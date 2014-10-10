<?php namespace Cms\Classes;

use File;

/**
 * The CMS component partial class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentPartial extends CmsObject
{
    /**
     * @var \Cms\Classes\ComponentBase A reference to the CMS component containing the object.
     */
    protected $component;

    /**
     * Creates an instance of the object and associates it with a CMS component.
     * @param \Cms\Classes\ComponentBase $component Specifies the component the object belongs to.
     */
    public function __construct(ComponentBase $component)
    {
        $this->component = $component;
    }

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'partials';
    }

    /**
     * Returns the full path to the template file corresponding to this object.
     * @return string
     */
    public function getFullPath()
    {
        return static::getFilePath($this->component, $this->fileName);
    }

    /**
     * Returns the absolute file path.
     * @param \Cms\Classes\ComponentBase $component Specifies a component the file belongs to.
     * @param string$fileName Specifies the file name to return the path to.
     * @return string
     */
    public static function getFilePath($component, $fileName)
    {
        $path = $component->getPath().'/'.$fileName;

        /*
         * Check the shared "/partials" directory for the partial
         */
        if (!File::isFile($path)) {
            $sharedDir = dirname($component->getPath()).'/partials';
            $sharedPath = $sharedDir.'/'.$fileName;
            if (File::isFile($sharedPath)) {
                return $sharedPath;
            }
        }

        return $path;
    }
}
