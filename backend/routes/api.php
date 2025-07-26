<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CommentReactionController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\KeyController;
use Illuminate\Http\Request;
use App\Models\User;

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/register', [AuthenticatedSessionController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'logout']);
    Route::get('/profile', [AuthenticatedSessionController::class, 'profile']);
    Route::get('/users/{id}/companies', [CompanyController::class, 'getCompaniesByUserId']);
    Route::get('/messages/{receiver}', [MessageController::class, 'index'])->name('messages.index');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::post('/companyRegister', [CompanyController::class, 'store']);
    Route::post('/RatingAndComments', [RatingController::class, 'store']);
    Route::post('/deleteReaction', [CommentReactionController::class, 'destroy']);
    Route::post('/commentReaction', [CommentReactionController::class, 'store']);
});
Route::get('/getGeminiKey', [KeyController::class, 'getKey']);
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/company/{id}', [CompanyController::class, 'show']);
Route::middleware('auth:sanctum')->get('/users', function (Request $request) {
    $user = $request->user();

    return User::where('id', '!=', $user->id)
        ->select('id', 'username', 'img')
        ->get();
});
Route::get('/company/{id}/comments', [RatingController::class, 'show']);
Route::get('/comments/{commentId}/reactions/{user_id}', [CommentReactionController::class, 'getCommentReactions']);



//-------Admin--------
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/companies/{id}', [CompanyController::class, 'update']);
    Route::get('/companies/unverified', [CompanyController::class, 'unverified']);
    Route::get('/companies/verified', [CompanyController::class, 'verified']);
    Route::delete('/companies/{id}', [CompanyController::class, 'destroy']);
});
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/ratings', [RatingController::class, 'index']);
    Route::put('/ratings/{id}', [RatingController::class, 'update']);
    Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);
});
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/messages')->group(function () {
    Route::get('/user/{user}/chats', [MessageController::class, 'getChatPartnersForUser']);
    Route::get('/conversation/{user1}/{user2}', [MessageController::class, 'getConversationBetweenUsers']);
});
