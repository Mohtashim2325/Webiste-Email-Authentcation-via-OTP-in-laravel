<?php

return [
    'defaults' => [
        'guard'     => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver'   => 'sanctum',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => 'password_reset_tokens',
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,

    // OTP settings — read from .env
    'otp_expiry_minutes' => (int) env('OTP_EXPIRY_MINUTES', 10),
    'otp_max_attempts'   => (int) env('OTP_MAX_ATTEMPTS', 5),
    'otp_lock_minutes'   => (int) env('OTP_LOCK_MINUTES', 15),
    'otp_resend_limit'   => (int) env('OTP_RESEND_LIMIT', 3),
];