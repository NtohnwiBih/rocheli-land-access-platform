<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class RegisteredUserController extends Controller
{
    // public function __construct(
    //     private readonly MemberRepositoryInterface $members,
    // ) {}

    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function verify(): Response
    {
        return Inertia::render('auth/verify-account');
    }
}
