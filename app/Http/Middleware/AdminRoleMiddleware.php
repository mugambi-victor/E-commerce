<?php 
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminRoleMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('Request Headers:', ['headers' => $request->headers->all()]);

        // Check if the user is authenticated
        if (!Auth::check()) {
            Log::info('User not authenticated.');
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Check if the authenticated user has the admin role (false in this case)
        $userRole = Auth::user()->role;
        
        // Check if the role is 'false'
        if ($userRole !== false) {
            Log::info('Unauthorized access for user ID: ' . Auth::id());
            return response()->json(['error' => 'Unauthorized.'], 403);
        }
        Log::info("proceeding to next action");
        // User is authenticated and has the admin role, proceed with the request
        return $next($request);
    }
}
