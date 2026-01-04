<?php namespace System\Console;

use DOMDocument;
use DOMXPath;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use SebastianBergmann\Environment\Console;
use Symfony\Component\Process\Exception\ProcessSignaledException;
use Symfony\Component\Process\Exception\RuntimeException;
use Symfony\Component\Process\Process;
use System\Classes\PluginManager;

/**
 * PluginTest command
 */
class PluginTest extends Command
{
    /**
     * @var string signature for the console command.
     */
    protected $signature = 'plugin:test
        {namespace : App or Plugin Namespace. <info>(eg: Acme.Blog)</info>}
        {--without-tty : Disable output to TTY}
        {--p|parallel : Run the tests in parallel}';

    /**
     * @var string description for the console command.
     */
    protected $description = 'Run unit tests for an October CMS plugin';

    /**
     * configure command to ignore unknown options (allows passing PHPUnit/Pest options directly)
     */
    protected function configure(): void
    {
        parent::configure();

        $this->ignoreValidationErrors();
    }

    /**
     * handle executes the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if (!$this->isValidNamespace()) {
            $name = $this->pluginCode();
            return $this->output->error("Unable to find plugin [{$name}]");
        }

        $options = array_slice($_SERVER['argv'], $this->option('without-tty') ? 4 : 3);

        $command = array_merge(
            $this->binary(),
            $this->option('parallel') ? $this->paratestArguments($options) : $this->phpunitArguments($options)
        );

        $process = (new Process($command, null, $this->env()))->setTimeout(null);

        try {
            if (!$this->option('without-tty')) {
                $process->setTty(true);
            }
        }
        catch (RuntimeException $e) {
            // TTY not supported on Windows, colors handled via --colors flag
        }

        try {
            return $process->run(function ($type, $line) {
                $this->output->write($line);
            });
        }
        catch (ProcessSignaledException $e) {
            if (extension_loaded('pcntl') && $e->getSignal() !== SIGINT) {
                throw $e;
            }
        }
    }

    /**
     * binary of PHP to execute.
     */
    protected function binary(): array
    {
        $pestPath = base_path('vendor/pestphp/pest/bin/pest');
        $paratestPath = base_path('vendor/brianium/paratest/bin/paratest');
        $phpunitPath = 'vendor/phpunit/phpunit/phpunit';

        if ($this->usingPest()) {
            $binary = $this->option('parallel')
                ? [$pestPath, '--parallel']
                : [$pestPath];
        } else {
            $binary = $this->option('parallel')
                ? [$paratestPath]
                : [$phpunitPath];
        }

        if (PHP_SAPI === 'phpdbg') {
            return array_merge([PHP_BINARY, '-qrr'], $binary);
        }

        return array_merge([PHP_BINARY], $binary);
    }

    /**
     * usingPest determines if Pest is being used.
     */
    protected function usingPest(): bool
    {
        return function_exists('\Pest\version');
    }

    /**
     * phpunitArguments gets the array of arguments for running PHPUnit.
     */
    protected function phpunitArguments(array $options): array
    {
        $options = array_values(array_filter($options, function ($option) {
            return !Str::startsWith($option, '--env=')
                && $option !== '--without-tty'
                && $option !== '--ansi'
                && $option !== '--no-ansi'
                && $option !== '-q'
                && $option !== '--quiet'
                && $option !== '-p'
                && $option !== '--parallel';
        }));

        return array_merge($this->commonArguments(), ['--configuration='.$this->getTestConfigurationFile()], $options);
    }

    /**
     * paratestArguments gets the array of arguments for running ParaTest.
     */
    protected function paratestArguments(array $options): array
    {
        $options = array_values(array_filter($options, function ($option) {
            return !Str::startsWith($option, '--env=')
                && $option !== '--without-tty'
                && $option !== '--ansi'
                && $option !== '--no-ansi'
                && $option !== '-q'
                && $option !== '--quiet'
                && $option !== '-p'
                && $option !== '--parallel';
        }));

        return array_merge($this->commonArguments(), ['--configuration='.$this->getTestConfigurationFile()], $options);
    }

    /**
     * commonArguments gets common arguments for PHPUnit/Pest.
     */
    protected function commonArguments(): array
    {
        $args = [];

        if ($this->option('ansi')) {
            $args[] = '--colors=always';
        } elseif ($this->option('no-ansi')) {
            $args[] = '--colors=never';
        } elseif ((new Console)->hasColorSupport()) {
            $args[] = '--colors=always';
        }

        return $args;
    }

    /**
     * getTestConfigurationFile
     */
    protected function getTestConfigurationFile()
    {
        $lookupMethod = $this->isAppNamespace() ? 'app_path' : [$this, 'pluginPath'];

        $file = $lookupMethod('phpunit.xml');
        if (!file_exists($file)) {
            $file = $lookupMethod('phpunit.xml.dist');
        }

        return $file;
    }

    /**
     * env gets the PHP binary environment variables.
     */
    protected function env(): array|null
    {
        $document = new DomDocument;
        $document->loadXML(file_get_contents($this->getTestConfigurationFile()));
        $vars = (new DOMXPath($document))->query('php/env');

        $env = [];
        foreach ($vars as $var) {
            $env[$var->getAttribute('name')] = $var->getAttribute('value');
        }
        return $env;
    }

    protected function isAppNamespace(): bool
    {
        return mb_strtolower(trim($this->argument('namespace'))) === 'app';
    }

    protected function isValidNamespace(): bool
    {
        if ($this->isAppNamespace()) {
            return true;
        }

        return PluginManager::instance()->hasPlugin($this->pluginCode());
    }

    protected function pluginPath($path = ''): string
    {
        return PluginManager::instance()->getPluginPath($this->pluginCode()) . '/' . $path;
    }

    protected function pluginCode(): string
    {
        return PluginManager::instance()->normalizeIdentifier($this->argument('namespace'));
    }
}
