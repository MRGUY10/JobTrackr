<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class NotificationController extends Controller
{
    #[OA\Get(
        path: "/api/notifications",
        summary: "Get all user notifications",
        security: [["bearerAuth" => []]],
        tags: ["Notifications"],
        parameters: [
            new OA\Parameter(
                name: "unread",
                in: "query",
                description: "Filter unread notifications only",
                required: false,
                schema: new OA\Schema(type: "boolean")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of notifications"
            )
        ]
    )]
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        if ($request->boolean('unread')) {
            $query->unread();
        }

        $notifications = $query->paginate(20);

        return NotificationResource::collection($notifications);
    }

    #[OA\Post(
        path: "/api/notifications",
        summary: "Create a notification",
        security: [["bearerAuth" => []]],
        tags: ["Notifications"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["title", "message"],
                properties: [
                    new OA\Property(property: "title", type: "string", example: "Interview Reminder"),
                    new OA\Property(property: "message", type: "string", example: "You have an interview tomorrow"),
                    new OA\Property(property: "type", type: "string", enum: ["interview_reminder", "follow_up", "general"])
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Notification created successfully"
            )
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'type' => ['sometimes', 'in:interview_reminder,follow_up,general'],
        ]);

        $notification = Notification::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'] ?? 'general',
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'data' => new NotificationResource($notification),
        ], 201);
    }

    #[OA\Put(
        path: "/api/notifications/{id}/read",
        summary: "Mark notification as read",
        security: [["bearerAuth" => []]],
        tags: ["Notifications"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Notification marked as read"
            )
        ]
    )]
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'data' => new NotificationResource($notification->fresh()),
        ]);
    }

    #[OA\Put(
        path: "/api/notifications/read-all",
        summary: "Mark all notifications as read",
        security: [["bearerAuth" => []]],
        tags: ["Notifications"],
        responses: [
            new OA\Response(
                response: 200,
                description: "All notifications marked as read"
            )
        ]
    )]
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    #[OA\Delete(
        path: "/api/notifications/{id}",
        summary: "Delete a notification",
        security: [["bearerAuth" => []]],
        tags: ["Notifications"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Notification deleted successfully"
            )
        ]
    )]
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully',
        ]);
    }

    #[OA\Get(
        path: "/api/notifications/unread-count",
        summary: "Get unread notifications count",
        security: [["bearerAuth" => []]],
        tags: ["Notifications"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Unread count"
            )
        ]
    )]
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }
}
