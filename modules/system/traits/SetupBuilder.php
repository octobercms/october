<?php namespace System\Traits;

use App;
use Str;
use Lang;
use Config;
use Exception;
use System\Classes\UpdateManager;
use October\Rain\Process\Composer as ComposerProcess;
use Dotenv\Dotenv;
use PDOException;
use PDO;

/**
 * SetupBuilder is shared logic for the commands
 */
trait SetupBuilder
{
    /**
     * setupInstallOctober installs October CMS using composer
     */
    protected function setupInstallOctober()
    {
        $requireStr = $this->composerRequireString($this->option('want') ?: null);
        $this->comment("Executing: composer require {$requireStr}");

        $composer = new ComposerProcess;
        $composer->setCallback(function($message) { echo $message; });
        $composer->require($requireStr);

        if ($composer->lastExitCode() !== 0) {
            $this->outputFailedOutro();
            exit(1);
        }

        $this->output->newLine();
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
            throw new Exception('License is unpaid or has expired. Please visit octobercms.com to obtain a license.');
        }

        // Save authentication token
        $projectId = $result['project_id'] ?? null;
        $projectEmail = $result['email'] ?? null;
        $this->setComposerAuth($projectEmail, $projectId);

        // Add October CMS gateway as a composer repo
        $composer = new ComposerProcess;
        $composer->addRepository('octobercms', 'composer', $this->getComposerUrl());
    }

    /**
     * outputIntro displays the introduction output
     */
    protected function outputIntro()
    {
        $message = [
            ".~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~. ",
            "                                                                       ",
            " .d8888b.   .o8888b.   db  .d8888b.  d8888b. d88888b d8888b.  .d88b.   ",
            ".8P    Y8. d8P    Y8   88 .8P    Y8. 88  `8D 88'     88  `8D .8',, `8  ",
            "88      88 8P      oooo88 88      88 88oooY' 88oooo  88oobY' 8. ||  `8 ",
            "88      88 8b      ~~~~88 88      88 88~~~b. 88~~~~  88`8b   8. ||// 8 ",
            "`8b    d8' Y8b    d8   88 `8b    d8' 88   8D 88.     88 `88. `8 || d'  ",
            " `Y8888P'   `Y8888P'   YP  `Y8888P'  Y8888P' Y88888P 88   YD  `.88P'   ",
            "                                                                       ",
            "`=========================== INSTALLATION ===========================' ",
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

        $this->comment('Please migrate the database with the following command');
        $this->output->newLine();
        $this->line("* php artisan october:migrate");
        $this->output->newLine();

        $adminUrl = env('APP_URL') . env('BACKEND_URI');
        $this->comment('Then, open the administration area at this URL');
        $this->output->newLine();
        $this->line("* {$adminUrl}");
    }
}
