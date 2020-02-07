<?php

class AssetMakerStub
{
    use System\Traits\AssetMaker;
    use System\Traits\ViewMaker; // Needed for guessViewPath(), which is used to set default assetPath
}

class AssetMakerTest extends TestCase
{
    private $stub;

    public function setUp() : void
    {
        $this->createApplication();
        $this->stub = new AssetMakerStub();
    }

    //
    // Tests
    //

    public function testGetLocalPath()
    {
        $basePath = base_path();

        // Default assetPath
        $assetPath = $this->stub->guessViewPath('/assets', true);
        $resolvedPath = $this->callProtectedMethod($this->stub, 'getLocalPath', [$assetPath]);
        $this->assertEquals(realpath($basePath.$assetPath), realpath($resolvedPath));

        // Paths with symbols
        $resolvedPath = $this->callProtectedMethod($this->stub, 'getLocalPath', ['~/themes/demo/']);
        $this->assertEquals(realpath($basePath.'/themes/demo/'), realpath($resolvedPath));

        $resolvedPath = $this->callProtectedMethod($this->stub, 'getLocalPath', ['~/plugins/demo/']);
        $this->assertEquals(realpath($basePath.'/plugins/demo/'), realpath($resolvedPath));

        $resolvedPath = $this->callProtectedMethod($this->stub, 'getLocalPath', ['$/demo/']);
        $this->assertEquals(realpath($basePath.'/plugins/demo/'), realpath($resolvedPath));

        // Absolute Path
        $resolvedPath = $this->callProtectedMethod($this->stub, 'getLocalPath', [$basePath.'/some/wild/absolute/path/']);
        $this->assertEquals(realpath($basePath.'/some/wild/absolute/path/'), realpath($resolvedPath));
    }
}
