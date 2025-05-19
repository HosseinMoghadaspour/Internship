<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyImagesTable extends Migration
{
    public function up()
    {
        Schema::create('company_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('image_path'); // مسیر فایل عکس
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('company_images');
    }
}
