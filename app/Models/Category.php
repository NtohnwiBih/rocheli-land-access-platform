<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'name', 'type', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return [
            'name' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeForArticles($query)
    {
        return $query->where('type', 'article');
    }

    public function scopeForProperties($query)
    {
        return $query->where('type', 'property');
    }

    public function nameForLocale(string $locale): string
    {
        return $this->name[$locale] ?? $this->name['en'] ?? '';
    }

    public static function generateUniqueSlug(string $nameEn, ?int $ignoreId = null): string
    {
        $base = \Illuminate\Support\Str::slug($nameEn);
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