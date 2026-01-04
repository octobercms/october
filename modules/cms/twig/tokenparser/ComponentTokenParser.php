<?php namespace Cms\Twig\TokenParser;

use Twig\Node\Node as TwigNode;
use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;
use Cms\Twig\Node\ComponentNode;

/**
 * ComponentTokenParser for the `{% component %}` Twig tag.
 *
 *     {% component "pluginComponent" %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return TwigNode A TwigNode instance
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $nodes = [];
        $paramNames = [];

        // Parse component name
        $nodes['__component_name'] = $this->parser->parseExpression();

        // Parse parameters
        while (!$stream->test(TwigToken::BLOCK_END_TYPE)) {
            $current = $stream->next();

            if ($current->test(TwigToken::NAME_TYPE)) {
                $paramName = $current->getValue();
                $stream->expect(TwigToken::OPERATOR_TYPE, '=');
                $nodes[$paramName] = $this->parser->parseExpression();
                $paramNames[] = $paramName;
            }
            else {
                throw new TwigErrorSyntax(
                    sprintf('Invalid syntax in the component tag. Line %s', $lineno),
                    $stream->getCurrent()->getLine(),
                    $stream->getSourceContext()
                );
            }
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        // Pass nodes directly without wrapping inside 'nodes'
        return new ComponentNode($nodes, $paramNames, $lineno, $this->getTag());
    }

    /**
     * getTag name associated with this token parser.
     * @return string The tag name
     */
    public function getTag()
    {
        return 'component';
    }
}
