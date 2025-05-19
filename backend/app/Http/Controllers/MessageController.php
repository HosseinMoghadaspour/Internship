<?php
namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
public function index()
{
return Message::with(['sender', 'receiver'])->get();
}

public function store(Request $request)
{
$validated = $request->validate([
'sender_id' => 'required|exists:users,id',
'reciver_id' => 'required|exists:users,id',
'message' => 'required',
]);

return Message::create($validated);
}
}