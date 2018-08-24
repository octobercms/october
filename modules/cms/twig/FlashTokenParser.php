<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Token;
use Twig_Node_Print;
use Twig_TokenParser;

/**
 * Parser for the {% flash %} Twig tag.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FlashTokenParser extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     *
     * @return Twig_Node A Twig_Node instance
     */
    public function parse(Twig_Token $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        if ($token = $stream->nextIf(Twig_Token::NAME_TYPE)) {
            $name = $token->getValue();
        }
        else {
            $name = 'all';
        }
        $stream->expect(Twig_Token::BLOCK_END_TYPE);

        $body = $this->parser->subparse([$this, 'decideIfEnd'], true);
        $stream->expect(Twig_Token::BLOCK_END_TYPE);

        return new FlashNode($name, $body, $lineno, $this->getTag());
    }

    public function decideIfEnd(Twig_Token $token)
    {
        return $token->test(['endflash']);
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'flash';
    }
}
