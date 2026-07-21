<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'target_price',
        'daily_amount',
        'weekly_amount',
        'monthly_amount',
        'is_flexible',
        'is_featured',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'target_price' => 'decimal:2',
            'daily_amount' => 'decimal:2',
            'weekly_amount' => 'decimal:2',
            'monthly_amount' => 'decimal:2',
            'is_flexible' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = \Illuminate\Support\Str::slug($name);
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