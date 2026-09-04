<?php namespace Editor\Classes;

use App;
use Event;
use SystemException;

/**
 * Manages Editor extensions.
 *
 * @package october\editor
 * @author Alexey Bobkov, Samuel Georges
 */
class ExtensionManager
{
    /**
     * @var array extensionClassNames is a collection of registered extensions
     */
    protected $extensionClassNames = [];

    /**
     * @var array extensions registered by this class
     */
    protected $extensions = [];

    /**
     * @var string context is the editor context extensions are listed for
     */
    protected $context = ExtensionBase::CONTEXT_EDITOR;

    /**
     * __construct this class
     */
    public function __construct()
    {
        $this->registerExtensions();
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('editor.extensions');
    }

    /**
     * setContext scopes subsequent list calls to a single editor context, so a host
     * page shows only the extensions registered in it
     */
    public function setContext(string $context)
    {
        $this->context = $context;

        return $this;
    }

    /**
     * getContext returns the current editor context.
     */
    public function getContext(): string
    {
        return $this->context;
    }

    /**
     * listVueComponents returns the Vue components for extensions in the current context.
     */
    public function listVueComponents()
    {
        $result = [];
        foreach ($this->listExtensions() as $extension) {
            $result = array_merge($result, $extension->listVueComponents());
        }

        return $result;
    }

    /**
     * listJsFiles returns the JS files for extensions in the current context.
     */
    public function listJsFiles()
    {
        $result = [];
        foreach ($this->listExtensions() as $extension) {
            $result = array_merge($result, $extension->listJsFiles());
        }

        return $result;
    }

    /**
     * listExtensions returns the registered extensions belonging to the current context
     */
    public function listExtensions()
    {
        $result = [];
        foreach ($this->extensionClassNames as $className) {
            $extension = $this->getExtension($className);

            if ($extension->getEditorContext() !== $this->context) {
                continue;
            }

            $result[] = $extension;
        }

        usort($result, function($a, $b) {
            if ($a->getExtensionSortOrder() >= $b->getExtensionSortOrder()) {
                return 1;
            }

            return -1;
        });

        return $result;
    }

    /**
     * runCommand
     */
    public function runCommand($namespace, $command, $controller)
    {
        $extension = $this->getExtensionByNamespace($namespace);

        return $extension->runCommand($command, $controller);
    }

    /**
     * getExtensionByNamespace looks up an extension by namespace across ALL registered
     * extensions, regardless of the current context
     */
    public function getExtensionByNamespace($namespace)
    {
        foreach ($this->extensionClassNames as $className) {
            $extension = $this->getExtension($className);
            if ($extension->getNamespaceNormalized() == $namespace) {
                return $extension;
            }
        }

        throw new SystemException(sprintf('Cannot find editor extension by namespace: %s', $namespace));
    }

    /**
     * makeExtension will create an extension object from a class name
     */
    protected function makeExtension(string $className)
    {
        if (!class_exists($className)) {
            throw new SystemException(sprintf('Editor extension class not found: %s', $className));
        }

        $extension = new $className();
        if (!$extension instanceof ExtensionBase) {
            throw new SystemException(
                sprintf('Editor extension class must be a descendant of Editor\Classes\ExtensionBase: %s', $className)
            );
        }

        return $extension;
    }

    /**
     * assertNamespaceUnique
     */
    private function assertNamespaceUnique($namespace)
    {
        foreach ($this->extensions as $extension) {
            if ($namespace == $extension->getNamespaceNormalized()) {
                throw new SystemException(sprintf('Editor extension namespace is already in use: %s', $namespace));
            }
        }
    }

    /**
     * getExtension will create and validate an extension object
     */
    protected function getExtension(string $className)
    {
        if (array_key_exists($className, $this->extensions)) {
            return $this->extensions[$className];
        }

        $extension = $this->makeExtension($className);
        $namespace = $extension->getNamespaceNormalized();

        if (!strlen($namespace)) {
            throw new SystemException(sprintf('Editor extension namespace must not be empty: %s', $className));
        }

        $this->assertNamespaceUnique($namespace);

        return $this->extensions[$className] = $extension;
    }

    /**
     * registerExtensions will build a collection of registered extensions
     */
    protected function registerExtensions()
    {
        $apiResult = Event::fire('editor.extension.register');

        if (!is_array($apiResult)) {
            return;
        }

        foreach ($apiResult as $extensionClassName) {
            if (!is_string($extensionClassName)) {
                continue;
            }

            $this->extensionClassNames[] = $extensionClassName;
        }
    }
}
