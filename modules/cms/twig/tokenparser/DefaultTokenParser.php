<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Cms\Twig\Node\DefaultNode;

/**
 * DefaultTokenParser for the `{% default %}` Twig tag.
 *
 * Example usage:
 *
 *     {% put head %}
 *         <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *         {% default %}
 *     {% endput %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class DefaultTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return DefaultNode
     */
    public function parse(TwigToken $token)
    {
        $stream = $this->parser->getStream();
        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new DefaultNode([], [], $token->getLine());
    }

    /**
     * Gets the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'default';
    }
}
