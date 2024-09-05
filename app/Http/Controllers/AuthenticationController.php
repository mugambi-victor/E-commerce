<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticationController extends Controller
{
    public function register(Request $request)
    {
        // Validate incoming request data
        $this->validate($request, [
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|boolean',
            'token_name' => 'string'
        ]);

        // Create a new user instance
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        // Use Laravel's bcrypt function to hash the password
        $user->password = bcrypt($request->password);
        $user->role = $request->role;
        $user->save();

        // Return a JSON response indicating success
        return response()->json(["result" => "ok"], 201);
    }
    public function login(Request $request)
{
    // Validate incoming request data
    $this->validate($request, [
        'email' => 'required|string|email',
        'password' => 'required|string|min:6',
        'token_name' => 'string'
    ]);

    // Attempt to authenticate the user
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        // Return a JSON response indicating failure
        return response()->json(["result" => "fail"], 401);
    }

    // If authentication succeeds, generate a token
    $tokenName = $request->has('token_name') ? $request->token_name : 'default_token_name';
    $token = $user->createToken($tokenName)->plainTextToken;

    // Return a JSON response indicating success, including the user's role
    return response()->json([
        "result" => "ok",
        "Access Token" => $token,
        "role" => $user->role // Add the user's role to the response
    ], 200);
}

public function logout(Request $request)
{
    // Ensure the user is authenticated
    if (!Auth::check()) {
        return response()->json(['error' => 'Unauthenticated.'], 401);
    }

    // Get the current user's token from the request
    $token = $request->bearerToken();

    // Find and delete the token
    if ($token) {
        $accessToken = PersonalAccessToken::findToken($token);
        if ($accessToken) {
            $accessToken->delete();
        }
    }

    // Optionally: Revoke all tokens for the user if you want to log out all sessions
    // Auth::user()->tokens()->delete();

    // Return a success response
    return response()->json(['message' => 'Logged out successfully.'], 200);
}



}
