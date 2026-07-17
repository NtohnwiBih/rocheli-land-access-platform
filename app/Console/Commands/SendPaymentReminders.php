<?php

namespace App\Console\Commands;

use App\Models\MemberPlan;
use App\Notifications\UpcomingPaymentReminder;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:send-payment-reminders')]
#[Description('Command description')]
class SendPaymentReminders extends Command
{
    protected $signature = 'payments:remind';

    protected $description = 'Notify members whose next contribution is due within 3 days';

    public function handle(): void
    {
        $plans = MemberPlan::query()
            ->whereIn('status', ['pending', 'under_review', 'approved'])
            ->with('member.user')
            ->get();

        $sent = 0;

        foreach ($plans as $plan) {
            $due = $plan->nextDueAt();

            if (! $due) {
                continue;
            }

            $isDueSoon = now()->diffInDays($due, false) <= 3 && now()->diffInDays($due, false) >= 0;
            $alreadyReminded = $plan->last_reminded_due_at?->isSameDay($due) ?? false;

            if ($isDueSoon && ! $alreadyReminded) {
                $plan->member->user->notify(new UpcomingPaymentReminder($plan));
                $plan->update(['last_reminded_due_at' => $due]);
                $sent++;
            }
        }

        $this->info("Sent {$sent} payment reminder(s).");
    }
}
