<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'image_path',
        'order',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'name' => 'array',
            'position' => 'array',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }

    public function nameForLocale(string $locale): string
    {
        return $this->name[$locale] ?? $this->name['en'] ?? '';
    }

    public function positionForLocale(string $locale): string
    {
        return $this->position[$locale] ?? $this->position['en'] ?? '';
    }
}