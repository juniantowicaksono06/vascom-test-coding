<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

class AuthController extends Controller {
    public function login() {
        return Inertia::render('Auth/Login', [
            'title' => "Login Page"
        ]);
    }
}