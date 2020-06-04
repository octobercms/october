<?php namespace System\Console;

use ApplicationException;
use ZipArchive;
use System\Classes\FileManifest;
use System\Classes\SourceManifest;

class OctoberManifest extends \Illuminate\Console\Command
{
    /**
     * @var string The console command description.
     */
    protected $description = 'Generates a build manifest of October CMS builds.';

    /**
     * @var string The name and signature of the console command.
     */
    protected $signature = 'october:manifest
                            {target : Specifies the target file for the build manifest.}
                            {--minBuild= : Specifies the minimum build number to retrieve from the source.}
                            {--maxBuild= : Specifies the maximum build number to retreive from the source.}';

    /**
     * @var bool Indicates whether the command should be shown in the Artisan command list.
     */
    protected $hidden = true;

    /**
     * @var string Source repository download file.
     */
    protected $sourceBuildFile = 'https://github.com/octobercms/october/archive/v1.0.%d.zip';


    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $minBuild = $this->option('minBuild') ?? 420;
        $maxBuild = $this->option('maxBuild') ?? 9999;

        $targetFile = (substr($this->argument('target'), 0, 1) === '/')
            ? $this->argument('target')
            : getcwd() . '/' . $this->argument('target');

        if (empty($targetFile)) {
            throw new ApplicationException(
                'A target argument must be specified for the generated manifest file.'
            );
        }

        if ($minBuild > $maxBuild) {
            throw new ApplicationException(
                'Minimum build specified is larger than the maximum build specified.'
            );
        }

        if (file_exists($targetFile)) {
            $manifest = new SourceManifest($targetFile);
            $manifestMaxBuild = $manifest->getMaxBuild();

            if ($manifestMaxBuild > $minBuild) {
                $minBuild = $manifestMaxBuild + 1;

                if ($minBuild > $maxBuild) {
                    throw new ApplicationException(
                        'This manifest already contains all requested builds.'
                    );
                }
            }
        } else {
            $manifest = new SourceManifest('', false);
        }

        // Create temporary directory to hold builds
        $buildDir = storage_path('temp/builds/');
        if (!is_dir($buildDir)) {
            mkdir($buildDir, 0775, true);
        }

        for ($build = $minBuild; $build <= $maxBuild; ++$build) {
            // Download version from GitHub
            $this->comment('Processing build ' . $build);
            $this->line('  - Downloading...');

            if (file_exists($buildDir . 'build-' . $build . '.zip') || is_dir($buildDir . $build . '/')) {
                $this->info('  - Already downloaded.');
            } else {
                $zipUrl = sprintf($this->sourceBuildFile, $build);
                $zipFile = @file_get_contents($zipUrl);

                if (empty($zipFile)) {
                    $this->error('  - Not found.');
                    break;
                }

                file_put_contents($buildDir . 'build-' . $build . '.zip', $zipFile);

                $this->info('  - Downloaded.');
            }

            // Extract version
            $this->line('  - Extracting...');
            if (is_dir($buildDir . $build . '/')) {
                $this->info('  - Already extracted.');
            } else {
                $zip = new ZipArchive;
                if ($zip->open($buildDir . 'build-' . $build . '.zip')) {
                    $toExtract = [];
                    $paths = [
                        'october-1.0.' . $build . '/modules/backend/',
                        'october-1.0.' . $build . '/modules/cms/',
                        'october-1.0.' . $build . '/modules/system/',
                    ];

                    // Only get necessary files from the modules directory
                    for ($i = 0; $i < $zip->numFiles; ++$i) {
                        $filename = $zip->statIndex($i)['name'];

                        foreach ($paths as $path) {
                            if (strpos($filename, $path) === 0) {
                                $toExtract[] = $filename;
                                break;
                            }
                        }
                    }

                    if (!count($toExtract)) {
                        $this->error('  - Unable to get valid files for extraction. Cancelled.');
                        exit(1);
                    }

                    $zip->extractTo($buildDir . $build . '/', $toExtract);
                    $zip->close();

                    // Remove ZIP file
                    unlink($buildDir . 'build-' . $build . '.zip');
                } else {
                    $this->error('  - Unable to extract zip file. Cancelled.');
                    exit(1);
                }

                $this->info('  - Extracted.');
            }

            // Determine previous build
            $manifestBuilds = $manifest->getBuilds();
            $previous = null;
            if (count($manifestBuilds)) {
                if (isset($manifestBuilds[$build - 1])) {
                    $previous = $build - 1;
                }
            }

            // Add build to manifest
            $this->line('  - Adding to manifest...');
            $buildManifest = new FileManifest($buildDir . $build . '/october-1.0.' . $build);
            $manifest->addBuild($build, $buildManifest, $previous);
            $this->info('  - Added.');
        }

        // Generate manifest
        $this->comment('Generating manifest...');
        file_put_contents($targetFile, $manifest->generate());

        $this->comment('Completed.');
    }
}
