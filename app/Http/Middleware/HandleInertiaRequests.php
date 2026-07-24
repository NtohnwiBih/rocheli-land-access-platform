<?php

namespace App\Http\Middleware;

use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        protected SiteContentRepositoryInterface $siteContent,
    ) {}

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $member = $user?->member;
        $primaryPlan = $member?->memberPlans()->where('is_primary', true)->with('plan')->first();
        $locale = $request->cookie('lang', 'en');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $request->user()->role,
                    'member_code' => $member?->id ? 'RC-' . str_pad($member->id, 5, '0', STR_PAD_LEFT) : null,
                    'member' => $request->user()->member
                        ? ['id' => $request->user()->member->id]
                        : null,
                    'plan' => $primaryPlan?->plan->name,
                    'avatar' => null,
                    'created_at' => $user->created_at?->toIso8601String(),
                ] : null,
            ],
            'notifications' => fn () => $user
                ? $user->notifications()->latest()->take(10)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'title' => $n->data['title'] ?? '',
                    'body' => $n->data['body'] ?? '',
                    'tone' => $n->data['tone'] ?? 'info',
                    'read_at' => $n->read_at?->toIso8601String(),
                    'created_at' => $n->created_at->diffForHumans(),
                ])
                : [],
            'flash' => [
                'registered' => fn () => $request->session()->get('registered'),
            ],
            'footer' => fn () => $this->siteContent
                ->forFrontend('global', ['footer'], $locale)['footer'] ?? [],
        ];
    }
}