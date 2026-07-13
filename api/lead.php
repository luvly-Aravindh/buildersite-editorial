<?php
/**
 * BuilderSite lead capture endpoint.
 * POST JSON from the audit wizard, validate it, store it, optionally email it.
 *
 * Deploy: put this behind /api/lead.php. Copy config.example.php to config.php
 * and fill in the values. Never commit config.php.
 */

declare(strict_types=1);

$config = require __DIR__ . '/config.php';

// ---------------------------------------------------------------------------
// CORS: only answer the origins we actually serve the site from.
// ---------------------------------------------------------------------------
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

function fail(int $code, string $message): never
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

function ok(array $extra = []): never
{
    echo json_encode(['ok' => true] + $extra, JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Method not allowed.');
}

// ---------------------------------------------------------------------------
// Rate limit: cheap per-IP throttle, no database required.
// ---------------------------------------------------------------------------
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
if ($raw === false || strlen($raw) > 12000) {
    fail(413, 'Payload too large.');
}

try {
    $in = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    fail(400, 'Malformed request.');
}
if (!is_array($in)) {
    fail(400, 'Malformed request.');
}

// Honeypot: real builders never fill this in, bots do.
if (!empty($in['company_website'])) {
    ok(['skipped' => true]);
}

/** Trim, strip control characters, and cap length. */
function clean(mixed $v, int $max): string
{
    if (!is_scalar($v)) {
        return '';
    }
    $s = preg_replace('/[\x00-\x1F\x7F]/u', '', trim((string) $v)) ?? '';
    return mb_substr($s, 0, $max);
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
$lead = [
    'received_at' => gmdate('c'),
    'name'        => $name,
    'business'    => $business,
    'email'       => strtolower($email),
    'phone'       => $phone,
    'city'        => $city,
    'source'      => clean($in['source'] ?? 'buildersite_audit', 40),
    'ip'          => hash('sha256', $ip . $config['ip_salt']), // hashed, not stored raw
    'user_agent'  => clean($_SERVER['HTTP_USER_AGENT'] ?? '', 200),
] + $answers;

if (!is_dir($config['storage_dir']) && !@mkdir($config['storage_dir'], 0700, true)) {
    fail(500, 'Could not store your details. Please email us instead.');
}

$file = $config['storage_dir'] . '/leads-' . gmdate('Y-m') . '.jsonl';
$line = json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
if (@file_put_contents($file, $line, FILE_APPEND | LOCK_EX) === false) {
    fail(500, 'Could not store your details. Please email us instead.');
}
@chmod($file, 0600);

// ---------------------------------------------------------------------------
// Notify. Header injection is impossible here: we never echo user input
// into a header, and the From address is fixed by config.
// ---------------------------------------------------------------------------
if ($config['notify_to'] !== '') {
    $subject = 'New builder lead: ' . mb_substr($business, 0, 60);
    $body = "New lead from the audit wizard\n\n";
    foreach ($lead as $k => $v) {
        if ($k === 'ip' || $k === 'user_agent') {
            continue;
        }
        $body .= str_pad($k, 14) . ': ' . $v . "\n";
    }
    $headers = [
        'From: ' . $config['notify_from'],
        'Content-Type: text/plain; charset=utf-8',
    ];
    @mail($config['notify_to'], $subject, $body, implode("\r\n", $headers));
}

ok();
