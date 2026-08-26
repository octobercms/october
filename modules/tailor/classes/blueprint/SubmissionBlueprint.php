<?php namespace Tailor\Classes\Blueprint;

/**
 * SubmissionBlueprint for user-submitted content with approval workflow
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class SubmissionBlueprint extends EntryBlueprint
{
    /**
     * @var string typeName of the blueprint
     */
    protected $typeName = 'submission';

    /**
     * getModelClassName
     */
    public function getModelClassName()
    {
        return \Tailor\Models\SubmissionRecord::class;
    }

    /**
     * getTitleTemplate returns a Twig template used to build the record title
     */
    public function getTitleTemplate(): ?string
    {
        return $this->submission['titleTemplate'] ?? null;
    }

    /**
     * getSpamSweepDays returns the lookback window for rejecting spam by IP, zero disables the sweep
     */
    public function getSpamSweepDays(): int
    {
        return (int) ($this->submission['spamSweepDays'] ?? 30);
    }

    /**
     * getPurgeRejectedDays returns days to keep rejected submissions, zero disables purging
     */
    public function getPurgeRejectedDays(): int
    {
        return (int) ($this->submission['purgeRejectedDays'] ?? 30);
    }

    /**
     * useDrafts returns false since submissions don't use drafts
     */
    public function useDrafts(): bool
    {
        return false;
    }

    /**
     * isEntryEnabledByDefault returns false since submissions arrive as pending
     */
    public function isEntryEnabledByDefault(): bool
    {
        return false;
    }

    /**
     * usePageFinder returns false since submissions are not linkable pages
     */
    public function usePageFinder(string $context = 'item')
    {
        return false;
    }
}
