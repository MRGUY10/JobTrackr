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
            justify-center;
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
        .message-box {
            background-color: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            font-size: 16px;
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
            <h1 class="title">{{ $notification->title }}</h1>
        </div>

        <div class="content">
            <p>Hi {{ $user->name }},</p>
            
            <div class="message-box">
                {{ $notification->message }}
            </div>

            @if($notification->action_url)
            <center>
                <a href="{{ config('app.frontend_url') }}{{ $notification->action_url }}" class="button">
                    Take Action
                </a>
            </center>
            @endif
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} JobTrackr. All rights reserved.</p>
            <p>You're receiving this email because you have an account on JobTrackr.</p>
        </div>
    </div>
</body>
</html>
