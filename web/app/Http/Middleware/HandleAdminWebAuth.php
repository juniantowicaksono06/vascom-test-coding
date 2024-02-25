<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Services\DecryptionService;

class HandleAdminWebAuth {
    public function handle(Request $request, Closure $next) {
        try {
            $encryptedToken = null;
            if(!empty(Cookie::get('auth_token'))) {
                $encryptedToken = Cookie::get('auth_token');
            }
            else {
                if($request->path() == 'admin/login') {
                    return $next($request);
                }
                return redirect('/admin/login');
            }
            $decryptedToken = DecryptionService::decrypt(base64_decode($encryptedToken));
            $credentials = JWT::decode($decryptedToken, new Key(env("JWT_SECRET_KEY"), 'HS256'));
            if($request->path() == 'admin/login') {
                return redirect('/admin/');
            }
            $request->attributes->add(['profile' => $credentials]);
            return $next($request);
        }
        catch(\Exception $err) {
            // Delete cookie if cookie is detected
            Cookie::queue(Cookie::forget('auth_token'));
            return redirect('/admin/login');
        }
    } 
}