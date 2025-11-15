<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Application;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class DocumentController extends Controller
{
    #[OA\Post(
        path: "/api/applications/{application_id}/documents",
        summary: "Upload a document for an application",
        security: [["bearerAuth" => []]],
        tags: ["Documents"],
        parameters: [
            new OA\Parameter(
                name: "application_id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["file", "type"],
                    properties: [
                        new OA\Property(property: "file", type: "string", format: "binary"),
                        new OA\Property(property: "type", type: "string", enum: ["cv", "cover_letter", "other"])
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Document uploaded successfully"
            )
        ]
    )]
    public function store(Request $request, Application $application): JsonResponse
    {
        // Ensure user owns this application
        if ($application->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
            'type' => ['required', 'in:cv,cover_letter,portfolio,certificate,reference,other'],
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $document = $application->documents()->create([
            'file_path' => $path,
            'type' => $request->type,
            'original_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'data' => new DocumentResource($document),
        ], 201);
    }

    #[OA\Get(
        path: "/api/applications/{application_id}/documents",
        summary: "Get all documents for an application",
        security: [["bearerAuth" => []]],
        tags: ["Documents"],
        parameters: [
            new OA\Parameter(
                name: "application_id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of documents"
            )
        ]
    )]
    public function index(Request $request, Application $application)
    {
        // Ensure user owns this application
        if ($application->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        return DocumentResource::collection($application->documents);
    }

    #[OA\Delete(
        path: "/api/documents/{id}",
        summary: "Delete a document",
        security: [["bearerAuth" => []]],
        tags: ["Documents"],
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
                description: "Document deleted successfully"
            )
        ]
    )]
    public function destroy(Request $request, Document $document): JsonResponse
    {
        // Ensure user owns this document's application
        if ($document->application->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully',
        ]);
    }

    #[OA\Get(
        path: "/api/documents/{id}/download",
        summary: "Download a document",
        security: [["bearerAuth" => []]],
        tags: ["Documents"],
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
                description: "Document file"
            )
        ]
    )]
    public function download(Request $request, Document $document)
    {
        // Ensure user owns this document's application
        if ($document->application->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        return Storage::disk('public')->download($document->file_path, $document->original_name);
    }
}
