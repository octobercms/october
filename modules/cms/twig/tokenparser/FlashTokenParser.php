<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Cms\Twig\Node\FlashNode;

/**
 * FlashTokenParser for the `{% flash %}` Twig tag.
 *
 * Example usage:
 *     {% flash %}
 *         {{ type }}: {{ message }}
 *     {% endflash %}
 *
 *     {% flash success %}
 *         {{ message }}
 *     {% endflash %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FlashTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return FlashNode
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        // Default flash type is "all"
        $name = 'all';

        if ($stream->test(TwigToken::NAME_TYPE)) {
            $name = $stream->next()->getValue();
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        // Parse body content
        $body = $this->parser->subparse([$this, 'decideIfEnd'], true);
        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new FlashNode($name, $body, $lineno, $this->getTag());
    }

    /**
     * Determines if the token marks the end of the flash block.
     */
    public function decideIfEnd(TwigToken $token)
    {
        return $token->test(['endflash']);
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'flash';
    }
}
