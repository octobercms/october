<?php namespace Cms\Twig\TokenParser;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Cms\Twig\Node\PropsNode;

/**
 * PropsTokenParser for the `{% props %}` Twig tag.
 *
 * Declares which parameters are props (component data) vs attributes
 * (HTML pass-through). Parameters not listed in props flow into
 * an `attributes` variable (ComponentAttributeBag).
 *
 * Example usage:
 *
 *     {% props {title: null, size: 'md'} %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PropsTokenParser extends TwigTokenParser
{
    /**
     * parse a token and returns a node.
     * @return PropsNode
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        // Parse the hash expression: {title: null, size: 'md'}
        $propsExpression = $this->parser->parseExpression();

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new PropsNode($propsExpression, $lineno, $this->getTag());
    }

    /**
     * getTag returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'props';
    }
}
