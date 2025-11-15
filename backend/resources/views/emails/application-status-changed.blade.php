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
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 10px 0;
        }
        .status-old {
            background-color: #fed7d7;
            color: #c53030;
        }
        .status-new {
            background-color: #c6f6d5;
            color: #2f855a;
        }
        .details-box {
            background-color: #f7fafc;
            border-left: 4px solid #667eea;
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
            <h1 class="title">Application Status Updated</h1>
        </div>

        <div class="content">
            <p>Hi {{ $user->name }},</p>
            
            <p>Your application status has been updated:</p>

            <div class="details-box">
                <p><strong>Position:</strong> {{ $metadata['position'] ?? 'N/A' }}</p>
                <p><strong>Company:</strong> {{ $metadata['company'] ?? 'N/A' }}</p>
                <p style="margin-top: 15px;">
                    <span class="status-badge status-old">{{ $metadata['old_status'] ?? 'N/A' }}</span>
                    →
                    <span class="status-badge status-new">{{ $metadata['new_status'] ?? 'N/A' }}</span>
                </p>
            </div>

            <p>{{ $notification->message }}</p>

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
