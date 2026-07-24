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

    public function toDisplayArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'total' => $this->formatMillions($this->target_price),
            'currency' => 'FCFA',
            'daily' => $this->formatAmount($this->daily_amount),
            'weekly' => $this->formatAmount($this->weekly_amount),
            'monthly' => $this->formatAmount($this->monthly_amount),
            'highlight' => $this->is_featured,
        ];
    }

    protected function formatMillions($value): string
    {
        if ($value === null) {
            return '—';
        }

        $millions = $value / 1000000;
        $formatted = rtrim(rtrim(number_format((float) $millions, 1), '0'), '.');

        return $formatted . 'M';
    }

    protected function formatAmount($value): string
    {
        if ($value === null) {
            return '—';
        }

        return number_format((float) $value, 0, '.', ',') . ' F';
    }
}