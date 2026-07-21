<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::orderBy('type')->orderBy('sort_order')->get()->map(fn (Category $c) => [
                'id' => $c->id,
                'slug' => $c->slug,
                'name_en' => $c->name['en'] ?? '',
                'name_fr' => $c->name['fr'] ?? '',
                'type' => $c->type,
                'sort_order' => $c->sort_order,
                'is_active' => $c->is_active,
                'articles_count' => $c->articles()->count(),
                'properties_count' => $c->properties()->count(),
            ]),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Category::create([
            'slug' => Category::generateUniqueSlug($validated['name_en']),
            'name' => ['en' => $validated['name_en'], 'fr' => $validated['name_fr']],
            'type' => $validated['type'],
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Category added.');
    }

    public function update(StoreCategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();

        $category->update([
            'name' => ['en' => $validated['name_en'], 'fr' => $validated['name_fr']],
            'type' => $validated['type'],
            'sort_order' => $validated['sort_order'] ?? $category->sort_order,
            'is_active' => $validated['is_active'] ?? $category->is_active,
        ]);

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->articles()->exists() || $category->properties()->exists()) {
            return back()->withErrors(['category' => 'Cannot delete a category that still has articles or properties assigned.']);
        }

        $category->delete();

        return back()->with('success', 'Category removed.');
    }
}