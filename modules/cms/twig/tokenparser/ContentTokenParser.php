<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;
use Cms\Twig\Node\ContentNode;

/**
 * ContentTokenParser for the `{% content %}` Twig tag.
 *
 * Examples:
 *
 *     {% content "intro.htm" %}
 *     {% content "intro.md" name='John' %}
 *     {% content "intro/txt" name='John', year=2013 %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ContentTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return ContentNode
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $nodes = [];
        $paramNames = [];

        // Parse content name (first argument)
        $nodes['__content_name'] = $this->parser->parseExpression();

        // Parse optional parameters
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
                    sprintf('Invalid syntax in the content tag. Line %s', $lineno),
                    $stream->getCurrent()->getLine(),
                    $stream->getSourceContext()
                );
            }
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        // Pass individual nodes instead of wrapping in a 'nodes' array
        return new ContentNode($nodes, $paramNames, $lineno, $this->getTag());
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'content';
    }
}
