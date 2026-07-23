<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'interest',
        'message',
        'appointment_date',
        'appointment_time',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
    ];

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function getShortTimeAttribute(): string
    {
        return $this->appointment_time->format('H:i');
    }
}