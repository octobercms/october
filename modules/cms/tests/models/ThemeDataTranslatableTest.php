<?php

use Cms\Classes\Theme;
use Cms\Models\ThemeData;
use Backend\Widgets\Form;
use Backend\Classes\Controller;
use October\Rain\Database\Relations\TranslatableAttachOne;

/**
 * ThemeDataTranslatableTest covers theme data fields marked as translatable.
 */
class ThemeDataTranslatableTest extends PluginTestCase
{
    /**
     * @var \System\Models\SiteDefinition site using the French locale
     */
    protected $site;

    public function setUp(): void
    {
        parent::setUp();

        Theme::resetCache();
        Cache::flush();
        $this->resetThemeDataInstances();

        $this->site = $this->makeSite('fr');
    }

    public function tearDown(): void
    {
        $this->resetThemeDataInstances();
        Site::resetCache();

        parent::tearDown();
    }

    /**
     * testTranslatableFieldsComeFromFormConfig confirms fields marked as translatable are translated
     */
    public function testTranslatableFieldsComeFromFormConfig()
    {
        $themeData = ThemeData::forTheme(Theme::load('themedatatest'));

        $this->assertEquals(['title', 'logo'], $themeData->getTranslatableAttributes());
        $this->assertEquals(['logo'], $themeData->getTranslatableAttachments());
    }

    /**
     * testTranslatedValueKeepsDefaultValue confirms saving in another locale stores a translation
     */
    public function testTranslatedValueKeepsDefaultValue()
    {
        $this->saveDefaultData();

        Site::withContext($this->site->id, function () {
            $themeData = $this->findThemeData();
            $this->assertEquals('Base title', $themeData->title);

            $themeData->title = 'Titre';
            $themeData->save();
        });

        $themeData = $this->findThemeData();
        $this->assertEquals('Base title', $themeData->title);
        $this->assertEquals('top', $themeData->position);
        $this->assertEquals('Titre', $themeData->getTranslation('title', 'fr'));

        $data = json_decode(Db::table('cms_theme_data')->where('id', $themeData->id)->value('data'), true);
        $this->assertEquals('Base title', $data['title']);

        Site::withContext($this->site->id, function () {
            $themeData = $this->findThemeData();
            $this->assertEquals('Titre', $themeData->title);
            $this->assertEquals('top', $themeData->position);
        });
    }

    /**
     * testForThemeKeepsInstancePerLocale confirms cached instances do not leak across locales
     */
    public function testForThemeKeepsInstancePerLocale()
    {
        $this->saveDefaultData();

        Site::withContext($this->site->id, function () {
            $themeData = $this->findThemeData();
            $themeData->title = 'Titre';
            $themeData->save();
        });

        $theme = Theme::load('themedatatest');
        $this->assertEquals('Base title', ThemeData::forTheme($theme)->title);

        // Rehydrated from the cache warmed by the default locale
        Site::withContext($this->site->id, function () use ($theme) {
            $this->assertEquals('Titre', ThemeData::forTheme($theme)->title);
        });

        $this->assertEquals('Base title', ThemeData::forTheme($theme)->title);
    }

    /**
     * testTranslatedFileUploadUsesLocaleField confirms translatable file uploads store files per locale
     */
    public function testTranslatedFileUploadUsesLocaleField()
    {
        $this->saveDefaultData();

        $themeData = ThemeData::forTheme(Theme::load('themedatatest'));
        $this->assertInstanceOf(TranslatableAttachOne::class, $themeData->logo());
        $this->assertNotInstanceOf(TranslatableAttachOne::class, $themeData->background());

        Site::withContext($this->site->id, function () {
            $themeData = $this->findThemeData();
            $this->assertEquals('logo:fr', $themeData->logo()->getAttachmentField());
            $this->assertEquals('background', $themeData->background()->getAttachmentField());
        });
    }

    /**
     * testTranslatePopupSavesToSiteLocale confirms the translate popup no longer overwrites the default value
     */
    public function testTranslatePopupSavesToSiteLocale()
    {
        $this->saveDefaultData();

        $this->swapRequest([
            'field_name' => 'title',
            'site_id' => $this->site->id,
            'TranslateField' => ['title' => 'Titre']
        ], 'form::onSaveTranslateField');

        $form = $this->makeForm($this->findThemeData());
        $this->assertTrue($form->getField('title')->translatable);
        $form->onSaveTranslateField();

        $themeData = $this->findThemeData();
        $this->assertEquals('Base title', $themeData->title);
        $this->assertEquals('Titre', $themeData->getTranslation('title', 'fr'));
    }

    /**
     * saveDefaultData stores values for the default locale
     */
    protected function saveDefaultData()
    {
        $themeData = ThemeData::forTheme(Theme::load('themedatatest'));
        $themeData->title = 'Base title';
        $themeData->position = 'top';
        $themeData->save();

        $this->resetThemeDataInstances();
    }

    /**
     * findThemeData fetches the theme data record in the active site context
     */
    protected function findThemeData()
    {
        return ThemeData::where('theme', 'themedatatest')->first();
    }

    /**
     * makeForm builds a form using the theme's own field definitions
     */
    protected function makeForm($model)
    {
        $fields = Theme::load('themedatatest')->getFormConfig()['fields'];

        $form = new Form(new Controller, [
            'model' => $model,
            'arrayName' => 'ThemeData',
            'fields' => array_only($fields, ['title', 'position'])
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        return $form;
    }

    /**
     * makeSite creates an edit enabled site for a locale
     */
    protected function makeSite(string $locale)
    {
        $site = new \System\Models\SiteDefinition;
        $site->name = 'Site ' . $locale;
        $site->code = 'site-' . $locale;
        $site->locale = $locale;
        $site->is_enabled = true;
        $site->is_enabled_edit = true;
        $site->save();

        Site::resetCache();

        return $site;
    }

    /**
     * swapRequest replaces the request with an AJAX handler request
     */
    protected function swapRequest(array $data, string $handler)
    {
        $request = \Illuminate\Http\Request::create('/', 'POST', $data, [], [], [
            'HTTP_X_AJAX_HANDLER' => $handler,
            'HTTP_X_REQUESTED_WITH' => 'XMLHttpRequest'
        ]);
        $this->app->instance('request', $request);
        \Illuminate\Support\Facades\Facade::clearResolvedInstance('request');
    }

    /**
     * resetThemeDataInstances clears the cached theme data models
     */
    protected function resetThemeDataInstances()
    {
        self::setProtectedProperty(new ThemeData, 'instances', []);
    }
}
