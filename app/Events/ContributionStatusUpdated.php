<?php

namespace App\Events;

use App\Models\Contribution;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContributionStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Contribution $contribution,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('member.' . $this->contribution->member_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ContributionStatusUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->contribution->id,
            'status' => ucfirst($this->contribution->status === 'successful' ? 'Successful' : $this->contribution->status),
            'rejection_reason' => $this->contribution->rejection_reason,
        ];
    }
}