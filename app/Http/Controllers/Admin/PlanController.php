<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePlanRequest;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/plans/index', [
            'plans' => Plan::orderBy('sort_order')->get()->map(fn (Plan $p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'target_price' => (float) $p->target_price,
                'daily_amount' => (float) $p->daily_amount,
                'weekly_amount' => (float) $p->weekly_amount,
                'monthly_amount' => (float) $p->monthly_amount,
                'is_flexible' => $p->is_flexible,
                'is_featured' => $p->is_featured,
                'sort_order' => $p->sort_order,
                'is_active' => $p->is_active,
                'subscribers_count' => \App\Models\MemberPlan::where('plan_id', $p->id)->count(),
            ]),
        ]);
    }

    public function store(StorePlanRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Plan::create([
            'name' => $validated['name'],
            'slug' => Plan::generateUniqueSlug($validated['name']),
            'target_price' => $validated['target_price'],
            'daily_amount' => $validated['daily_amount'],
            'weekly_amount' => $validated['weekly_amount'],
            'monthly_amount' => $validated['monthly_amount'],
            'is_flexible' => $validated['is_flexible'] ?? false,
            'is_featured' => $validated['is_featured'] ?? false,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Plan added.');
    }

    public function update(StorePlanRequest $request, Plan $plan): RedirectResponse
    {
        $validated = $request->validated();

        $plan->update([
            'name' => $validated['name'],
            'target_price' => $validated['target_price'],
            'daily_amount' => $validated['daily_amount'],
            'weekly_amount' => $validated['weekly_amount'],
            'monthly_amount' => $validated['monthly_amount'],
            'is_flexible' => $validated['is_flexible'] ?? false,
            'is_featured' => $validated['is_featured'] ?? false,
            'sort_order' => $validated['sort_order'] ?? $plan->sort_order,
            'is_active' => $validated['is_active'] ?? $plan->is_active,
        ]);

        return back()->with('success', 'Plan updated.');
    }

    public function destroy(Plan $plan): RedirectResponse
    {
        if (\App\Models\MemberPlan::where('plan_id', $plan->id)->exists()) {
            return back()->withErrors(['plan' => 'Cannot delete a plan that members are subscribed to. Deactivate it instead.']);
        }

        $plan->delete();

        return back()->with('success', 'Plan removed.');
    }
}