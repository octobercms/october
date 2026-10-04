<?php

class DashboardLangTest extends TestCase
{
    /**
     * testWidgetWidthTitleKeepsColumnsPlaceholder ensures every locale passes the
     * column range hint through, see Backend\Widgets\ReportContainer::getWidgetPropertyConfig
     */
    public function testWidgetWidthTitleKeepsColumnsPlaceholder()
    {
        $translator = $this->app['translator'];
        $originalLocale = $translator->getLocale();

        // JSON translations are only registered in the backend context
        $translator->addJsonPath(base_path('modules/dashboard/lang'));

        $files = glob(base_path('modules/dashboard/lang/*.json'));
        $this->assertNotEmpty($files);

        foreach ($files as $path) {
            $locale = basename($path, '.json');
            $messages = json_decode(file_get_contents($path), true);
            $this->assertIsArray($messages, "Invalid JSON found in [{$locale}.json] for module [dashboard].");

            if (!isset($messages['Width :columns'])) {
                continue;
            }

            $this->assertStringContainsString(
                ':columns',
                $messages['Width :columns'],
                "The [Width :columns] translation in [{$locale}.json] must keep the :columns placeholder."
            );

            $translator->setLocale($locale);
            $this->assertStringContainsString(
                '(1-12)',
                __("Width :columns", ['columns' => '(1-12)']),
                "The widget width title for locale [{$locale}] does not show the column range."
            );
        }

        $translator->setLocale($originalLocale);
    }
}
