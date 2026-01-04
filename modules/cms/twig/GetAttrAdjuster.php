<?php namespace Cms\Twig;

use Twig\Node\Node;
use Twig\Environment;
use Twig\Node\Expression\GetAttrExpression;
use Twig\NodeVisitor\NodeVisitorInterface;
use Twig\Node\Expression\SupportDefinedTestInterface;
use Cms\Twig\Node\GetAttrNode;

/**
 * GetAttrAdjuster tweaks the get attribute functionality.
 */
class GetAttrAdjuster implements NodeVisitorInterface
{
    /**
     * @inheritdoc
     */
    public function enterNode(Node $node, Environment $env): Node
    {
        if (get_class($node) !== GetAttrExpression::class) {
            return $node;
        }

        $nodes = [
            'node' => $node->getNode('node'),
            'attribute' => $node->getNode('attribute')
        ];

        if ($node->hasNode('arguments')) {
            $nodes['arguments'] = $node->getNode('arguments');
        }

        $isDefinedTest = $node->isDefinedTestEnabled();

        $attributes = [
            'type' => $node->getAttribute('type'),
            'is_defined_test' => $isDefinedTest,
            'ignore_strict_check' => $node->getAttribute('ignore_strict_check'),
            'optimizable' => $node->getAttribute('optimizable'),
        ];

        $getAttrNode = new GetAttrNode($nodes, $attributes, $node->getTemplateLine(), $node->getNodeTag());

        if ($isDefinedTest) {
            $getAttrNode->enableDefinedTest();
        }

        return $getAttrNode;
    }

    /**
     * @inheritdoc
     */
    public function leaveNode(Node $node, Environment $env): ?Node
    {
        return $node;
    }

    /**
     * @inheritdoc
     */
    public function getPriority()
    {
        return 0;
    }
}
