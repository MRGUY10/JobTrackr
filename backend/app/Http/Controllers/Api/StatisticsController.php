<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class StatisticsController extends Controller
{
    #[OA\Get(
        path: "/api/stats/overview",
        summary: "Get dashboard overview statistics",
        security: [["bearerAuth" => []]],
        tags: ["Statistics"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Dashboard statistics"
            )
        ]
    )]
    public function overview(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $total = Application::where('user_id', $userId)->count();
        $byStatus = Application::where('user_id', $userId)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $successRate = $total > 0 
            ? round((($byStatus['Offer'] ?? 0) / $total) * 100, 2) 
            : 0;

        return response()->json([
            'total_applications' => $total,
            'by_status' => [
                'applied' => $byStatus['Applied'] ?? 0,
                'interview' => $byStatus['Interview'] ?? 0,
                'technical_test' => $byStatus['Technical Test'] ?? 0,
                'offer' => $byStatus['Offer'] ?? 0,
                'rejected' => $byStatus['Rejected'] ?? 0,
            ],
            'success_rate' => $successRate,
        ]);
    }

    #[OA\Get(
        path: "/api/stats/monthly",
        summary: "Get applications per month",
        security: [["bearerAuth" => []]],
        tags: ["Statistics"],
        parameters: [
            new OA\Parameter(
                name: "year",
                in: "query",
                description: "Filter by year",
                required: false,
                schema: new OA\Schema(type: "integer", example: 2025)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Monthly statistics"
            )
        ]
    )]
    public function monthly(Request $request): JsonResponse
    {
        $year = $request->get('year', date('Y'));
        $userId = $request->user()->id;

        $monthly = Application::where('user_id', $userId)
            ->whereYear('applied_date', $year)
            ->select(
                DB::raw('MONTH(applied_date) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month');

        // Fill missing months with 0
        $result = [];
        for ($i = 1; $i <= 12; $i++) {
            $result[] = [
                'month' => $i,
                'month_name' => date('F', mktime(0, 0, 0, $i, 1)),
                'count' => $monthly[$i] ?? 0,
            ];
        }

        return response()->json([
            'year' => $year,
            'data' => $result,
        ]);
    }

    #[OA\Get(
        path: "/api/stats/by-status",
        summary: "Get detailed statistics by status",
        security: [["bearerAuth" => []]],
        tags: ["Statistics"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Status breakdown"
            )
        ]
    )]
    public function byStatus(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $statusStats = Application::where('user_id', $userId)
            ->select(
                'status',
                DB::raw('COUNT(*) as count'),
                DB::raw('AVG(DATEDIFF(NOW(), applied_date)) as avg_days')
            )
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                    'average_days' => round($item->avg_days, 1),
                ];
            });

        return response()->json([
            'data' => $statusStats,
        ]);
    }

    #[OA\Get(
        path: "/api/stats/top-companies",
        summary: "Get most targeted companies",
        security: [["bearerAuth" => []]],
        tags: ["Statistics"],
        parameters: [
            new OA\Parameter(
                name: "limit",
                in: "query",
                description: "Number of companies to return",
                required: false,
                schema: new OA\Schema(type: "integer", example: 10)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Top companies list"
            )
        ]
    )]
    public function topCompanies(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);
        $userId = $request->user()->id;

        $companies = Application::where('user_id', $userId)
            ->select(
                'company',
                DB::raw('COUNT(*) as applications_count'),
                DB::raw('MAX(status) as last_status')
            )
            ->groupBy('company')
            ->orderByDesc('applications_count')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $companies,
        ]);
    }

    #[OA\Get(
        path: "/api/stats/recent-activity",
        summary: "Get recent application activity",
        security: [["bearerAuth" => []]],
        tags: ["Statistics"],
        parameters: [
            new OA\Parameter(
                name: "days",
                in: "query",
                description: "Number of days to look back",
                required: false,
                schema: new OA\Schema(type: "integer", example: 30)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Recent activity"
            )
        ]
    )]
    public function recentActivity(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $userId = $request->user()->id;

        $activity = Application::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays($days))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'days' => $days,
            'data' => $activity,
        ]);
    }
}
