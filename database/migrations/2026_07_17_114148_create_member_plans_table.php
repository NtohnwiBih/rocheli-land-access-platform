<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('plan_id')
                ->constrained()
                ->restrictOnDelete();
            $table->string('label')->nullable();
            $table->string('goal')->nullable();
            $table->json('preferred_locations')->nullable();
            $table->string('land_type')->nullable();
            $table->string('contribution_frequency');
            $table->decimal('contribution_amount', 12, 2);
            $table->string('payment_method');
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])
                ->default('pending');
            // The subscription created automatically at registration.
            $table->boolean('is_primary')->default(false);
            $table->timestamp('subscribed_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_plans');
    }
};