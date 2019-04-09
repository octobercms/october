<?php namespace Cms\Twig;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;

/**
 * Parser for the `{% scripts %}` Twig tag.
 *
 *     {% scripts %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ScriptsTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param TwigToken $token A TwigToken instance
     * @return Twig\Node\Node A Twig\Node\Node instance
     */
    public function parse(TwigToken $token)
    {
        $stream = $this->parser->getStream();
        $stream->expect(TwigToken::BLOCK_END_TYPE);
        return new ScriptsNode($token->getLine(), $this->getTag());
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'scripts';
    }
}
