<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

 Route::post('register', 'App\Http\Controllers\AuthenticationController@register')->name('register');
Route::post('login', 'App\Http\Controllers\AuthenticationController@login')->name('login');

//All routes require that they be authenticated via sanctum authentication.
Route::middleware('auth:sanctum')->group(function () {
    // Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class)->only([
         'show', 'index'
     ]);
});

Route::middleware('admin')->group(function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class)->only([
        'destroy', 'store', 'update'
     ]);
});