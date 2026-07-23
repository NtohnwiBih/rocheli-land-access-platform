<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Contact;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactCenterController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->string('tab', 'all')->toString();

        $contacts = Contact::latest()->get()->map(fn (Contact $c) => [
            'id' => $c->id,
            'type' => 'contact',
            'name' => $c->name,
            'phone' => $c->phone,
            'email' => $c->email,
            'summary' => $c->interest ?? $c->message ?? 'General enquiry',
            'status' => $c->status,
            'message' => $c->message,
            'created_at' => $c->created_at->diffForHumans(),
            'timestamp' => $c->created_at->timestamp,
        ]);

        $appointments = Appointment::latest('appointment_date')->get()->map(fn (Appointment $a) => [
            'id' => $a->id,
            'type' => 'appointment',
            'name' => $a->name,
            'phone' => $a->phone,
            'email' => $a->email,
            'summary' => $a->appointment_date->format('M j') . ' at ' . $a->appointment_time->format('H:i'),
            'status' => $a->status,
            'interest' => $a->interest,
            'message' => $a->message,
            'created_at' => $a->created_at->diffForHumans(),
            'timestamp' => $a->created_at->timestamp,
        ]);

        $enquiries = Enquiry::with(['member.user', 'property'])->latest()->get()->map(fn (Enquiry $e) => [
            'id' => $e->id,
            'type' => 'enquiry',
            'name' => $e->contact_name,
            'phone' => $e->contact_phone,
            'email' => $e->contact_email,
            'summary' => $e->property->titleForLocale('en') . ' — ' . $e->interest,
            'status' => $e->status,
            'created_at' => $e->created_at->diffForHumans(),
            'timestamp' => $e->created_at->timestamp,
        ]);

        $all = $contacts->concat($appointments)->concat($enquiries)
            ->sortByDesc('timestamp')
            ->values();

        return Inertia::render('admin/contacts/index', [
            'tab' => $tab,
            'counts' => [
                'all' => $all->count(),
                'contacts' => $contacts->count(),
                'appointments' => $appointments->count(),
                'enquiries' => $enquiries->count(),
                'unhandled_contacts' => $contacts->where('status', 'new')->count(),
                'pending_appointments' => $appointments->where('status', 'pending')->count(),
                'new_enquiries' => $enquiries->where('status', 'sent')->count(),
            ],
            'all' => $all,
            'contacts' => $contacts->values(),
            'appointments' => $appointments->values(),
            'enquiries' => $enquiries->values(),
        ]);
    }
}