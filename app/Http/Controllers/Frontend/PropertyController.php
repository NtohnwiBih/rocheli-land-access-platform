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
            ->map(fn (Property $p) => [
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
            ]);

        return Inertia::render('site/properties/index', [
            'properties' => $properties,
        ]);
    }

    public function show(Property $property): Response
    {
        $property->load(['media', 'category', 'city']);

        return Inertia::render('site/properties/show', [
            'property' => [
                'id' => $property->id,
                'title' => $property->titleForLocale(app()->getLocale()),
                'description' => $property->descriptionForLocale(app()->getLocale()),
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
                'category' => $property->category?->name,
                'city' => $property->city?->name,
            ],
        ]);
    }
}