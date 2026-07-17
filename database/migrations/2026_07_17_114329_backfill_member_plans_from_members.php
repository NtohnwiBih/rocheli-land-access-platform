<?php

use App\Models\Contribution;
use App\Models\Member;
use App\Models\MemberPlan;
use App\Models\Plan;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Member::query()
            ->whereNotNull('plan')
            ->chunk(50, function ($members) {
                foreach ($members as $member) {
                    $plan = Plan::where('name', $member->plan)->first();

                    if (! $plan) {
                        continue; 
                    }

                    $memberPlan = MemberPlan::create([
                        'member_id' => $member->id,
                        'plan_id' => $plan->id,
                        'label' => $member->plan,
                        'goal' => $member->goal,
                        'preferred_locations' => $member->preferred_locations,
                        'land_type' => $member->land_type,
                        'contribution_frequency' => $member->contribution_frequency,
                        'contribution_amount' => $member->contribution_amount,
                        'payment_method' => $member->payment_method,
                        'status' => $member->status,
                        'is_primary' => true,
                        'subscribed_at' => $member->submitted_at ?? $member->created_at,
                    ]);

                    Contribution::where('member_id', $member->id)
                        ->whereNull('member_plan_id')
                        ->update(['member_plan_id' => $memberPlan->id]);
                }
            });
    }

    public function down(): void
    {
        
    }
};