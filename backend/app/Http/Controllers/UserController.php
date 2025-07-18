<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }
    public function show($id)
    {
        return User::findOrFail($id);
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $updateData = [
            'username' => $request->username,
            'is_admin' => $request->is_admin,
        ];

        if ($request->has('img')) {
            $updateData['img'] = $request->img;
        }

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'کاربر با موفقیت به‌روزرسانی شد.',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'کاربر با موفقیت حذف شد.'
        ], 200);
    }
}
