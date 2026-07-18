<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'size',
        'type',
        'price',
        'price_value',
        'image_path',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'price_value' => 'decimal:2',
        ];
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }

    public function media()
    {
        return $this->hasMany(PropertyMedia::class)->orderBy('sort_order');
    }

    public function featuredMedia()
    {
        return $this->hasMany(PropertyMedia::class)->where('is_featured', true)->orderBy('sort_order');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}