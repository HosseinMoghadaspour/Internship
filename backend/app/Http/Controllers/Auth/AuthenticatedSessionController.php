<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthenticatedSessionController extends Controller
{

    public function store(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'نام کاربری یا رمز عبور اشتباه است.',
            ], 401);
        }

        $user = User::where('username', $request->username)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'ورود با موفقیت انجام شد.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'img' => $user->img ? asset('storage/' . $user->img) : null,
                    'is_admin' => $user->is_admin,
                ],
                'token' => $token
            ]
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $path = null;
        if ($request->hasFile('img')) {
            $path = $request->file('img')->store('profile_images', 'public');
        }

        $user = User::create([
            'username' => $request->username,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
            'img' => $path,
            'is_admin' => false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'ثبت‌نام با موفقیت انجام شد',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'mobile' => $user->mobile,
                    'img' => $user->img ? asset('storage/' . $user->img) : null,
                ],
                'token' => $token
            ]
        ], 201);
    }
    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'نام کاربری یا رمز عبور نامعتبر است.'
            ], 401);
        }

        $user = User::where('username', $request->username)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'ورود با موفقیت انجام شد',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'img' => $user->img ? asset('storage/' . $user->img) : null,
                    'is_admin' => $user->is_admin,
                ],
                'token' => $token
            ]
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'خروج با موفقیت انجام شد'
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'img' => $user->img ? asset('storage/' . $user->img) : null,
            'mobile' => $user->mobile,
            'is_admin' => $user->is_admin,
        ]);
    }
}
