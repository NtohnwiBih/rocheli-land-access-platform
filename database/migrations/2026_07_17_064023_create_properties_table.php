<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('interest');
            $table->text('message')->nullable();
            $table->enum('status', ['sent', 'in_review', 'responded'])
                ->default('sent');
            $table->text('response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};