<?php namespace System\Traits;

use Lang;
use Exception;
use System\Classes\UpdateManager;
use October\Rain\Composer\Manager as ComposerManager;

/**
 * SetupBuilder is shared logic for the commands
 */
trait SetupBuilder
{
    /**
     * getUpdateWantVersion
     */
    public function getUpdateWantVersion()
    {
        return UpdateManager::WANT_VERSION;
    }

    /**
     * getLang
     */
    public function getLang($key, $vars = [])
    {
        return Lang::get($key, $vars);
    }

    /**
     * setupInstallOctober installs October CMS using composer
     */
    protected function setupInstallOctober()
    {
        $composer = ComposerManager::instance();
        $composer->setOutputCommand($this, $this->input);

        $this->composerRequireCore($composer, $this->option('want') ?: null);
        $this->line('');
    }

    /**
     * composerRequireString returns the composer require string for installing dependencies
     */
    protected function composerRequireCore($composer, $want = null)
    {
        if ($want === null) {
            $composer->require(['october/all' => $this->getUpdateWantVersion()]);
        }
        else {
            $want = $this->processWantString($want);
            $composer->require([
                'october/rain' => $want,
                'october/all' => $want
            ]);
        }
    }

    /**
     * setupSetProject
     */
    protected function setupSetProject($licenceKey)
    {
        $result = UpdateManager::instance()->requestProjectDetails($licenceKey);

        // Check status
        $isActive = $result['is_active'] ?? false;
        if (!$isActive) {
            // License is unpaid or has expired. Please visit octobercms.com to obtain a license.
            throw new Exception(Lang::get('system::lang.installer.license_expired_comment'));
        }

        // Configure composer and save authentication token
        $this->setComposerAuth(
            $result['email'] ?? null,
            $result['project_id'] ?? null
        );
    }

    /**
     * outputIntro displays the introduction output
     */
    protected function outputIntro()
    {
        $message = [
            ".~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~. ",
            "                                                                      ",
            " .d888b.   .o888b.   db  .d888b.  d8888b. d88888b d8888b.  .d88b.     ",
            ".8P   Y8. d8P   Y8   88 .8P   Y8. 88  `8D 88'     88  `8D .8',, `8    ",
            "88     88 8P     oooo88 88     88 88oooY' 88oooo  88oobY' 8. ||  `8   ",
            "88     88 8b     ~~~~88 88     88 88~~~b. 88~~~~  88`8b   8. ||// 8   ",
            "`8b   d8' Y8b   d8   88 `8b   d8' 88   8D 88.     88 `88. `8 || d'    ",
            " `Y888P'   `Y888P'   YP  `Y888P'  Y8888P' Y88888P 88   YD  `.88P'     ",
            "                                                                      ",
            "`=========================== INSTALLATION ==========================' ",
            "",
        ];

        $this->line($message);
    }

    /**
     * outputOutro displays the credits output
     */
    protected function outputOutro()
    {
        $message = [
            ".~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~.",
            "                ,@@@@@@@,                  ",
            "        ,,,.   ,@@@@@@/@@,  .oo8888o.      ",
            "     ,&%%&%&&%,@@@@@/@@@@@@,8888\88/8o     ",
            "    ,%&\%&&%&&%,@@@\@@@/@@@88\88888/88'    ",
            "    %&&%&%&/%&&%@@\@@/ /@@@88888\88888'    ",
            "    %&&%/ %&%%&&@@\ V /@@' `88\8 `/88'     ",
            "    `&%\ ` /%&'    |.|        \ '|8'       ",
            "        |o|        | |         | |         ",
            "        |.|        | |         | |         ",
            "`========= INSTALLATION COMPLETE ========='",
            "",
        ];

        $this->line($message);

        // Please migrate the database with the following command
        $this->comment(Lang::get('system::lang.installer.migrate_database_comment'));
        $this->line('');
        $this->line("* php artisan october:migrate");
        $this->line('');

        $adminUrl = $this->getEnvVar('APP_URL') . $this->getEnvVar('BACKEND_URI');
        // Then, open the administration area at this URL
        $this->comment(Lang::get('system::lang.installer.visit_backend_comment'));
        $this->line('');
        $this->line("* {$adminUrl}");
    }

    /**
     * outputFailedOutro displays the failure message
     */
    protected function outputFailedOutro()
    {
        // Installation Failed
        $this->output->title(Lang::get('system::lang.installer.install_failed_label'));

        // Please try running these commands manually.
        $this->output->error(Lang::get('system::lang.installer.install_failed_comment'));
        $this->line('');

        // Open this application in your browser
        $this->line(Lang::get('system::lang.installer.open_configurator_comment'));
        $this->line('');

        $this->line('-- OR --');
        $this->line('');

        $this->line("* php artisan project:set <LICENSE KEY>");
        $this->line('');

        if ($want = $this->option('want')) {
            $this->line("* php artisan october:build --want=".$want);
        }
        else {
            $this->line("* php artisan october:build");
        }
    }

    /**
     * nonInteractiveCheck will make a calculated guess if the command is running
     * in non interactive mode by how long it takes to execute
     */
    protected function nonInteractiveCheck(): bool
    {
        return (microtime(true) - LARAVEL_START) < 1;
    }
}
