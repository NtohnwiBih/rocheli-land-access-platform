<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class LegalDocument extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'title', 'file_path_en', 'file_path_fr', 'version'];

    protected function casts(): array
    {
        return ['title' => 'array'];
    }

    public function urlForLocale(string $locale): ?string
    {
        $path = $locale === 'fr' ? $this->file_path_fr : $this->file_path_en;

        return $path ? Storage::disk('public')->url($path) : null;
    }

    public function titleForLocale(string $locale): string
    {
        return $this->title[$locale] ?? $this->title['en'] ?? '';
    }
}