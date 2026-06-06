<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'otp_code',
        'otp_expires_at',
        'otp_attempts',
        'otp_locked_until',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at'    => 'datetime',
        'otp_locked_until'  => 'datetime',
        'password'          => 'hashed',
    ];

    public function isOtpLocked(): bool
    {
        return $this->otp_locked_until && Carbon::now()->lessThan($this->otp_locked_until);
    }

    public function isOtpValid(string $code): bool
    {
        return $this->otp_code === $code
            && $this->otp_expires_at
            && Carbon::now()->lessThanOrEqualTo($this->otp_expires_at);
    }

    public function clearOtp(): void
    {
        $this->update([
            'otp_code'         => null,
            'otp_expires_at'   => null,
            'otp_attempts'     => 0,
            'otp_locked_until' => null,
        ]);
    }

    public function incrementOtpAttempts(): void
    {
        $this->increment('otp_attempts');

        $maxAttempts = (int) config('auth.otp_max_attempts', 5);

        if ($this->otp_attempts >= $maxAttempts) {
            $lockMinutes = (int) config('auth.otp_lock_minutes', 15);
            $this->update(['otp_locked_until' => Carbon::now()->addMinutes($lockMinutes)]);
        }
    }
}