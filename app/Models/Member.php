<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'whatsapp',
        'occupation',
        'country_of_residence',
        'city',
        'id_type',
        'id_number',
        'id_document_path',
        'kin_name',
        'kin_relationship',
        'kin_phone',
        'goal',
        'preferred_locations',
        'land_type',
        'plan',
        'contribution_frequency',
        'contribution_amount',
        'payment_method',
        'agreements',
        'signature',
        'agreed_at',
        'status',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_locations' => 'array',
            'agreements' => 'array',
            'contribution_amount' => 'decimal:2',
            'agreed_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }

    public function memberPlans()
    {
        return $this->hasMany(MemberPlan::class);
    }

    public function primaryPlan()
    {
        return $this->hasOne(MemberPlan::class)->where('is_primary', true);
    }
}