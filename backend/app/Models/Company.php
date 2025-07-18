<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'province', 'city', 'address', 'is_verified', 'introduced_by'];

    public function introducer()
    {
        return $this->belongsTo(User::class, 'introduced_by');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function images()
    {
        return $this->hasMany(CompanyImage::class);
    }

    public function introducedBy()
    {
        return $this->belongsTo(User::class, 'introduced_by');
    }
}
