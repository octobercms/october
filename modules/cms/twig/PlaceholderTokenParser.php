<?php namespace Cms\Twig;

use Twig\Node\Node as TwigNode;
use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;

/**
 * Parser for the `{% placeholder %}` Twig tag.
 *
 *     {% placeholder head %}
 *
 * or - use default placeholder content
 *
 *     {% placeholder head %}
 *         <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *     {% endshowblock %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PlaceholderTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param TwigToken $token A TwigToken instance
     * @return TwigNode A TwigNode instance
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

        return new PlaceholderNode($name, $params, $body, $token->getLine(), $this->getTag());
    }

    public function decidePlaceholderEnd(TwigToken $token)
    {
        return $token->test('endplaceholder');
    }

    protected function loadParams($stream)
    {
        $params = [];

        $end = false;
        while (!$end) {
            $current = $stream->next();

            switch ($current->getType()) {
                case TwigToken::NAME_TYPE:
                    $paramName = $current->getValue();
                    $stream->expect(TwigToken::OPERATOR_TYPE, '=');
                    $current = $stream->next();
                    $params[$paramName] = $current->getValue();
                    break;

                case TwigToken::BLOCK_END_TYPE:
                    $end = true;
                    break;

                default:
                    throw new TwigErrorSyntax(
                        sprintf('Invalid syntax in the placeholder tag. Line %s', $stream->getCurrent()->getLine()),
                        $stream->getCurrent()->getLine(),
                        $stream->getSourceContext()
                    );
                    break;
            }
        }

        return $params;
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
