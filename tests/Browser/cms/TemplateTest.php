<?php

namespace Tests\Browser\Cms;

use Laravel\Dusk\Browser;
use Config;

class TemplateTest extends \UiTestCase
{

    private $theme;

    private $fakePath = '/xxx/functional/test/';

    private $fakeName = 'xxx_functional_test';

    public function setUp()
    {
        parent::setUp();
        $this->theme = Config::get('cms.activeTheme');
        $this->clean();
    }

    private function fixSidebar(Browser $browser)
    {
        $browser->waitUntil('document.getElementsByClassName("fix-button")[0].style.display="block";');
    }

    /**
     * @group templates
     */
    public function testCmsPages()
    {

        $this->signInToBackend();

        $this->browse(function (Browser $browser) {
            $browser->visit('backend/cms')
                ->assertPathIs('/backend/cms');

            $this->fixSidebar($browser);

            $browser->click("form[data-template-type='page'] button[data-control='create-template']");
            $browser->waitFor("input[name='settings[title]']");

            //Populate page details
            $browser->type('settings[title]', 'Functional Test Page');
            $browser->type('settings[url]', "{$this->fakePath}page");
            $browser->type('fileName', "{$this->fakeName}_page");

            //Save the new page
            $pageSelector = "li[data-tab-id='page-{$this->theme}-{$this->fakeName}_page.htm']";
            $browser->click('a[data-request=onSave]');
            $browser->waitFor("$pageSelector");

            //Close the tab
            $browser->waitUntilMissing('.flash-message', 7);
            $browser->click("$pageSelector span.tab-close");

            //Reopen the tab
            $pageToOpenSelector = "div#TemplateList-pageList-template-list ul > li[data-item-path='{$this->fakeName}_page.htm'] a";
            $browser->waitFor($pageToOpenSelector);
            $browser->click($pageToOpenSelector);
            $browser->waitFor("input[name='settings[title]']");

            $browser->pause(100);

            //Delete the page
            $browser->click('button[data-request="onDelete"]');

            $browser->whenAvailable('.sweet-alert', function ($sweetAlert) {
                $sweetAlert->assertSee('Delete this page?');
                $sweetAlert->pause(1000); //Wait for the correct DOM binding to the button
                $sweetAlert->press('OK');
            });

            $browser->waitUntilMissing("input[name='settings[title]']");

        });
    }

    /**
     * @group templates
     */

    public function testCmsPartials()
    {

        $this->browse(function (Browser $browser) {

            $browser->visit('backend/cms');

            $browser->assertPathIs('/backend/cms');

            $this->fixSidebar($browser);

            //Click partials menu item

            $browser->click('li[data-menu-item="partials"] > a');

            //Create a new partial

            $browser->click('form[data-template-type="partial"] button[data-control="create-template"]');
            $browser->waitFor("input[name='fileName']");

            //Populate partial details

            $browser->type('fileName', "{$this->fakeName}_partial");
            $browser->type('settings[description]', 'Test partial');

            //Save the new partial

            $partialSelector = "li[data-tab-id='partial-{$this->theme}-{$this->fakeName}_partial.htm']";
            $browser->click('a[data-request="onSave"]');
            $browser->waitFor($partialSelector);

            //Close the tab

            $browser->waitUntilMissing('.flash-message', 7);
            $browser->click("$partialSelector span.tab-close");

            //Reopen the tab
            $partialToOpenSelector = "div#TemplateList-partialList-template-list ul > li[data-item-path='{$this->fakeName}_partial.htm'] a";
            $browser->waitFor($partialToOpenSelector);
            $browser->click($partialToOpenSelector);
            $browser->waitFor("input[name='fileName']");

            $browser->pause(100);

            //Delete the page
            $browser->click('button[data-request="onDelete"]');

            $browser->whenAvailable('.sweet-alert', function ($sweetAlert) {
                $sweetAlert->assertSee('Delete this partial?');
                $sweetAlert->pause(1000); //Wait for the correct DOM binding to the button
                $sweetAlert->press('OK');
            });

            $browser->waitUntilMissing("input[name='fileName']");

        });
    }

    public function testCmsLayout()
    {

        $this->browse(function (Browser $browser) {

            $browser->visit('backend/cms');

            $browser->assertPathIs('/backend/cms');

            $this->fixSidebar($browser);

            //Click layouts menu item

            $browser->click('li[data-menu-item="layouts"] > a');

            //Create a new layout

            $browser->click('form[data-template-type="layout"] button[data-control="create-template"]');
            $browser->waitFor("input[name='fileName']");

            //Populate layout details

            $browser->type('fileName', "{$this->fakeName}_layout");
            $browser->type('settings[description]', 'Test layout');

            //Save the new layout

            $partialSelector = "li[data-tab-id='layout-{$this->theme}-{$this->fakeName}_layout.htm']";
            $browser->click('a[data-request="onSave"]');
            $browser->waitFor($partialSelector);

            //Close the tab

            $browser->waitUntilMissing('.flash-message', 7);
            $browser->click("$partialSelector span.tab-close");

            //Reopen the tab
            $partialToOpenSelector = "div#TemplateList-layoutList-template-list ul > li[data-item-path='{$this->fakeName}_layout.htm'] a";
            $browser->waitFor($partialToOpenSelector);
            $browser->click($partialToOpenSelector);
            $browser->waitFor("input[name='fileName']");

            $browser->pause(100);

            //Delete the page
            $browser->click('button[data-request="onDelete"]');

            $browser->whenAvailable('.sweet-alert', function ($sweetAlert) {
                $sweetAlert->assertSee('Delete this layout?');
                $sweetAlert->pause(1000); //Wait for the correct DOM binding to the button
                $sweetAlert->press('OK');
            });

            $browser->waitUntilMissing("input[name='fileName']");

        });
    }

    public function testCmsContent()
    {

        $this->browse(function (Browser $browser) {

            $browser->visit('backend/cms');

            $browser->assertPathIs('/backend/cms');

            $this->fixSidebar($browser);

            //Click contents menu item

            $browser->click('li[data-menu-item="content"] > a');

            //Create a new content

            $browser->click('form[data-template-type="content"] button[data-control="create-template"]');
            $browser->waitFor("input[name='fileName']");

            //Populate contents defails

            $browser->type('fileName', "{$this->fakeName}_content.txt");

            //Save the new content

            $contentSelector = "li[data-tab-id='content-{$this->theme}-{$this->fakeName}_content.txt']";
            $browser->click('a[data-request="onSave"]');
            $browser->waitFor($contentSelector);

            //Close the tab

            $browser->waitUntilMissing('.flash-message', 7);
            $browser->click("$contentSelector span.tab-close");

            //Reopen the tab
            $partialToOpenSelector = "div#TemplateList-contentList-template-list ul > li[data-item-path='{$this->fakeName}_content.txt'] a";
            $browser->waitFor($partialToOpenSelector);
            $browser->click($partialToOpenSelector);
            $browser->waitFor("input[name='fileName']");

            $browser->pause(100);

            //Delete the page
            $browser->click('button[data-request="onDelete"]');

            $browser->whenAvailable('.sweet-alert', function ($sweetAlert) {
                $sweetAlert->assertSee('Delete this content file?');
                $sweetAlert->pause(1000); //Wait for the correct DOM binding to the button
                $sweetAlert->press('OK');
            });

            $browser->waitUntilMissing("input[name='fileName']");

        });

    }

    public function tearDown()
    {
        $this->clean();
        parent::tearDown();
    }

    private function clean()
    {
        collect(['page', 'partial', 'layout'])->each(function ($dir) {
            $file = themes_path("{$this->theme}/{$dir}s/{$this->fakeName}_{$dir}.htm");
            if (file_exists($file)) {
                unlink($file);
            }
        });
        $txt = themes_path("{$this->theme}/content/{$this->fakeName}_content.txt");
        if (file_exists($txt)) {
            unlink($txt);
        }
    }

}
