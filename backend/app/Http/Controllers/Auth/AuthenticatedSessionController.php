<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthenticatedSessionController extends Controller
{
    // ثبت‌نام کاربر
    public function register(Request $request)
    {
        try {
            // اعتبارسنجی ورودی‌ها
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:255|unique:users,username',
                'password' => 'required|string|min:6',
                'mobile' => 'required|string|regex:/^09\d{9}$/|unique:users,mobile',
                'img' => 'nullable|image|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'خطا در اعتبارسنجی',
                    'errors' => $validator->errors()
                ], 422);
            }

            $path = null;
            if ($request->hasFile('img')) {
                $path = $request->file('img')->store('profile_images', 'public');
            }

            // ایجاد کاربر جدید
            $user = User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'mobile' => $request->mobile,
                'img' => $path,
                'is_admin' => false,
            ]);

            // تولید توکن
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
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطا در ثبت‌نام',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ورود کاربر
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('username', $request->username)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'username' => $user->username,
                        'img' => $user->img,
                        'is_admin' => $user->is_admin,
                    ],
                    'token' => $token
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // خروج کاربر
    public function logout(Request $request)
    {
        try {
            if (!$request->user() || !$request->user()->currentAccessToken()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No authenticated user or token found.'
                ], 401);
            }

            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // پیدا کردن شخص
    public function profile(Request $request)
    {
        $user = $request->user(); // با توکن احراز هویت میشه

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'img' => $user->img ? asset('storage/' . $user->img) : null,
            'is_admin' => $user->is_admin,
        ]);
    }
}