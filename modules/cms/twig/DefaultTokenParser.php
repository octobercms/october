<?php namespace Cms\Twig;

use Twig_Token;
use Twig_TokenParser;

/**
 * Parser for the {% default %} Twig tag.
 *
 * <pre>
 *  {% put head %}
 *    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *    {% default %}
 *  {% endput %}
 * </pre>
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class DefaultTokenParser extends Twig_TokenParser
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
        $stream->expect(Twig_Token::BLOCK_END_TYPE);
        return new DefaultNode($token->getLine(), $this->getTag());
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'default';
    }
}
