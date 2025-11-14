<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class ProfileController extends Controller
{
    #[OA\Get(
        path: "/api/profile",
        summary: "Get user profile",
        security: [["bearerAuth" => []]],
        tags: ["Profile"],
        responses: [
            new OA\Response(
                response: 200,
                description: "User profile retrieved successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "user", ref: "#/components/schemas/User"),
                        new OA\Property(property: "unread_notifications_count", type: "integer")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load(['applications', 'notifications']),
            'unread_notifications_count' => $request->user()->unreadNotificationsCount(),
        ]);
    }

    #[OA\Put(
        path: "/api/profile",
        summary: "Update user profile",
        security: [["bearerAuth" => []]],
        tags: ["Profile"],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Profile updated successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string"),
                        new OA\Property(property: "user", ref: "#/components/schemas/User")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $avatarPath;
        }

        // Handle CV upload
        if ($request->hasFile('cv')) {
            // Delete old CV if exists
            if ($user->cv_path) {
                Storage::disk('public')->delete($user->cv_path);
            }

            $cvPath = $request->file('cv')->store('cvs', 'public');
            $data['cv_path'] = $cvPath;
        }

        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Delete user account.
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        // Delete avatar and CV files
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        if ($user->cv_path) {
            Storage::disk('public')->delete($user->cv_path);
        }

        // Delete all user tokens
        $user->tokens()->delete();

        // Delete user (will cascade delete applications, documents, notifications)
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }

    /**
     * Upload avatar.
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $avatarPath]);

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => Storage::disk('public')->url($avatarPath),
        ]);
    }

    /**
     * Upload CV.
     */
    public function uploadCv(Request $request): JsonResponse
    {
        $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $user = $request->user();

        // Delete old CV if exists
        if ($user->cv_path) {
            Storage::disk('public')->delete($user->cv_path);
        }

        $cvPath = $request->file('cv')->store('cvs', 'public');
        $user->update(['cv_path' => $cvPath]);

        return response()->json([
            'message' => 'CV uploaded successfully',
            'cv_url' => Storage::disk('public')->url($cvPath),
        ]);
    }
}
