<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\PageCode;
use Cms\Classes\Controller;
use Tailor\Models\SubmissionRecord;
use Tailor\Components\SubmissionComponent;
use October\Rain\Database\ModelException;
use Illuminate\Support\Facades\Facade;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\UploadedFile;

class SubmissionComponentTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->migrateTailor();
    }

    /**
     * testFormGetFieldsFilterByTag
     */
    public function testFormGetFieldsFilterByTag()
    {
        $component = $this->makeComponent();

        $allFields = $component->formGetFields();
        $this->assertCount(4, $allFields);
        $this->assertEquals(['step1'], $allFields[0]['tags']);

        $step1Fields = $component->formGetFields('step1');
        $this->assertEquals(['name', 'email', 'phone'], array_column($step1Fields, 'name'));

        $step3Fields = $component->formGetFields('step3');
        $this->assertEquals(['email'], array_column($step3Fields, 'name'));

        $this->assertCount(0, $component->formGetFields('bogus'));
    }

    /**
     * testFormGetFieldConfigByTagThrowsForUnknownTag
     */
    public function testFormGetFieldConfigByTagThrowsForUnknownTag()
    {
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('Unknown form tag');

        $this->makeComponent()->formGetFieldConfigByTag('bogus');
    }

    /**
     * testDeferRequiresWizardProperty
     */
    public function testDeferRequiresWizardProperty()
    {
        $component = $this->makeComponent(wizard: false);

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('not enabled');

        $component->onFormStep();
    }

    /**
     * testNonWizardSubmitIgnoresPartialRecords
     */
    public function testNonWizardSubmitIgnoresPartialRecords()
    {
        $wizard = $this->makeComponent();

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $wizard->onFormStep();
        $partialId = Session::get($wizard->formGetSessionKey());

        // A plain form sharing the blueprint must not complete the partial
        $plain = $this->makeComponent(wizard: false);
        $this->setPostData([
            'name' => 'Sam',
            'email' => 'sam@example.tld',
        ]);

        $plain->onFormSubmit();

        $partial = SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->find($partialId);
        $this->assertTrue((bool) $partial->is_partial_submission);
        $this->assertEquals('Jeff', $partial->name);
        $this->assertEquals(2, SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->count());

        // The in-flight wizard session survives the unrelated submit
        $this->assertEquals($partialId, Session::get($wizard->formGetSessionKey()));
    }

    /**
     * testStepRequiresFormStep
     */
    public function testStepRequiresFormStep()
    {
        $component = $this->makeComponent();
        $this->setPostData(['name' => 'Jeff']);

        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('Missing step');

        $component->onFormStep();
    }

    /**
     * testGotoEmptyReturnsToStart
     */
    public function testGotoEmptyReturnsToStart()
    {
        $component = $this->makeComponent();
        $this->setPostData(['_form_goto' => '']);

        $component->onFormGoto();

        $this->assertEquals('', $component->getController()->vars['formTag']);
    }

    /**
     * testDeferCreatesPartialSubmission
     */
    public function testDeferCreatesPartialSubmission()
    {
        $component = $this->makeComponent();

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
            'phone' => '555-0100',
        ]);

        $component->onFormStep();

        $record = $this->findLastSubmission();
        $this->assertNotNull($record);
        $this->assertTrue((bool) $record->is_partial_submission);
        $this->assertEquals('partial', $record->status_code);
        $this->assertEquals('Jeff', $record->name);
        $this->assertEquals($record->getKey(), Session::get($component->formGetSessionKey()));
    }

    /**
     * testDeferValidatesOnlyTaggedFields
     */
    public function testDeferValidatesOnlyTaggedFields()
    {
        $component = $this->makeComponent();

        // Rules for step2+ fields must not block a step1 save
        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $component->onFormStep();
        $this->assertNotNull($this->findLastSubmission());

        // Rules for tagged fields still apply
        Session::forget($component->formGetSessionKey());
        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'not-an-email',
        ]);

        $this->expectException(ModelException::class);
        $this->expectExceptionMessage('email');

        $component->onFormStep();
    }

    /**
     * testDeferIgnoresUntaggedFields
     */
    public function testDeferIgnoresUntaggedFields()
    {
        $component = $this->makeComponent();

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
            'needs' => 'Smuggled step2 value',
        ]);

        $component->onFormStep();

        $record = $this->findLastSubmission();
        $this->assertEmpty($record->needs);
    }

    /**
     * testMultiStepFlowCompletesSubmission
     */
    public function testMultiStepFlowCompletesSubmission()
    {
        $component = $this->makeComponent();

        // Step 1: capture the lead
        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
            'phone' => '555-0100',
        ]);

        $component->onFormStep();

        $lead = $this->findLastSubmission();
        $this->assertEquals('partial', $lead->status_code);

        // Step 2: add client needs to the same record
        $this->setPostData([
            '_form_step' => 'step2',
            'needs' => 'A new website please',
        ]);

        $component->onFormStep();

        // Final step: complete the submission
        $this->setPostData([
            'email' => 'jeff@example.tld',
        ]);

        $component->onFormSubmit();

        $record = $this->findLastSubmission();
        $this->assertEquals(1, SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->count());
        $this->assertEquals($lead->getKey(), $record->getKey());
        $this->assertFalse((bool) $record->is_partial_submission);
        $this->assertEquals('pending', $record->status_code);
        $this->assertEquals('Jeff', $record->name);
        $this->assertEquals('A new website please', $record->needs);
        $this->assertNull(Session::get($component->formGetSessionKey()));
    }

    /**
     * testGotoNavigatesWithoutSaving
     */
    public function testGotoNavigatesWithoutSaving()
    {
        $component = $this->makeComponent();

        // Advance to step 2 saving the lead
        $this->setPostData([
            '_form_step' => 'step1',
            '_form_goto' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $component->onFormStep();
        $lead = $this->findLastSubmission();
        $updatedAt = $lead->updated_at;

        // Go back to the start, no save, no new record
        $this->setPostData([
            '_form_goto' => '',
        ]);

        $component->onFormGoto();

        $this->assertEquals('', $component->getController()->vars['formTag']);

        $record = $this->findLastSubmission();
        $this->assertEquals($lead->getKey(), $record->getKey());
        $this->assertEquals(1, SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->count());
        $this->assertEquals('Jeff', $record->name);
        $this->assertEquals($updatedAt, $record->updated_at);
    }

    /**
     * testGotoSkipsValidationWithStrayFormStep
     */
    public function testGotoSkipsValidationWithStrayFormStep()
    {
        $component = $this->makeComponent();

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $component->onFormStep();

        // A Back button inside a step form serializes the hidden _form_step
        // input, but onFormGoto must not validate or save the current step
        $this->setPostData([
            '_form_step' => 'step1',
            '_form_goto' => '',
            'email' => 'not-an-email',
        ]);

        $component->onFormGoto();

        $this->assertEquals('', $component->getController()->vars['formTag']);
        $this->assertEquals('jeff@example.tld', $this->findLastSubmission()->email);
    }

    /**
     * testUpdatingExistingPartialIsNotThrottled
     */
    public function testUpdatingExistingPartialIsNotThrottled()
    {
        $component = $this->makeComponent();

        // Create the partial, then re-save the same record well past the
        // throttle rate. Updates to an owned record must never be limited.
        for ($i = 0; $i < 20; $i++) {
            $this->setPostData([
                '_form_step' => 'step1',
                '_form_goto' => 'step1',
                'name' => 'Jeff ' . $i,
                'email' => 'jeff@example.tld',
            ]);

            $component->onFormStep();
        }

        $this->assertEquals(1, SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->count());
        $this->assertEquals('Jeff 19', $this->findLastSubmission()->name);
    }

    /**
     * testFinalSubmitValidatesAllRules
     */
    public function testFinalSubmitValidatesAllRules()
    {
        $component = $this->makeComponent();

        // Step 2 alone captures needs without a name or email
        $this->setPostData([
            '_form_step' => 'step2',
            'needs' => 'A new website please',
        ]);

        $component->onFormStep();

        // The final submit enforces the full rule set
        $this->setPostData([]);

        $this->expectException(ModelException::class);

        $component->onFormSubmit();
    }

    /**
     * testCompletedSubmissionCannotBeReopened
     */
    public function testCompletedSubmissionCannotBeReopened()
    {
        $component = $this->makeComponent();

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $component->onFormStep();
        $recordId = Session::get($component->formGetSessionKey());

        $this->setPostData(['email' => 'jeff@example.tld']);
        $component->onFormSubmit();

        // A stale session value must not resolve the completed record
        Session::put($component->formGetSessionKey(), $recordId);
        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Mallory',
            'email' => 'mallory@example.tld',
        ]);

        $component->onFormStep();

        $original = SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->find($recordId);
        $this->assertEquals('Jeff', $original->name);
        $this->assertEquals(2, SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->count());
    }

    /**
     * testRequiredFileUploadFailsWithoutFile
     */
    public function testRequiredFileUploadFailsWithoutFile()
    {
        $component = $this->makeComponent(wizard: false, handle: 'UnitTest\Upload');

        $this->setPostData(['name' => 'Jeff']);

        try {
            $component->onFormSubmit();
            $this->fail('Expected validation to fail without a file');
        }
        catch (ModelException $ex) {
            $this->assertArrayHasKey('files', $ex->getErrors()->messages());
        }
    }

    /**
     * testRequiredFileUploadPassesWithFile
     */
    public function testRequiredFileUploadPassesWithFile()
    {
        $component = $this->makeComponent(wizard: false, handle: 'UnitTest\Upload');

        $this->setPostData(['name' => 'Jeff'], [
            'files' => [$this->makeUploadedFile('sample.txt')],
        ]);

        $component->onFormSubmit();

        $record = SubmissionRecord::inSection('UnitTest\Upload')->newQuery()->orderBy('id', 'desc')->first();
        $this->assertNotNull($record);
        $this->assertEquals('Jeff', $record->name);
        $this->assertEquals(1, $record->files()->count());

        // Remove the stored attachment from disk
        foreach ($record->files as $file) {
            $file->delete();
        }
    }

    /**
     * testRejectedPartialFollowsStandardRetention
     */
    public function testRejectedPartialFollowsStandardRetention()
    {
        $component = $this->makeComponent();

        $this->setPostData([
            '_form_step' => 'step1',
            'name' => 'Jeff',
            'email' => 'jeff@example.tld',
        ]);

        $component->onFormStep();

        $record = $this->findLastSubmission();
        $uuid = $record->blueprint_uuid;

        // An admin rejects the abandoned partial
        $record->delete();

        // Backdate the rejection past the retention period
        Db::table($record->getTable())->where('id', $record->getKey())->update([
            'deleted_at' => now()->subDays(60),
        ]);

        $count = SubmissionRecord::purgeRejectedRecords($uuid);

        $this->assertEquals(1, $count);
        $this->assertNull($this->findLastSubmission());
    }

    /**
     * makeComponent builds a submission component wired to a CMS controller
     */
    protected function makeComponent(bool $wizard = true, string $handle = 'UnitTest\Contact'): SubmissionComponent
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $page = Page::load($theme, 'ajax-test.htm');
        $pageCode = new PageCode($page, null, $controller);

        $component = new SubmissionComponent($pageCode, [
            'handle' => $handle,
            'wizard' => $wizard,
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

        return new UploadedFile($path, $fileName, 'text/plain', null, true);
    }

    /**
     * findLastSubmission returns the most recently created contact submission
     */
    protected function findLastSubmission(): ?SubmissionRecord
    {
        return SubmissionRecord::inSection('UnitTest\Contact')->newQuery()->orderBy('id', 'desc')->first();
    }
}
