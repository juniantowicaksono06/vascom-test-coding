<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::prefix('/admin')->group(function() {
    Route::controller(AdminController::class)->group(function() {
        Route::middleware(['auth.admin'])->group(function() {
            Route::get('/', 'dashboard');
            Route::get('/produk', 'products');
            Route::get('/user', 'users');
            Route::get('/logout', 'logout');
        });
    });
    Route::controller(AuthController::class)->group(function() {
        Route::middleware(['auth.admin'])->group(function() {
            Route::get('/login', 'login');
        });
    });
});