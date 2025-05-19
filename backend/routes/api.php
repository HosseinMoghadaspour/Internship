<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CommentReactionController;

Route::apiResource('comments', CommentController::class);
Route::apiResource('ratings', RatingController::class);
Route::apiResource('comment-reactions', CommentReactionController::class);

Route::post('messages/send', [MessageController::class, 'send']);
Route::get('messages/{user_id}', [MessageController::class, 'getForUser']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/register', [AuthenticatedSessionController::class, 'register']);
Route::middleware('auth:sanctum')->get('/profile', [AuthenticatedSessionController::class, 'profile']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'logout']);
Route::post('/companies', [CompanyController::class, 'store']);
