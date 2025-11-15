Hi {{ $user->name }},

Great news! You have an interview scheduled.

Position: {{ $metadata['position'] ?? 'N/A' }}
Company: {{ $metadata['company'] ?? 'N/A' }}

@if(isset($metadata['interview_date']))
Interview Date: {{ \Carbon\Carbon::parse($metadata['interview_date'])->format('M d, Y h:i A') }}
@else
Interview Date: To Be Determined
@endif

Interview Tips:
- Research the company and role thoroughly
- Prepare answers to common interview questions
- Prepare questions to ask the interviewer
- Test your equipment if it's a virtual interview
- Arrive 10-15 minutes early

View application details: {{ config('app.frontend_url') }}{{ $notification->action_url }}

Good luck!

© {{ date('Y') }} JobTrackr. All rights reserved.
