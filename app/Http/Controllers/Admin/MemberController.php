<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\Member;
use App\Models\MemberPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $members = Member::with('user')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%"));
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->latest()
            ->get()
            ->map(fn (Member $m) => [
                'id' => $m->id,
                'name' => $m->user->name,
                'email' => $m->user->email,
                'phone' => $m->user->phone,
                'city' => $m->city,
                'status' => $m->status,
                'plans_count' => $m->memberPlans()->count(),
                'joined_at' => $m->created_at->format('M j, Y'),
            ]);

        return Inertia::render('admin/members/index', [
            'members' => $members,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Member $member): Response
    {
        $member->load('user');

        $plans = $member->memberPlans()->with('plan')->orderBy('subscribed_at')->get()->map(function (MemberPlan $mp) {
            $total = $mp->totalContributed();
            $target = (float) $mp->plan->target_price;

            return [
                'id' => $mp->id,
                'label' => $mp->displayName(),
                'plan_name' => $mp->plan->name,
                'target_price' => $target,
                'total_contributed' => $total,
                'progress_pct' => $target > 0
                    ? min(round(($total / $target) * 100, 2), 100)
                    : 0,
                'contribution_frequency' => $mp->contribution_frequency,
                'contribution_amount' => (float) $mp->contribution_amount,
                'status' => $mp->status,
                'is_primary' => $mp->is_primary,
                'is_completed' => $mp->isCompleted(),
                'subscribed_at' => $mp->subscribed_at->format('M j, Y'),
            ];
        });

        $contributions = Contribution::whereIn('member_plan_id', $plans->pluck('id'))
            ->with('memberPlan')
            ->latest()
            ->get()
            ->map(fn (Contribution $c) => [
                'id' => $c->id,
                'date' => $c->created_at->format('M j, Y'),
                'project' => $c->memberPlan->displayName(),
                'amount' => (float) $c->amount,
                'method' => $c->method,
                'ref' => $c->reference,
                'status' => $c->status,
                'has_proof' => (bool) $c->proof_path,
                'note' => $c->note,
            ]);

        return Inertia::render('admin/members/show', [
            'member' => [
                'id' => $member->id,
                'name' => $member->user->name,
                'email' => $member->user->email,
                'phone' => $member->user->phone,
                'whatsapp' => $member->whatsapp,
                'gender' => $member->user->gender,
                'occupation' => $member->occupation,
                'city' => $member->city,
                'id_type' => $member->id_type,
                'id_number' => $member->id_number,
                'id_document_url' => $member->id_document_path
                    ? route('admin.members.document', $member)
                    : null,
                'id_document_back_url' => $member->id_document_back_path
                    ? route('admin.members.document-back', $member)
                    : null,
                'kin_name' => $member->kin_name,
                'kin_relationship' => $member->kin_relationship,
                'kin_phone' => $member->kin_phone,
                'status' => $member->status,
                'joined_at' => $member->created_at->format('M j, Y'),
            ],
            'plans' => $plans,
            'contributions' => $contributions,
        ]);
    }

    public function document(Member $member)
    {
        abort_unless($member->id_document_path, 404);
        abort_unless(\Illuminate\Support\Facades\Storage::disk('local')->exists($member->id_document_path), 404);

        return \Illuminate\Support\Facades\Storage::disk('local')->response($member->id_document_path);
    }

    public function documentBack(Member $member)
    {
        abort_unless($member->id_document_back_path, 404);
        abort_unless(Storage::disk('local')->exists($member->id_document_back_path), 404);

        return Storage::disk('local')->response($member->id_document_back_path);
    }
}