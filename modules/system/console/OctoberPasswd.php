<?php namespace System\Console;

use Str;
use Backend\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Question\Question;

/**
 * Console command to change the password of a Backend user via CLI.
 *
 * This command may only be run through CLI.
 *
 * @package october\system
 */
class OctoberPasswd extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'october:passwd';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change the password of a Backend user.';

    /**
     * Was the password automatically generated?
     *
     * @var bool
     */
    protected $generatedPassword = false;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Must be in CLI environment
        if (php_sapi_name() !== 'cli') {
            $this->error('This command may only be run through the command-line.');
            exit(1);
        }

        $username = $this->argument('username')
            ?? $this->ask(
                'Which user would you like to change the password for'
            );

        // Check that the user exists
        try {
            $user = User::where('login', $username)
                ->orWhere('email', $username)
                ->firstOrFail();
        } catch (ModelNotFoundException $e) {
            $this->error('The specified user does not exist.');
            exit(1);
        }

        $password = $this->argument('password')
            ?? (
                $this->optionalSecret(
                    'Enter in a new password, or press ENTER to use a generated password',
                    false,
                    false
                ) ?: $this->generatePassword()
            );

        // Change password
        $user->password = $password;
        $user->forceSave();

        if (!$this->generatedPassword) {
            $this->info('Password successfully changed.');
            exit(0);
        }

        $this->info('Password successfully changed.');
        $this->output->writeLn('The new password is <info>' . $password . '</info>.');
        exit(0);
    }

    /**
     * Get the console command options.
     */
    protected function getArguments()
    {
        return [
            ['username', InputArgument::OPTIONAL, 'The username of the Backend user'],
            ['password', InputArgument::OPTIONAL, 'The new password']
        ];
    }

    /**
     * Prompt the user for input but hide the answer from the console.
     *
     * Also allows for a default to be specified.
     *
     * @param  string  $question
     * @param  bool    $fallback
     * @return string
     */
    protected function optionalSecret($question, $fallback = true, $default = null)
    {
        $question = new Question($question, $default);

        $question->setHidden(true)->setHiddenFallback($fallback);

        return $this->output->askQuestion($question);
    }

    /**
     * Generate a password and flag it as an automatically-generated password.
     *
     * @return string
     */
    protected function generatePassword()
    {
        $this->generatedPassword = true;

        return Str::random(14);
    }
}
