<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PropertyMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'type',
        'path',
        'url',
        'caption',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
        ];
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Resolves to a usable src regardless of whether this is an uploaded
     * file (path on the public disk) or an external link (url column).
     */
    public function getSrcAttribute(): ?string
    {
        if ($this->url) {
            return $this->url;
        }

        return $this->path ? Storage::disk('public')->url($this->path) : null;
    }
}