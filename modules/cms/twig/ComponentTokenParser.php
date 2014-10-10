<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Token;
use Twig_TokenParser;
use Twig_Error_Syntax;

/**
 * Parser for the {% component %} Twig tag.
 *
 * <pre>
 *  {% component "pluginComponent" %}
 * </pre>
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentTokenParser extends Twig_TokenParser
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
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $name = $this->parser->getExpressionParser()->parseExpression();
        $paramNames = [];
        $nodes = [$name];

        $end = false;
        while (!$end) {
            $current = $stream->next();

            switch ($current->getType()) {
                case Twig_Token::NAME_TYPE:
                    $paramNames[] = $current->getValue();
                    $stream->expect(Twig_Token::OPERATOR_TYPE, '=');
                    $nodes[] = $this->parser->getExpressionParser()->parseExpression();
                    break;

                case Twig_Token::BLOCK_END_TYPE:
                    $end = true;
                    break;

                default:
                    throw new Twig_Error_Syntax(
                        sprintf('Invalid syntax in the partial tag. Line %s', $lineno),
                        $stream->getCurrent()->getLine(),
                        $stream->getFilename()
                    );
                    break;
            }
        }

        return new ComponentNode(new Twig_Node($nodes), $paramNames, $token->getLine(), $this->getTag());
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'component';
    }
}
