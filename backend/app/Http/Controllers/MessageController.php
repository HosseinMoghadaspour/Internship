<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    // ... (متدهای index و store قبلی شما اینجا قرار دارند) ...
    public function index(User $receiver)
    {
        $sender = Auth::user();

        $messages = Message::where(function ($query) use ($sender, $receiver) {
            $query->where('sender_id', $sender->id)
                ->where('receiver_id', $receiver->id);
        })->orWhere(function ($query) use ($sender, $receiver) {
            $query->where('sender_id', $receiver->id)
                ->where('receiver_id', $sender->id);
        })
            ->with(['sender:id,username', 'receiver:id,username'])
            ->orderBy('created_at', 'asc')
            ->get();


        $transformedMessages = $messages->map(function ($message) use ($sender) {
            return [
                'id' => $message->id,
                'text' => $message->message,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'senderType' => $message->sender_id == $sender->id ? 'me' : 'other',
                'created_at' => $message->created_at->toISOString(),
            ];
        });

        return response()->json($transformedMessages);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $sender = Auth::user();


        if ($sender->id == $validatedData['receiver_id']) {
            return response()->json(['message' => 'شما نمی‌توانید به خودتان پیام ارسال کنید.'], 422);
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $validatedData['receiver_id'],
            'message' => $validatedData['message'],
        ]);


        $responseMessage = [
            'id' => $message->id,
            'text' => $message->message,
            'sender_id' => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'senderType' => 'me',
            'timestamp' => $message->created_at->toISOString(),

        ];

        return response()->json($responseMessage, 201);
    }

    /*
    |--------------------------------------------------------------------------
    | متدهای مخصوص ادمین
    |--------------------------------------------------------------------------
    */

    /**
     * نمایش لیست کاربرانی که یک کاربر خاص با آنها چت کرده است
     * (فقط برای ادمین)
     */
    public function getChatPartnersForUser(User $user)
    {
        // پیدا کردن ID کاربرانی که به این کاربر پیام فرستاده‌اند
        $sentToUser = Message::where('receiver_id', $user->id)->pluck('sender_id');
        // پیدا کردن ID کاربرانی که از این کاربر پیام دریافت کرده‌اند
        $receivedFromUser = Message::where('sender_id', $user->id)->pluck('receiver_id');

        // ترکیب IDها، حذف موارد تکراری و گرفتن اطلاعات کاربران
        $partnerIds = $sentToUser->merge($receivedFromUser)->unique();
        $partners = User::whereIn('id', $partnerIds)->get(['id', 'username', 'img']);

        return response()->json($partners);
    }

    /**
     * نمایش تاریخچه کامل چت بین دو کاربر مشخص
     * (فقط برای ادمین)
     */
    public function getConversationBetweenUsers(User $user1, User $user2)
    {
        $messages = Message::where(function ($query) use ($user1, $user2) {
            $query->where('sender_id', $user1->id)
                  ->where('receiver_id', $user2->id);
        })->orWhere(function ($query) use ($user1, $user2) {
            $query->where('sender_id', $user2->id)
                  ->where('receiver_id', $user1->id);
        })
        ->with(['sender:id,username', 'receiver:id,username'])
        ->orderBy('created_at', 'asc')
        ->get();

        return response()->json($messages);
    }
}
