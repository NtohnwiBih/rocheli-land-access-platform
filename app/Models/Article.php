<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'title', 'excerpt', 'body', 'category',
        'author', 'read_time', 'image_path', 'published_at', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'title' => 'array',
            'excerpt' => 'array',
            'body' => 'array',
            'category' => 'array',
            'published_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderByDesc('published_at');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }

    public function forLocale(string $locale): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title[$locale] ?? $this->title['en'] ?? '',
            'excerpt' => $this->excerpt[$locale] ?? $this->excerpt['en'] ?? '',
            'category' => $this->category[$locale] ?? $this->category['en'] ?? '',
            'author' => $this->author,
            'readTime' => $this->read_time,
            'image' => $this->image_url,
            'date' => $this->published_at?->format('M j, Y'),
        ];
    }
}