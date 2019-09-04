<?php namespace Backend\Models;

use Mail;
use Event;
use Backend;
use October\Rain\Network\Http;
use October\Rain\Auth\Models\User as UserBase;

/**
 * Administrator user model
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class User extends UserBase
{
    use \October\Rain\Database\Traits\SoftDelete;

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'backend_users';

    /**
     * Validation rules
     */
    public $rules = [
        'email' => 'required|between:6,255|email|unique:backend_users',
        'login' => 'required|between:2,255|unique:backend_users',
        'password' => 'required:create|between:4,255|confirmed',
        'password_confirmation' => 'required_with:password|between:4,255'
    ];

    /**
     * @var array Attributes that should be cast to dates
     */
    protected $dates = [
        'activated_at',
        'last_login',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Relations
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
     * Purge attributes from data set.
     */
    protected $purgeable = ['password_confirmation', 'send_invite'];

    /**
     * @var string Login attribute
     */
    public static $loginAttribute = 'login';

    /**
     * @return string Returns the user's full name.
     */
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Gets a code for when the user is persisted to a cookie or session which identifies the user.
     * @return string
     */
    public function getPersistCode()
    {
        // Option A: @todo config
        // return parent::getPersistCode();

        // Option B:
        if (!$this->persist_code) {
            return parent::getPersistCode();
        }

        return $this->persist_code;
    }

    /**
     * Returns the public image file path to this user's avatar.
     */
    public function getAvatarThumb($size = 25, $options = null)
    {
        if (is_string($options)) {
            $options = ['default' => $options];
        }
        elseif (!is_array($options)) {
            $options = [];
        }

        if ($this->avatar) {
            return $this->avatar->getThumb($size, $size, $options);
        }

        // If no custom avatar then display the default (Mystery man) image
        return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAgICAgJCAkKCgkNDgwODRMREBARExwUFhQWFBwrGx8bGx8bKyYuJSMlLiZENS8vNUROQj5CTl9VVV93cXecnNEBCAgICAkICQoKCQ0ODA4NExEQEBETHBQWFBYUHCsbHxsbHxsrJi4lIyUuJkQ1Ly81RE5CPkJOX1VVX3dxd5yc0f/CABEIAFoAWgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQYDBAUCB//aAAgBAQAAAAD6KBEiAmCSDJYujrVzUElk6pipkAuWwKbrgtPQPFKggz23P5q/OJh7s3SNerasxKz9MMNO8G3bwOBxDvdwDQqhYuukNamv/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAD//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMQAAAAAAAAAA//xAAyEAACAQEGAwYDCQAAAAAAAAABAgMEAAURICExEiJREBMwQWFxcoGhIyQyMzRAU5Gx/9oACAEBAAE/AP3ccbyuqIuLG1NdUEYBl53+gsIYAMBEgHThFp7upJVPIFbqmlqujlpX4W1U/hYbHwLppwkJmI5nOnooyVNOk8DxtuRy+hsQQSCNc9IAKWnw/jXLVhRVVHDt3jf7nuucS0qoTrGcD7HJNKsMbu2yizMWZmO5OJz09RJTyiRPmOotBMJ4g4Vl9GHYTgCddOmtq+teduAKVRTsdyfXPGjyOqIuLG1Jd0UADOA8nXyGSppIKhMHXm8n87VdJJSylH1Hkw2Oa7aQQRCRh9o/0HTsxyVFPHUwNG2+4PraSNo3ZGGDA4HJQwd9Uxqdhq3sPAvqALIkq+Y4W9xkuSMfeJD0Cj5+BeaB6OTquDD+8ly/ky/HY9nSwyVv6Of4T2//xAAUEQEAAAAAAAAAAAAAAAAAAABQ/9oACAECAQE/ABP/xAAUEQEAAAAAAAAAAAAAAAAAAABQ/9oACAEDAQE/ABP/2Q==';
    }
    
    /**
     * After save event
     * @return void
     */
    public function afterSave($size = 25)
    {
        if ($this->avatar()->exists()) {
           return;
        }

        $avatarRequest = Http::get('http://www.gravatar.com/avatar/' . md5(strtolower(trim($this->email))) . '?s=' . $size . '&d=404');

        if ($avatarRequest->code === 200) {
             $avatar = new System\Models\File();
             $avatar->fromData($avatarRequest->body, $this->email . '-gravatar.jpg');
             $avatar->save();
             $this->avatar()->attach($avatar);
        }
    }

    /**
     * After create event
     * @return void
     */
    public function afterCreate()
    {
        $this->restorePurgedValues();

        if ($this->send_invite) {
            $this->sendInvitation();
        }
    }

    /**
     * After login event
     * @return void
     */
    public function afterLogin()
    {
        parent::afterLogin();
        Event::fire('backend.user.login', [$this]);
    }

    /**
     * Sends an invitation to the user using template "backend::mail.invite".
     * @return void
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

    public function getGroupsOptions()
    {
        $result = [];

        foreach (UserGroup::all() as $group) {
            $result[$group->id] = [$group->name, $group->description];
        }

        return $result;
    }

    public function getRoleOptions()
    {
        $result = [];

        foreach (UserRole::all() as $role) {
            $result[$role->id] = [$role->name, $role->description];
        }

        return $result;
    }
}
