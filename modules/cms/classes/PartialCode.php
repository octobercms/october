<?php namespace Cms\Classes;

/**
 * Parent class for PHP classes created for partial PHP sections.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PartialCode extends CodeBase
{
    public function getParam($attr) {
        $params = $this->getParams();

        if(isset($params[$attr])) {
            return $params[$attr];
        } else {
            return null;
        }
    }

    public function getParams() {
        return $this->controller->vars["this"]["partial"]["vars"];
    }
}
