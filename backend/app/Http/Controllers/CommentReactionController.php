<?php
namespace App\Http\Controllers;

use App\Models\CommentReaction;
use Illuminate\Http\Request;

class CommentReactionController extends Controller
{
public function store(Request $request)
{
$validated = $request->validate([
'user_id' => 'required|exists:users,id',
'comment_id' => 'required|exists:comments,id',
'is_like' => 'required|boolean',
]);

return CommentReaction::create($validated);
}

public function update(Request $request, $id)
{
$reaction = CommentReaction::findOrFail($id);
$reaction->update($request->only('is_like'));
return $reaction;
}

public function destroy($id)
{
return CommentReaction::destroy($id);
}
}