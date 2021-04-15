<?php namespace System\Handlers;

use October\Rain\Process\Composer as ComposerProcess;
use Illuminate\Routing\Controller as ControllerBase;

class Composer extends ControllerBase
{
    use \System\Traits\SetupHelper;

    /**
     * Route: /composer/update
     */
    public function update()
    {
        ini_set('max_input_time', 0);
        ini_set('max_execution_time', 0);

        while (@ob_end_flush());

        $composer = new ComposerProcess;

        $composer->setCallback(function($msg) {
            if ($nMsg = $this->processOutput($msg)) {
                foreach (explode("\n", $nMsg) as $nnMsg) {
                    echo '<line>'.trim($nnMsg).'</line>' . PHP_EOL;
                    flush();
                }
            }
        });

        flush();

        $composer->require($this->composerRequireString());

        echo "<exit>{$composer->lastExitCode()}</exit>";
    }

    protected function processOutput($output)
    {
        if ($output === null) {
            return $output;
        }

        // Split backspaced lines
        while (true) {
            $oldOutput = $output;
            $output = str_replace(chr(8).chr(8), chr(8), $output);
            if ($output === $oldOutput) {
                break;
            }
        }
        $output = array_last(explode(chr(8), $output));

        // Remove terminal colors
        $output = preg_replace('/\\e\[[0-9]+m/', '', $output);

        // Remove trailing newline
        $output = preg_replace('/\\n$/', '', $output);

        return $output;
    }
}
