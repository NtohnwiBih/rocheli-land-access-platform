<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StoreMemberRequest;
use App\Mail\NewMemberApplication;
use App\Models\City;
use App\Models\Member;
use App\Models\MemberPlan;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'plans' => Plan::active()->get()->map(fn (Plan $p) => [
                'name' => $p->name,
                'target_price' => (float) $p->target_price,
                'daily_amount' => (float) $p->daily_amount,
                'weekly_amount' => (float) $p->weekly_amount,
                'monthly_amount' => (float) $p->monthly_amount,
                'is_flexible' => $p->is_flexible,
                'is_featured' => $p->is_featured,
            ]),
            'cities' => City::active()->get()->map(fn (City $c) => [
                'key' => $c->key,
                'name_en' => $c->name_en,
                'name_fr' => $c->name_fr,
            ]),
        ]);
    }

    public function store(StoreMemberRequest $request)
    {
        $validated = $request->validated();

        [$user, $member] = DB::transaction(function () use ($validated, $request) {
            $user = User::create([
                'name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'gender' => $validated['gender'],
                'password' => Hash::make($validated['password']),
            ]);

            $documentPath = $request->file('id_document')->store('id-documents', 'local');

            $member = Member::create([
                'user_id' => $user->id,
                'whatsapp' => $validated['whatsapp'] ?? null,
                'occupation' => $validated['occupation'] ?? null,
                'country_of_residence' => $validated['country_of_residence'] ?? null,
                'city' => $validated['city'],
                'id_type' => $validated['id_type'],
                'id_number' => $validated['id_number'],
                'id_document_path' => $documentPath,
                'kin_name' => $validated['kin_name'] ?? null,
                'kin_relationship' => $validated['kin_relationship'] ?? null,
                'kin_phone' => $validated['kin_phone'] ?? null,
                'goal' => $validated['goal'],
                'preferred_locations' => $validated['preferred_locations'] ?? [],
                'land_type' => $validated['land_type'],
                'plan' => $validated['plan'],
                'contribution_frequency' => $validated['contribution_frequency'],
                'contribution_amount' => $validated['contribution_amount'],
                'payment_method' => $validated['payment_method'],
                'agreements' => $validated['agreements'],
                'signature' => $validated['signature'],
                'agreed_at' => now(),
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            $plan = Plan::where('name', $validated['plan'])->first();

            if ($plan) {
                MemberPlan::create([
                    'member_id' => $member->id,
                    'plan_id' => $plan->id,
                    'label' => $plan->name,
                    'goal' => $validated['goal'],
                    'preferred_locations' => $validated['preferred_locations'] ?? [],
                    'land_type' => $validated['land_type'],
                    'contribution_frequency' => $validated['contribution_frequency'],
                    'contribution_amount' => $validated['contribution_amount'],
                    'payment_method' => $validated['payment_method'],
                    'status' => 'pending',
                    'is_primary' => true,
                    'subscribed_at' => now(),
                ]);
            } else {
                Log::warning('Registration completed but no matching Plan found — MemberPlan not created.', [
                    'member_id' => $member->id,
                    'plan_name' => $validated['plan'],
                ]);
            }

            return [$user, $member];
        });

        event(new Registered($user));

        Auth::login($user);

        try {
            Mail::to(config('mail.company_notification_email'))
                ->send(new NewMemberApplication($member->fresh(['user'])));
        } catch (\Throwable $e) {
            Log::error('Failed to send new member application notification', [
                'member_id' => $member->id,
                'error' => $e->getMessage(),
            ]);
        }

        return redirect()->route('member.dashboard');
    }
}