<?php

use Tailor\Models\EntryRecord;
use October\Rain\Database\ModelException;

class EntryRecordTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->migrateTailor();
    }

    /**
     * testHiddenCoreFieldsDropRequiredRules covers programmatic saves against a blueprint
     * that hides title and slug, the backend form is not the only enforcement path
     */
    public function testHiddenCoreFieldsDropRequiredRules()
    {
        $note = EntryRecord::inSection('UnitTest\Note');
        $note->content = 'Some content';
        $note->save();

        $this->assertTrue($note->exists);
        $this->assertArrayNotHasKey('title', $note->rules);
        $this->assertArrayNotHasKey('slug', $note->rules);
    }

    /**
     * testHiddenCoreFieldsKeepOtherRules
     */
    public function testHiddenCoreFieldsKeepOtherRules()
    {
        $note = EntryRecord::inSection('UnitTest\Note');

        $this->expectException(ModelException::class);
        $this->expectExceptionMessage('content');

        $note->save();
    }

    /**
     * testVisibleSlugAutoGeneratesWhenOmitted covers new records no longer being
     * mistaken for drafts, which skipped the slug generator before the first save
     */
    public function testVisibleSlugAutoGeneratesWhenOmitted()
    {
        $post = EntryRecord::inSection('UnitTest\Post');
        $post->title = 'Needs A Slug';
        $post->content_group = 'regular_post';
        $post->save();

        $this->assertTrue($post->exists);
        $this->assertStringStartsWith('needs-a-slug', $post->slug);
    }

    /**
     * testUniqueSlugEnforcedOnNewRecords ensures unique_site is no longer silently
     * removed from new records misread as drafts
     */
    public function testUniqueSlugEnforcedOnNewRecords()
    {
        $first = EntryRecord::inSection('UnitTest\Post');
        $first->title = 'Original';
        $first->slug = 'same-slug';
        $first->content_group = 'regular_post';
        $first->save();

        $second = EntryRecord::inSection('UnitTest\Post');
        $second->title = 'Duplicate';
        $second->slug = 'same-slug';
        $second->content_group = 'regular_post';

        $this->expectException(ModelException::class);
        $this->expectExceptionMessage('slug');

        $second->save();
    }
}
