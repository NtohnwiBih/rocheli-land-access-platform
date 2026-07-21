<?php

namespace App\Mail;

use App\Models\ContactLead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactLeadConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactLead $lead
    ) {}

    public function build()
    {
        return $this
            ->subject('We received your request')
            ->markdown('emails.contact.confirmation');
    }
}