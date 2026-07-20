<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\LegalDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LegalDocumentController extends Controller
{
   protected array $keys = ['member_agreement', 'privacy_policy'];

    public function index(Request $request): Response
    {
        $locale = $request->cookie('lang', 'en');

        $documents = LegalDocument::whereIn('key', $this->keys)->get()->keyBy('key');

        return Inertia::render('member/legal', [
            'documents' => collect($this->keys)->map(function (string $key) use ($documents, $locale) {
                $doc = $documents->get($key);

                return [
                    'key' => $key,
                    'title' => $doc?->titleForLocale($locale) ?? ucwords(str_replace('_', ' ', $key)),
                    'url' => $doc?->urlForLocale($locale),
                    'available' => (bool) $doc?->urlForLocale($locale),
                ];
            }),
        ]);
    }
}