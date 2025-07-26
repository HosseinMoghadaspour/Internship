<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['username', 'password', 'mobile', 'img', 'is_admin', 'remember_token'];

    protected $hidden = ['password', 'remember_token'];

    public function setPasswordAttribute($value)
    {
        if (Hash::needsRehash($value)) {
            $value = Hash::make($value);
        }

        $this->attributes['password'] = $value;
    }

    public function introducedCompanies()
    {
        return $this->hasMany(Company::class, 'introduced_by');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'reciver_id');
    }

    public function commentReactions()
    {
        return $this->hasMany(CommentReaction::class);
    }
}
