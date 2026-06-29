<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password'   => 'required|string',
        ]);

        $identifier = $request->identifier;
        $password   = $request->password;

        // Try email first
        $user = User::where('email', $identifier)->first();

        // If not found by email AND phone column exists, try phone
        if (!$user && Schema::hasColumn('users', 'phone')) {
            $user = User::where('phone', $identifier)->first();
        }

        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Plain text password compare for ALL roles — no hashing
       $dbPassword = $user->getAttributes()['password'];

$isMatch = strlen($dbPassword) === 60 && str_starts_with($dbPassword, '$2')
    ? \Illuminate\Support\Facades\Hash::check($password, $dbPassword)
    : $password === $dbPassword;

if (!$isMatch) {
    return response()->json(['message' => 'Invalid credentials'], 401);
}

        // Check Status if column exists
        if (Schema::hasColumn('users', 'Status')) {
            if ($user->Status && $user->Status !== 'active') {
                return response()->json(['message' => 'Account is inactive. Contact your administrator.'], 403);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role'  => $user->role,
            'user'  => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}