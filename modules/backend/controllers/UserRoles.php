<?php namespace Backend\Controllers;

use Config;
use Backend;
use BackendAuth;
use Backend\Models\UserRole;
use Backend\Classes\SettingsController;
use ForbiddenException;

/**
 * UserRoles controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class UserRoles extends SettingsController
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = 'config_list.yaml';

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['admins.roles'];

    /**
     * @var string settingsItemCode determines the settings code
     */
    public $settingsItemCode = 'adminroles';

    /**
     * onImpersonateRole
     */
    public function onImpersonateRole($roleId = null)
    {
        if ($role = $this->formFindModelObject($roleId)) {
            BackendAuth::impersonateRole($role);
        }

        return Backend::redirect('');
    }

    /**
     * listExtendQuery
     */
    public function listExtendQuery($query)
    {
        $this->applyRankPermissionsToQuery($query);
    }

    /**
     * formExtendQuery
     */
    public function formExtendQuery($query)
    {
        $this->applyRankPermissionsToQuery($query);
    }

    /**
     * listBeforeReorderStructure blocks reorder posts that reference roles the
     * caller is not authorized to manage
     */
    public function listBeforeReorderStructure($record)
    {
        $ids = array_filter(array_merge(
            [$record->getKey()],
            (array) post('sort_orders', []),
            (array) post('root_sort_orders', [])
        ));

        if (!$ids) {
            return;
        }

        $query = UserRole::whereIn('id', $ids);
        $this->applyRankPermissionsToQuery($query);

        $authorizedIds = $query->pluck('id')->all();
        if (array_diff(array_unique($ids), $authorizedIds)) {
            throw new ForbiddenException;
        }
    }

    /**
     * applyRankPermissionsToQuery
     */
    protected function applyRankPermissionsToQuery($query)
    {
        // Super users have no restrictions
        if ($this->user->isSuperUser()) {
            return;
        }

        // Fetch user role, including impersonation
        $userRole = $this->user->getRoleImpersonation() ?: $this->user->role;

        // User has no role and therefore cannot manage roles
        if (!$userRole || !$userRole->sort_order) {
            $query->whereRaw('1 = 2');
            return;
        }

        $query->where(
            'sort_order',
            $this->allowPeerManagement() ? '>=' : '>',
            $userRole->sort_order
        );
    }

    /**
     * allowPeerManagement returns true if users can manage other peers
     */
    public function allowPeerManagement(): bool
    {
        return Config::get('backend.user_peer_management', false);
    }
}
