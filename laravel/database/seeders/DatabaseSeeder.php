<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // test user
        DB::table('users')->insert([
            'name' => 'GLaDOS',
            'email' => 'GLaDOS@aperture.com',
            'email_verified_at' => now(),
            'password' => bcrypt('ISawDeer'),
            'remember_token' => Str::random(10),
        ]);

        // new user
        DB::table('users')->insert([
            'name' => 'New User',
            'email' => 'new@user.com',
            'email_verified_at' => now(),
            'password' => bcrypt('secret'),
            'remember_token' => Str::random(10),
        ]);
    }
}
