<?php namespace October\Core\Tests\Browser\Backend\Cms;

use Laravel\Dusk\Browser;
use October\Core\Tests\Browser\Pages\Backend\Cms;

class TemplateTest extends \October\Core\Tests\BrowserTestCase
{
    public function testPageTemplates()
    {
        $this->browse(function (Browser $browser) {
            $browser
                ->signInToBackend()
                ->visit(new Cms)
                ->pause(200);

            // Fix side panel, if necessary
            if ($browser->hasClass('', 'side-panel-not-fixed')) {
                $browser
                    ->mouseover('@sideNav > li[data-menu-item="pages"]')
                    ->waitFor('@sidePanel')
                    ->mouseover('@sidePanel')
                    ->waitFor('@sidePanelFixButton')
                    ->click('@sidePanelFixButton');
            }

            // Add a new page
            $browser
                ->click('form[data-template-type="page"] button[data-control="create-template"]')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane');

            $tabId = $browser->attribute('#cms-master-tabs .tab-content .tab-pane', 'id');

            $browser->assertPresent('a[data-toggle="tab"][data-target="#' . $tabId . '"]');
            $this->assertEquals('New page', $browser->text('a[data-toggle="tab"][data-target="#' . $tabId . '"]'));

            $browser
                ->type('input[name="settings[title]"]', 'Functional Test Page')
                ->pause(100)

                // Check that slug values are working
                ->assertInputValue('input[name="settings[url]"]', '/functional-test-page')
                ->assertInputValue('input[name="fileName"]', 'functional-test-page')

                ->clear('input[name="settings[url]"]')
                ->type('input[name="settings[url]"]', '/xxx/functional/test/page')
                ->clear('input[name="fileName"]')
                ->type('input[name="fileName"]', 'xxx_functional_test_page.htm')

                // Check that slug values have not been re-added after manual entry
                ->assertInputValue('input[name="settings[url]"]', '/xxx/functional/test/page')
                ->assertInputValue('input[name="fileName"]', 'xxx_functional_test_page.htm');

            // Save the new page
            $browser
                ->click('a[data-request="onSave"]')
                ->waitFor('.flash-message')
                ->assertSeeIn('.flash-message', 'Template saved.');

            $this->assertEquals(
                'Functional Test Page',
                $browser->attribute('a[data-toggle="tab"][data-target="#' . $tabId . '"] span.title', 'title')
            );

            // Close the tab
            $browser
                ->click('li[data-tab-id^="page-"][data-tab-id$="-xxx_functional_test_page.htm"] span.tab-close')
                ->pause(100)
                ->assertMissing('#cms-master-tabs .tab-content .tab-pane');

            // Re-open the page
            $browser
                ->click('div#TemplateList-pageList-template-list li[data-item-path="xxx_functional_test_page.htm"] a')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane')

                // Check that saved details are still there
                ->assertInputValue('input[name="settings[title]"]', 'Functional Test Page')
                ->assertInputValue('input[name="settings[url]"]', '/xxx/functional/test/page')
                ->assertInputValue('input[name="fileName"]', 'xxx_functional_test_page.htm');

            // Delete the page
            $browser
                ->click('button[data-request="onDelete"]')
                ->waitFor('.sweet-alert.showSweetAlert.visible')
                ->pause(300)
                ->click('.sweet-alert.showSweetAlert.visible button.confirm')
                ->waitUntilMissing('div#TemplateList-pageList-template-list li[data-item-path="xxx_functional_test_page.htm"]');
        });
    }

    public function testPartialTemplates()
    {
        $this->browse(function (Browser $browser) {
            $browser
                ->signInToBackend()
                ->visit(new Cms)
                ->pause(200);

            // Fix side panel, if necessary
            if ($browser->hasClass('', 'side-panel-not-fixed')) {
                $browser
                    ->mouseover('@sideNav > li[data-menu-item="pages"]')
                    ->waitFor('@sidePanel')
                    ->mouseover('@sidePanel')
                    ->waitFor('@sidePanelFixButton')
                    ->click('@sidePanelFixButton');
            }

            $browser
                ->click('@sideNav > li[data-menu-item="partials"] a');

            // Add a new partial
            $browser
                ->click('form[data-template-type="partial"] button[data-control="create-template"]')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane');

            $tabId = $browser->attribute('#cms-master-tabs .tab-content .tab-pane', 'id');

            $browser->assertPresent('a[data-toggle="tab"][data-target="#' . $tabId . '"]');
            $this->assertEquals('New partial', $browser->text('a[data-toggle="tab"][data-target="#' . $tabId . '"]'));

            $browser
                ->type('input[name="fileName"]', 'xxx_functional_test_partial')
                ->type('input[name="settings[description]"]', 'Test Partial');

            // Save the new partial
            $browser
                ->click('a[data-request="onSave"]')
                ->waitFor('.flash-message')
                ->assertSeeIn('.flash-message', 'Template saved.');

            $this->assertEquals(
                'xxx_functional_test_partial',
                $browser->attribute('a[data-toggle="tab"][data-target="#' . $tabId . '"] span.title', 'title')
            );

            // Close the tab
            $browser
                ->click('li[data-tab-id^="partial-"][data-tab-id$="-xxx_functional_test_partial.htm"] span.tab-close')
                ->pause(100)
                ->assertMissing('#cms-master-tabs .tab-content .tab-pane');

            // Re-open the partial
            $browser
                ->click('div#TemplateList-partialList-template-list li[data-item-path="xxx_functional_test_partial.htm"] a')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane')

                // Check that saved details are still there
                ->assertInputValue('input[name="fileName"]', 'xxx_functional_test_partial.htm')
                ->assertInputValue('input[name="settings[description]"]', 'Test Partial');

            // Delete the partial
            $browser
                ->click('button[data-request="onDelete"]')
                ->waitFor('.sweet-alert.showSweetAlert.visible')
                ->pause(300)
                ->click('.sweet-alert.showSweetAlert.visible button.confirm')
                ->waitUntilMissing('div#TemplateList-partialList-template-list li[data-item-path="xxx_functional_test_partial.htm"]');
        });
    }

    public function testLayoutTemplates()
    {
        $this->browse(function (Browser $browser) {
            $browser
                ->signInToBackend()
                ->visit(new Cms)
                ->pause(200);

            // Fix side panel, if necessary
            if ($browser->hasClass('', 'side-panel-not-fixed')) {
                $browser
                    ->mouseover('@sideNav > li[data-menu-item="pages"]')
                    ->waitFor('@sidePanel')
                    ->mouseover('@sidePanel')
                    ->waitFor('@sidePanelFixButton')
                    ->click('@sidePanelFixButton');
            }

            $browser
                ->click('@sideNav > li[data-menu-item="layouts"] a');

            // Add a new layout
            $browser
                ->click('form[data-template-type="layout"] button[data-control="create-template"]')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane');

            $tabId = $browser->attribute('#cms-master-tabs .tab-content .tab-pane', 'id');

            $browser->assertPresent('a[data-toggle="tab"][data-target="#' . $tabId . '"]');
            $this->assertEquals('New layout', $browser->text('a[data-toggle="tab"][data-target="#' . $tabId . '"]'));

            $browser
                ->type('input[name="fileName"]', 'xxx_functional_test_layout')
                ->type('input[name="settings[description]"]', 'Test Layout');

            // Save the new layout
            $browser
                ->click('a[data-request="onSave"]')
                ->waitFor('.flash-message')
                ->assertSeeIn('.flash-message', 'Template saved.');

            $this->assertEquals(
                'xxx_functional_test_layout',
                $browser->attribute('a[data-toggle="tab"][data-target="#' . $tabId . '"] span.title', 'title')
            );

            // Close the tab
            $browser
                ->click('li[data-tab-id^="layout-"][data-tab-id$="-xxx_functional_test_layout.htm"] span.tab-close')
                ->pause(100)
                ->assertMissing('#cms-master-tabs .tab-content .tab-pane');

            // Re-open the partial
            $browser
                ->click('div#TemplateList-layoutList-template-list li[data-item-path="xxx_functional_test_layout.htm"] a')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane')

                // Check that saved details are still there
                ->assertInputValue('input[name="fileName"]', 'xxx_functional_test_layout.htm')
                ->assertInputValue('input[name="settings[description]"]', 'Test Layout');

            // Delete the partial
            $browser
                ->click('button[data-request="onDelete"]')
                ->waitFor('.sweet-alert.showSweetAlert.visible')
                ->pause(300)
                ->click('.sweet-alert.showSweetAlert.visible button.confirm')
                ->waitUntilMissing('div#TemplateList-layoutList-template-list li[data-item-path="xxx_functional_test_layout.htm"]');
        });
    }

    public function testContentTemplates()
    {
        $this->browse(function (Browser $browser) {
            $browser
                ->signInToBackend()
                ->visit(new Cms)
                ->pause(200);

            // Fix side panel, if necessary
            if ($browser->hasClass('', 'side-panel-not-fixed')) {
                $browser
                    ->mouseover('@sideNav > li[data-menu-item="pages"]')
                    ->waitFor('@sidePanel')
                    ->mouseover('@sidePanel')
                    ->waitFor('@sidePanelFixButton')
                    ->click('@sidePanelFixButton');
            }

            $browser
                ->click('@sideNav > li[data-menu-item="content"] a');

            // Add a new content file
            $browser
                ->click('form[data-template-type="content"] button[data-control="create-template"]')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane');

            $tabId = $browser->attribute('#cms-master-tabs .tab-content .tab-pane', 'id');

            $browser->assertPresent('a[data-toggle="tab"][data-target="#' . $tabId . '"]');
            $this->assertStringContainsString('content', $browser->text('a[data-toggle="tab"][data-target="#' . $tabId . '"]'));

            $browser
                ->type('input[name="fileName"]', 'xxx_functional_test_content.txt');

            // Save the new content file
            $browser
                ->click('a[data-request="onSave"]')
                ->waitFor('.flash-message')
                ->assertSeeIn('.flash-message', 'Template saved.');

            $this->assertEquals(
                'xxx_functional_test_content.txt',
                $browser->attribute('a[data-toggle="tab"][data-target="#' . $tabId . '"] span.title', 'title')
            );

            // Close the tab
            $browser
                ->click('li[data-tab-id^="content-"][data-tab-id$="-xxx_functional_test_content.txt"] span.tab-close')
                ->pause(100)
                ->assertMissing('#cms-master-tabs .tab-content .tab-pane');

            // Re-open the partial
            $browser
                ->click('div#TemplateList-contentList-template-list li[data-item-path="xxx_functional_test_content.txt"] a')
                ->waitFor('#cms-master-tabs .tab-content .tab-pane')

                // Check that saved details are still there
                ->assertInputValue('input[name="fileName"]', 'xxx_functional_test_content.txt');

            // Delete the partial
            $browser
                ->click('button[data-request="onDelete"]')
                ->waitFor('.sweet-alert.showSweetAlert.visible')
                ->pause(300)
                ->click('.sweet-alert.showSweetAlert.visible button.confirm')
                ->waitUntilMissing('div#TemplateList-contentList-template-list li[data-item-path="xxx_functional_test_content.txt"]');
        });
    }
}
