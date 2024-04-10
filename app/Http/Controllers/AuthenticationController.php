<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


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
        'email' =>'required|string|email',
        'password'=>'required|string|min:6',
        'token_name' =>'string'
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

    // Return a JSON response indicating success
    return response()->json(["result" => "ok", "Access Token" => $token], 200);
}



}
