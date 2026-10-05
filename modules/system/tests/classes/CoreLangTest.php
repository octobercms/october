<?php

class CoreLangTest extends TestCase
{
    public function testValidationTranslator()
    {
        $translator = $this->app['translator'];
        $translator->setLocale('en');

        $validator = Validator::make(
            ['name' => 'me'],
            ['name' => 'required|min:5']
        );

        $this->assertTrue($validator->fails());

        $messages = $validator->messages();
        $this->assertCount(1, $messages);
        $this->assertEquals('The name field must be at least 5 characters.', $messages->all()[0]);
    }

    public function testValidCoreLanguageFiles()
    {
        $translator = $this->app['translator'];
        $locales = $translator->get('system::lang.locale');
        $this->assertNotEmpty($locales);

        $locales = array_keys($locales);
        $modules = ['system', 'backend', 'cms'];
        $files = ['lang.php', 'validation.php', 'client.php'];

        foreach ($modules as $module) {
            foreach ($locales as $locale) {
                foreach ($files as $file) {
                    $srcPath = base_path() . '/modules/'.$module.'/lang/'.$locale.'/'.$file;
                    if (!file_exists($srcPath)) {
                        continue;
                    }
                    $messages = require $srcPath;
                    $this->assertNotEmpty($messages);
                    $this->assertNotCount(0, $messages);
                }

                $jsonPath = base_path() . '/modules/'.$module.'/lang/'.$locale.'.json';
                if (file_exists($jsonPath)) {
                    $jsonOut = json_decode(file_get_contents($jsonPath));
                    $this->assertNotEmpty($jsonOut, "Invalid JSON found in [{$locale}.json] for module [{$module}].");
                }
            }
        }
    }

    /**
     * testTranslationsKeepPlaceholders checks every translation keeps the :placeholders found in its English source.
     */
    public function testTranslationsKeepPlaceholders()
    {
        $errors = [];

        foreach ($this->getTranslationPairs() as [$label, $source, $message]) {
            $errors = array_merge($errors, $this->findMissingPlaceholders($source, $message, $label));
        }

        $this->assertEmpty($errors, count($errors)." translations are missing placeholders:\n".implode("\n", $errors));
    }

    /**
     * testPluralConditionsAreValid checks plural strings only use {n} and [from,to] conditions the message selector can parse.
     */
    public function testPluralConditionsAreValid()
    {
        $errors = [];

        foreach ($this->getTranslationPairs() as [$label, $source, $message]) {
            $errors = array_merge($errors, $this->findInvalidPluralConditions($source, $message, $label));
        }

        $this->assertEmpty($errors, count($errors)." translations have invalid plural conditions:\n".implode("\n", $errors));
    }

    /**
     * getTranslationPairs returns every module translation as a [label, source, message] tuple, where the source is the JSON key or the English PHP string.
     */
    protected function getTranslationPairs(): array
    {
        $pairs = [];

        foreach (glob(base_path('modules/*/lang/*.json')) as $path) {
            $label = basename(dirname($path, 2)).'/lang/'.basename($path);
            $messages = json_decode(file_get_contents($path), true) ?: [];

            foreach ($messages as $source => $message) {
                if (is_string($message)) {
                    $pairs[] = ["{$label} [{$source}]", (string) $source, $message];
                }
            }
        }

        foreach (glob(base_path('modules/*/lang/en/*.php')) as $sourcePath) {
            $module = basename(dirname($sourcePath, 3));
            $file = basename($sourcePath);
            $sources = Arr::dot(require $sourcePath);

            foreach (glob(base_path("modules/{$module}/lang/*/{$file}")) as $path) {
                $label = $module.'/lang/'.basename(dirname($path)).'/'.$file;

                foreach (Arr::dot(require $path) as $key => $message) {
                    if (isset($sources[$key]) && is_string($sources[$key]) && is_string($message)) {
                        $pairs[] = ["{$label} [{$key}]", $sources[$key], $message];
                    }
                }
            }
        }

        return $pairs;
    }

    /**
     * findInvalidPluralConditions returns an error for each segment of a conditional plural string that fails the message selector's condition pattern.
     */
    protected function findInvalidPluralConditions(string $source, string $message, string $label): array
    {
        if (!str_contains($source, '|') || !preg_match('/^[\{\[]/', $source)) {
            return [];
        }

        $errors = [];
        foreach ([$source, $message] as $string) {
            $segments = explode('|', $string);
            if (count($segments) < 2) {
                continue;
            }

            foreach ($segments as $segment) {
                if (!preg_match('/^[\{\[][-?\d|*,\.*]*[\}\]]/', $segment)) {
                    $errors[] = "{$label} has an invalid plural condition in [{$segment}]";
                }
            }
        }

        return $errors;
    }

    /**
     * findMissingPlaceholders returns an error for each source placeholder the message drops, matching case-insensitively like the translator.
     */
    protected function findMissingPlaceholders(string $source, string $message, string $label): array
    {
        preg_match_all('/:([a-zA-Z_][a-zA-Z0-9_]*)/', $source, $matches);

        $errors = [];
        foreach (array_unique($matches[1]) as $name) {
            if (stripos($message, ':'.$name) === false) {
                $errors[] = "{$label} is missing :{$name}";
            }
        }

        return $errors;
    }
}
