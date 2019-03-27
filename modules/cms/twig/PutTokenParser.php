<?php namespace Cms\Twig;

use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;

/**
 * Parser for the `{% put %}` Twig tag.
 *
 *     {% put head %}
 *         <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *     {% endput %}
 *
 * or
 *
 *     {% put head %}
 *         <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *         {% default %}
 *     {% endput %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PutTokenParser extends TwigTokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param TwigToken $token A TwigToken instance
     * @return Twig\Node\Node A Twig\Node\Node instance
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();
        $name = $stream->expect(TwigToken::NAME_TYPE)->getValue();
        $stream->expect(TwigToken::BLOCK_END_TYPE);
        $body = $this->parser->subparse([$this, 'decidePutEnd'], true);

        $endType = null;
        if ($token = $stream->nextIf(TwigToken::NAME_TYPE)) {
            $endType = $token->getValue();
        }

        $stream->expect(TwigToken::BLOCK_END_TYPE);

        return new PutNode($body, $name, $endType, $lineno, $this->getTag());
    }

    public function decidePutEnd(TwigToken $token)
    {
        return $token->test('endput');
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'put';
    }
}
