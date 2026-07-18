<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'role', 'quote', 'rating', 'avatar_path', 'sort_order', 'is_published'];

    protected function casts(): array
    {
        return [
            'role' => 'array',
            'quote' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('sort_order');
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null;
    }

    public function forLocale(string $locale): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role[$locale] ?? $this->role['en'] ?? '',
            'quote' => $this->quote[$locale] ?? $this->quote['en'] ?? '',
            'rating' => $this->rating,
            'avatar' => $this->avatar_url,
        ];
    }
}