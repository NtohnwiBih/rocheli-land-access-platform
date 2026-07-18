<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'admin@rocheli.com',
            ],
            [
                'name' => 'System Administrator',
                'role' => 'admin',
                'phone' => '670000000',
                'gender' => 'female',
                'email_verified_at' => now(),
                'password' => Hash::make('Admin@12345'),
            ]
        );
    }
}