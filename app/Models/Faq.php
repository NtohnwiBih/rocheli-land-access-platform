<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;

    protected $fillable = ['question', 'answer', 'sort_order', 'is_published', 'is_land_access'];

    protected function casts(): array
    {
        return [
            'question' => 'array',
            'answer' => 'array',
            'is_published' => 'boolean',
            'is_land_access' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('sort_order');
    }

    public function scopeLandAccess($query)
    {
        return $query->where('is_land_access', true);
    }

    public function scopeGeneral($query)
    {
        return $query->where('is_land_access', false);
    }

    public function forLocale(string $locale): array
    {
        return [
            'id' => $this->id,
            'question' => $this->question[$locale] ?? $this->question['en'] ?? '',
            'answer' => $this->answer[$locale] ?? $this->answer['en'] ?? '',
        ];
    }
}