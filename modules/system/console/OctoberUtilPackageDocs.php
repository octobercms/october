<?php namespace System\Console;

use Yaml;
use File;

/**
 * OctoberUtilPackageDocs compiles a documentation file for the October CMS website
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait OctoberUtilPackageDocs
{
    /**
     * utilCompileDocs
     */
    protected function utilCompileDocs()
    {
        $input = $this->option('value');
        if (!$input) {
            $this->comment('Missing theme or plugin name.');
            $input = $this->ask('Enter theme or plugin name');
        }

        if (str_contains($input, '.')) {
            $pluginDir = strtolower(str_replace('.', '/', $input));
            $targetPath = plugins_path("{$pluginDir}/docs/docs.yaml");
        }
        else {
            $themeDir = strtolower($input);
            $targetPath = themes_path("{$themeDir}/docs/docs.yaml");
        }

        if (!file_exists($targetPath)) {
            $nicePath = File::nicePath($targetPath);
            $this->error("Could not find docs file at path: {$nicePath}");
            return;
        }

        $lockFile = dirname($targetPath) . "/docs-lock.json";
        $this->compileDocsInternal($targetPath, $lockFile);

        $niceLockFile = File::nicePath($lockFile);

        $this->line('');
        $this->comment("*** Docs compiled: {$niceLockFile}");
        $this->line('');
        $this->comment("Paste the contents of this file in the Documentation tab on the plugin management page.");
    }

    /**
     * compileDocsInternal
     */
    protected function compileDocsInternal($configFile, $lockFile)
    {
        $config = Yaml::parseFile($configFile);
        $config['content'] = $content = [];

        if (isset($config['navigation'])) {
            $config['navigation'] = $this->compileDocsContentInternal(
                dirname($configFile),
                $config['navigation'],
                $config['content']
            );
        }

        file_put_contents($lockFile, json_encode($config, JSON_PRETTY_PRINT));
    }

    /**
     * compileDocsContentInternal
     */
    protected function compileDocsContentInternal($baseDir, $navArray, &$contentArray)
    {
        foreach ($navArray as &$item) {
            // Process links
            if ($itemLink = $item['link'] ?? '') {
                if (($contentPath = realpath($baseDir . '/' . $itemLink)) && file_exists($contentPath)) {
                    $itemSlug = $this->compileDocsContentLink($itemLink);
                    $item['slug'] = $itemSlug;
                    $contentArray[$itemSlug] = file_get_contents($contentPath);
                }
                unset($item['link']);
            }

            // Process children
            if (isset($item['children'])) {
                $item['children'] = $this->compileDocsContentInternal($baseDir, $item['children'], $contentArray);
            }
        };

        return $navArray;
    }

    /**
     * compileDocsContentLink
     */
    protected function compileDocsContentLink($linkPath)
    {
        return trim(str_replace('.', '', File::anyname($linkPath)), '/');
    }
}
