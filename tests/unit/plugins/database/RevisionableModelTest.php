<?php

use Carbon\Carbon;
use Database\Tester\Models\RevisionablePost;

class RevisionableModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testUpdateNothing()
    {
        $post = RevisionablePost::create(['title' => 'Hello World!']);
        $this->assertEquals('Hello World!', $post->title);
        $this->assertEquals(0, $post->revision_history()->count());

        $post->revisionsEnabled = false;
        $post->title = 'Helloooooooooooo!';
        $post->save();
        $this->assertEquals(0, $post->revision_history()->count());
    }

    public function testUpdateSingleField()
    {
        $post = RevisionablePost::create(['title' => 'Hello World!']);
        $this->assertEquals('Hello World!', $post->title);
        $this->assertEquals(0, $post->revision_history()->count());

        $post->title = 'Helloooooooooooo!';
        $post->save();
        $this->assertEquals(1, $post->revision_history()->count());

        $item = $post->revision_history()->first();

        $this->assertEquals('title', $item->field);
        $this->assertEquals('Hello World!', $item->old_value);
        $this->assertEquals('Helloooooooooooo!', $item->new_value);
        $this->assertEquals(7, $item->user_id);
    }

    public function testUpdateMultipleFields()
    {
        $post = RevisionablePost::create([
            'title' => 'Hello World!',
            'slug' => 'hello-world',
            'description' => 'Good day, Commander',
            'is_published' => true,
            'published_at' => new DateTime
        ]);

        $this->assertEquals(0, $post->revision_history()->count());

        $post->title = "Gday mate";
        $post->slug = "gday-mate";
        $post->description = 'Wazzaaaaaaaaaaaaap';
        $post->is_published = false;
        $post->published_at = Carbon::now()->addDays(1);
        $post->save();

        $history = $post->revision_history;

        $this->assertEquals(5, $history->count());
        $this->assertEquals([
            'title',
            'slug',
            'description',
            'is_published',
            'published_at'
        ], $history->lists('field'));
    }

    public function testExceedingRevisionLimit()
    {
        $post = RevisionablePost::create([
            'title' => 'Hello World!',
            'slug' => 'hello-world',
            'description' => 'Good day, Commander',
            'is_published' => true,
            'published_at' => new DateTime
        ]);

        $this->assertEquals(0, $post->revision_history()->count());

        $post->title = "Gday mate";
        $post->slug = "gday-mate";
        $post->description = 'Wazzaaaaaaaaaaaaap';
        $post->is_published = false;
        $post->published_at = Carbon::now()->addDays(1);
        $post->save();

        $post->title = 'The Boss';
        $post->slug = 'the-boss';
        $post->description = 'Paid the cost to be the boss';
        $post->is_published = true;
        $post->published_at = Carbon::now()->addDays(10);
        $post->save();

        // Count 10 changes above, limit is 8
        $this->assertEquals(8, $post->revision_history()->count());
    }

    public function testSoftDeletes()
    {
        $post = RevisionablePost::create(['title' => 'Hello World!']);
        $this->assertEquals('Hello World!', $post->title);
        $this->assertEquals(0, $post->revision_history()->count());

        $post->title = 'Helloooooooooooo!';
        $post->save();
        $this->assertEquals(1, $post->revision_history()->count());

        $post->delete();
        $this->assertEquals(2, $post->revision_history()->count());
    }

    public function testRevisionDateCast()
    {
        $post = RevisionablePost::create([
            'title' => 'Hello World!',
            'published_at' => Carbon::now()
        ]);
        $this->assertEquals(0, $post->revision_history()->count());

        $post->published_at = Carbon::now()->addDays(1);
        $post->save();

        $this->assertEquals(1, $post->revision_history()->count());

        $item = $post->revision_history()->first();
        $this->assertEquals('published_at', $item->field);
        $this->assertEquals('date', $item->cast);
        $this->assertInstanceOf('Carbon\Carbon', $item->old_value);
        $this->assertInstanceOf('Carbon\Carbon', $item->new_value);
    }
}
