<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('interest')->nullable();
            $table->text('message')->nullable();
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->string('status')->default('confirmed'); // confirmed | cancelled
            $table->timestamps();
            $table->unique(['appointment_date', 'appointment_time'], 'appointments_slot_unique');

            $table->index(['appointment_date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};