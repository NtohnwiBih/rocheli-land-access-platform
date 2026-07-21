<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $member = $user->member;

        return Inertia::render('member/profile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'gender' => $user->gender,
                'avatar' => $user->avatar ?? null,
                'member_code' => $user->member_code ?? null,
                'email_verified' => (bool) $user->email_verified_at,
                'phone_verified' => (bool) $user->phone_verified_at,
                'created_at' => $user->created_at->toIso8601String(),
            ],
            'member' => $member ? [
                'whatsapp' => $member->whatsapp,
                'occupation' => $member->occupation,
                'country_of_residence' => $member->country_of_residence,
                'city' => $member->city,
                'id_type' => $member->id_type,
                'id_number' => $member->id_number,
                'kin_name' => $member->kin_name,
                'kin_relationship' => $member->kin_relationship,
                'kin_phone' => $member->kin_phone,
                'goal' => $member->goal,
                'preferred_locations' => $member->preferred_locations,
                'land_type' => $member->land_type,
                'plan' => $member->plan,
                'contribution_frequency' => $member->contribution_frequency,
                'contribution_amount' => $member->contribution_amount !== null ? (float) $member->contribution_amount : null,
                'payment_method' => $member->payment_method,
                'status' => $member->status,
                'submitted_at' => $member->submitted_at?->toIso8601String(),
            ] : null,
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'gender' => $validated['gender'] ?? null,
        ])->save();

        if ($member = $user->member) {
            $member->fill([
                'whatsapp' => $validated['whatsapp'] ?? null,
                'occupation' => $validated['occupation'] ?? null,
                'country_of_residence' => $validated['country_of_residence'] ?? null,
                'city' => $validated['city'] ?? null,
                'kin_name' => $validated['kin_name'] ?? null,
                'kin_relationship' => $validated['kin_relationship'] ?? null,
                'kin_phone' => $validated['kin_phone'] ?? null,
            ])->save();
        }

        return back()->with('success', 'Profile updated.');
    }
}