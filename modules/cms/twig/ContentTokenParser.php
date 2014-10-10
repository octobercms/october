<?php namespace Cms\Twig;

use Twig_Token;
use Twig_TokenParser;

/**
 * Parser for the {% content %} Twig tag.
 *
 * <pre>
 *  {% content "intro.htm" %}
 * </pre>
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ContentTokenParser extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     *
     * @return Twig_NodeInterface A Twig_NodeInterface instance
     */
    public function parse(Twig_Token $token)
    {
        $stream = $this->parser->getStream();
        $name = $this->parser->getExpressionParser()->parseExpression();
        $stream->expect(Twig_Token::BLOCK_END_TYPE);
        return new ContentNode($name, $token->getLine(), $this->getTag());
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'content';
    }
}
