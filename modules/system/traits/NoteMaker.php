<?php namespace System\Traits;

/**
 * NoteMaker makes notes as it does work.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait NoteMaker
{
    /**
     * @var \Illuminate\Console\OutputStyle
     */
    protected $notesOutput;

    /**
     * @var \Illuminate\Console\Command
     */
    protected $notesCommand;

    /**
     * note writes a note event for the migrator.
     * @param  string  $message
     * @return self
     */
    protected function note($message)
    {
        if ($this->notesOutput !== null) {
            $this->notesOutput->writeln($message);
        }

        return $this;
    }

    /**
     * setNotesOutput sets an output stream for writing notes.
     * @param  \Illuminate\Console\OutputStyle $output
     */
    public function setNotesOutput($output)
    {
        $this->notesOutput = $output;

        return $this;
    }

    /**
     * setNotesCommand sets the fully qualified command for writing notes.
     * @param  \Illuminate\Console\Command $command
     */
    public function setNotesCommand($command)
    {
        $this->notesCommand = $command;

        $this->notesOutput = $command->getOutput();

        return $this;
    }

    /**
     * getNotesOutput returns the note output, used by command line.
     * @return \Illuminate\Console\OutputStyle|null
     */
    public function getNotesOutput()
    {
        return $this->notesOutput;
    }

    /**
     * getNotesOutput returns the note command object, if available.
     * @return \Illuminate\Console\Command|null
     */
    public function getNotesCommand()
    {
        return $this->notesCommand;
    }
}
