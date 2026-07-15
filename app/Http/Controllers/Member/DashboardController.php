<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function create(): Response
    {
        $member = auth()->user()->member;
        
        return Inertia::render('member/index', [
            'member' => $member,
        ]);
    }
}
