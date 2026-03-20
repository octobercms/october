<?php namespace System\Console;

use File;
use System;
use Exception;
use System\Models\PluginVersion;

/**
 * OctoberUtilRefitLang is a dedicated class for the refit lang util command
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait OctoberUtilRefitLang
{
    /**
     * @var string refitFinalMessage
     */
    protected $refitFinalMessage;

    /**
     * utilImportCrowdin excepts a directory above the root
     * called "crowdin" with the export data
     */
    protected function utilImportCrowdin()
    {
        $this->comment('Importing crowdin translations.');

        $supplements = [
            'es-es' => 'es'
        ];

        $path = realpath(base_path('../crowdin'));

        foreach (File::directories($path) as $dir) {
            $lang = strtolower(basename($dir));
            if (isset($supplements[$lang])) {
                $lang = $supplements[$lang];
            }

            $modules = '';
            foreach (File::files($dir) as $source) {
                $module = File::anyname(basename($source));
                $destination = base_path("modules/{$module}/lang/{$lang}.json");
                if (file_exists($destination)) {
                    $modules .= $module.' ';
                    $existingArr = json_decode(File::get($destination), true) ?: [];
                    $crowdinArr = json_decode(File::get($source), true) ?: [];
                    $mergedArr = array_merge($existingArr, $crowdinArr);
                    File::put($destination, $this->refitLangJsonEncode($mergedArr));
                }
            }

            $this->comment("{$modules}→ [{$lang}]");
        }
    }

    /**
     * utilLangWipeJson
     */
    protected function utilWipeLangJson()
    {
        $input = $this->option('value');
        if (!$input) {
            $this->comment('Missing language key.');
            $input = $this->ask('Enter JSON language key');
        }

        $modules = System::listModules();
        $locales = $this->refitLangFindLocales();

        foreach ($modules as $module) {
            $fileDir = base_path('modules/'.strtolower($module));
            foreach ($locales as $locale) {
                $this->refitLangJsonDelete($fileDir, $locale, $input);
            }
        }

        foreach (PluginVersion::all() as $plugin) {
            $fileDir = plugins_path(str_replace('.', '/', $plugin->code));
            foreach ($locales as $locale) {
                $this->refitLangJsonDelete($fileDir, $locale, $input);
            }
        }
    }

    /**
     * utilLangWipe
     */
    protected function utilWipeLang()
    {
        $input = $this->option('value');
        if (!$input) {
            $this->comment('Missing language key.');
            $input = $this->ask('Enter PHP language key');
        }

        $this->refitLangInternal($input, false);
    }

    /**
     * utilRefitLang
     */
    protected function utilRefitLang()
    {
        $input = $this->option('value');
        if (!$input) {
            $this->comment('Missing language key.');
            $input = $this->ask('Enter PHP language key');
        }

        $this->refitLangInternal($input);
    }

    /**
     * refitLangInternal
     */
    protected function refitLangInternal($input, $rewrite = true)
    {
        // Ex[author.plugin::lang.some.key]
        $parts = explode('::', $input);

        // Ex[author.plugin]
        $namespace = $parts[0];

        // Ex[lang.some.key]
        $langKey = $parts[1];
        $langParts = explode('.', $langKey);

        // Ex[lang.php]
        $fileName = array_shift($langParts) . '.php';

        // Ex[some.key]
        $arrPath = implode('.', $langParts);

        // Ex[/path/to/plugins/author/plugin]
        if (strpos($namespace, '.') !== false) {
            $fileDir = plugins_path(str_replace('.', '/', $namespace));
        }
        else {
            $fileDir = base_path('modules/'.$namespace);
        }

        // Ex[cs,de,en]
        $dirs = array_map(function($path) {
            return basename($path);
        }, File::directories($fileDir . '/lang'));

        // Rewrite the language key for each lang
        if ($rewrite) {
            foreach ($dirs as $lang) {
                $this->refitLangKeyRewrite($fileDir, $lang, $arrPath);
            }
        }

        // Delete the language key for each lang
        foreach ($dirs as $lang) {
            $this->refitLangPhpDelete($fileDir, $lang, $arrPath);
        }

        $this->comment($this->refitFinalMessage);
    }

    /**
     * refitLangKeyRewrite will add the php lang to the json lang
     */
    protected function refitLangKeyRewrite(string $basePath, string $lang, string $key, ?string $fileName = null)
    {
        if (!$fileName) {
            $fileName = 'lang.php';
        }

        $englishPath = "{$basePath}/lang/en/{$fileName}";
        $englishArr = include($englishPath);

        $legacyPath = "{$basePath}/lang/{$lang}/{$fileName}";
        $legacyArr = include($legacyPath);

        $newPath = "{$basePath}/lang/{$lang}.json";
        $newArr = [];

        if (file_exists($newPath)) {
            $newArr = json_decode(file_get_contents($newPath), true);
        }

        $english = array_get($englishArr, $key);
        if (!$english) {
            throw new Exception("[!!] Missing key for english [{$key}] in [{$englishPath}]");
        }

        $translated = array_get($legacyArr, $key);
        if (!$translated) {
            $this->comment("[{$lang}] Missing key [{$key}] in [{$legacyPath}]");
            return;
        }

        $newArr[$english] = $translated;

        File::put($newPath, $this->refitLangJsonEncode($newArr));

        $this->comment("[{$lang}] → {$english}:{$translated}");

        if ($lang === 'en') {
            $this->comment(PHP_EOL);
            $this->refitFinalMessage = "<?= __(\"{$english}\") ?>";
        }
    }

    /**
     * refitLangJsonDelete will delete the JSON lang key and rewrite the file
     */
    protected function refitLangJsonDelete(string $basePath, string $lang, string $key)
    {
        $jsonPath = "{$basePath}/lang/{$lang}.json";

        if (file_exists($jsonPath)) {
            $newArr = json_decode(file_get_contents($jsonPath), true);
            if (isset($newArr[$key])) {
                unset($newArr[$key]);
                File::put($jsonPath, $this->refitLangJsonEncode($newArr));
                $this->comment("[{$lang}] → {$key} (deleted)");
            }
        }
    }

    /**
     * refitLangPhpDelete will delete the php lang key and rewrite the file
     */
    protected function refitLangPhpDelete(string $basePath, string $lang, string $key, ?string $fileName = null)
    {
        if (!$fileName) {
            $fileName = 'lang.php';
        }

        $legacyPath = "{$basePath}/lang/{$lang}/{$fileName}";

        if (file_exists($legacyPath)) {
            $legacyArr = include($legacyPath);
            if (array_get($legacyArr, $key)) {
                array_forget($legacyArr, $key);
                File::put($legacyPath, '<?php return '.$this->refitVarExportShort($legacyArr, true).';'.PHP_EOL);
                $this->comment("[{$lang}] → {$key} (deleted)");
            }
        }
    }

    /**
     * refitVarExportShort
     */
    protected function refitVarExportShort($data, $return = true)
    {
        $dump = var_export($data, true);

        // Array starts
        $dump = preg_replace('#(?:\A|\n)([ ]*)array \(#i', '[', $dump);

        // Array ends
        $dump = preg_replace('#\n([ ]*)\),#', "\n$1],", $dump);

        // Array empties
        $dump = preg_replace('#=> \[\n\s+\],\n#', "=> [],\n", $dump);

        // Object states
        if (gettype($data) == 'object') {
            $dump = str_replace('__set_state(array(', '__set_state([', $dump);
            $dump = preg_replace('#\)\)$#', "])", $dump);
        }
        else {
            $dump = preg_replace('#\)$#', "]", $dump);
        }

        // 2 char to 4 char indent
        // $dump = str_replace('  ', '    ', $dump);

        if ($return === true) {
            return $dump;
        }
        else {
            echo $dump;
        }
    }

    /**
     * refitLangJsonEncode
     */
    protected function refitLangJsonEncode($newArr)
    {
        $indentFour = json_encode($newArr, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
        $indentTwo = preg_replace('/^(  +?)\\1(?=[^ ])/m', '$1', $indentFour);
        return $indentTwo;
    }

    /**
     * refitLangFindLocales
     */
    protected function refitLangFindLocales()
    {
        return [
            'ar',
            'be',
            'bg',
            'ca',
            'cs',
            'da',
            'de',
            'el',
            'en',
            'en-au',
            'en-ca',
            'en-gb',
            'es',
            'es-ar',
            'et',
            'fa',
            'fi',
            'fr',
            'fr-ca',
            'hu',
            'id',
            'it',
            'ja',
            'ko',
            'lt',
            'lv',
            'nb-no',
            'nn-no',
            'nl',
            'pl',
            'pt-br',
            'pt-pt',
            'ro',
            'ru',
            'sk',
            'sl',
            'sv',
            'th',
            'tr',
            'uk',
            'vn',
            'zh-cn',
            'zh-tw',

            // Alternatives
            'zh-CN',
            'zh-TW',
        ];
    }
}
