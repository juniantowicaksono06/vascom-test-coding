<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function renderAdminView($view_name, $passing_data = []) {
        $data = \Request::get('profile');
        $data = (array)$data;
        return Inertia::render($view_name, array_merge($data, $passing_data));
    }
}
