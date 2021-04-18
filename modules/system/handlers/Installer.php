<?php namespace System\Handlers;

use Url;
use View;
use Config;
use Redirect;
use System\Classes\UpdateManager;
use October\Rain\Process\Composer as ComposerProcess;
use Illuminate\Routing\Controller as ControllerBase;
use Exception;

class Installer extends ControllerBase
{
    use \System\Traits\SetupHelper;

    protected $lastError;

    /**
     * Route: /
     */
    public function placeholder()
    {
        return View::make('system::placeholder');
    }

    /**
     * Route: /
     */
    public function index()
    {
        try {
            if ($selected = get('locale')) {
                if (!$this->checkEnvWritable()) {
                    throw new Exception('Cannot write to .env file!');
                }

                if (!env('APP_KEY')) {
                    $this->setEnvVar('APP_KEY', $this->getRandomKey());
                }

                $this->setEnvVar('APP_LOCALE', $selected);
                return Redirect::to('check');
            }
        }
        catch (Exception $ex) {
            $this->lastError = $ex->getMessage();
        }

        return $this->makeLayoutView('system::index', [
            'title' => 'Select Language',
            'locales' => $this->getAvailableLocales()
        ]);
    }

    /**
     * Route: /check
     */
    public function check()
    {
        $requirements = array_filter([
            'composer'         => !$this->composerInstalled(),
            'cache-path'       => !is_writable(cache_path()),
            'pdo-library'      => !defined('PDO::ATTR_DRIVER_NAME'),
            'mbstring-library' => !extension_loaded('mbstring'),
            'fileinfo-library' => !extension_loaded('fileinfo'),
            'ssl-library'      => !extension_loaded('openssl'),
            'gd-library'       => !extension_loaded('gd'),
            'curl-library'     => !function_exists('curl_init') && defined('CURLOPT_FOLLOWLOCATION'),
            'zip-library'      => !class_exists('ZipArchive'),
        ]);

        if (count($requirements) === 0) {
            return Redirect::to('setup');
        }

        return $this->makeLayoutView('system::check', [
            'title' => 'Check Requirements',
            'requirements' => $requirements
        ]);
    }

    /**
     * Route: /setup
     */
    public function setup()
    {
        try {
            if (post('postback')) {
                $dbType = post('db_type', 'sqlite');
                $dbName = $dbType === 'sqlite' ? post('db_filename') : post('db_name');

                $this->checkDatabase(
                    $dbType,
                    post('db_host'),
                    post('db_port'),
                    $dbName,
                    post('db_user'),
                    post('db_pass')
                );

                if ($dbType === 'sqlite') {
                    $this->setEnvVars([
                        'BACKEND_URI'   => post('backend_uri', '/backend'),
                        'APP_URL'       => Url::to(''),
                        'DB_CONNECTION' => $dbType,
                        'DB_DATABASE'   => $dbName,
                    ]);
                }
                else {
                    $this->setEnvVars([
                        'BACKEND_URI'   => post('backend_uri', '/backend'),
                        'APP_URL'       => Url::to(''),
                        'DB_CONNECTION' => $dbType,
                        'DB_HOST'       => post('db_host'),
                        'DB_PORT'       => post('db_port'),
                        'DB_DATABASE'   => $dbName,
                        'DB_USERNAME'   => post('db_user'),
                        'DB_PASSWORD'   => post('db_pass'),
                    ]);
                }

                return Redirect::to('project');
            }
        }
        catch (Exception $ex) {
            $this->lastError = $ex->getMessage();
        }

        return $this->makeLayoutView('system::setup', [
            'title' => 'Configuration'
        ]);
    }

    /**
     * Route: /project
     */
    public function project()
    {
        try {
            if (post('postback')) {
                $licenceKey = trim(post('license_key'));

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

                return Redirect::to('install');
            }
        }
        catch (Exception $ex) {
            $this->lastError = $ex->getMessage();
        }

        return $this->makeLayoutView('system::project', [
            'title' => 'Installation',
        ]);
    }

    /**
     * Route: /install
     */
    public function install()
    {
        return $this->makeLayoutView('system::install', [
            'title' => 'Installation',
            'backendUrl' => Url::to(Config::get('backend.uri', 'backend'))
        ]);
    }

    /**
     * makeLayoutView renders a view wrapped in a layout
     */
    protected function makeLayoutView($name, $vars)
    {
        return View::make('system::layout', [
            '_layoutName' => $name,
            '_layoutVars' => $vars,
            'error' => $this->lastError,
        ] + $vars);
    }
}
