<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends
Controller
{
    public function index()
    {
        return User::all();
    }
    public function show($id)
    {
        return
            User::findOrFail($id);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|unique:users',
            'password' => 'required',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        return User::create($validated);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->only(['username', 'img', 'is_admin']));
        return $user;
    }

    public function destroy($id)
    {
        return User::destroy($id);
    }
}
