<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', 'App\Http\Controllers\AuthenticationController@register')->name('register');
Route::post('login', 'App\Http\Controllers\AuthenticationController@login')->name('login');

// Routes requiring authentication
Route::middleware('auth:sanctum')->group(function () {
    // In routes/api.php or routes/web.php
Route::post('/products/{id}/update', [ProductController::class, 'update']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user');
    // Protect category routes

    Route::resource('categories', CategoryController::class);
    
    // Protect product routes with both 'auth' and 'admin' middleware
    Route::middleware('admin')->group(function () {
        Route::resource('products', ProductController::class);
    });
});
Route::middleware('auth:sanctum')->post('logout', [AuthenticationController::class, 'logout'])->name('logout');

// Public routes
Route::get('/categories/{id}', [CategoryController::class, 'getCategoryById']);
