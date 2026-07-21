<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactLead extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'interest',
        'message',
        'email_sent',
    ];
}