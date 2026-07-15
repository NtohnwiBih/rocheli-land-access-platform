<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('whatsapp')->nullable();
            $table->string('occupation')->nullable(); 
            $table->string('country_of_residence')->nullable();
            $table->string('city')->nullable();
            $table->string('id_type')->nullable();     
            $table->string('id_number')->nullable();
            $table->string('id_document_path')->nullable();
            $table->string('kin_name')->nullable();
            $table->string('kin_relationship')->nullable();
            $table->string('kin_phone')->nullable();
            $table->string('goal')->nullable();
            $table->json('preferred_locations')->nullable(); 
            $table->string('land_type')->nullable();
            $table->string('plan')->nullable(); 
            $table->string('contribution_frequency')->nullable(); 
            $table->decimal('contribution_amount', 12, 2)->nullable();
            $table->string('payment_method')->nullable();
            $table->json('agreements')->nullable(); 
            $table->string('signature')->nullable();
            $table->timestamp('agreed_at')->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])
                ->default('pending');
            $table->timestamp('submitted_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
