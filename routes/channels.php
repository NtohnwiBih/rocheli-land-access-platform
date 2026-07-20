<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('member.{memberId}', function ($user, $memberId) {
    return (int) $user->member?->id === (int) $memberId;
});