<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;
use Cms\Twig\Node\PlaceholderNode;

/**
 * PlaceholderTokenParser for the `{% placeholder %}` Twig tag.
 *
 * Example usage:
 *
 *     {% placeholder head %}
 *
 * Using default content:
 *
 *     {% placeholder head default %}
 *         <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *     {% endplaceholder %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PlaceholderTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return PlaceholderNode
     */
    public function parse(TwigToken $token)
    {
        $stream = $this->parser->getStream();
        $name = $stream->expect(TwigToken::NAME_TYPE)->getValue();
        $body = null;
        $params = [];

        if ($stream->test(TwigToken::NAME_TYPE, 'default')) {
            $stream->next();
            $params = $this->loadParams($stream);

            $body = $this->parser->subparse([$this, 'decidePlaceholderEnd'], true);
            $stream->expect(TwigToken::BLOCK_END_TYPE);
        }
        else {
            $params = $this->loadParams($stream);
        }

        return new PlaceholderNode($body, $name, $params, $token->getLine(), $this->getTag());
    }

    /**
     * Determines if the token marks the end of the placeholder block.
     */
    public function decidePlaceholderEnd(TwigToken $token)
    {
        return $token->test('endplaceholder');
    }

    /**
     * Loads parameters from the stream.
     */
    protected function loadParams($stream)
    {
        $params = [];

        while (!$stream->test(TwigToken::BLOCK_END_TYPE)) {
            $paramName = $stream->expect(TwigToken::NAME_TYPE)->getValue();
            $stream->expect(TwigToken::OPERATOR_TYPE, '=');
            $params[$paramName] = $stream->expect(TwigToken::STRING_TYPE)->getValue();
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);
        return $params;
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'placeholder';
    }
}
