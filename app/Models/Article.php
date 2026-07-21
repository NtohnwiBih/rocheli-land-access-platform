<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'title', 'excerpt', 'body', 'category_id',
        'author', 'read_time', 'image_path', 'published_at', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'title' => 'array',
            'excerpt' => 'array',
            'body' => 'array',
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function forLocale(string $locale): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title[$locale] ?? $this->title['en'] ?? '',
            'excerpt' => $this->excerpt[$locale] ?? $this->excerpt['en'] ?? '',
            'category' => $this->category?->nameForLocale($locale) ?? '',
            'author' => $this->author,
            'readTime' => $this->read_time,
            'image' => $this->image_url,
            'date' => $this->published_at?->format('M j, Y'),
        ];
    }

    public static function generateUniqueSlug(string $titleEn, ?int $ignoreId = null): string
    {
        $base = Str::slug($titleEn);
        $slug = $base;
        $suffix = 2;

        while (
            self::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}