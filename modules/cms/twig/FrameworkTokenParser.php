<?php namespace Cms\Twig;

use Twig_Token;
use Twig_TokenParser;

/**
 * Parser for the `{% framework %}` Twig tag.
 *
 *     {% framework %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FrameworkTokenParser extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     * @return Twig_NodeInterface A Twig_NodeInterface instance
     */
    public function parse(Twig_Token $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $name = null;
        if ($token = $stream->nextIf(Twig_Token::NAME_TYPE)) {
            $name = $token->getValue();
        }

        $stream->expect(Twig_Token::BLOCK_END_TYPE);
        return new FrameworkNode($name, $lineno, $this->getTag());
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'framework';
    }
}
