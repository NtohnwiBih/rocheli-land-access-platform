<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnquiryRequest;
use App\Models\Enquiry;
use App\Models\Property;
use App\Models\User;
use App\Notifications\NewEnquiryReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class EnquiryFormController extends Controller
{
    public function store(StoreEnquiryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = Auth::user();

        if ($user && $user->member) {
            $data['member_id'] = $user->member->id;
            unset($data['name'], $data['email'], $data['phone']);
        }

        $enquiry = Enquiry::create($data);

        $admins = User::where('role', 'admin')->get();
        if ($admins->isNotEmpty()) {
            Notification::send($admins, new NewEnquiryReceived($enquiry));
        }

        return back()->with('success', 'Your enquiry has been sent — we will be in touch shortly.');
    }
}