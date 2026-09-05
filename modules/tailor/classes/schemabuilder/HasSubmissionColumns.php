<?php namespace Tailor\Classes\SchemaBuilder;

/**
 * HasSubmissionColumns
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasSubmissionColumns
{
    /**
     * defineSubmissionColumns
     */
    protected function defineSubmissionColumns($table)
    {
        if (!$this->hasColumn('submitted_ip')) {
            $table->string('submitted_ip', 45)->nullable()->index();
        }

        if (!$this->hasColumn('submitted_user_agent')) {
            $table->string('submitted_user_agent')->nullable();
        }

        if (!$this->hasColumn('is_partial_submission')) {
            $table->boolean('is_partial_submission')->default(false);
        }
    }
}
