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

    // فیلدهایی که قابل مقداردهی هستند
    protected $fillable = ['username', 'password', 'mobile' ,'img', 'is_admin', 'remember_token'];

    // فیلدهایی که در خروجی (مثلاً API) مخفی می‌مونند
    protected $hidden = ['password' , 'remember_token'];

    /**`
     * Mutator برای هش کردن رمز عبور به صورت خودکار
     */
   public function setPasswordAttribute($value)
{
    if (Hash::needsRehash($value)) {
        $value = Hash::make($value);
    }

    $this->attributes['password'] = $value;
}

    /**
     * ارتباط با شرکت‌هایی که کاربر معرفی کرده
     */
    public function introducedCompanies()
    {
        return $this->hasMany(Company::class, 'introduced_by');
    }

    /**
     * ارتباط با امتیازها
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * پیام‌های ارسالی
     */
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * پیام‌های دریافتی
     */
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'reciver_id');
    }

    /**
     * واکنش‌ها به کامنت‌ها
     */
    public function commentReactions()
    {
        return $this->hasMany(CommentReaction::class);
    }

}
