<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'message' => 'Account created successfully. Please log in.',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 10)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Too many login attempts. Try again in {$seconds} seconds.",
            ], 429);
        }

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            RateLimiter::hit($key, 60);
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        RateLimiter::clear($key);

        if ($user->isOtpLocked()) {
            $remaining = Carbon::now()->diffInMinutes($user->otp_locked_until, false);
            return response()->json([
                'message' => "Account temporarily locked. Try again in {$remaining} minute(s).",
            ], 423);
        }

        $otp = $this->generateAndSaveOtp($user);
        $this->sendOtp($user, $otp);

        return response()->json([
            'message'  => 'OTP sent to your email address.',
            'email'    => $user->email,
            'otp_sent' => true,
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->isOtpLocked()) {
            return response()->json(['message' => 'Account is locked due to too many failed attempts.'], 423);
        }

        if (!$user->isOtpValid($data['otp'])) {
            $user->incrementOtpAttempts();
            $remaining = max(0, (int) config('auth.otp_max_attempts', 5) - $user->fresh()->otp_attempts);
            return response()->json([
                'message'            => 'Invalid or expired OTP.',
                'attempts_remaining' => $remaining,
            ], 422);
        }

        $user->clearOtp();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Authentication successful.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function resendOtp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
        ]);

        $key   = 'resend-otp:' . $data['email'];
        $limit = (int) config('auth.otp_resend_limit', 3);

        if (RateLimiter::tooManyAttempts($key, $limit)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Too many resend attempts. Try again in {$seconds} seconds.",
            ], 429);
        }

        RateLimiter::hit($key, 60);

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'If this email is registered, a new OTP has been sent.']);
        }

        if ($user->isOtpLocked()) {
            return response()->json(['message' => 'Account is locked. Cannot resend OTP.'], 423);
        }

        $otp = $this->generateAndSaveOtp($user);
        $this->sendOtp($user, $otp);

        return response()->json(['message' => 'New OTP sent to your email address.']);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ]);
    }

    private function generateAndSaveOtp(User $user): string
    {
        $otp    = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiry = (int) config('auth.otp_expiry_minutes', 10);

        $user->update([
            'otp_code'         => $otp,
            'otp_expires_at'   => Carbon::now()->addMinutes($expiry),
            'otp_attempts'     => 0,
            'otp_locked_until' => null,
        ]);

        return $otp;
    }

    private function sendOtp(User $user, string $otp): void
    {
        Mail::to($user->email)->send(new OtpMail($otp, $user->name));
    }
}