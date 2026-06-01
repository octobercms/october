<?php namespace Backend\Classes;

use October\Rain\Auth\Manager as RainAuthManager;

/**
 * AuthManager is backend authentication manager.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class AuthManager extends RainAuthManager
{
    /**
     * {@inheritdoc}
     */
    protected static $instance;

    /**
     * {@inheritdoc}
     */
    protected $sessionKey = 'admin_auth';

    /**
     * {@inheritdoc}
     */
    protected $userModel = \Backend\Models\User::class;

    /**
     * @var string roleModel class
     */
    protected $roleModel = \Backend\Models\UserRole::class;

    /**
     * {@inheritdoc}
     */
    protected $groupModel = \Backend\Models\UserGroup::class;

    /**
     * {@inheritdoc}
     */
    protected $throttleModel = \Backend\Models\UserThrottle::class;

    /**
     * {@inheritdoc}
     */
    protected $requireActivation = false;

    /**
     * userHasAccess is identical to User::hasAccess
     */
    public function userHasAccess($permissions, $all = true)
    {
        if ($user = $this->getUser()) {
            return $user->hasAccess($permissions, $all);
        }

        return false;
    }

    /**
     * userHasPermission is identical to User::hasPermission
     */
    public function userHasPermission($permissions, $all = true)
    {
        if ($user = $this->getUser()) {
            return $user->hasPermission($permissions, $all);
        }

        return false;
    }

    /**
     * {@inheritdoc}
     */
    protected function createUserModelQuery()
    {
        return parent::createUserModelQuery()->withTrashed();
    }

    /**
     * {@inheritdoc}
     */
    protected function validateUserModel($user)
    {
        if (!$user instanceof $this->userModel) {
            return false;
        }

        if ($user->deleted_at !== null) {
            return false;
        }

        return $user;
    }
}
