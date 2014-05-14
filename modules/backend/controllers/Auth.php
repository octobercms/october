<?php namespace Backend\Controllers;

use Mail;
use Flash;
use Backend;
use Redirect;
use Validator;
use BackendAuth;
use Backend\Models\User;
use Backend\Classes\Controller;
use System\Classes\VersionManager;
use System\Classes\ApplicationException;
use October\Rain\Support\ValidationException;
use Exception;

/**
 * Authentication controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Auth extends Controller
{
    protected $publicActions = ['index', 'signin', 'signout', 'restore', 'reset'];

    public function __construct()
    {
        parent::__construct();
        $this->layout = 'auth';
    }

    /**
     * Default route, redirects to signin.
     */
    public function index()
    {
        return Redirect::to(Backend::url('backend/auth/signin'));
    }

    /**
     * Displays the log in page.
     */
    public function signin()
    {
        $this->bodyClass = 'signin';

        try {
            if (post('postback'))
                return $this->signin_onSubmit();
            else
                $this->bodyClass .= ' preload';
        }
        catch (Exception $ex) {
            Flash::error($ex->getMessage());
        }
    }

    public function signin_onSubmit()
    {
        $rules = [
            'login'    => 'required|min:2|max:32',
            'password' => 'required|min:2'
        ];

        $validation = Validator::make(post(), $rules);
        if ($validation->fails())
            throw new ValidationException($validation);

        // Authenticate user
        $user = BackendAuth::authenticate([
            'login' => post('login'),
            'password' => post('password')
        ], true);

        // Load version updates
        VersionManager::instance()->updateAll();

        // Redirect to the intended page after successful sign in
        return Redirect::intended(Backend::url('backend'));
    }

    /**
     * Logs out a backend user.
     */
    public function signout()
    {
        BackendAuth::logout();
        return Redirect::to(Backend::url('backend'));
    }
    
    /**
     * Request a password reset verification code.
     */
    public function restore()
    {
        try {
            if (post('postback'))
                return $this->restore_onSubmit();
        }
        catch (Exception $ex) {
            Flash::error($ex->getMessage());
        }
    }

    public function restore_onSubmit()
    {
        $rules = [
            'login' => 'required|min:2|max:32'
        ];

        $validation = Validator::make(post(), $rules);
        if ($validation->fails())
            throw new ValidationException($validation);

        $user = BackendAuth::findUserByLogin(post('login'));
        if (!$user) {
            throw new ValidationException([
                'login' => trans('backend::lang.account.restore_error', ['login' => post('login')])
            ]);
        }

        Flash::success(trans('backend::lang.account.restore_success'));

        $code = $user->getResetPasswordCode();
        $link = Backend::url('backend/auth/reset/'.$user->id.'/'.$code);

        $data = [
            'name' => $user->full_name,
            'link' => $link,
        ];

        Mail::send('backend::emails.restore', $data, function($message) use ($user)
        {
            $message->to($user->email, $user->full_name)->subject(trans('backend::lang.account.password_reset'));
        });

        return Redirect::to(Backend::url('backend/auth/signin'));
    }

    /**
     * Reset backend user password using verification code.
     */
    public function reset($userId = null, $code = null)
    {
        try {
            if (post('postback'))
                return $this->reset_onSubmit();

            if (!$userId || !$code)
                throw new ApplicationException(trans('backend::lang.account.reset_error'));
        }
        catch (Exception $ex) {
            Flash::error($ex->getMessage());
        }

        $this->vars['code'] = $code;
        $this->vars['id'] = $userId;
    }

    public function reset_onSubmit()
    {
        if (!post('id') || !post('code'))
            throw new ApplicationException(trans('backend::lang.account.reset_error'));

        $rules = [
            'password' => 'required|min:2'
        ];

        $validation = Validator::make(post(), $rules);
        if ($validation->fails())
            throw new ValidationException($validation);

        $code = post('code');
        $user = BackendAuth::findUserById(post('id'));

        if (!$user->checkResetPasswordCode($code))
            throw new ApplicationException(trans('backend::lang.account.reset_error'));

        if (!$user->attemptResetPassword($code, post('password')))
            throw new ApplicationException(trans('backend::lang.account.reset_fail'));

        $user->clearResetPassword();

        Flash::success(trans('backend::lang.account.reset_success'));

        return Redirect::to(Backend::url('backend/auth/signin'));
    }
}