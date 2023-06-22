<?php

use App\Http\Controllers\AuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
    return Inertia::render('home');
});

Route::get('/admin/login', function () {
    if (session('user') != null) return redirect('/admin/dashboard');
    return Inertia::render('admin/login');
})->name("login");

Route::post('admin/login', [AuthenticationController::class, "adminLogin"]);

Route::middleware('AdminAuth')->group(function () {
    Route::get('/admin/users', function () {
        return Inertia::render('admin/users');
    });

    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    });

    Route::get('/admin/agesum', function () {
        return Inertia::render('admin/agesum');
    });

    Route::get('/admin/agerange', function () {
        return Inertia::render('admin/agerange');
    });

    Route::get('/logout', [AuthenticationController::class, 'adminLogout']);
});
