<?php

namespace App\Http\Controllers;

use App\Models\CommentReaction;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentReactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating_id' => 'required|exists:ratings,id',
            'is_like' => 'required|boolean',
        ]);

        $comment = Rating::findOrFail($validated['rating_id']);

        if ($comment->user_id == $validated['user_id']) {
            return response()->json(['message' => 'You cannot react to your own comment.'], 403);
        }

        $reaction = CommentReaction::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'rating_id' => $validated['rating_id'],
            ],
            [
                'is_like' => $validated['is_like'],
            ]
        );

        return response()->json($reaction);
    }

    public function getCommentReactions($commentId, $user_id)
    {
        $likes = CommentReaction::where('rating_id', $commentId)->where('is_like', true)->count();
        $dislikes = CommentReaction::where('rating_id', $commentId)->where('is_like', false)->count();

        $userReaction = CommentReaction::where('rating_id', $commentId)
            ->where('user_id', $user_id)
            ->first();

        return response()->json([
            'likes' => $likes,
            'dislikes' => $dislikes,
            'user_reaction' => $userReaction ? ($userReaction->is_like ? 'like' : 'dislike') : null,
        ]);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating_id' => 'required|exists:ratings,id',
        ]);

        $deleted = CommentReaction::where('user_id', $validated['user_id'])
            ->where('rating_id', $validated['rating_id'])
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Reaction successfully removed.'], 200);
        } else {
            return response()->json(['message' => 'Reaction not found or could not be removed.'], 404);
        }
    }
}
