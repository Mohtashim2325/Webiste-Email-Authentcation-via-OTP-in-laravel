<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Support\Facades\Route;

Route::middleware(ForceJsonResponse::class)->group(function () {

    // Public auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/register',   [AuthController::class, 'register']);
        Route::post('/login',      [AuthController::class, 'login']);
        Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
        Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    });

    // Protected auth routes
    Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });

});