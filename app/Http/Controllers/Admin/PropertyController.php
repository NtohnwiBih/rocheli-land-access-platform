<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePropertyRequest;
use App\Http\Requests\Admin\StorePropertyMediaRequest;
use App\Models\Category;
use App\Models\City;
use App\Models\Property;
use App\Models\PropertyMedia;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/properties/index', [
            'properties' => Property::with(['category', 'city'])->latest()->get()->map(fn (Property $p) => [
                'id' => $p->id,
                'title' => $p->titleForLocale('en'),
                'location' => $p->location,
                'city' => $p->city?->name_en ?? '—',
                'category' => $p->category?->name['en'] ?? '—',
                'price' => $p->price,
                'status' => $p->status,
                'image' => $p->image_url,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/properties/form', [
            'property' => null,
            'categories' => $this->categoryOptions(),
            'cities' => $this->cityOptions(),
        ]);
    }

    public function store(StorePropertyRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('properties', 'public')
            : null;

        $slug = ! empty($validated['slug'])
            ? $validated['slug']
            : Article::generateUniqueSlug($validated['title_en']);

        Property::create([
            ...$this->mapPayload($validated),
            'image_path' => $imagePath,
            'slug' => $slug,
        ]);

        return redirect()->route('admin.properties.index')->with('success', 'Property created.');
    }

    public function edit(Property $property): Response
    {
        return Inertia::render('admin/properties/form', [
            'property' => [
                'id' => $property->id,
                'slug' => $property->slug,
                'title_en' => $property->title['en'] ?? '',
                'title_fr' => $property->title['fr'] ?? '',
                'city_id' => $property->city_id,
                'location' => $property->location,
                'size' => $property->size,
                'type' => $property->type,
                'category_id' => $property->category_id,
                'price' => $property->price,
                'price_value' => $property->price_value,
                'status' => $property->status,
                'description_en' => $property->description['en'] ?? '',
                'description_fr' => $property->description['fr'] ?? '',
                'image' => $property->image_url,
                'media' => $property->media()->orderBy('sort_order')->get()->map(fn (PropertyMedia $m) => [
                    'id' => $m->id,
                    'type' => $m->type,
                    'src' => $m->src,
                    'caption' => $m->caption,
                    'is_featured' => $m->is_featured,
                ]),
            ],
            'categories' => $this->categoryOptions(),
            'cities' => $this->cityOptions(),
        ]);
    }

    public function update(StorePropertyRequest $request, Property $property): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $property->image_path;
        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('properties', 'public');
        }

        $slug = ! empty($validated['slug']) ? $validated['slug'] : $property->slug;

        $property->update([
            ...$this->mapPayload($validated),
            'image_path' => $imagePath,
            'slug' => $slug,
        ]);

        return redirect()->route('admin.properties.index')->with('success', 'Property updated.');
    }

    public function destroy(Property $property): RedirectResponse
    {
        if ($property->image_path) {
            Storage::disk('public')->delete($property->image_path);
        }

        foreach ($property->media as $media) {
            if ($media->path) {
                Storage::disk('public')->delete($media->path);
            }
        }

        $property->delete();

        return back()->with('success', 'Property removed.');
    }

    public function storeMedia(StorePropertyMediaRequest $request, Property $property): RedirectResponse
    {
        $nextOrder = $property->media()->max('sort_order') + 1;

        foreach ($request->file('files') as $file) {
            $isVideo = str_starts_with($file->getMimeType(), 'video');
            $path = $file->store('property-media', 'public');

            PropertyMedia::create([
                'property_id' => $property->id,
                'type' => $isVideo ? 'video' : 'image',
                'path' => $path,
                'sort_order' => $nextOrder++,
            ]);
        }

        return back()->with('success', 'Media uploaded.');
    }

    public function destroyMedia(Property $property, PropertyMedia $media): RedirectResponse
    {
        abort_unless($media->property_id === $property->id, 404);

        if ($media->path) {
            Storage::disk('public')->delete($media->path);
        }

        $media->delete();

        return back()->with('success', 'Media removed.');
    }

    protected function mapPayload(array $validated): array
    {
        return [
            'title' => ['en' => $validated['title_en'], 'fr' => $validated['title_fr']],
            'city_id' => $validated['city_id'],
            'location' => $validated['location'],
            'size' => $validated['size'],
            'type' => $validated['type'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'price_value' => $validated['price_value'] ?? null,
            'status' => $validated['status'],
            'description' => [
                'en' => $validated['description_en'] ?? '',
                'fr' => $validated['description_fr'] ?? '',
            ],
        ];
    }

    protected function categoryOptions(): array
    {
        return Category::forProperties()->active()->get()->map(fn (Category $c) => [
            'id' => $c->id,
            'name_en' => $c->name['en'] ?? '',
        ])->all();
    }

    protected function cityOptions(): array
    {
        return City::active()->get()->map(fn (City $c) => [
            'id' => $c->id,
            'name_en' => $c->name_en,
        ])->all();
    }
}