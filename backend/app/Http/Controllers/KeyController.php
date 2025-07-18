<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class KeyController extends Controller
{
    public function getKey(): JsonResponse
    {
        $apiKey = env('GEMINI_API_KEY');
        return response()->json(data: [
            'apiKey' => $apiKey
        ]);
    }
}
