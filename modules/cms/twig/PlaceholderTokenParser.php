<?php namespace Cms\Twig;

use Twig_Token;
use Twig_TokenParser;

/**
 * Parser for the {% placeholder %} Twig tag.
 *
 * <pre>
 *  {% placeholder head %}
 *
 *  or - use default placeholder content
 *
 *  {% placeholder head %}
 *    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *  {% endshowblock %}
 * </pre>
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PlaceholderTokenParser extends Twig_TokenParser
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
        $name = $stream->expect(Twig_Token::NAME_TYPE)->getValue();
        $body = null;

        if ($stream->test(Twig_Token::NAME_TYPE, 'default')) {
            $stream->next();
            $stream->expect(Twig_Token::BLOCK_END_TYPE);
            $body = $this->parser->subparse([$this, 'decidePlaceholderEnd'], true);
            $stream->expect(Twig_Token::BLOCK_END_TYPE);
        } else {
            $stream->expect(Twig_Token::BLOCK_END_TYPE);
        }

        return new PlaceholderNode($name, $body, $token->getLine(), $this->getTag());
    }

    public function decidePlaceholderEnd(Twig_Token $token)
    {
        return $token->test('endplaceholder');
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'placeholder';
    }
}