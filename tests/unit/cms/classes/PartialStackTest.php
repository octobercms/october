<?php

use Cms\Classes\PartialStack;

class PartialStackTest extends TestCase
{

    public function testStackPartials()
    {
        $stack = new PartialStack;

        /*
         * Stack em up
         */
        $stack->stackPartial();
            $stack->addComponent('override1', 'October\Tester\Components\MainMenu');
            $stack->addComponent('override2', 'October\Tester\Components\ContentBlock');

            $stack->stackPartial();
                $stack->addComponent('override3', 'October\Tester\Components\Post');
                $stack->addComponent('post', 'October\Tester\Components\Post');

                $stack->stackPartial();
                    $stack->addComponent('mainMenu', 'October\Tester\Components\MainMenu');

        /*
         * Knock em down
         */
        $this->assertEquals('October\Tester\Components\MainMenu', $stack->getComponent('mainMenu'));
        $this->assertEquals('October\Tester\Components\MainMenu', $stack->getComponent('override1'));

        $stack->unstackPartial();

        $this->assertNull($stack->getComponent('mainMenu'));
        $this->assertEquals('October\Tester\Components\ContentBlock', $stack->getComponent('override2'));
        $this->assertEquals('October\Tester\Components\Post', $stack->getComponent('override3'));

        $stack->unstackPartial();

        $this->assertNull($stack->getComponent('mainMenu'));
        $this->assertNull($stack->getComponent('post'));
        $this->assertEquals('October\Tester\Components\MainMenu', $stack->getComponent('override1'));

        $stack->unstackPartial();

        $this->assertNull($stack->getComponent('post'));
        $this->assertNull($stack->getComponent('mainMenu'));
        $this->assertNull($stack->getComponent('override1'));
        $this->assertNull($stack->getComponent('override2'));
        $this->assertNull($stack->getComponent('override3'));
    }

    public function testEmptyStack()
    {
        $stack = new PartialStack;
        $this->assertNull($stack->getComponent('xxx'));
    }

}
