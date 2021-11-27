<?php namespace Backend\Models;

use Str;
use Mail;
use Event;
use Config;
use Backend;
use October\Rain\Auth\Models\User as UserBase;
use ValidationException;

/**
 * User is an administrator model
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class User extends UserBase
{
    use \October\Rain\Database\Traits\SoftDelete;

    /**
     * @var string table associated with the model
     */
    protected $table = 'backend_users';

    /**
     * @var array rules for validation
     */
    public $rules = [
        'email' => 'required|between:6,255|email|unique:backend_users',
        'login' => 'required|between:2,255|unique:backend_users',
        'password' => 'required:create|between:4,255|confirmed',
        'password_confirmation' => 'required_with:password|between:4,255'
    ];

    /**
     * @var array dates attributes that should be mutated to dates
     */
    protected $dates = [
        'activated_at',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * belongsToMany relation
     */
    public $belongsToMany = [
        'groups' => [UserGroup::class, 'table' => 'backend_users_groups']
    ];

    public $belongsTo = [
        'role' => UserRole::class
    ];

    public $attachOne = [
        'avatar' => \System\Models\File::class
    ];

    /**
     * @var array fillable fields
     * the guarded attribute is @deprecated and should swap to fillable
     */
    // protected $fillable = [
    //     'first_name',
    //     'last_name',
    //     'login',
    //     'email',
    //     'password',
    //     'password_confirmation',
    //     'send_invite',
    // ];

    /**
     * @var array purgeable list of attribute names which should not be saved to the database
     */
    protected $purgeable = ['password_confirmation', 'send_invite'];

    /**
     * @var string loginAttribute
     */
    public static $loginAttribute = 'login';

    /**
     * getFullNameAttribute returns the user's full name
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * getPersistCode gets a code for when the user is persisted to a cookie or session
     * which identifies the user
     * @return string
     */
    public function getPersistCode()
    {
        if (!$this->persist_code || Config::get('backend.force_single_session', false)) {
            return parent::getPersistCode();
        }

        return $this->persist_code;
    }

    /**
     * getAvatarThumb returns the public image file path to this user's avatar
     */
    public function getAvatarThumb($size = 25, $options = null)
    {
        if (is_string($options)) {
            $options = ['default' => $options];
        }
        elseif (!is_array($options)) {
            $options = [];
        }

        // Default is "mm" (Mystery man)
        $default = array_get($options, 'default', 'mm');

        if ($this->avatar) {
            return $this->avatar->getThumb($size, $size, $options);
        }

        return Config::get('backend.avatar_thumb', '//www.gravatar.com/avatar/' .
                    md5(strtolower(trim($this->email))) .
                    '?s='. $size .
                    '&d='. urlencode($default));
    }

    /**
     * beforeValidate event
     */
    public function beforeValidate()
    {
        if ($this->validationForced) {
            return;
        }

        // Will pass if password attribute is dirty
        if ($password = $this->getOriginalHashValue('password')) {
            $this->validatePasswordPolicy($password);
        }
    }

    /**
     * afterCreate event
     */
    public function afterCreate()
    {
        $this->restorePurgedValues();

        if ($this->send_invite) {
            $this->sendInvitation();
        }
    }

    /**
     * afterLogin event
     */
    public function afterLogin()
    {
        parent::afterLogin();

        /**
         * @event backend.user.login
         * Provides an opportunity to interact with the Backend User model after the user has logged in
         *
         * Example usage:
         *
         *     Event::listen('backend.user.login', function ((\Backend\Models\User) $user) {
         *         Flash::success(sprintf('Welcome %s!', $user->getFullNameAttribute()));
         *     });
         *
         */
        Event::fire('backend.user.login', [$this]);
    }

    /**
     * sendInvitation sends an invitation to the user using template "backend::mail.invite"
     */
    public function sendInvitation()
    {
        $data = [
            'name' => $this->full_name,
            'login' => $this->login,
            'password' => $this->getOriginalHashValue('password'),
            'link' => Backend::url('backend'),
        ];

        Mail::send('backend::mail.invite', $data, function ($message) {
            $message->to($this->email, $this->full_name);
        });
    }

    /**
     * getGroupsOptions returns available group options
     */
    public function getGroupsOptions()
    {
        $result = [];

        foreach (UserGroup::all() as $group) {
            $result[$group->id] = [$group->name, $group->description];
        }

        return $result;
    }

    /**
     * getRoleOptions returns available role options
     */
    public function getRoleOptions()
    {
        $result = [];

        foreach (UserRole::all() as $role) {
            $result[$role->id] = [$role->name, $role->description];
        }

        return $result;
    }

    /**
     * createDefaultAdmin inserts a new administrator with the default featureset
     */
    public static function createDefaultAdmin(array $data)
    {
        // Look up default role
        $roleId = UserRole::where('code', UserRole::CODE_DEVELOPER)->first()->id ?? null;

        // Create admin
        $user = new self;
        $user->forceFill([
            'last_name' => array_get($data, 'last_name'),
            'first_name' => array_get($data, 'first_name'),
            'email' => array_get($data, 'email'),
            'login' => array_get($data, 'login'),
            'password' => array_get($data, 'password'),
            'password_confirmation' => array_get($data, 'password_confirmation'),
            'permissions' => [],
            'is_superuser' => true,
            'is_activated' => true,
            'role_id' => $roleId
        ]);
        $user->save();

        // Add to default group
        if ($group = UserGroup::where('code', UserGroup::CODE_OWNERS)->first()) {
            $user->addGroup($group);
        }

        return $user;
    }

    /**
     * validatePasswordPolicy will check the password based on the backend policy
     */
    public function validatePasswordPolicy($password)
    {
        $policy = Config::get('backend.password_policy', []);

        if ($minLength = $policy['min_length'] ?? 4) {
            if (mb_strlen($password) < $minLength) {
                throw new ValidationException(['password' => __('Password must have a minimum of length of :min characters', ['min'=>$minLength])]);
            }
        }

        if ($policy['require_uppercase'] ?? false) {
            if (mb_strtolower($password) === $password) {
                throw new ValidationException(['password' => __('Password must contain at least one uppercase character.')]);
            }
        }

        if ($policy['require_lowercase'] ?? false) {
            if (mb_strtoupper($password) === $password) {
                throw new ValidationException(['password' => __('Password must contain at least one lowercase character.')]);
            }
        }

        if ($policy['require_number'] ?? false) {
            if (!array_filter(str_split($password), 'is_numeric')) {
                throw new ValidationException(['password' => __('Password must contain at least one number.')]);
            }
        }

        if ($policy['require_nonalpha'] ?? false) {
            if (!Str::contains($password, str_split("!@#$%^&*()_+-=[]{}|'"))) {
                throw new ValidationException(['password' => __('Password must contain at least one nonalphanumeric character.')]);
            }
        }

        /**
         * @event user.validatePasswordPolicy
         * Called when the user password is validated against the policy
         *
         * Example usage:
         *
         *     $model->bindEvent('user.validatePasswordPolicy', function (string $password) use ($model) {
         *         throw new ValidationException(['password' => 'Prevent anything from validating ever!']);
         *     });
         *
         */
        $this->fireEvent('user.validatePasswordPolicy', compact('password'));
    }
}
