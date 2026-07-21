<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Appointment;
use App\Models\Enquiry;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/inbox/index', [
            'contacts' => Contact::latest()->get()->map(fn (Contact $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email,
                'phone' => $c->phone,
                'interest' => $c->interest,
                'message' => $c->message,
                'status' => $c->status, // 'new' | 'read' | 'responded'
                'created_at' => $c->created_at->format('M j, Y g:i A'),
            ]),
            'appointments' => Appointment::latest()->get()->map(fn (Appointment $a) => [
                'id' => $a->id,
                'name' => $a->name,
                'phone' => $a->phone,
                'email' => $a->email,
                'date' => $a->date->format('M j, Y'), // e.g. "Wed 11"
                'time_slot' => $a->time_slot,
                'status' => $a->status, // 'pending' | 'confirmed' | 'cancelled' | 'completed'
                'created_at' => $a->created_at->format('M j, Y g:i A'),
            ]),
            'enquiries' => Enquiry::with('property')->latest()->get()->map(fn (Enquiry $e) => [
                'id' => $e->id,
                'name' => $e->name,
                'email' => $e->email,
                'phone' => $e->phone,
                'property_title' => $e->property?->title,
                'message' => $e->message,
                'status' => $e->status, // 'sent' | 'in_review' | 'responded'
                'response' => $e->response,
                'created_at' => $e->created_at->format('M j, Y g:i A'),
            ]),
        ]);
    }

    // stubs — fill in once the forms/fields are confirmed
    public function markContactRead(Contact $contact) { $contact->update(['status' => 'read']); return back(); }
    public function confirmAppointment(Appointment $appointment) { $appointment->update(['status' => 'confirmed']); return back(); }
    public function cancelAppointment(Appointment $appointment) { $appointment->update(['status' => 'cancelled']); return back(); }
    public function respondToEnquiry(Enquiry $enquiry) { /* pending: response field + notify */ return back(); }
}