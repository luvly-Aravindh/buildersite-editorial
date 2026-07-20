<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

function fail(int $code, string $message): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

function ok(array $extra = []): void
{
    echo json_encode(['ok' => true] + $extra, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Method not allowed.');
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$bucket = $config['storage_dir'] . '/rate';
if (!is_dir($bucket)) {
    @mkdir($bucket, 0700, true);
}
$stamp = $bucket . '/' . hash('sha256', $ip) . '.txt';
$now = time();
$hits = [];
if (is_readable($stamp)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($stamp))),
        static fn(int $t): bool => $t > $now - $config['rate_window']
    );
}
if (count($hits) >= $config['rate_max']) {
    fail(429, 'Too many submissions. Please try again shortly.');
}
$hits[] = $now;
@file_put_contents($stamp, implode(',', $hits), LOCK_EX);

// ---------------------------------------------------------------------------
// Parse and validate.
// ---------------------------------------------------------------------------
$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    fail(400, 'Empty request body.');
}
if (strlen($raw) > 12000) {
    fail(413, 'Payload too large.');
}

$in = json_decode($raw, true);
if (!is_array($in) || json_last_error() !== JSON_ERROR_NONE) {
    fail(400, 'Malformed request.');
}

/** Trim, strip control characters, and cap length. */
function clean(mixed $v, int $max): string
{
    if (!is_scalar($v)) {
        return '';
    }
    $s = preg_replace('/[\x00-\x1F\x7F]/u', '', trim((string) $v)) ?? '';
    return function_exists('mb_substr')
        ? mb_substr($s, 0, $max)
        : substr($s, 0, $max);
}

$name     = clean($in['name'] ?? '', 120);
$business = clean($in['business'] ?? '', 160);
$email    = clean($in['email'] ?? '', 200);
$phone    = clean($in['phone'] ?? '', 40);
$city     = clean($in['city'] ?? '', 60);

$errors = [];
if ($name === '')     { $errors[] = 'name'; }
if ($business === '') { $errors[] = 'business'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = 'email'; }
if (strlen(preg_replace('/\D/', '', $phone) ?? '') < 8) { $errors[] = 'phone'; }
if (!in_array($city, $config['cities'], true)) { $errors[] = 'city'; }

// Qualifying answers must match the options we actually offer.
$answers = [];
foreach ($config['questions'] as $key => $allowed) {
    $val = clean($in[$key] ?? '', 80);
    if (!in_array($val, $allowed, true)) {
        $errors[] = $key;
        continue;
    }
    $answers[$key] = $val;
}

if ($errors !== []) {
    fail(422, 'Please check these fields: ' . implode(', ', $errors));
}

// ---------------------------------------------------------------------------
// Store. Newline-delimited JSON, outside the web root, locked on write.
// ---------------------------------------------------------------------------
$id = 'lead_' . gmdate('Ymd_His') . '_' . bin2hex(random_bytes(3));
$lead = [
    'id'          => $id,
    'received_at' => gmdate('c'),
    'name'        => $name,
    'business'    => $business,
    'email'       => strtolower($email),
    'phone'       => $phone,
    'city'        => $city,
    'source'      => clean($in['source'] ?? 'buildersite_audit', 40),
    'page'        => 'Editorial',
    'submitted_at'=> clean($in['ts'] ?? '', 40),
    'ip'          => hash('sha256', $ip . $config['ip_salt']), // hashed, not stored raw
    'user_agent'  => clean($_SERVER['HTTP_USER_AGENT'] ?? '', 200),
] + $answers;

if (!is_dir($config['storage_dir']) && !@mkdir($config['storage_dir'], 0700, true)) {
    fail(500, 'Could not store your details. Please email us instead.');
}

$file = $config['storage_dir'] . '/leads-' . gmdate('Y-m') . '.jsonl';
$line = json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;

$writeOk = false;
$fp = @fopen($file, 'ab');
if ($fp !== false) {
    if (flock($fp, LOCK_EX)) {
        $writeOk = fwrite($fp, $line) !== false;
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

if (!$writeOk) {
    error_log('BuilderSite lead storage failed: ' . $file);
    fail(500, 'Could not store your details. Please email us instead.');
}
@chmod($file, 0600);

$mailSent = null;
if ($config['notify_to'] !== '') {
    $subject = 'New Lead - BuilderSite';
    $lines = [
        'New lead from BuilderSite:',
        '',
        'Name:         ' . $name,
        'Business:     ' . $business,
        'Email:        ' . strtolower($email),
        'Phone:        ' . $phone,
        'City:         ' . $city,
        'Licensed:     ' . $answers['licensed'],
        'Volume:       ' . $answers['volume'],
        'Website:      ' . $answers['website'],
        'Find you:     ' . $answers['findYou'],
        'Timeline:     ' . $answers['timeline'],
        '',
        'Page:         Editorial',
        'Received:     ' . $lead['received_at'],
        'Lead ID:      ' . $id,
    ];
    $body = implode("\n", $lines);
    $headers = 'From: BuilderSite <' . $config['notify_from'] . ">\r\n"
        . 'Reply-To: ' . strtolower($email) . "\r\n"
        . "MIME-Version: 1.0\r\n"
        . "Content-Type: text/plain; charset=utf-8\r\n";

    $mailSent = @mail($config['notify_to'], $subject, $body, $headers);

    if (!$mailSent) {
        error_log(
            'BuilderSite lead email rejected by PHP mail(). Recipient: ' .
            $config['notify_to']
        );
    }
}

ok([
    'id' => $id,
    'mail_sent' => $mailSent,
]);
