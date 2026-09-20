<?php namespace Backend\Console;

use Backend\Classes\UserFactory;
use Illuminate\Console\Command;
use ValidationException;
use Exception;

/**
 * OctoberAdmin creates a backend administrator
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberAdmin extends Command
{
    /**
     * @var string signature for the console command
     */
    protected $signature = 'october:admin
        {--first-name= : The first name of the backend user.}
        {--last-name= : The last name of the backend user.}
        {--email= : The email address of the backend user.}
        {--login= : The username of the backend user.}
        {--password= : The password of the backend user.}
        {--password-confirmation= : Confirm the password of the backend user.}
        {--default : Create the user as a default administrator.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Create a Backend administrator.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $password = $this->option('password') ?: $this->secret('Password');
        $passwordConfirmation = $this->option('password-confirmation') ?: $password;

        try {
            $user = UserFactory::create(
                data: [
                    'first_name' => $this->option('first-name') ?: $this->ask('First name'),
                    'last_name' => $this->option('last-name') ?: $this->ask('Last name'),
                    'email' => $this->option('email') ?: $this->ask('Email address'),
                    'login' => $this->option('login') ?: $this->ask('Username'),
                    'password' => $password,
                    'password_confirmation' => $passwordConfirmation,
                ],
                createDefaultAdmin: (bool) $this->option('default')
            );
        }
        catch (ValidationException $ex) {
            $this->error($ex->getMessage());
            return 1;
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
            return 1;
        }

        $this->output->success('Administrator created successfully');
        $this->line('Login set to <info>' . $user->login . '</info>.');
    }
}
