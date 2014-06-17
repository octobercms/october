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

        // Create a new page
        $this->click("xpath=(//button[@data-control='create-template'])[1]");
        $this->waitForElementPresent("name=settings[title]");

        // Populate page details
        $this->type('name=settings[title]', 'Functional Test Page');
        $this->type('name=settings[url]', '/xxx/functional/test/page');
        $this->type('name=fileName', 'xxx_functional_test_page');

        // Save the new page
        $this->click("xpath=(//a[@data-request='onSave'])[1]");
        $this->waitForElementPresent("xpath=(//li[@data-tab-id='page-website-xxx_functional_test_page.htm'])[1]");

        // Close the tab
        $this->click("xpath=(//li[@data-tab-id='page-website-xxx_functional_test_page.htm']/span[@class='tab-close'])[1]");

        // Reopen the tab
        $this->waitForElementPresent("xpath=(//div[@id='TemplateList-pageList-template-list']/ul/li[@data-item-path='xxx_functional_test_page.htm']/a)[1]");
        $this->click("xpath=(//div[@id='TemplateList-pageList-template-list']/ul/li[@data-item-path='xxx_functional_test_page.htm']/a)[1]");
        $this->waitForElementPresent("name=settings[title]");

        // Delete the page
        $this->click("xpath=(//button[@data-request='onDelete'])[1]");
        $this->assertTrue((bool)preg_match('/^Do you really want delete this page[\s\S]$/',$this->getConfirmation()));
    }

}