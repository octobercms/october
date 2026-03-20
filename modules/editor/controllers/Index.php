<?php namespace Editor\Controllers;

use Request;
use Response;
use BackendMenu;
use SystemException;
use Backend\Classes\Controller;
use Backend\Models\BrandSetting;
use Editor\Classes\ExtensionManager;
use October\Rain\Exception\ValidationException;

/**
 * Editor index controller
 *
 * @package october\editor
 * @author Alexey Bobkov, Samuel Georges
 */
class Index extends Controller
{
    use \Backend\Traits\InspectableContainer;

    /**
     * @var array requiredPermissions
     */
    public $requiredPermissions = ['editor'];

    /**
     * @var array implement
     */
    public $implement = [
        \Editor\Behaviors\StateManager::class
    ];

    /**
     * @var bool turboRouter
     */
    public $turboRouter = false;

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Editor', 'editor');

        $this->bodyClass = 'compact-container editor-page backend-document-layout';
        $this->pageTitle = 'editor::lang.plugin.name';
    }

    /**
     * index
     */
    public function index()
    {
        $this->addCss('/modules/editor/assets/css/editor.css');
        $this->addJs('/modules/editor/assets/js/editor.page.js', ['type' => 'module']);

        $this->registerVueComponent(\Backend\VueComponents\Document::class);
        $this->registerVueComponent(\Backend\VueComponents\Tabs::class);
        $this->registerVueComponent(\Backend\VueComponents\TreeView::class);
        $this->registerVueComponent(\Backend\VueComponents\Splitter::class);
        $this->registerVueComponent(\Backend\VueComponents\Modal::class);
        $this->registerVueComponent(\Backend\VueComponents\Inspector::class);
        $this->registerVueComponent(\Backend\VueComponents\Uploader::class);

        $this->registerVueComponent(\Editor\VueComponents\EditorConflictResolver::class);
        $this->registerVueComponent(\Editor\VueComponents\Application::class);

        $extensionManager = ExtensionManager::instance();
        $jsFiles = $extensionManager->listJsFiles();
        foreach ($jsFiles as $jsFile) {
            $this->addJs($jsFile, ['type' => 'module']);
        }

        $componentClasses = $extensionManager->listVueComponents();
        foreach ($componentClasses as $componentClass) {
            $this->registerVueComponent($componentClass);
        }

        $directEditDocument = Request::query('document');
        if (strlen($directEditDocument)) {
            $this->vars['hideMainMenu'] = true;
        }

        $this->vars['customLogo'] = BrandSetting::getLogo();

        $this->vars['initialState'] = $this->makeInitialState([
            'directModeDocument' => $directEditDocument,
            'openDocument' => Request::query('open')
        ]);
    }

    /**
     * index_onCommand
     */
    public function index_onCommand()
    {
        $extension = post('extension');
        if (!is_scalar($extension) || !strlen($extension)) {
            throw new SystemException('Missing extension name');
        }

        $command = post('command');
        if (!is_scalar($command) || !strlen($command)) {
            throw new SystemException('Missing command');
        }

        return ExtensionManager::instance()->runCommand($extension, $command, $this);
    }

    /**
     * onListExtensionNavigatorSections
     */
    public function onListExtensionNavigatorSections()
    {
        $namespace = post('extension');
        if (!is_scalar($namespace) || !strlen($namespace)) {
            throw new SystemException('Missing extension namespace');
        }

        $documentType = post('documentType');
        if ($documentType && !is_scalar($documentType)) {
            throw new SystemException('Invalid document type');
        }

        if ($namespace !== '*') {
            $extension = ExtensionManager::instance()->getExtensionByNamespace($namespace);
            $namespace = $extension->getNamespaceNormalized();

            return [
                'sections' => $this->listExtensionNavigatorSections($extension, $namespace, $documentType)
            ];
        }

        $result = [];
        $extensions = ExtensionManager::instance()->listExtensions();
        foreach ($extensions as $extension) {
            $namespace = $extension->getNamespaceNormalized();
            $result[$namespace] = $this->listExtensionNavigatorSections($extension, $namespace, $documentType);
        }

        return ['multiSections' => $result];
    }
}
