<?php

namespace System\Console;

use System;
use Illuminate\Console\Command;

/**
 * OctoberOptimize optimizes the framework and platform files
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberOptimize extends Command
{
    /**
     * @var string signature of console command
     */
    protected $signature = 'october:optimize
        {--clear : Remove the cached framework and platform files}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Cache the framework and platform files';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        if ($this->option('clear')) {
            $this->handleClear();
            return;
        }

        $this->components->info('Caching the framework and platform files');

        $commands = collect([
            'config' => fn () => $this->callSilent('config:cache') == 0,
            'routes' => fn () => $this->callSilent('route:cache') == 0,
        ]);

        if (System::hasModule('Cms')) {
            $commands->put('theme', fn () => $this->callSilent('theme:cache') == 0);
        }

        $commands->each(fn ($task, $description) => $this->components->task($description, $task));

        $this->newLine();
    }

    /**
     * handleClear removes the cached framework and platform files
     */
    protected function handleClear()
    {
        $this->components->info('Clearing the cached framework and platform files');

        $commands = collect([
            'config' => fn () => $this->callSilent('config:clear') == 0,
            'routes' => fn () => $this->callSilent('route:clear') == 0,
        ]);

        if (System::hasModule('Cms')) {
            $commands->put('theme', fn () => $this->callSilent('theme:clear') == 0);
        }

        $commands->each(fn ($task, $description) => $this->components->task($description, $task));

        $this->newLine();
    }
}
