<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFaqRequest;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/faqs/index', [
            'faqs' => Faq::orderBy('sort_order')->get()->map(fn (Faq $f) => [
                'id' => $f->id,
                'question_en' => $f->question['en'] ?? '',
                'question_fr' => $f->question['fr'] ?? '',
                'answer_en' => $f->answer['en'] ?? '',
                'answer_fr' => $f->answer['fr'] ?? '',
                'sort_order' => $f->sort_order,
                'is_published' => $f->is_published,
            ]),
        ]);
    }

    public function store(StoreFaqRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Faq::create([
            'question' => ['en' => $validated['question_en'], 'fr' => $validated['question_fr']],
            'answer' => ['en' => $validated['answer_en'], 'fr' => $validated['answer_fr']],
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        return back()->with('success', 'FAQ added.');
    }

    public function update(StoreFaqRequest $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validated();

        $faq->update([
            'question' => ['en' => $validated['question_en'], 'fr' => $validated['question_fr']],
            'answer' => ['en' => $validated['answer_en'], 'fr' => $validated['answer_fr']],
            'sort_order' => $validated['sort_order'] ?? $faq->sort_order,
            'is_published' => $validated['is_published'] ?? $faq->is_published,
        ]);

        return back()->with('success', 'FAQ updated.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back()->with('success', 'FAQ removed.');
    }
}