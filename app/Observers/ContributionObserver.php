<?php

namespace App\Observers;

use App\Models\Contribution;

class ContributionObserver
{
    public function saved(Contribution $contribution): void
    {
        if ($contribution->wasChanged('status') && $contribution->status === 'successful') {
            $contribution->memberPlan?->recalculateCompletion();
        }
    }
}