<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportRequestReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $subject,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "We've received your message — {$this->subject}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.support.received',
            with: [
                'userName' => $this->userName,
                'subject' => $this->subject,
            ],
        );
    }
}