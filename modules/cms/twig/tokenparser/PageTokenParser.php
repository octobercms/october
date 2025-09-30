<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Cms\Twig\Node\PageNode;

/**
 * PageTokenParser for the `{% page %}` Twig tag.
 *
 * Example usage:
 *
 *     {% page %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PageTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return PageNode
     */
    public function parse(TwigToken $token)
    {
        $stream = $this->parser->getStream();
        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new PageNode($token->getLine(), $this->getTag());
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'page';
    }
}
