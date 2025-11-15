Hi {{ $user->name }},

Your application status has been updated:

Position: {{ $metadata['position'] ?? 'N/A' }}
Company: {{ $metadata['company'] ?? 'N/A' }}

Status changed from: {{ $metadata['old_status'] ?? 'N/A' }}
To: {{ $metadata['new_status'] ?? 'N/A' }}

{{ $notification->message }}

View your application: {{ config('app.frontend_url') }}{{ $notification->action_url }}

© {{ date('Y') }} JobTrackr. All rights reserved.
