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
        'city_id',
        'location',
        'size',
        'type',
        'category_id',
        'price',
        'price_value',
        'image_path',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'title' => 'array',
            'description' => 'array',
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function titleForLocale(string $locale): string
    {
        return $this->title[$locale] ?? $this->title['en'] ?? '';
    }

    public function descriptionForLocale(string $locale): ?string
    {
        return $this->description[$locale] ?? $this->description['en'] ?? null;
    }
}