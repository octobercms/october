<?php namespace Backend\Console;

use Validator;
use Backend\Models\User;
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

        $data = [
            'first_name' => $this->option('first-name') ?: $this->ask('First name'),
            'last_name' => $this->option('last-name') ?: $this->ask('Last name'),
            'email' => $this->option('email') ?: $this->ask('Email address'),
            'login' => $this->option('login') ?: $this->ask('Username'),
            'password' => $password,
            'password_confirmation' => $passwordConfirmation,
        ];

        try {
            // Validate user input
            $rules = [
                'first_name' => 'required',
                'last_name' => 'required',
                'email' => 'required|between:6,255|email|unique:backend_users',
                'login' => 'required|between:2,255|unique:backend_users',
                'password' => 'required:create|between:4,255|confirmed',
                'password_confirmation' => 'required_with:password|between:4,255'
            ];

            $validation = Validator::make($data, $rules, [], [
                'first_name' => __('First name'),
                'last_name' => __('Last name'),
                'email' => __('Email'),
                'login' => __('Username'),
                'password' => __('Password'),
                'password_confirmation' => __('Confirm Password'),
            ]);

            if ($validation->fails()) {
                throw new ValidationException($validation);
            }

            // Validate password against policy
            (new User)->validatePasswordPolicy($data['password']);

            // Create user
            if ($this->option('default')) {
                $user = User::createDefaultAdmin($data);
            }
            else {
                $user = new User;
                $user->fill($data);
                $user->save();
            }
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
            return 1;
        }

        $this->output->success('Administrator created successfully');
        $this->line('Login set to <info>' . $user->login . '</info>.');

        return 0;
    }
}
