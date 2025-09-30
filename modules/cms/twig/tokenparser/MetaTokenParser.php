<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Cms\Twig\Node\MetaNode;

/**
 * MetaTokenParser for the `{% meta %}` Twig tag.
 *
 * Example usage:
 *
 *     {% meta %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MetaTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return MetaNode
     */
    public function parse(TwigToken $token)
    {
        $stream = $this->parser->getStream();
        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new MetaNode($token->getLine(), $this->getTag());
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'meta';
    }
}
