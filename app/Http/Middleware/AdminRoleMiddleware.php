<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
class AdminRoleMiddleware
{
   
    public function handle(Request $request, Closure $next)
    {
        // Retrieve the email and password from the request
        $email = $request->input('email');
        $password = $request->input('password');
    
        // Retrieve the user from the database based on the provided email
        $user = User::where('email', $email)->first();
    
        // Verify if the user exists and if the password matches
        if (!$user || !Hash::check($password, $user->password)) {
            // Log authentication failure
            Log::info('Authentication failed for email: ' . $email);
            // Return a JSON response indicating authentication failure
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
    
        // Check if the user has the admin role
        if ($user->role !== false) {
            // Log unauthorized access
            Log::info('Unauthorized access for email: ' . $email);
            // Return a JSON response indicating unauthorized access
            return response()->json(['error' => 'Unauthorized.'], 403);
        }
    
        // User is authenticated and has the admin role, proceed with the request
        return $next($request);
    }
    
}
