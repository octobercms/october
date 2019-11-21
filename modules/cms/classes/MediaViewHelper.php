<?php namespace Cms\Classes;

use ApplicationException;

/**
 * Helper class for processing video and audio tags inserted by the Media Manager.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaViewHelper
{
    use \October\Rain\Support\Traits\Singleton;

    protected $playerPartialFlags = [];

    /**
     * Replaces audio and video tags inserted by the Media Manager with players markup.
     * @param string $html Specifies the HTML string to process.
     * @return string Returns the processed HTML string.
     */
    public function processHtml($html)
    {
        if (!is_string($html)) {
            return $html;
        }

        $mediaTags = $this->extractMediaTags($html);
        foreach ($mediaTags as $tagInfo) {
            $pattern = preg_quote($tagInfo['declaration']);
            $generatedMarkup = $this->generateMediaTagMarkup($tagInfo['type'], $tagInfo['src']);
            $html = mb_ereg_replace($pattern, $generatedMarkup, $html);
        }

        return $html;
    }

    protected function extractMediaTags($html)
    {
        $result = [];
        $matches = [];

        $tagDefinitions = [
            'audio' => '/data\-audio\s*=\s*"([^"]+)"/',
            'video' => '/data\-video\s*=\s*"([^"]+)"/'
        ];

        if (preg_match_all('/\<figure\s+[^\>]+\>[^\<]*\<\/figure\>/i', $html, $matches)) {
            foreach ($matches[0] as $mediaDeclaration) {
                foreach ($tagDefinitions as $type => $pattern) {
                    $nameMatch = [];
                    if (preg_match($pattern, $mediaDeclaration, $nameMatch)) {
                        $result[] = [
                            'declaration' => $mediaDeclaration,
                            'type' => $type,
                            'src' => $nameMatch[1]
                        ];
                    }
                }
            }
        }

        return $result;
    }

    protected function generateMediaTagMarkup($type, $src)
    {
        $partialName = $type == 'audio' ? 'oc-audio-player' : 'oc-video-player';

        if ($this->playerPartialExists($partialName)) {
            return Controller::getController()->renderPartial($partialName, ['src' => $src]);
        }

        return $this->getDefaultPlayerMarkup($type, $src);
    }

    protected function playerPartialExists($name)
    {
        if (array_key_exists($name, $this->playerPartialFlags)) {
            return $this->playerPartialFlags[$name];
        }

        $controller = Controller::getController();
        if (!$controller) {
            throw new ApplicationException('Media tags can only be processed for front-end requests.');
        }

        $partial = Partial::loadCached($controller->getTheme(), $name);

        return $this->playerPartialFlags[$name] = !!$partial;
    }

    protected function getDefaultPlayerMarkup($type, $src)
    {
        switch ($type) {
            case 'video':
                return '<video src="'.e($src).'" controls preload="metadata"></video>';
            break;

            case 'audio':
                return '<audio src="'.e($src).'" controls preload="metadata"></audio>';
            break;
        }
    }
}
