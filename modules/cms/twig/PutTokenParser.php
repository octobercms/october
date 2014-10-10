<?php namespace Cms\Twig;

use Twig_Token;
use Twig_TokenParser;

/**
 * Parser for the {% put %} Twig tag.
 *
 * <pre>
 *  {% put head %}
 *    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *  {% endput %}
 *
 * or
 *
 * {% put head %}
 *   <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *   {% default %}
 * {% endput %}
 * </pre>
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PutTokenParser extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     *
     * @return Twig_NodeInterface A Twig_NodeInterface instance
     */
    public function parse(Twig_Token $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();
        $name = $stream->expect(Twig_Token::NAME_TYPE)->getValue();
        $stream->expect(Twig_Token::BLOCK_END_TYPE);
        $body = $this->parser->subparse([$this, 'decidePutEnd'], true);

        $endType = null;
        if ($token = $stream->nextIf(Twig_Token::NAME_TYPE)) {
            $endType = $token->getValue();
        }

        $stream->expect(Twig_Token::BLOCK_END_TYPE);

        return new PutNode($body, $name, $endType, $lineno, $this->getTag());
    }

    public function decidePutEnd(Twig_Token $token)
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
