<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;

class UserController extends Controller
{
    public function addUser()
    {
        $vdata = Validator::make(request()->all(), [
            'name' => 'bail|required|string|min:1',
            'email' => 'bail|required|email|unique:users,email',
            'birthDate' => 'bail|required|date',
            'password' => 'bail|required|string|min:1'
        ]);

        if ($vdata->fails()) return ["success" => false, "data" => null, "message" => "Invalid data"];

        $password = request('password');
        $email = request('email');
        $name = request('name');
        $date = Carbon::parse(request('birthDate'));

        if ($date > Carbon::now()) return ['success' => false, "data" => null, "message" => "False date"];

        $user = new User();
        $user->name = $name;
        $user->email = $email;
        $user->type = "STANDARD";
        $user->password = $password;
        $user->birth_date = $date;
        $user->save();

        return ['success' => true, "data" => $user, "message" => "User added"];
    }

    public function listUsers()
    {
        $vdata = Validator::make(request()->all(), [
            'skip' => 'bail|required|integer|min:0',
            'search' => 'nullable|string',
        ]);

        if ($vdata->fails()) return ["success" => false, "data" => null, "message" => "Invalid data"];

        $skip = request('skip');
        $search = request('search');
        if ($search == "") $search = null;

        $users = $search == null
            ? User::select(['id', 'type', 'name', 'birth_date', 'email'])->where('type', 'STANDARD')->take(15)->skip($skip)->get()
            : User::select(['id', 'type', 'name', 'birth_date', 'email'])->where('type', 'STANDARD')->where("name", "ilike", "%$search%")->take(15)->skip($skip)->get();

        $more = $users->count() < 15 ? false : true;
        $total = $search == null ? User::where('type', 'STANDARD')->count() : User::where('type', 'STANDARD')->where("name", "ilike", "%$search%")->count();

        return ['success' => true, "data" => ["users" => $users, "more" => $more, "total" => $total], "message" => "Listing users"];
    }

    public function deleteUser()
    {
        $vdata = Validator::make(request()->all(), [
            'user' => 'bail|required|exists:users,id',
        ]);

        if ($vdata->fails()) return ["success" => false, "data" => null, "message" => "Invalid data"];

        $id = request('user');
        User::find($id)->delete();

        return ['success' => true, "data" => null, "message" => "User deleted"];
    }

    public function sumAge()
    {
        $vdata = Validator::make(request()->all(), [
            'age' => 'bail|required|integer|min:0',
        ]);

        if ($vdata->fails()) return ["success" => false, "data" => null, "message" => "Invalid data"];

        $age = request('age');
        $res = [];

        $allusers = User::where('type', 'STANDARD')->get();
        $now = Carbon::now()->startOfDay();

        for ($i = 0; $i < $allusers->count(); $i++) {
            for ($y = 0; $y < $allusers->count(); $y++) {
                if ($allusers[$i]->id != $allusers[$y]->id) {
                    $first_age = Carbon::parse($allusers[$i]->birth_date)->startOfYear()->diffInYears($now);
                    $second_age = Carbon::parse($allusers[$y]->birth_date)->startOfYear()->diffInYears($now);
                    if ($first_age + $second_age == $age) {
                        array_push($res, [
                            "id1" => $allusers[$i]->id, "name1" => $allusers[$i]->name, "birth_date1" => $allusers[$i]->birth_date, "age1" => $first_age,
                            "id2" => $allusers[$y]->id, "name2" => $allusers[$y]->name, "birth_date2" => $allusers[$y]->birth_date, "age2" => $second_age
                        ]);
                    }
                }
            }
        }

        return ["success" => true, "data" => ["users" => $res], "message" => "Listing the users"];
    }

    public function sumAgeRange()
    {
        $vdata = Validator::make(request()->all(), [
            'ageMin' => 'bail|required|integer|min:0',
            'ageMax' => 'bail|required|integer|min:0',
        ]);

        if ($vdata->fails()) return ["success" => false, "data" => null, "message" => "Invalid data"];

        $ageMin = request('ageMin');
        $ageMax = request('ageMax');
        $res = [];

        $allusers = User::where('type', 'STANDARD')->get();
        $now = Carbon::now()->startOfDay();

        for ($i = 0; $i < $allusers->count(); $i++) {
            $age = Carbon::parse($allusers[$i]->birth_date)->startOfYear()->diffInYears($now);
            if ($age >= $ageMin && $age <= $ageMax) {
                array_push($res,  ["id" => $allusers[$i]->id, "name" => $allusers[$i]->name, "birth_date" => $allusers[$i]->birth_date, "age" => $age]);
            }
        }

        return ["success" => true, "data" => ["users" => $res], "message" => "Listing the users"];
    }

    public function userCount()
    {
        $userscount = User::where('type', 'STANDARD')->count();

        return ["success" => true, "data" => ["userscount" => $userscount], "message" => "User count"];
    }
}
