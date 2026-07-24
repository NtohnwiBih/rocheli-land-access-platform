<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'property_id',
        'name',
        'email',
        'phone',
        'interest',
        'message',
        'status',
        'response',
        'responded_by',
        'responded_at',
    ];

    protected function casts(): array
    {
        return ['responded_at' => 'datetime'];
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function respondedBy()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function getContactNameAttribute(): string
    {
        return $this->member?->user?->name ?? $this->name ?? 'Guest';
    }

    public function getContactEmailAttribute(): ?string
    {
        return $this->member?->user?->email ?? $this->email;
    }

    public function getContactPhoneAttribute(): ?string
    {
        return $this->member?->user?->phone ?? $this->phone;
    }

    public function scopeInReview($query)
    {
        return $query->where('status', 'in_review');
    }

    public function scopeResponded($query)
    {
        return $query->where('status', 'responded');
    }
}