<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Application;
use App\Models\Document;
use App\Models\JobPosting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use OpenApi\Attributes as OA;

class AdminController extends Controller
{
    #[OA\Get(
        path: "/api/admin/dashboard",
        summary: "Get admin dashboard statistics",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Admin dashboard data"
            )
        ]
    )]
    public function dashboard(): JsonResponse
    {
        $totalUsers = User::count();
        $totalApplications = Application::count();
        $totalDocuments = Document::count();
        
        // Users registered in last 30 days
        $newUsers = User::where('created_at', '>=', now()->subDays(30))->count();
        
        // Applications in last 30 days
        $recentApplications = Application::where('created_at', '>=', now()->subDays(30))->count();
        
        // Status breakdown
        $statusBreakdown = Application::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');
        
        // Top active users
        $topUsers = User::withCount('applications')
            ->orderByDesc('applications_count')
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'applications_count' => $user->applications_count,
                    'joined_at' => $user->created_at->format('M d, Y'),
                ];
            });
        
        return response()->json([
            'total_users' => $totalUsers,
            'total_applications' => $totalApplications,
            'total_documents' => $totalDocuments,
            'new_users_30d' => $newUsers,
            'recent_applications_30d' => $recentApplications,
            'status_breakdown' => $statusBreakdown,
            'top_users' => $topUsers,
        ]);
    }

    #[OA\Get(
        path: "/api/admin/users",
        summary: "Get all users (admin only)",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of users"
            )
        ]
    )]
    public function users(): JsonResponse
    {
        $users = User::withCount('applications')
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'applications_count' => $user->applications_count,
                    'joined_at' => $user->created_at->format('M d, Y'),
                ];
            });

        return response()->json(['data' => $users]);
    }

    #[OA\Get(
        path: "/api/admin/applications",
        summary: "Get all applications (admin only)",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of all applications"
            )
        ]
    )]
    public function applications(): JsonResponse
    {
        $applications = Application::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return response()->json(['data' => $applications]);
    }

    #[OA\Get(
        path: "/api/admin/job-postings",
        summary: "Get all job postings (admin only)",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of all job postings"
            )
        ]
    )]
    public function getJobPostings(): JsonResponse
    {
        $jobs = JobPosting::with('postedBy:id,name,email')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $jobs]);
    }

    #[OA\Post(
        path: "/api/admin/job-postings",
        summary: "Create a new job posting (admin only)",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 201,
                description: "Job posting created"
            )
        ]
    )]
    public function createJobPosting(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|string|max:255',
            'experience_level' => 'required|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'application_url' => 'nullable|url|max:255',
            'contact_email' => 'nullable|email|max:255',
            'status' => 'nullable|in:active,closed,draft',
            'deadline' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = JobPosting::create([
            ...$request->all(),
            'posted_by' => auth()->id(),
        ]);

        return response()->json(['data' => $job->load('postedBy:id,name,email')], 201);
    }

    #[OA\Put(
        path: "/api/admin/job-postings/{id}",
        summary: "Update a job posting (admin only)",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Job posting updated"
            )
        ]
    )]
    public function updateJobPosting(Request $request, $id): JsonResponse
    {
        $job = JobPosting::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'company' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'job_type' => 'sometimes|string|max:255',
            'experience_level' => 'sometimes|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'application_url' => 'nullable|url|max:255',
            'contact_email' => 'nullable|email|max:255',
            'status' => 'nullable|in:active,closed,draft',
            'deadline' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job->update($request->all());

        return response()->json(['data' => $job->load('postedBy:id,name,email')]);
    }

    #[OA\Delete(
        path: "/api/admin/job-postings/{id}",
        summary: "Delete a job posting (admin only)",
        security: [["bearerAuth" => []]],
        tags: ["Admin"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Job posting deleted"
            )
        ]
    )]
    public function deleteJobPosting($id): JsonResponse
    {
        $job = JobPosting::findOrFail($id);
        $job->delete();

        return response()->json(['message' => 'Job posting deleted successfully']);
    }

    #[OA\Get(
        path: "/api/job-postings",
        summary: "Get all active job postings (public)",
        tags: ["Jobs"],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of active job postings"
            )
        ]
    )]
    public function getPublicJobPostings(): JsonResponse
    {
        $jobs = JobPosting::with('postedBy:id,name')
            ->where('status', 'active')
            ->whereNull('deadline')
            ->orWhere('deadline', '>=', now())
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $jobs]);
    }
}
