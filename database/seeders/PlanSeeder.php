<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter Plan',
                'slug' => 'starter',
                'target_price' => 2000000,
                'daily_amount' => 2500,
                'weekly_amount' => 15000,
                'monthly_amount' => 65000,
                'is_flexible' => true,
                'is_featured' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Growth Plan',
                'slug' => 'growth',
                'target_price' => 3000000,
                'daily_amount' => 5000,
                'weekly_amount' => 25000,
                'monthly_amount' => 100000,
                'is_flexible' => true,
                'is_featured' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Advance Plan',
                'slug' => 'advance',
                'target_price' => 5000000,
                'daily_amount' => 10000,
                'weekly_amount' => 50000,
                'monthly_amount' => 175000,
                'is_flexible' => true,
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Prime Plan',
                'slug' => 'prime',
                'target_price' => 10000000,
                'daily_amount' => 10000,
                'weekly_amount' => 75000,
                'monthly_amount' => 300000,
                'is_flexible' => true, 
                'is_featured' => false,
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}