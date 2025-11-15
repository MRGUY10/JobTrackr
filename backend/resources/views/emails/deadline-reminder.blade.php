<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .title {
            color: #1a202c;
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }
        .content {
            margin: 20px 0;
        }
        .reminder-box {
            background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .details-box {
            background-color: #f7fafc;
            border-left: 4px solid #ed8936;
            padding: 15px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">JT</div>
            <h1 class="title">⏰ Reminder</h1>
        </div>

        <div class="content">
            <p>Hi {{ $user->name }},</p>
            
            <div class="reminder-box">
                <p style="font-size: 20px; font-weight: bold; margin: 0;">{{ $notification->title }}</p>
            </div>

            <p>{{ $notification->message }}</p>

            <div class="details-box">
                <p><strong>Position:</strong> {{ $metadata['position'] ?? 'N/A' }}</p>
                <p><strong>Company:</strong> {{ $metadata['company'] ?? 'N/A' }}</p>
                @if(isset($metadata['days_remaining']))
                    <p><strong>Days Remaining:</strong> {{ $metadata['days_remaining'] }}</p>
                @endif
                @if(isset($metadata['days_since_applied']))
                    <p><strong>Days Since Applied:</strong> {{ $metadata['days_since_applied'] }}</p>
                @endif
            </div>

            <center>
                <a href="{{ config('app.frontend_url') }}{{ $notification->action_url }}" class="button">
                    View Application
                </a>
            </center>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} JobTrackr. All rights reserved.</p>
            <p>You're receiving this email because you have an account on JobTrackr.</p>
        </div>
    </div>
</body>
</html>
