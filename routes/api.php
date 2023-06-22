<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('fake', function () {

    if (User::count() > 0) ["success" => false, "data" => null, "message" => "Database not empty"];

    $faker = Faker\Factory::create();
    $fakeUsers = [];

    for ($i = 0; $i < 1000; $i++) {
        $email = $faker->unique()->email();
        while ($email == "admin@something.com") {
            $email = $faker->unique()->email();
        }
        array_push($fakeUsers, [
            'name' => $faker->name(),
            'email' => $email,
            'password' => $faker->password(),
            'type' => 'STANDARD',
            'birth_date' => $faker->dateTimeBetween('-75 years', '-15 years')
        ]);
    }
    array_push($fakeUsers, [
        'name' => $faker->name(),
        'email' => 'admin@something.com',
        'password' => 'password',
        'type' => 'ADMIN',
        'birth_date' => $faker->dateTimeBetween('-75 years', '-15 years')
    ]);

    $users = User::factory()->createMany($fakeUsers);

    return ["success" => true, "message" => "Fake data generated", "data" => $users];
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('admin/users/list', [UserController::class, 'listUsers']);

    Route::post('admin/users/add', [UserController::class, 'addUser']);

    Route::post('admin/users/delete',  [UserController::class, 'deleteUser']);

    Route::post('admin/users/agesum', [UserController::class, 'sumAge']);

    Route::post('admin/users/agerange', [UserController::class, 'sumAgeRange']);

    Route::post('admin/dashboard/info', [UserController::class, 'userCount']);
});
