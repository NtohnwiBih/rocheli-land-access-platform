<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => Testimonial::orderBy('sort_order')->get()->map(fn (Testimonial $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'role_en' => $t->role['en'] ?? '',
                'role_fr' => $t->role['fr'] ?? '',
                'quote_en' => $t->quote['en'] ?? '',
                'quote_fr' => $t->quote['fr'] ?? '',
                'rating' => $t->rating,
                'avatar' => $t->avatar_url,
                'sort_order' => $t->sort_order,
                'is_published' => $t->is_published,
            ]),
        ]);
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $avatarPath = $request->hasFile('avatar')
            ? $request->file('avatar')->store('testimonials', 'public')
            : null;

        Testimonial::create([
            'name' => $validated['name'],
            'role' => ['en' => $validated['role_en'], 'fr' => $validated['role_fr']],
            'quote' => ['en' => $validated['quote_en'], 'fr' => $validated['quote_fr']],
            'rating' => $validated['rating'],
            'avatar_path' => $avatarPath,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        return back()->with('success', 'Testimonial added.');
    }

    public function update(StoreTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validated();

        $avatarPath = $testimonial->avatar_path;

        if ($request->hasFile('avatar')) {
            if ($avatarPath) {
                Storage::disk('public')->delete($avatarPath);
            }
            $avatarPath = $request->file('avatar')->store('testimonials', 'public');
        }

        $testimonial->update([
            'name' => $validated['name'],
            'role' => ['en' => $validated['role_en'], 'fr' => $validated['role_fr']],
            'quote' => ['en' => $validated['quote_en'], 'fr' => $validated['quote_fr']],
            'rating' => $validated['rating'],
            'avatar_path' => $avatarPath,
            'sort_order' => $validated['sort_order'] ?? $testimonial->sort_order,
            'is_published' => $validated['is_published'] ?? $testimonial->is_published,
        ]);

        return back()->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        if ($testimonial->avatar_path) {
            Storage::disk('public')->delete($testimonial->avatar_path);
        }

        $testimonial->delete();

        return back()->with('success', 'Testimonial removed.');
    }
}