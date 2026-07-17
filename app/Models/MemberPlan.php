<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'plan_id',
        'label',
        'goal',
        'preferred_locations',
        'land_type',
        'contribution_frequency',
        'contribution_amount',
        'payment_method',
        'status',
        'is_primary',
        'subscribed_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_locations' => 'array',
            'contribution_amount' => 'decimal:2',
            'is_primary' => 'boolean',
            'subscribed_at' => 'datetime',
        ];
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function displayName(): string
    {
        return $this->label ?: $this->plan->name;
    }

    public function lastSuccessfulContributionAt(): ?\Illuminate\Support\Carbon
    {
        return $this->contributions()
            ->where('status', 'successful')
            ->latest()
            ->value('created_at');
    }

    public function nextDueAt(): ?\Illuminate\Support\Carbon
    {
        $base = $this->lastSuccessfulContributionAt() ?? $this->subscribed_at;

        return match ($this->contribution_frequency) {
            'Daily' => $base->copy()->addDay(),
            'Weekly' => $base->copy()->addWeek(),
            'Monthly' => $base->copy()->addMonth(),
            default => null,
        };
    }
}