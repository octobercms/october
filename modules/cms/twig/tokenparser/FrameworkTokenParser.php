<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;
use Cms\Twig\Node\FrameworkNode;

/**
 * FrameworkTokenParser for the `{% framework %}` Twig tag.
 *
 * Example usage:
 *     {% framework %}
 *     {% framework extras %}
 *     {% framework turbo %}
 *     {% framework extras turbo %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FrameworkTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return FrameworkNode
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $options = [];

        while (!$stream->test(TwigToken::BLOCK_END_TYPE)) {
            if ($stream->test(TwigToken::NAME_TYPE)) {
                $options[] = strtolower(trim($stream->next()->getValue()));
            }
            else {
                throw new TwigErrorSyntax(
                    sprintf('Invalid syntax in the framework tag. Line %s', $lineno),
                    $stream->getCurrent()->getLine(),
                    $stream->getSourceContext()
                );
            }
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new FrameworkNode($options, $lineno, $this->getTag());
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'framework';
    }
}
