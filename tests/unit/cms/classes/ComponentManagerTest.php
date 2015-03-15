<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Layout;
use Cms\Classes\Controller;
use Cms\Classes\CodeParser;
use Cms\Classes\ComponentManager;

class ComponentManagerTest extends TestCase
{
    public function testListComponents()
    {
        $manager = ComponentManager::instance();
        $components = $manager->listComponents();

        $this->assertArrayHasKey('testArchive', $components);
        $this->assertArrayHasKey('testPost', $components);
    }

    public function testListComponentDetails()
    {
        include_once base_path() . '/tests/fixtures/plugins/october/tester/components/Archive.php';
        include_once base_path() . '/tests/fixtures/plugins/october/tester/components/Post.php';

        $manager = ComponentManager::instance();
        $components = $manager->listComponentDetails();
        
        $this->assertArrayHasKey('testArchive', $components);
        $this->assertArrayHasKey('name', $components['testArchive']);
        $this->assertArrayHasKey('description', $components['testArchive']);
        $this->assertEquals('Blog Archive Dummy Component', $components['testArchive']['name']);
        $this->assertEquals('Displays an archive of blog posts.', $components['testArchive']['description']);

        $this->assertArrayHasKey('testPost', $components);
        $this->assertArrayHasKey('name', $components['testPost']);
        $this->assertArrayHasKey('description', $components['testPost']);
        $this->assertEquals('Blog Post Dummy Component', $components['testPost']['name']);
        $this->assertEquals('Displays a blog post.', $components['testPost']['description']);
    }

    public function testFindByAlias()
    {
        $manager = ComponentManager::instance();

        $component = $manager->resolve('testArchive');
        $this->assertEquals('\October\Tester\Components\Archive', $component);

        $component = $manager->resolve('testPost');
        $this->assertEquals('\October\Tester\Components\Post', $component);

    }

    public function testHasComponent()
    {
        $manager = ComponentManager::instance();
        $result = $manager->hasComponent('testArchive');
        $this->assertTrue($result);

        $result = $manager->hasComponent('October\Tester\Components\Archive');
        $this->assertTrue($result);

        $result = $manager->hasComponent('October\Tester\Components\Post');
        $this->assertTrue($result);
    }

    public function testMakeComponent()
    {
        include_once base_path() . '/tests/fixtures/plugins/october/tester/components/Archive.php';

        $pageObj = $this->spoofPageCode();

        // Test a defined property
        $manager = ComponentManager::instance();
        $object = $manager->makeComponent('testArchive', $pageObj, ['posts-per-page' => 20]);
        $this->assertNotNull($object);
        $this->assertEquals(20, $object->property('posts-per-page'));

        // Test an undefined property with default
        $object = $manager->makeComponent('testArchive', $pageObj);
        $this->assertNotNull($object);
        $this->assertEquals(10, $object->property('posts-per-page'));
        $this->assertEquals(2020, $object->property('undefined-property', 2020));
    }

    public function testDefineProperties()
    {
        include_once base_path() . '/tests/fixtures/plugins/october/tester/components/Archive.php';
        $manager = ComponentManager::instance();
        $object = $manager->makeComponent('testArchive');
        $details = $object->componentDetails();
        $this->assertCount(2, $details);
        $this->assertNotNull($details);
        $this->assertArrayHasKey('name', $details);
        $this->assertArrayHasKey('description', $details);
        $this->assertEquals('Blog Archive Dummy Component', $details['name']);
    }

    private function spoofPageCode()
    {
        // Spoof all the objects we need to make a page object
        $theme = Theme::load('test');
        $page = Page::load($theme, 'index.htm');
        $layout = Layout::load($theme, 'content.htm');
        $controller = new Controller($theme);
        $parser = new CodeParser($page);
        $pageObj = $parser->source($page, $layout, $controller);
        return $pageObj;
    }
}
