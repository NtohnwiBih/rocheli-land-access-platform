<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\StoreContributionRequest;
use App\Models\Contribution;
use App\Models\MemberPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContributionController extends Controller
{
    public function index(): Response
    {
        $member = auth()->user()->member;

        $memberPlans = $member->memberPlans()->with('plan')->get();

        $contributions = Contribution::query()
            ->whereIn('member_plan_id', $memberPlans->pluck('id'))
            ->with('memberPlan.plan')
            ->latest()
            ->get()
            ->map(fn (Contribution $c) => [
                'id' => $c->id,
                'date' => $c->created_at->format('Y-m-d'),
                'amount' => (float) $c->amount,
                'method' => $c->method,
                'ref' => $c->reference,
                'status' => ucfirst($c->status === 'successful' ? 'Successful' : $c->status),
                'has_proof' => (bool) $c->proof_path,
                'note' => $c->note,
                'project' => $c->memberPlan->displayName(),
            ]);

        $totalContributed = Contribution::whereIn('member_plan_id', $memberPlans->pluck('id'))
            ->where('status', 'successful')->sum('amount');

        $thisYear = Contribution::whereIn('member_plan_id', $memberPlans->pluck('id'))
            ->where('status', 'successful')
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        return Inertia::render('member/contributions', [
            'contributions' => $contributions,
            'projects' => $memberPlans->map(fn (MemberPlan $mp) => [
                'id' => $mp->id,
                'label' => $mp->displayName(),
                'payment_method' => $mp->payment_method,
            ]),
            'stats' => [
                'total_contributed' => (float) $totalContributed,
                'this_year' => (float) $thisYear,
            ],
            'pending_count' => Contribution::whereIn('member_plan_id', $memberPlans->pluck('id'))
                ->where('status', 'pending')->count(),
        ]);
    }

    public function store(StoreContributionRequest $request): RedirectResponse
    {
        $member = $request->user()->member;
        $validated = $request->validated();

        $memberPlan = $member->memberPlans()->findOrFail($validated['member_plan_id']);

        $proofPath = $request->file('proof')->store('contribution-proofs', 'private');

        Contribution::create([
            'member_id' => $member->id,
            'member_plan_id' => $memberPlan->id,
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'reference' => Contribution::generateReference(),
            'proof_path' => $proofPath,
            'note' => $validated['note'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Contribution submitted — awaiting admin validation.');
    }

    public function proof(Contribution $contribution)
    {
        $memberPlanIds = auth()->user()->member->memberPlans()->pluck('id');

        abort_unless($memberPlanIds->contains($contribution->member_plan_id), 403);
        abort_unless(Storage::disk('private')->exists($contribution->proof_path), 404);

        return Storage::disk('private')->response($contribution->proof_path);
    }
}