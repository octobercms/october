<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\PageCode;
use Cms\Classes\Controller;
use Tailor\Models\EntryRecord;
use Tailor\Models\SubmissionRecord;
use Tailor\Components\SubmissionComponent;
use Illuminate\Support\Facades\Facade;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\UploadedFile;

class SubmissionDecoderTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->migrateTailor();
    }

    /**
     * testRepeaterScalarInputRejected covers the reparenting primitive, a scalar ID must never
     * reach HasMany::setSimpleValue
     */
    public function testRepeaterScalarInputRejected()
    {
        $victim = $this->createSubmission(['answers' => [['answer' => 'Victim Answer']]]);
        $victimRow = $victim->answers()->first();

        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Attacker',
            'answers' => $victimRow->id,
        ]);

        $this->expectException(ValidationException::class);

        try {
            $component->onFormSubmit();
        }
        finally {
            $this->assertEquals($victim->id, $victim->answers()->first()->host_id);
        }
    }

    /**
     * testRepeaterScalarArrayInputRejected
     */
    public function testRepeaterScalarArrayInputRejected()
    {
        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Attacker',
            'answers' => ['1', '2'],
        ]);

        $this->expectException(ValidationException::class);

        $component->onFormSubmit();
    }

    /**
     * testNestedFormScalarInputRejected covers the HasOne::setSimpleValue variant
     */
    public function testNestedFormScalarInputRejected()
    {
        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Attacker',
            'profile' => '1',
        ]);

        $this->expectException(ValidationException::class);

        $component->onFormSubmit();
    }

    /**
     * testRepeaterNestedCreate
     */
    public function testRepeaterNestedCreate()
    {
        $record = $this->createSubmission([
            'answers' => [
                ['answer' => 'First'],
                ['answer' => 'Second'],
            ],
        ]);

        $rows = $record->answers()->get();
        $this->assertCount(2, $rows);
        $this->assertEquals('First', $rows[0]->answer);
        $this->assertEquals('Second', $rows[1]->answer);
    }

    /**
     * testNestedFormCreate
     */
    public function testNestedFormCreate()
    {
        $record = $this->createSubmission([
            'profile' => ['bio' => 'A short story'],
        ]);

        $this->assertEquals('A short story', $record->profile()->first()->bio);
    }

    /**
     * testNestedIdKeyStripped ensures nested data cannot target existing child records
     */
    public function testNestedIdKeyStripped()
    {
        $victim = $this->createSubmission(['answers' => [['answer' => 'Victim Answer']]]);
        $victimRow = $victim->answers()->first();

        $record = $this->createSubmission([
            'answers' => [
                ['answer' => 'Fresh', 'id' => $victimRow->id, 'host_id' => 999],
            ],
        ]);

        $newRow = $record->answers()->first();
        $this->assertNotEquals($victimRow->id, $newRow->id);
        $this->assertEquals($record->id, $newRow->host_id);

        $victimRow->reload();
        $this->assertEquals($victim->id, $victimRow->host_id);
        $this->assertEquals('Victim Answer', $victimRow->answer);
    }

    /**
     * testUnknownRowFieldDropped
     */
    public function testUnknownRowFieldDropped()
    {
        $record = $this->createSubmission([
            'answers' => [
                ['answer' => 'Real', 'hacker_field' => 'junk'],
            ],
        ]);

        $row = $record->answers()->first();
        $this->assertEquals('Real', $row->answer);
        $this->assertNull($row->hacker_field);
    }

    /**
     * testNestedRepeaterRecursion
     */
    public function testNestedRepeaterRecursion()
    {
        $record = $this->createSubmission([
            'answers' => [
                [
                    'answer' => 'Parent',
                    'followups' => [
                        ['note' => 'Nested One'],
                        ['note' => 'Nested Two'],
                    ],
                ],
            ],
        ]);

        $row = $record->answers()->first();
        $followups = $row->followups()->get();
        $this->assertCount(2, $followups);
        $this->assertEquals('Nested One', $followups[0]->note);
    }

    /**
     * testFileUploadInsideRepeater
     */
    public function testFileUploadInsideRepeater()
    {
        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Uploader',
            'answers' => [['answer' => 'With Photo']],
        ], [
            'answers' => [['photo' => $this->makeUploadedFile('photo.jpg')]],
        ]);

        $component->onFormSubmit();

        $row = $this->findLastSubmission()->answers()->first();
        $this->assertEquals('With Photo', $row->answer);
        $this->assertNotNull($row->photo);
        $this->assertEquals('photo.jpg', $row->photo->file_name);
    }

    /**
     * testFilePostbackValueIgnoredInsideRepeater
     */
    public function testFilePostbackValueIgnoredInsideRepeater()
    {
        $record = $this->createSubmission([
            'answers' => [['answer' => 'No Photo', 'photo' => '1']],
        ]);

        $row = $record->answers()->first();
        $this->assertEquals('No Photo', $row->answer);
        $this->assertNull($row->photo);
    }

    /**
     * testEntriesPublishedAssociation
     */
    public function testEntriesPublishedAssociation()
    {
        $post = $this->createPost('Published Post', true);

        $record = $this->createSubmission(['post' => $post->id]);

        $this->assertEquals($post->id, $record->post_id);
    }

    /**
     * testEntriesUnpublishedRejected
     */
    public function testEntriesUnpublishedRejected()
    {
        $post = $this->createPost('Hidden Post', false);

        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Visitor',
            'post' => $post->id,
        ]);

        $this->expectException(ValidationException::class);

        $component->onFormSubmit();
    }

    /**
     * testEntriesMissingRejected
     */
    public function testEntriesMissingRejected()
    {
        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Visitor',
            'post' => 999999,
        ]);

        $this->expectException(ValidationException::class);

        $component->onFormSubmit();
    }

    /**
     * testEntriesNestedArrayRejected
     */
    public function testEntriesNestedArrayRejected()
    {
        $post = $this->createPost('Published Post', true);

        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Visitor',
            'post' => ['id' => $post->id, 'title' => 'Overwrite'],
        ]);

        $this->expectException(ValidationException::class);

        $component->onFormSubmit();
    }

    /**
     * testGroupedRepeaterValidGroup
     */
    public function testGroupedRepeaterValidGroup()
    {
        $record = $this->createSubmission([
            'blocks' => [
                ['content_group' => 'quote', 'text' => 'To be'],
                ['content_group' => 'code', 'snippet' => 'echo 1;'],
            ],
        ]);

        $blocks = $record->blocks()->get();
        $this->assertCount(2, $blocks);
        $this->assertEquals('quote', $blocks[0]->content_group);
        $this->assertEquals('To be', $blocks[0]->text);
        $this->assertEquals('code', $blocks[1]->content_group);
        $this->assertEquals('echo 1;', $blocks[1]->snippet);
    }

    /**
     * testGroupedRepeaterInvalidGroupRejected
     */
    public function testGroupedRepeaterInvalidGroupRejected()
    {
        $component = $this->makeComponent();
        $this->setPostData([
            'name' => 'Visitor',
            'blocks' => [['content_group' => 'bogus', 'text' => 'x']],
        ]);

        $this->expectException(ValidationException::class);

        $component->onFormSubmit();
    }

    /**
     * createSubmission runs a full form submission and returns the stored record
     */
    protected function createSubmission(array $data): SubmissionRecord
    {
        $component = $this->makeComponent();

        $this->setPostData(array_merge(['name' => 'Tester'], $data));

        $component->onFormSubmit();

        return $this->findLastSubmission();
    }

    /**
     * createPost stores an entry in the UnitTest\Post section
     */
    protected function createPost(string $title, bool $isEnabled): EntryRecord
    {
        $post = EntryRecord::inSection('UnitTest\Post');
        $post->title = $title;
        $post->content_group = 'regular_post';
        $post->is_enabled = $isEnabled;
        $post->save();

        return $post;
    }

    /**
     * makeComponent builds a submission component wired to a CMS controller
     */
    protected function makeComponent(): SubmissionComponent
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $page = Page::load($theme, 'ajax-test.htm');
        $pageCode = new PageCode($page, null, $controller);

        $component = new SubmissionComponent($pageCode, [
            'handle' => 'UnitTest\Survey',
            'wizard' => false,
        ]);

        $component->init();

        return $component;
    }

    /**
     * setPostData swaps the request for a POST containing the given data and files
     */
    protected function setPostData(array $data, array $files = []): void
    {
        $this->app->instance('request', HttpRequest::create('/', 'POST', $data, [], $files));
        Facade::clearResolvedInstance('request');
    }

    /**
     * makeUploadedFile builds a test upload from a generated temp file
     */
    protected function makeUploadedFile(string $fileName): UploadedFile
    {
        $path = temp_path($fileName);
        file_put_contents($path, 'Sample upload content');

        return new UploadedFile($path, $fileName, 'image/jpeg', null, true);
    }

    /**
     * findLastSubmission returns the most recently created survey submission
     */
    protected function findLastSubmission(): ?SubmissionRecord
    {
        return SubmissionRecord::inSection('UnitTest\Survey')->newQuery()->orderBy('id', 'desc')->first();
    }
}
