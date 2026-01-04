<?php namespace System\Twig;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;

/**
 * MailPartialTokenParser for the `{% partial %}` Twig tag.
 *
 * Example usage:
 *
 *     {% partial "sidebar" %}
 *     {% partial "sidebar" name='John' %}
 *     {% partial "sidebar" name='John' year=2013 %}
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartialTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return MailPartialNode
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $nodes = [];
        $paramNames = [];
        $hasBody = false;
        $body = null;

        // Parse partial name (first argument)
        $nodes['__partial_name'] = $this->parser->parseExpression();

        // Parse optional parameters
        while (!$stream->test(TwigToken::BLOCK_END_TYPE)) {
            $current = $stream->next();

            if ($current->test(TwigToken::NAME_TYPE, 'body') && !$stream->test(TwigToken::OPERATOR_TYPE, '=')) {
                $hasBody = true;
                continue;
            }

            if ($current->test(TwigToken::NAME_TYPE)) {
                $paramName = $current->getValue();
                $stream->expect(TwigToken::OPERATOR_TYPE, '=');
                $nodes[$paramName] = $this->parser->parseExpression();
                $paramNames[] = $paramName;
            } else {
                throw new TwigErrorSyntax(
                    sprintf('Invalid syntax in the partial tag. Line %s', $lineno),
                    $stream->getCurrent()->getLine(),
                    $stream->getSourceContext()
                );
            }
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        if ($hasBody) {
            $body = $this->parser->subparse([$this, 'decidePartialEnd'], true);
            $stream->expect(TwigToken::BLOCK_END_TYPE);
        }

        return new MailPartialNode($nodes, $paramNames, $body, $lineno);
    }

    /**
     * Determines if the token marks the end of the partial block.
     */
    public function decidePartialEnd(TwigToken $token)
    {
        return $token->test('endpartial');
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'partial';
    }
}
