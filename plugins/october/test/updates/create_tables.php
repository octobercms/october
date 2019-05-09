<?php namespace October\Test\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateTables extends Migration
{
    public function up()
    {
        /*
         * Test 1: People
         */

        Schema::create('october_test_people', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('preferred_name')->nullable();
            $table->string('bio')->nullable();
            $table->string('expenses')->nullable();
            $table->datetime('birth')->nullable();
            $table->time('birthtime')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('favcolor')->nullable();
            $table->boolean('is_married')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_phones', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('number')->nullable();
            $table->string('brand')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('person_id')->unsigned()->nullable()->index();
            $table->timestamps();
        });

        /*
         * Test 2: Posts
         */

        Schema::create('october_test_posts', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->text('content')->nullable();
            $table->text('content_md')->nullable();
            $table->text('content_html')->nullable();
            $table->string('tags_array')->nullable();
            $table->string('tags_string')->nullable();
            $table->string('tags_array_id')->nullable();
            $table->string('tags_string_id')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->integer('status_id')->unsigned()->nullable()->index();
            $table->timestamps();
        });

        Schema::create('october_test_comments', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->text('content')->nullable();
            $table->text('content_md')->nullable();
            $table->text('content_html')->nullable();
            $table->text('breakdown')->nullable();
            $table->text('mood')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('post_id')->unsigned()->nullable()->index();
            $table->timestamps();
        });

        Schema::create('october_test_tags', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_posts_tags', function($table)
        {
            $table->engine = 'InnoDB';
            $table->integer('post_id');
            $table->integer('tag_id');
            $table->timestamps();
        });

        /*
         * Test 3: Users
         */

        Schema::create('october_test_users', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('username')->nullable();
            $table->integer('security_code')->nullable();
            $table->string('media_image')->nullable();
            $table->string('media_file')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_roles', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_users_roles', function($table)
        {
            $table->engine = 'InnoDB';
            $table->integer('user_id')->unsigned();
            $table->integer('role_id')->unsigned();
            $table->primary(['user_id', 'role_id']);
            $table->string('clearance_level')->nullable();
            $table->boolean('is_executive')->default(false);
            $table->timestamps();
        });

        /*
         * Test 4: Countries
         */

        Schema::create('october_test_countries', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->text('content')->nullable();
            $table->text('pages')->nullable();
            $table->text('states')->nullable();
            $table->text('locations')->nullable();
            $table->string('language')->nullable();
            $table->string('currency')->nullable();
            $table->boolean('is_active')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_countries_types', function($table)
        {
            $table->engine = 'InnoDB';
            $table->integer('country_id')->unsigned();
            $table->integer('attribute_id')->unsigned();
            $table->primary(['country_id', 'attribute_id']);
        });

        /*
         * Test 5: Reviews
         */

        Schema::create('october_test_meta', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('taggable_id')->unsigned()->index()->nullable();
            $table->string('taggable_type')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('redirect_url')->nullable();
            $table->string('robot_index')->nullable();
            $table->string('robot_follow')->nullable();
        });

        Schema::create('october_test_reviews', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('product_type')->nullable();
            $table->integer('product_id')->unsigned()->nullable();
            $table->text('content')->nullable();
            $table->boolean('is_positive')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_plugins', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->text('content')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_themes', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->text('content')->nullable();
            $table->timestamps();
        });

        /*
         * Test 6: Trees
         */

        Schema::create('october_test_members', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('parent_id')->unsigned()->index()->nullable();
            $table->integer('user_id')->unsigned()->index()->nullable();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_categories', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('parent_id')->unsigned()->index()->nullable();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->integer('sort_order')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });

        Schema::create('october_test_channels', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('parent_id')->unsigned()->index()->nullable();
            $table->integer('user_id')->unsigned()->index()->nullable();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->integer('nest_left')->nullable();
            $table->integer('nest_right')->nullable();
            $table->integer('nest_depth')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_related_channels', function($table)
        {
            $table->engine = 'InnoDB';
            $table->integer('channel_id')->unsigned();
            $table->integer('related_id')->unsigned();
            $table->primary(['channel_id', 'related_id']);
            $table->timestamps();
        });

        /*
         * Test 7: Attributes
         */

        Schema::create('october_test_attributes', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('type')->nullable();
            $table->string('name')->nullable();
            $table->string('label')->nullable();
            $table->string('code')->nullable();
            $table->boolean('is_default')->default(false);
            $table->integer('sort_order')->nullable();
            $table->timestamps();
        });

        /*
         * Test 8: Galleries
         */

        Schema::create('october_test_galleries', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('title')->nullable();
            $table->string('status')->nullable();
            $table->boolean('party_mode')->nullable();
            $table->timestamps();
        });

        Schema::create('october_test_gallery_entity', function($table) {
            $table->engine = 'InnoDB';
            $table->unsignedInteger('gallery_id')->index('gallery_id_idx');
            $table->unsignedInteger('entity_id')->index('entity_id_idx');
            $table->string('entity_type')->index('entity_type_idx');
            $table->primary(['gallery_id', 'entity_id', 'entity_type'], 'gallery_entity_pk');
        });

        Schema::create('october_test_pages', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('type')->unsigned();
            $table->text('content')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('october_test_gallery_entity');
        Schema::dropIfExists('october_test_galleries');
        Schema::dropIfExists('october_test_comments');
        Schema::dropIfExists('october_test_people');
        Schema::dropIfExists('october_test_phones');
        Schema::dropIfExists('october_test_countries');
        Schema::dropIfExists('october_test_countries_types');
        Schema::dropIfExists('october_test_plugins');
        Schema::dropIfExists('october_test_reviews');
        Schema::dropIfExists('october_test_posts');
        Schema::dropIfExists('october_test_roles');
        Schema::dropIfExists('october_test_people_roles');
        Schema::dropIfExists('october_test_themes');
        Schema::dropIfExists('october_test_users');
        Schema::dropIfExists('october_test_users_roles');
        Schema::dropIfExists('october_test_members');
        Schema::dropIfExists('october_test_categories');
        Schema::dropIfExists('october_test_channels');
        Schema::dropIfExists('october_test_related_channels');
        Schema::dropIfExists('october_test_meta');
        Schema::dropIfExists('october_test_attributes');
        Schema::dropIfExists('october_test_tags');
        Schema::dropIfExists('october_test_posts_tags');
        Schema::dropIfExists('october_test_pages');
    }
}
