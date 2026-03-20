<?php namespace System\Console;

use Str;
use BackendAuth;
use Backend\Models\User;
use Illuminate\Console\Command;

/**
 * OctoberPasswd changes the password of a backend user
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberPasswd extends Command
{
    /**
     * @var string signature for the console command
     */
    protected $signature = 'october:passwd
        {username? : The username of the backend user.}
        {password? : The new password.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Change the password of a Backend user.';

    /**
     * @var bool displayPassword will show the user their password
     */
    protected $displayPassword = false;

    /**
     * handle executes the console command
     */
    public function handle()
    {
        if (!$username = $this->argument('username')) {
            $username = $this->ask('Username to reset');
        }

        // Lookup user
        $user = User::where('login', $username)->orWhere('email', $username)->first();

        if (!$user) {
            $this->error('The specified user does not exist.');
            return;
        }

        // Determine password
        if (!$password = $this->argument('password')) {
            $password = $this->secret('Enter new password (leave blank for random password)');
        }

        if (!$password) {
            $password = $this->generatePassword();
        }

        // Change password
        $user->password = $password;
        $user->forceSave();

        // Clear throttles
        BackendAuth::clearThrottleForUserId($user->id);

        $this->output->success('Password successfully changed');

        if ($this->displayPassword) {
            $this->line('Password set to <info>' . $password . '</info>.');
        }
    }

    /**
     * generatePassword returns an automatically generated password
     */
    protected function generatePassword(): string
    {
        $this->displayPassword = true;

        return Str::random(22);
    }
}
