<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LegalDocumentController extends Controller
{
    protected array $keys = ['member_agreement', 'privacy_policy'];

    public function index(): Response
    {
        $documents = LegalDocument::whereIn('key', $this->keys)->get()->keyBy('key');

        return Inertia::render('admin/legal/index', [
            'documents' => collect($this->keys)->map(function (string $key) use ($documents) {
                $doc = $documents->get($key);

                return [
                    'key' => $key,
                    'title_en' => $doc?->title['en'] ?? ucwords(str_replace('_', ' ', $key)),
                    'title_fr' => $doc?->title['fr'] ?? '',
                    'file_en' => $doc?->urlForLocale('en'),
                    'file_fr' => $doc?->urlForLocale('fr'),
                    'version' => $doc?->version ?? 1,
                ];
            }),
        ]);
    }

    public function update(Request $request, string $key): RedirectResponse
    {
        abort_unless(in_array($key, $this->keys), 404);

        $request->validate([
            'title_en' => ['required', 'string', 'max:150'],
            'title_fr' => ['required', 'string', 'max:150'],
            'file_en' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'file_fr' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $document = LegalDocument::firstOrNew(['key' => $key]);

        if ($request->hasFile('file_en')) {
            if ($document->file_path_en) {
                Storage::disk('public')->delete($document->file_path_en);
            }
            $document->file_path_en = $request->file('file_en')->store('legal', 'public');
        }

        if ($request->hasFile('file_fr')) {
            if ($document->file_path_fr) {
                Storage::disk('public')->delete($document->file_path_fr);
            }
            $document->file_path_fr = $request->file('file_fr')->store('legal', 'public');
        }

        $document->title = ['en' => $request->string('title_en')->toString(), 'fr' => $request->string('title_fr')->toString()];
        $document->version = ($document->version ?? 0) + 1;
        $document->save();

        return back()->with('success', 'Document updated.');
    }
}