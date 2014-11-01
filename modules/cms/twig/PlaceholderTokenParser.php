<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Token;
use Twig_TokenParser;
use Twig_Error_Syntax;

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
        $params = [];

        if ($stream->test(Twig_Token::NAME_TYPE, 'default')) {
            $stream->next();
            $params = $this->loadParams($stream);

            $body = $this->parser->subparse([$this, 'decidePlaceholderEnd'], true);
            $stream->expect(Twig_Token::BLOCK_END_TYPE);
        }
        else {
            $params = $this->loadParams($stream);
        }

        return new PlaceholderNode($name, $params, $body, $token->getLine(), $this->getTag());
    }

    public function decidePlaceholderEnd(Twig_Token $token)
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
                case Twig_Token::NAME_TYPE:
                    $paramName = $current->getValue();
                    $stream->expect(Twig_Token::OPERATOR_TYPE, '=');
                    $current = $stream->next();
                    $params[$paramName] = $current->getValue();
                    break;

                case Twig_Token::BLOCK_END_TYPE:
                    $end = true;
                    break;

                default:
                    throw new Twig_Error_Syntax(
                        sprintf('Invalid syntax in the placeholder tag. Line %s', $lineno),
                        $stream->getCurrent()->getLine(),
                        $stream->getFilename()
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
