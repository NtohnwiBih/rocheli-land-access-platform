<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\StoreContributionRequest;
use App\Models\Contribution;
use App\Models\MemberPlan;
use App\Models\User;
use App\Notifications\NewContributionSubmitted;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class ContributionController extends Controller
{
    public function index(Request $request): Response
    {
        $member = auth()->user()->member;

        $memberPlans = $member->memberPlans()->with('plan')->orderBy('subscribed_at')->get();
        $memberPlanIds = $memberPlans->pluck('id');

        $contributions = Contribution::query()
            ->whereIn('member_plan_id', $memberPlanIds)
            ->with('memberPlan.plan')
            ->latest()
            ->get();

        $contributionsData = $contributions->map(fn (Contribution $c) => [
            'id' => $c->id,
            'date' => $c->created_at->format('Y-m-d'),
            'amount' => (float) $c->amount,
            'method' => $c->method,
            'ref' => $c->reference,
            'status' => ucfirst($c->status === 'successful' ? 'Successful' : $c->status),
            'has_proof' => (bool) $c->proof_path,
            'note' => $c->note,
            'project_id' => $c->member_plan_id,
            'project' => $c->memberPlan->displayName(),
        ]);

        $successful = $contributions->where('status', 'successful');

        $projectBreakdown = $memberPlans->map(function ($mp) use ($successful) {
            $total = $successful->where('member_plan_id', $mp->id)->sum('amount');

            return [
                'id' => $mp->id,
                'label' => $mp->displayName(),
                'target_price' => (float) $mp->plan->target_price,
                'total_contributed' => (float) $total,
                'this_year' => (float) $successful
                    ->where('member_plan_id', $mp->id)
                    ->filter(fn ($c) => $c->created_at->isCurrentYear())
                    ->sum('amount'),
                'is_completed' => $mp->isCompleted(),
            ];
        });

        $requestedProjectId = $request->integer('project');
        $initialProjectFilter = $memberPlanIds->contains($requestedProjectId)
            ? (string) $requestedProjectId
            : 'all';

        return Inertia::render('member/contributions', [
            'contributions' => $contributionsData,
            'projects' => $memberPlans->reject(fn (MemberPlan $mp) => $mp->isCompleted())->values()->map(fn (MemberPlan $mp) => [
                'id' => $mp->id,
                'label' => $mp->displayName(),
                'payment_method' => $mp->payment_method,
            ]),
            'project_breakdown' => $projectBreakdown,
            'stats' => [
                'total_contributed' => (float) $successful->sum('amount'),
                'this_year' => (float) $successful->filter(fn ($c) => $c->created_at->isCurrentYear())->sum('amount'),
            ],
            'pending_count' => $contributions->where('status', 'pending')->count(),
            'initial_project_filter' => $initialProjectFilter,
        ]);
    }

    public function store(StoreContributionRequest $request): RedirectResponse
    {
        $member = $request->user()->member;
        $validated = $request->validated();

        $memberPlan = $member->memberPlans()->findOrFail($validated['member_plan_id']);

        abort_if($memberPlan->isCompleted(), 422, 'This project has already been fully funded.');

        $proofPath = $request->file('proof')->store('contribution-proofs', 'private');

        $contribution = Contribution::create([
            'member_id' => $member->id,
            'member_plan_id' => $memberPlan->id,
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'reference' => Contribution::generateReference(),
            'proof_path' => $proofPath,
            'note' => $validated['note'] ?? null,
            'status' => 'pending',
        ]);

        $contribution->load('memberPlan.member.user');

        User::where('role', 'admin')->get()->each(
            fn (User $admin) => $admin->notify(new NewContributionSubmitted($contribution))
        );

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