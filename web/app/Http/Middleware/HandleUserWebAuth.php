<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Services\DecryptionService;

class HandleUserWebAuth {
    public function handle(Request $request, Closure $next) {
        try {
            $encryptedToken = null;
            if(!empty(Cookie::get('user_token'))) {
                $encryptedToken = Cookie::get('user_token');
            }
            $decryptedToken = DecryptionService::decrypt(base64_decode($encryptedToken));
            $credentials = JWT::decode($decryptedToken, new Key(env("JWT_SECRET_KEY"), 'HS256'));
            $request->attributes->add(['profile' => $credentials]);
            return $next($request);
        }
        catch(\Exception $err) {
            // Delete cookie if cookie is detected
            Cookie::queue(Cookie::forget('user_token'));
            return $next($request);
        }
    } 
}