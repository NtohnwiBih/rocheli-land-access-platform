<?php

use App\Models\LegalDocument;
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
        LegalDocument::where('key', 'terms_and_conditions')
            ->update(['key' => 'member_agreement']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('member_agreement', function (Blueprint $table) {
            //
        });
    }
};
