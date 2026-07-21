<?php

namespace App\Console\Commands;

use App\Models\MemberPlan;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class MarkMemberPlansInactive extends Command
{
    protected $signature = 'plans:mark-inactive';

    protected $description = 'Mark active member plans as inactive if no contribution has been made in over a year';

    public function handle(): int
    {
        $cutoff = Carbon::now()->subYear();
        $count = 0;

        MemberPlan::query()
            ->where('status', 'active')
            ->whereDoesntHave('contributions', function ($query) use ($cutoff) {
                $query->where('created_at', '>=', $cutoff);
            })
            ->where('subscribed_at', '<=', $cutoff)
            ->chunkById(200, function ($plans) use (&$count) {
                foreach ($plans as $plan) {
                    $plan->update(['status' => 'inactive']);
                    $count++;
                }
            });

        $this->info("Marked {$count} plan(s) as inactive.");

        return self::SUCCESS;
    }
}