<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SiteContent extends Model
{
    protected $fillable = ['page', 'key', 'content'];

    protected function casts(): array
    {
        return ['content' => 'array'];
    }

    public function scopeForPage(Builder $query, string $page): Builder
    {
        return $query->where('page', $page);
    }

    public function forLocale(string $locale): array
    {
        return $this->content[$locale] ?? $this->content['en'] ?? [];
    }

    public static function get(string $page, string $key, string $locale = 'en'): array
    {
        $row = static::forPage($page)->where('key', $key)->first();

        return $row ? $row->forLocale($locale) : [];
    }
}