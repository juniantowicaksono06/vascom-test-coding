<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cookie;

class AdminController extends Controller {
    public function dashboard() {
        return $this->renderAdminView('Admin/Dashboard', [
            'title' => "Admin Dashboard"
        ]);
    }


    public function products() {
        return $this->renderAdminView('Admin/Products', [
            'title' => "Manajemen Produk"
        ]);
    }


    public function users() {
        return $this->renderAdminView('Admin/Users', [
            'title' => "Manajemen User"
        ]);
    }

    public function logout() {
        Cookie::queue(Cookie::forget('auth_token'));
        return redirect('/admin/login');
    }
}