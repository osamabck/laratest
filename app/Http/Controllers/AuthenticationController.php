<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;

class AuthenticationController extends Controller
{
    public function adminLogin()
    {
        if (session('user') != null) return abort(403);

        $vdata = Validator::make(request()->all(), [
            'email' => 'bail|required|email|exists:users,email',
            'password' => 'required|min:6',
        ]);

        if ($vdata->fails()) return ["success" => false, "data" => null, "message" => "Invalid data"];

        $admin = User::where(['email' => request('email'), 'type' => 'ADMIN'])->first();
        $pass = password_verify(request('password'), $admin->password);

        if (!$pass) return ["success" => false, "data" => null, "message" => "Incorrect credentials"];

        session(['user' => $admin]);
        $token = $admin->createToken("authtoken");

        return ["success" => true, "data" => ['name' => $admin->name, 'token' => $token->plainTextToken], "message" => "Loggedin!"];
    }

    public function adminLogout()
    {
        session()->forget('user');
        session()->flush();

        return redirect('/');
    }
}
