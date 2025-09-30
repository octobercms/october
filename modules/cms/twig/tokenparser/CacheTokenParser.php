<?php namespace Cms\Twig\TokenParser;

use Twig\TokenParser\AbstractTokenParser;
use Twig\Node\Expression\Filter\RawFilter;
use Cms\Twig\Node\CacheNode;
use Twig\Error\SyntaxError;
use Twig\Node\PrintNode;
use Twig\Node\Node;
use Twig\Token;

/**
 * CacheTokenParser
 */
class CacheTokenParser extends AbstractTokenParser
{
    /**
     * Parses a token and returns a node.
     * @return PartialNode
     */
    public function parse(Token $token): Node
    {
        $stream = $this->parser->getStream();
        $key = $this->parser->parseExpression();

        $ttl = null;
        while ($stream->test(Token::NAME_TYPE)) {
            $k = $stream->getCurrent()->getValue();
            if (!in_array($k, ['ttl'], true)) {
                throw new SyntaxError(sprintf('Unknown "%s" configuration.', $k), $stream->getCurrent()->getLine(), $stream->getSourceContext());
            }

            $stream->next();
            $stream->expect(Token::OPERATOR_TYPE, '(');
            $line = $stream->getCurrent()->getLine();
            if ($stream->test(Token::PUNCTUATION_TYPE, ')')) {
                throw new SyntaxError(sprintf('The "%s" modifier takes exactly one argument (0 given).', $k), $line, $stream->getSourceContext());
            }

            $arg = $this->parser->parseExpression();
            if ($stream->test(Token::PUNCTUATION_TYPE, ',')) {
                throw new SyntaxError(sprintf('The "%s" modifier takes exactly one argument (2 given).', $k), $line, $stream->getSourceContext());
            }
            $stream->expect(Token::PUNCTUATION_TYPE, ')');

            if ($k === 'ttl') {
                $ttl = $arg;
            }
        }

        $stream->expect(Token::BLOCK_END_TYPE);
        $body = $this->parser->subparse([$this, 'decideCacheEnd'], true);
        $stream->expect(Token::BLOCK_END_TYPE);

        $body = new CacheNode($key, $ttl, $body, $token->getLine());

        return new PrintNode(new RawFilter($body), $token->getLine());
    }

    /**
     * Determines if the token marks the end of the partial block.
     */
    public function decideCacheEnd(Token $token): bool
    {
        return $token->test('endcache');
    }

    /**
     * Returns the tag name associated with this token parser.
     * @return string
     */
    public function getTag(): string
    {
        return 'cache';
    }
}
