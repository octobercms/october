<?php

class TemplateTest extends UiTestCase
{

    public function testOpenTemplates()
    {
        $this->signInToBackend();
        $this->open('cms');
        $this->waitForPageToLoad("30000");

        // Fix the sidebar
        $this->click("xpath=(//a[@class='fix-button'])[1]");

        /*
         * Page
         */

        // Create a new page
        $this->click("xpath=(//form[@data-template-type='page']//button[@data-control='create-template'])[1]");
        $this->waitForElementPresent("name=settings[title]");

        // Populate page details
        $this->type('name=settings[title]', 'Functional Test Page');
        $this->type('name=settings[url]', '/xxx/functional/test/page');
        $this->type('name=fileName', 'xxx_functional_test_page');

        // Save the new page
        $this->click("xpath=(//a[@data-request='onSave'])[1]");
        $this->waitForElementPresent("xpath=(//li[@data-tab-id='page-".TEST_SELENIUM_THEME."-xxx_functional_test_page.htm'])[1]");

        // Close the tab
        $this->click("xpath=(//li[@data-tab-id='page-".TEST_SELENIUM_THEME."-xxx_functional_test_page.htm']/span[@class='tab-close'])[1]");

        // Reopen the tab
        $this->waitForElementPresent("xpath=(//div[@id='TemplateList-pageList-template-list']//li[@data-item-path='xxx_functional_test_page.htm']/a)[1]");
        $this->click("xpath=(//div[@id='TemplateList-pageList-template-list']//li[@data-item-path='xxx_functional_test_page.htm']/a)[1]");
        $this->waitForElementPresent("name=settings[title]");
        sleep(1);

        // Delete the page
        $this->click("xpath=(//button[@data-request='onDelete'])[1]");
        $this->getSweetConfirmation('Do you really want delete this page?');
        // $this->assertTrue((bool)preg_match('/^Do you really want delete this page[\s\S]$/',$this->getConfirmation()));
        $this->waitForElementNotPresent("name=settings[title]");

        /*
         * Partial
         */

        // Click partials menu item
        $this->click("xpath=(//li[@data-menu-item='partials']/a)[1]");

        // Create a new partial
        $this->click("xpath=(//form[@data-template-type='partial']//button[@data-control='create-template'])[1]");
        $this->waitForElementPresent("name=fileName");

        // Populate partial details
        $this->type('name=fileName', 'xxx_functional_test_partial');
        $this->type('name=settings[description]', 'Test partial');

        // Save the new partial
        $this->click("xpath=(//a[@data-request='onSave'])[1]");
        $this->waitForElementPresent("xpath=(//li[@data-tab-id='partial-".TEST_SELENIUM_THEME."-xxx_functional_test_partial.htm'])[1]");

        // Close the tab
        $this->click("xpath=(//li[@data-tab-id='partial-".TEST_SELENIUM_THEME."-xxx_functional_test_partial.htm']/span[@class='tab-close'])[1]");

        // Reopen the tab
        $this->waitForElementPresent("xpath=(//div[@id='TemplateList-partialList-template-list']//li[@data-item-path='xxx_functional_test_partial.htm']/a)[1]");
        $this->click("xpath=(//div[@id='TemplateList-partialList-template-list']//li[@data-item-path='xxx_functional_test_partial.htm']/a)[1]");
        $this->waitForElementPresent("name=fileName");
        sleep(1);

        // Delete the partial
        $this->click("xpath=(//button[@data-request='onDelete'])[1]");
        $this->getSweetConfirmation('Do you really want delete this partial?');
        $this->waitForElementNotPresent("name=fileName");

        /*
         * Layout
         */

        // Click layouts menu item
        $this->click("xpath=(//li[@data-menu-item='layouts']/a)[1]");

        // Create a new layout
        $this->click("xpath=(//form[@data-template-type='layout']//button[@data-control='create-template'])[1]");
        $this->waitForElementPresent("name=fileName");

        // Populate layout details
        $this->type('name=fileName', 'xxx_functional_test_layout');
        $this->type('name=settings[description]', 'Test layout');

        // Save the new layout
        $this->click("xpath=(//a[@data-request='onSave'])[1]");
        $this->waitForElementPresent("xpath=(//li[@data-tab-id='layout-".TEST_SELENIUM_THEME."-xxx_functional_test_layout.htm'])[1]");

        // Close the tab
        $this->click("xpath=(//li[@data-tab-id='layout-".TEST_SELENIUM_THEME."-xxx_functional_test_layout.htm']/span[@class='tab-close'])[1]");

        // Reopen the tab
        $this->waitForElementPresent("xpath=(//div[@id='TemplateList-layoutList-template-list']//li[@data-item-path='xxx_functional_test_layout.htm']/a)[1]");
        $this->click("xpath=(//div[@id='TemplateList-layoutList-template-list']//li[@data-item-path='xxx_functional_test_layout.htm']/a)[1]");
        $this->waitForElementPresent("name=fileName");
        sleep(1);

        // Delete the layout
        $this->click("xpath=(//button[@data-request='onDelete'])[1]");
        $this->getSweetConfirmation('Do you really want delete this layout?');
        $this->waitForElementNotPresent("name=fileName");

        /*
         * Content
         */

        // Click contents menu item
        $this->click("xpath=(//li[@data-menu-item='content']/a)[1]");

        // Create a new content
        $this->click("xpath=(//form[@data-template-type='content']//button[@data-control='create-template'])[1]");
        $this->waitForElementPresent("name=fileName");

        // Populate content details
        $this->type('name=fileName', 'xxx_functional_test_content.txt');

        // Save the new content
        $this->click("xpath=(//a[@data-request='onSave'])[1]");
        $this->waitForElementPresent("xpath=(//li[@data-tab-id='content-".TEST_SELENIUM_THEME."-xxx_functional_test_content.txt'])[1]");

        // Close the tab
        $this->click("xpath=(//li[@data-tab-id='content-".TEST_SELENIUM_THEME."-xxx_functional_test_content.txt']/span[@class='tab-close'])[1]");

        // Reopen the tab
        $this->waitForElementPresent("xpath=(//div[@id='TemplateList-contentList-template-list']//li[@data-item-path='xxx_functional_test_content.txt']/a)[1]");
        $this->click("xpath=(//div[@id='TemplateList-contentList-template-list']//li[@data-item-path='xxx_functional_test_content.txt']/a)[1]");
        $this->waitForElementPresent("name=fileName");
        sleep(1);

        // Delete the content
        $this->click("xpath=(//button[@data-request='onDelete'])[1]");
        $this->getSweetConfirmation('Do you really want delete this content file?');
        $this->waitForElementNotPresent("name=fileName");

    }

}
