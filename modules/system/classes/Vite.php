<?php namespace System\Classes;

use Illuminate\Foundation\Vite as ViteBase;

/**
 * Vite renders the tags for Vite entry points built inside a directory on disk,
 * such as a theme or a plugin. Laravel's Vite reads the manifest and hot file from
 * public_path(), which only holds them when the directory is mirrored into the
 * public folder, so it fails for a project that commits a public folder and runs
 * from the project root.
 *
 *     (new Vite)
 *         ->useBasePath(themes_path('demo'))
 *         ->useBuildDirectory('assets/dist')
 *         ->createAssetPathsUsing(fn ($path) => url('themes/demo/'.$path))
 *         ->withEntryPoints(['assets/css/theme.css', 'assets/js/app.js'])
 *         ->toHtml();
 *
 * Without a base path it behaves like Laravel's Vite.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Vite extends ViteBase
{
    /**
     * @var string|null basePath is the directory the build directory and hot file are in
     */
    protected $basePath;

    /**
     * useBasePath sets the directory the build directory and hot file are relative to.
     */
    public function useBasePath(string $path): static
    {
        $this->basePath = rtrim($path, '/\\');

        return $this;
    }

    /**
     * hotFile returns the path to the hot file, which the dev server writes to the base path.
     */
    public function hotFile(): string
    {
        if ($this->basePath === null) {
            return parent::hotFile();
        }

        return $this->hotFile ?? $this->basePath.'/hot';
    }

    /**
     * manifestPath returns the path to the manifest file in the build directory.
     */
    protected function manifestPath($buildDirectory): string
    {
        if ($this->basePath === null) {
            return parent::manifestPath($buildDirectory);
        }

        return $this->basePath.'/'.$buildDirectory.'/'.$this->manifestFilename;
    }

    /**
     * publicPath returns the path to a built file, used to read its content.
     */
    protected function publicPath($path): string
    {
        if ($this->basePath === null) {
            return parent::publicPath($path);
        }

        return $this->basePath.'/'.$path;
    }
}
