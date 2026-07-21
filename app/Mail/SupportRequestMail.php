<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $category,
        public string $subject,
        public string $message,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[Support] {$this->subject}",
            replyTo: $this->user->email ? [$this->user->email] : [],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.support.request',
            with: [
                'userName' => $this->user->name,
                'userEmail' => $this->user->email,
                'userPhone' => $this->user->phone,
                'memberCode' => $this->user->member_code ?? null,
                'category' => $this->category,
                'subject' => $this->subject,
                'body' => $this->message,
            ],
        );
    }
}