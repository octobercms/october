<?php namespace Cms\Twig\TokenParser;

use Twig\Node\Nodes;
use Twig\Token as TwigToken;
use Twig\TokenParser\AbstractTokenParser as TwigTokenParser;
use Twig\Error\SyntaxError as TwigErrorSyntax;
use Cms\Twig\Node\PutNode;

/**
 * PutTokenParser for the `{% put %}` Twig tag.
 *
 * Example usage:
 *
 *     {% put head %}
 *         <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"/>
 *     {% endput %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PutTokenParser extends TwigTokenParser
{
    /**
     * parse a token and returns a node.
     * @return PutNode
     */
    public function parse(TwigToken $token)
    {
        $lineno = $token->getLine();
        $stream = $this->parser->getStream();
        $names = $this->parseAssignmentExpression();

        $capture = false;
        $options = [];

        if ($stream->nextIf(TwigToken::OPERATOR_TYPE, '=')) {
            // Direct assignment mode
            $values = $this->parseMultitargetExpression();
            $stream->expect(TwigToken::BLOCK_END_TYPE);

            if (count($names) !== count($values)) {
                throw new TwigErrorSyntax(
                    'When using put, you must have the same number of variables and assignments.',
                    $stream->getCurrent()->getLine(),
                    $stream->getSourceContext()
                );
            }
        }
        else {
            // Capture mode
            $capture = true;

            if (count($names) > 1) {
                throw new TwigErrorSyntax(
                    'When using put with a block, you cannot have multiple targets.',
                    $stream->getCurrent()->getLine(),
                    $stream->getSourceContext()
                );
            }

            while (!$stream->test(TwigToken::BLOCK_END_TYPE)) {
                $current = $stream->next();
                if ($current->test(TwigToken::NAME_TYPE)) {
                    $options[] = strtolower(trim($current->getValue()));
                }
                else {
                    throw new TwigErrorSyntax(
                        sprintf('Invalid syntax in the put tag. Line %s', $lineno),
                        $stream->getCurrent()->getLine(),
                        $stream->getSourceContext()
                    );
                }
            }

            $stream->expect(TwigToken::BLOCK_END_TYPE);
            $values = $this->parser->subparse([$this, 'decidePutEnd'], true);

            // Deprecated usage: {% endput overwrite %}
            if ($stream->test(TwigToken::NAME_TYPE)) {
                $options[] = $stream->next()->getValue();
            }

            $stream->expect(TwigToken::BLOCK_END_TYPE);
        }

        return new PutNode($capture, $names, $values, $options, $lineno, $this->getTag());
    }

    /**
     * decidePutEnd determines if the token marks the end of the put block.
     */
    public function decidePutEnd(TwigToken $token)
    {
        return $token->test('endput');
    }

    /**
     * getTag returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag()
    {
        return 'put';
    }

    /**
     * parseMultitargetExpression
     */
    protected function parseMultitargetExpression(): Nodes
    {
        $targets = [];

        while (true) {
            $targets[] = $this->parser->parseExpression();
            if (!$this->parser->getStream()->nextIf(TwigToken::PUNCTUATION_TYPE, ',')) {
                break;
            }
        }

        return new Nodes($targets);
    }
}
