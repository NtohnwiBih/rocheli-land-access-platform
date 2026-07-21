<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'member_plan_id',
        'amount',
        'method',
        'reference',
        'proof_path',
        'note',
        'status',
        'rejection_reason',
        'validated_by',
        'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'validated_at' => 'datetime',
        ];
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public static function generateReference(): string
    {
        do {
            $ref = 'RCV-' . strtoupper(str()->random(6));
        } while (self::where('reference', $ref)->exists());

        return $ref;
    }

    public function memberPlan()
    {
        return $this->belongsTo(MemberPlan::class);
    }
}