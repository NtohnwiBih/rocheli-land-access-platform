<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('location');
            $table->string('size');
            $table->string('type');
            $table->string('price');
            $table->decimal('price_value', 12, 2)->nullable();
            $table->string('image_path')->nullable();
            $table->enum('status', ['Available', 'Selling Fast', 'Reserved', 'Sold'])
                ->default('Available');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};