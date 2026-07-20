<?php

namespace App\Mail;

use App\Models\ContactLead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewContactLeadMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactLead $lead
    ) {}

    public function build()
    {
        return $this
            ->subject('New Consultation Request')
            ->markdown('emails.contact.new-lead');
    }
}