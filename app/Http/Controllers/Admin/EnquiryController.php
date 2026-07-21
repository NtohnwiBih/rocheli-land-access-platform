<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Notifications\EnquiryResponded;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $enquiries = Enquiry::with(['member.user', 'property'])
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->latest()
            ->get()
            ->map(fn (Enquiry $e) => [
                'id' => $e->id,
                'member_name' => $e->member->user->name,
                'member_id' => $e->member_id,
                'property_title' => $e->property->title,
                'property_id' => $e->property_id,
                'interest' => $e->interest,
                'message' => $e->message,
                'status' => $e->status,
                'response' => $e->response,
                'created_at' => $e->created_at->diffForHumans(),
                'responded_at' => $e->responded_at?->format('M j, Y'),
            ]);

        return Inertia::render('admin/enquiries/index', [
            'enquiries' => $enquiries,
            'filters' => $request->only('status'),
        ]);
    }

    public function show(Enquiry $enquiry): Response
    {
        $enquiry->load(['member.user', 'property']);

        // Viewing counts as review — bump from 'sent' to 'in_review' automatically.
        if ($enquiry->status === 'sent') {
            $enquiry->update(['status' => 'in_review']);
        }

        return Inertia::render('admin/enquiries/show', [
            'enquiry' => [
                'id' => $enquiry->id,
                'member_id' => $enquiry->member_id,
                'member_name' => $enquiry->member->user->name,
                'member_phone' => $enquiry->member->user->phone,
                'member_email' => $enquiry->member->user->email,
                'property_id' => $enquiry->property_id,
                'property_title' => $enquiry->property->title,
                'property_image' => $enquiry->property->image_url,
                'interest' => $enquiry->interest,
                'message' => $enquiry->message,
                'status' => $enquiry->status,
                'response' => $enquiry->response,
                'created_at' => $enquiry->created_at->format('M j, Y g:i A'),
                'responded_at' => $enquiry->responded_at?->format('M j, Y g:i A'),
            ],
        ]);
    }

    public function respond(Request $request, Enquiry $enquiry): RedirectResponse
    {
        $request->validate([
            'response' => ['required', 'string', 'max:2000'],
        ]);

        $enquiry->update([
            'response' => $request->string('response')->toString(),
            'status' => 'responded',
            'responded_at' => now(),
        ]);

        $enquiry->load('member.user', 'property');
        $enquiry->member->user->notify(new EnquiryResponded($enquiry));

        return back()->with('success', 'Response sent to member.');
    }
}