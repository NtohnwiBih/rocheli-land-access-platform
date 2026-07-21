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
        'completed_at',
        'is_primary',
        'subscribed_at',
        'last_reminded_due_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_locations' => 'array',
            'contribution_amount' => 'decimal:2',
            'is_primary' => 'boolean',
            'subscribed_at' => 'datetime',
            'completed_at' => 'datetime',
            'last_reminded_due_at' => 'datetime',
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

    public function isCompleted(): bool
    {
        return $this->completed_at !== null;
    }

    public function totalContributed(): float
    {
        return (float) $this->contributions()->where('status', 'successful')->sum('amount');
    }

    public function recalculateCompletion(): void
    {
        if ($this->isCompleted()) {
            return; 
        }

        $target = (float) $this->plan->target_price;

        if ($target <= 0 || $this->totalContributed() < $target) {
            return; 
        }

        $this->update([
            'completed_at' => now(),
            'is_primary' => false,
        ]);

        if ($this->is_primary === false && $this->getOriginal('is_primary') === true) {
            $this->promoteNextPrimary();
        }
    }

    public function lastContributionAt(): ?\Illuminate\Support\Carbon
    {
        return $this->contributions()->max('created_at');
    }

    public function suspend(): void
    {
        $this->update(['status' => 'suspended']);
    }

    protected function promoteNextPrimary(): void
    {
        $next = self::where('member_id', $this->member_id)
            ->whereNull('completed_at')
            ->where('id', '!=', $this->id)
            ->orderBy('subscribed_at')
            ->first();

        $next?->update(['is_primary' => true]);
    }
}