<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'title' => $n->data['title'] ?? '',
                'body' => $n->data['body'] ?? '',
                'tone' => $n->data['tone'] ?? 'info',
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        return Inertia::render('member/notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function show(string $id): Response
    {
        $notification = auth()->user()->notifications()->where('id', $id)->firstOrFail();

        if (! $notification->read_at) {
            $notification->markAsRead();
        }

        return Inertia::render('member/notification-detail', [
            'notification' => [
                'id' => $notification->id,
                'title' => $notification->data['title'] ?? '',
                'body' => $notification->data['body'] ?? '',
                'tone' => $notification->data['tone'] ?? 'info',
                'data' => $notification->data,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at->toIso8601String(),
                'created_at_human' => $notification->created_at->diffForHumans(),
            ],
        ]);
    }

    public function markRead(string $id): RedirectResponse
    {
        auth()->user()->notifications()->where('id', $id)->first()?->markAsRead();

        return back();
    }

    public function markAllRead(): RedirectResponse
    {
        auth()->user()->unreadNotifications->markAsRead();

        return back();
    }
}