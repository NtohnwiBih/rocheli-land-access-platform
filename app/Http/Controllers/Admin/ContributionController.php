<?php

namespace App\Http\Controllers\Admin;

use App\Events\ContributionStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Notifications\ContributionValidated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContributionController extends Controller
{
    public function approve(Contribution $contribution): RedirectResponse
    {
        abort_if($contribution->status !== 'pending', 422, 'This contribution has already been reviewed.');

        $contribution->update(['status' => 'successful']);

        $contribution->memberPlan->recalculateCompletion();

        $contribution->memberPlan->member->user->notify(
            new ContributionValidated($contribution, approved: true)
        );

        broadcast(new ContributionStatusUpdated($contribution))->toOthers();

        return back()->with('success', 'Contribution approved.');
    }

    public function reject(Request $request, Contribution $contribution): RedirectResponse
    {
        abort_if($contribution->status !== 'pending', 422, 'This contribution has already been reviewed.');

        $contribution->update([
            'status' => 'rejected',
            'rejection_reason' => $request->string('reason')->toString() ?: null,
        ]);

        $contribution->memberPlan->member->user->notify(
            new ContributionValidated($contribution, approved: false)
        );

        broadcast(new ContributionStatusUpdated($contribution))->toOthers();

        return back()->with('success', 'Contribution rejected.');
    }

    public function proof(Contribution $contribution)
    {
        abort_unless(Storage::disk('private')->exists($contribution->proof_path), 404);

        return Storage::disk('private')->response($contribution->proof_path);
    }
}