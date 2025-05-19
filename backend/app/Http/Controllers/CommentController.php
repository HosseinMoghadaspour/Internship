<?php
namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
public function store(Request $request)
{
$validated = $request->validate([
'user_id' => 'required|exists:users,id',
'company_id' => 'required|exists:companies,id',
'comment' => 'required',
]);

return Comment::create($validated);
}

public function update(Request $request, $id)
{
$comment = Comment::findOrFail($id);
$comment->update($request->only('comment'));
return $comment;
}

public function destroy($id)
{
return Comment::destroy($id);
}
}