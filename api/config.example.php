<?php
/**
 * Copy to config.php and fill in. Do not commit config.php.
 * storage_dir must sit OUTSIDE the public web root.
 */
declare(strict_types=1);

return [
    'allowed_origins' => [
        'https://buildersite.co',
        'https://www.buildersite.co',
        'http://localhost:5173', // vite dev
    ],

    // Absolute path outside the web root, e.g. /var/www/buildersite-data
    'storage_dir' => dirname(__DIR__, 2) . '/buildersite-data',

    // Random string, used to hash IPs so raw addresses are never stored.
    'ip_salt' => 'CHANGE_ME_TO_A_LONG_RANDOM_STRING',

    // Leave notify_to empty to disable email notifications.
    'notify_to'   => 'sriethiraj@getnos.io',
    'notify_from' => 'hello@getnos.io',

    // Per-IP throttle.
    'rate_window' => 3600, // seconds
    'rate_max'    => 6,    // submissions per window

    // Allow-lists. Must mirror the options rendered in the audit wizard.
    'cities' => ['Melbourne', 'Sydney', 'Brisbane', 'Adelaide', 'Canberra', 'Gold Coast', 'Perth', 'Other'],

    'questions' => [
        'licensed' => ['Yes, licensed', 'Working toward my licence', 'Prefer not to say'],
        'volume'   => ['1 to 3', '4 to 10', '11 to 25', '26 or more'],
        'website'  => ['No website yet', 'Yes, but it is dated', 'Yes, and it is fine'],
        'findYou'  => ['Word of mouth and referrals', 'Directories like hipages', 'Google search', 'Social media', 'A mix of these'],
        'timeline' => ['As soon as possible', 'Within a month', 'In the next 3 months', 'Just exploring for now'],
    ],
];
