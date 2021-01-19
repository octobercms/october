<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreatePostsTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_posts', function ($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('title')->nullable();
            $table->string('slug')->nullable()->index();
            $table->text('long_slug')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->integer('author_id')->unsigned()->index()->nullable();
            $table->string('author_nickname')->default('October')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('database_tester_categories_posts', function ($table) {
            $table->engine = 'InnoDB';
            $table->integer('category_id')->unsigned();
            $table->integer('post_id')->unsigned();
            $table->primary(['category_id', 'post_id']);
            $table->string('category_name')->nullable();
            $table->string('post_name')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_categories_posts');
        Schema::dropIfExists('database_tester_posts');
    }
}
