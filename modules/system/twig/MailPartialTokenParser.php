<?php namespace System\Twig;

use Twig_Node;
use Twig_Token;
use Twig_TokenParser;
use Twig_Error_Syntax;

/**
 * Parser for the `{% partial %}` Twig tag.
 *
 *     {% partial "sidebar" %}
 *
 *     {% partial "sidebar" name='John' %}
 *
 *     {% partial "sidebar" name='John', year=2013 %}
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartialTokenParser extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     * @return Twig_Node A Twig_Node instance
     */
    public function parse(Twig_Token $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $name = $this->parser->getExpressionParser()->parseExpression();
        $paramNames = [];
        $nodes = [$name];
        $hasBody = false;
        $body = null;

        $end = false;
        while (!$end) {
            $current = $stream->next();

            if (
                $current->test(Twig_Token::NAME_TYPE, 'body') &&
                !$stream->test(Twig_Token::OPERATOR_TYPE, '=')
            ) {
                $hasBody = true;
                $current = $stream->next();
            }

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
                        $stream->getSourceContext()
                    );
                    break;
            }
        }

        if ($hasBody) {
            $body = $this->parser->subparse([$this, 'decidePartialEnd'], true);
            $stream->expect(Twig_Token::BLOCK_END_TYPE);
        }

        return new MailPartialNode(new Twig_Node($nodes), $paramNames, $body, $token->getLine(), $this->getTag());
    }

    public function decidePartialEnd(Twig_Token $token)
    {
        return $token->test('endpartial');
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'partial';
    }
}
