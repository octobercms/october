<?php namespace Cms\Console;

use Site;
use Cms\Classes\Lang;
use Cms\Classes\Theme;
use Cms\Classes\LangScanner;
use Illuminate\Console\Command;

/**
 * ThemeScan scans theme templates for translatable strings and adds
 * missing keys to the theme language file
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeScan extends Command
{
    /**
     * @var string signature of console command
     */
    protected $signature = 'theme:scan
        {name : The directory name of the theme.}
        {--locale= : Target locale file, defaults to the primary site locale.}
        {--dry-run : List found messages without writing the language file.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Scan theme templates for translatable strings and add missing keys to the language file.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $themeName = $this->argument('name');
        $theme = Theme::load($themeName);

        if (!$theme->isValid()) {
            return $this->error(sprintf('The theme %s does not exist.', $themeName));
        }

        $this->info('Scanning Theme...');

        $messages = LangScanner::scan($theme);

        if (!$messages) {
            $this->info('No translatable messages found.');
            return;
        }

        $this->line(sprintf('Found %d unique messages.', count($messages)));

        if ($this->option('dry-run')) {
            foreach ($messages as $message) {
                $this->line('  - ' . $message);
            }
            return;
        }

        $locale = $this->option('locale') ?: $this->getDefaultLocale();
        $fileName = $locale . '.json';

        $template = Lang::load($theme, $fileName);
        $content = $template ? (json_decode($template->content ?: '{}', true) ?: []) : [];

        $addedCount = 0;
        foreach ($messages as $message) {
            if (!array_key_exists($message, $content)) {
                $content[$message] = '';
                $addedCount++;
            }
        }

        if (!$addedCount) {
            $this->info(sprintf('No new messages for lang/%s.', $fileName));
            return;
        }

        if (!$template) {
            $template = new Lang($theme);
        }

        $template->fill([
            'fileName' => $fileName,
            'content' => json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n"
        ]);

        $template->save();

        $this->info(sprintf('Added %d new messages to lang/%s.', $addedCount, $fileName));
    }

    /**
     * getDefaultLocale returns the primary site locale, or English as a fallback
     */
    protected function getDefaultLocale(): string
    {
        $primarySite = Site::getPrimarySite();

        return $primarySite && $primarySite->hard_locale ? $primarySite->hard_locale : 'en';
    }
}
