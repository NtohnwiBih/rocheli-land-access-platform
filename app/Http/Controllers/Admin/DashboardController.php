<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Plan;
use App\Models\Member;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/index', [
            'properties' => Property::select('id', 'status')->get(),
            'articles' => [],
            'plans' => Plan::select('id', 'is_featured as highlight')->get(),
            'members' => Member::with('user:id,name')
                ->select('id', 'user_id', 'plan', 'status')
                ->latest()
                ->get()
                ->map(fn ($member) => [
                    'id' => $member->id,
                    'name' => $member->user?->name ?? 'Unnamed',
                    'plan' => $member->plan,
                    'status' => $member->status,
                ]),
            'contacts' => [],
        ]);
    }
}