Hi {{ $user->name }},

{{ $notification->title }}

{{ $notification->message }}

Position: {{ $metadata['position'] ?? 'N/A' }}
Company: {{ $metadata['company'] ?? 'N/A' }}

@if(isset($metadata['days_remaining']))
Days Remaining: {{ $metadata['days_remaining'] }}
@endif

@if(isset($metadata['days_since_applied']))
Days Since Applied: {{ $metadata['days_since_applied'] }}
@endif

View application: {{ config('app.frontend_url') }}{{ $notification->action_url }}

© {{ date('Y') }} JobTrackr. All rights reserved.
