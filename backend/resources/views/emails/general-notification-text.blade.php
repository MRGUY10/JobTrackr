Hi {{ $user->name }},

{{ $notification->title }}

{{ $notification->message }}

@if($notification->action_url)
View more: {{ config('app.frontend_url') }}{{ $notification->action_url }}
@endif

© {{ date('Y') }} JobTrackr. All rights reserved.
