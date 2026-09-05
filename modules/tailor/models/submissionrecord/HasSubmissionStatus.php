<?php namespace Tailor\Models\SubmissionRecord;

/**
 * HasSubmissionStatus overrides status behavior for submission records.
 *
 * Submissions use a pending/approved/rejected workflow instead of the
 * standard published/hidden/scheduled statuses.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasSubmissionStatus
{
    /**
     * getStatusCodeAttribute returns the submission-specific status code
     */
    public function getStatusCodeAttribute()
    {
        if ($this->trashed()) {
            return 'rejected';
        }

        if ($this->is_partial_submission) {
            return 'partial';
        }

        if (!$this->is_enabled) {
            return 'pending';
        }

        return 'approved';
    }

    /**
     * getStatusCodeOptions returns submission-specific status options
     */
    public function getStatusCodeOptions()
    {
        $options = [
            'approved' => ['Approved', 'var(--bs-green)'],
            'pending' => ['Pending', 'var(--bs-orange)'],
            'partial' => ['Partial', 'var(--bs-gray-500)'],
        ];

        if ($this->isSoftDeleteEnabled()) {
            $options += ['rejected' => ['Rejected', 'var(--bs-red)']];
        }

        return $options;
    }

    /**
     * scopeApplyStatusFromFilter
     */
    public function scopeApplyStatusFromFilter($query, $scope)
    {
        if ($scope->value === 'approved') {
            return $query->where('is_enabled', true);
        }

        if ($scope->value === 'pending') {
            return $query->where('is_enabled', false)->where('is_partial_submission', false);
        }

        if ($scope->value === 'partial') {
            return $query->where('is_partial_submission', true);
        }

        if ($scope->value === 'rejected') {
            return $query->onlyTrashed();
        }

        return $query;
    }
}
