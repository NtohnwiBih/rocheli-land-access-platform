<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(): Response
    {
        $locale = app()->getLocale();

        $properties = Property::with(['category', 'city'])
            ->latest()
            ->get()
            ->map(fn (Property $p) => $this->transform($p, $locale));

        return Inertia::render('site/properties/index', [
            'properties' => $properties,
        ]);
    }

    public function show(Property $property): Response
    {
        $locale = app()->getLocale();

        $property->load(['media', 'category', 'city']);

        return Inertia::render('site/properties/show', [
            'property' => [
                'id' => $property->id,
                'title' => $property->titleForLocale($locale),
                'description' => $property->descriptionForLocale($locale),
                'location' => $property->location,
                'size' => $property->size,
                'type' => $property->type,
                'price' => $property->price,
                'status' => $property->status,
                'image_url' => $property->image_url,
                'media' => $property->media->map(fn ($m) => [
                    'id' => $m->id,
                    'src' => $m->src,
                    'caption' => $m->caption,
                    'is_featured' => $m->is_featured,
                ]),
                // Was $property->category?->name / $property->city?->name — those
                // return the raw translatable attribute (all locales), which is
                // what caused the "object with keys {en, fr}" render crash.
                // Use the same locale-resolved accessors as index().
                'category' => $property->category?->nameForLocale($locale),
                'city' => $property->city?->name_en,
            ],
            'relatedProperties' => $this->relatedTo($property, $locale),
        ]);
    }

    /**
     * Other properties sharing a category or city with the given property,
     * most recent first, excluding the property itself.
     */
    private function relatedTo(Property $property, string $locale, int $limit = 4)
    {
        return Property::query()
            ->where('id', '!=', $property->id)
            ->when(
                $property->category_id || $property->city_id,
                function ($query) use ($property) {
                    $query->where(function ($q) use ($property) {
                        if ($property->category_id) {
                            $q->orWhere('category_id', $property->category_id);
                        }
                        if ($property->city_id) {
                            $q->orWhere('city_id', $property->city_id);
                        }
                    });
                }
            )
            ->with(['category', 'city'])
            ->latest()
            ->take($limit)
            ->get()
            ->map(fn (Property $p) => $this->transform($p, $locale));
    }

    private function transform(Property $p, string $locale): array
    {
        return [
            'id' => $p->id,
            'slug' => $p->slug,
            'title' => $p->titleForLocale($locale),
            'location' => $p->location,
            'price' => $p->price,
            'priceValue' => (float) $p->price_value,
            'size' => $p->size,
            'status' => $p->status,
            'type' => $p->type,
            'image' => $p->image_url,
            'category' => $p->category?->nameForLocale($locale),
            'city' => $p->city?->name_en,
        ];
    }
}