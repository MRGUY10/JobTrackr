<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo-box {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            line-height: 60px;
            font-size: 32px;
            font-weight: bold;
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 16px;
            text-align: center;
        }
        .greeting {
            font-size: 16px;
            color: #4b5563;
            text-align: center;
            margin-bottom: 30px;
        }
        .otp-container {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            color: #e0e7ff;
            font-size: 14px;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .message {
            color: #6b7280;
            font-size: 14px;
            text-align: center;
            margin: 20px 0;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .warning p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
        }
        .help-text {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 20px;
        }
        .help-text a {
            color: #6366f1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <div class="logo-box">JT</div>
        </div>
        
        <h1>Verify Your Email Address</h1>
        
        <p class="greeting">
            Hello {{ $user->name }},
        </p>
        
        <p class="message">
            Thank you for registering with JobTrackr! To complete your registration and start tracking your job applications, please verify your email address using the code below:
        </p>
        
        <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">{{ $otp }}</div>
        </div>
        
        <p class="message">
            Enter this code on the verification page to activate your account.
        </p>
        
        <div class="warning">
            <p>
                <strong>⚠️ Important:</strong> This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
            </p>
        </div>
        
        <p class="help-text">
            Having trouble? Contact us at 
            <a href="mailto:support@jobtrackr.com">support@jobtrackr.com</a>
        </p>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} JobTrackr. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>
