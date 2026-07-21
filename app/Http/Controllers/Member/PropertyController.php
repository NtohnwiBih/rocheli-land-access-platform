<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\StoreEnquiryRequest;
use App\Models\Enquiry;
use App\Models\Property;
use App\Models\PropertyMedia;
use App\Models\User;
use App\Notifications\NewPropertyEnquiry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(): Response
    {
        $member = auth()->user()->member;

        $properties = Property::query()
            ->with('media')
            ->latest()
            ->get()
            ->map(fn (Property $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'location' => $p->location,
                'size' => $p->size,
                'type' => $p->type,
                'price' => $p->price,
                'image' => $p->image_url,
                'status' => $p->status,
                'media' => $p->media->map(fn (PropertyMedia $m) => [
                    'id' => $m->id,
                    'type' => $m->type,
                    'src' => $m->src,
                    'caption' => $m->caption,
                    'is_featured' => $m->is_featured,
                ]),
            ]);

       $enquiries = $member
            ->enquiries()
            ->with('property')
            ->latest()
            ->get()
            ->map(fn (Enquiry $e) => [
                'id' => $e->id,
                'property' => [
                    'id' => $e->property->id,
                    'title' => $e->property->title,
                    'image' => $e->property->image_url,
                ],
                'message' => $e->message ?: 'General enquiry',
                'response' => $e->response,
                'status' => match ($e->status) {
                    'sent' => 'Sent',
                    'in_review' => 'In review',
                    'responded' => 'Responded',
                },
                'date' => $e->created_at->format('d M Y'),
            ]);

        return Inertia::render('member/property', [
            'properties' => $properties,
            'enquiries' => $enquiries,
        ]);
    }

    public function storeEnquiry(StoreEnquiryRequest $request): RedirectResponse
    {
        $member = $request->user()->member;
        $validated = $request->validated();

        $enquiry = Enquiry::create([
            'member_id' => $member->id,
            'property_id' => $validated['property_id'],
            'interest' => $validated['interest'],
            'message' => $validated['message'] ?? null,
            'status' => 'sent',
        ]);

        $enquiry->load('member.user', 'property');

        User::where('role', 'admin')->get()->each(
            fn (User $admin) => $admin->notify(new NewPropertyEnquiry($enquiry))
        );

        return back()->with('success', 'Enquiry sent — our team will respond within 24 hours.');
    }
}