<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class ApplicationController extends Controller
{
    #[OA\Get(
        path: "/api/applications",
        summary: "Get all user applications",
        security: [["bearerAuth" => []]],
        tags: ["Applications"],
        parameters: [
            new OA\Parameter(
                name: "status",
                in: "query",
                description: "Filter by status",
                required: false,
                schema: new OA\Schema(type: "string", enum: ["Applied", "Interview", "Technical Test", "Offer", "Rejected"])
            ),
            new OA\Parameter(
                name: "company",
                in: "query",
                description: "Search by company name",
                required: false,
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "sort",
                in: "query",
                description: "Sort by field (applied_date, company, position)",
                required: false,
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "order",
                in: "query",
                description: "Sort order (asc, desc)",
                required: false,
                schema: new OA\Schema(type: "string", enum: ["asc", "desc"])
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of applications",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Application"))
                    ]
                )
            )
        ]
    )]
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Application::where('user_id', $request->user()->id)
            ->withCount('documents');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by company
        if ($request->has('company')) {
            $query->where('company', 'like', '%' . $request->company . '%');
        }

        // Sorting
        $sortField = $request->get('sort', 'applied_date');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $applications = $query->paginate(15);

        return ApplicationResource::collection($applications);
    }

    #[OA\Post(
        path: "/api/applications",
        summary: "Create a new application",
        security: [["bearerAuth" => []]],
        tags: ["Applications"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["company", "position", "applied_date"],
                properties: [
                    new OA\Property(property: "company", type: "string", example: "Google"),
                    new OA\Property(property: "position", type: "string", example: "Senior Developer"),
                    new OA\Property(property: "status", type: "string", enum: ["Applied", "Interview", "Technical Test", "Offer", "Rejected"]),
                    new OA\Property(property: "job_url", type: "string", format: "url"),
                    new OA\Property(property: "job_description", type: "string"),
                    new OA\Property(property: "notes", type: "string"),
                    new OA\Property(property: "applied_date", type: "string", format: "date", example: "2025-11-14")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Application created successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string"),
                        new OA\Property(property: "data", ref: "#/components/schemas/Application")
                    ]
                )
            )
        ]
    )]
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        
        $application = Application::create($data);

        // Send notification
        NotificationService::applicationCreated($application);

        return response()->json([
            'message' => 'Application created successfully',
            'data' => new ApplicationResource($application),
        ], 201);
    }

    #[OA\Get(
        path: "/api/applications/{id}",
        summary: "Get a specific application",
        security: [["bearerAuth" => []]],
        tags: ["Applications"],
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
                description: "Application details",
                content: new OA\JsonContent(ref: "#/components/schemas/Application")
            ),
            new OA\Response(response: 404, description: "Application not found")
        ]
    )]
    public function show(Request $request, Application $application): ApplicationResource
    {
        // Ensure user owns this application
        if ($application->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        $application->load('documents');

        return new ApplicationResource($application);
    }

    #[OA\Put(
        path: "/api/applications/{id}",
        summary: "Update an application",
        security: [["bearerAuth" => []]],
        tags: ["Applications"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "company", type: "string"),
                    new OA\Property(property: "position", type: "string"),
                    new OA\Property(property: "status", type: "string", enum: ["Applied", "Interview", "Technical Test", "Offer", "Rejected"]),
                    new OA\Property(property: "job_url", type: "string", format: "url"),
                    new OA\Property(property: "job_description", type: "string"),
                    new OA\Property(property: "notes", type: "string"),
                    new OA\Property(property: "applied_date", type: "string", format: "date")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Application updated successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string"),
                        new OA\Property(property: "data", ref: "#/components/schemas/Application")
                    ]
                )
            )
        ]
    )]
    public function update(UpdateApplicationRequest $request, Application $application): JsonResponse
    {
        $oldStatus = $application->status;
        $application->update($request->validated());

        // Send status change notification if status changed
        if ($request->has('status') && $oldStatus !== $request->status) {
            NotificationService::applicationStatusChanged($application, $oldStatus);
        }

        // Send interview scheduled notification if interview_date was set
        if ($request->has('interview_date') && !$application->getOriginal('interview_date')) {
            NotificationService::interviewScheduled($application);
        }

        return response()->json([
            'message' => 'Application updated successfully',
            'data' => new ApplicationResource($application->fresh()),
        ]);
    }

    #[OA\Delete(
        path: "/api/applications/{id}",
        summary: "Delete an application",
        security: [["bearerAuth" => []]],
        tags: ["Applications"],
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
                description: "Application deleted successfully"
            )
        ]
    )]
    public function destroy(Request $request, Application $application): JsonResponse
    {
        // Ensure user owns this application
        if ($application->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        $application->delete();

        return response()->json([
            'message' => 'Application deleted successfully',
        ]);
    }

    #[OA\Get(
        path: "/api/calendar/events",
        summary: "Get calendar events (interviews and deadlines)",
        security: [["bearerAuth" => []]],
        tags: ["Calendar"],
        parameters: [
            new OA\Parameter(
                name: "start_date",
                in: "query",
                description: "Start date filter (Y-m-d)",
                required: false,
                schema: new OA\Schema(type: "string", format: "date")
            ),
            new OA\Parameter(
                name: "end_date",
                in: "query",
                description: "End date filter (Y-m-d)",
                required: false,
                schema: new OA\Schema(type: "string", format: "date")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Calendar events",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "interviews", type: "array", items: new OA\Items(ref: "#/components/schemas/Application")),
                        new OA\Property(property: "deadlines", type: "array", items: new OA\Items(ref: "#/components/schemas/Application"))
                    ]
                )
            )
        ]
    )]
    public function calendarEvents(Request $request): JsonResponse
    {
        $query = Application::where('user_id', $request->user()->id);

        // Filter by date range if provided
        if ($request->has('start_date')) {
            $query->where(function($q) use ($request) {
                $q->where('interview_date', '>=', $request->start_date)
                  ->orWhere('deadline', '>=', $request->start_date);
            });
        }

        if ($request->has('end_date')) {
            $query->where(function($q) use ($request) {
                $q->where('interview_date', '<=', $request->end_date)
                  ->orWhere('deadline', '<=', $request->end_date);
            });
        }

        $applications = $query->get();

        // Separate interviews and deadlines
        $interviews = $applications->filter(function($app) {
            return $app->interview_date !== null;
        })->values();

        $deadlines = $applications->filter(function($app) {
            return $app->deadline !== null;
        })->values();

        return response()->json([
            'interviews' => ApplicationResource::collection($interviews),
            'deadlines' => ApplicationResource::collection($deadlines),
        ]);
    }

    #[OA\Get(
        path: "/api/calendar/interviews",
        summary: "Get upcoming interviews",
        security: [["bearerAuth" => []]],
        tags: ["Calendar"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Upcoming interviews",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Application"))
                    ]
                )
            )
        ]
    )]
    public function upcomingInterviews(Request $request): JsonResponse
    {
        $interviews = Application::where('user_id', $request->user()->id)
            ->whereNotNull('interview_date')
            ->where('interview_date', '>=', now())
            ->whereIn('status', ['Interview', 'Technical Test'])
            ->orderBy('interview_date', 'asc')
            ->get();

        return response()->json([
            'data' => ApplicationResource::collection($interviews),
        ]);
    }
}
