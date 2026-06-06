<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f4f4f5;
        }
        .wrapper {
            max-width: 520px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .header {
            background: #111827;
            padding: 32px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            letter-spacing: -0.3px;
        }
        .body {
            padding: 40px 32px;
        }
        .greeting {
            font-size: 16px;
            color: #374151;
            margin-bottom: 12px;
        }
        .message {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        .otp-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            text-align: center;
            padding: 28px;
            margin-bottom: 32px;
        }
        .otp-label {
            font-size: 12px;
            font-weight: 600;
            color: #9ca3af;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 12px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 800;
            color: #111827;
            letter-spacing: 10px;
            font-family: 'Courier New', monospace;
        }
        .expiry {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 10px;
        }
        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 14px 16px;
            border-radius: 0 8px 8px 0;
            font-size: 13px;
            color: #78350f;
            margin-bottom: 24px;
        }
        .footer {
            padding: 20px 32px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Ecommerce</h1>
        </div>
        <div class="body">
            <p class="greeting">Hello, {{ $userName }}</p>
            <p class="message">
                Use the code below to complete your sign-in. This code is valid for
                {{ config('auth.otp_expiry_minutes', 10) }} minutes.
            </p>
            <div class="otp-box">
                <div class="otp-label">Verification Code</div>
                <div class="otp-code">{{ $otpCode }}</div>
                <div class="expiry">Expires in {{ config('auth.otp_expiry_minutes', 10) }} minutes</div>
            </div>
            <div class="warning">
                If you did not request this code, please ignore this email and ensure your account password is secure.
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Ecommerce. All rights reserved.<br>
            This is an automated message — please do not reply.
        </div>
    </div>
</body>
</html>