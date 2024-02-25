<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cookie;

class LandingController extends Controller {
    public function landing() {
        return $this->renderUserView('Landing/Main', [
            'title'     => 'Landing Page'
        ]);
    }

    public function logout() {
        Cookie::queue(Cookie::forget('user_token'));
        return redirect('/');
    }
}