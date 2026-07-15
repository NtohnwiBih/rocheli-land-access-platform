<?php

namespace App\Mail;

use App\Models\Member;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewMemberApplication extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Member $member,
    ) {}

    public function build(): self
    {
        return $this
            ->subject("New Member Application — {$this->member->user->name}")
            ->view('emails.new-member-application');
    }
}