<?php namespace Tailor\Models;

use App;
use Str;
use Cache;
use Request;
use October\Contracts\Element\ListElement;
use October\Contracts\Element\FormElement;
use October\Contracts\Element\FilterElement;
use Tailor\Classes\Scopes\SubmissionRecordScope;

/**
 * SubmissionRecord model for user-submitted content
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class SubmissionRecord extends EntryRecord
{
    use \Tailor\Models\SubmissionRecord\HasSubmissionStatus;

    /**
     * @var array rules for validation — submissions don't require title or slug
     */
    public $rules = [];

    /**
     * @var array fillable fields
     */
    protected $fillable = [];

    /**
     * afterBoot
     */
    public function afterBoot()
    {
        static::addGlobalScope(new SubmissionRecordScope);
    }

    /**
     * beforeSave computes the record title from the blueprint configuration
     */
    public function beforeSave()
    {
        if ($title = $this->makeSubmissionTitle()) {
            $this->title = $title;
        }
    }

    /**
     * beforeCreate auto-generates title and slug for the submission
     */
    public function beforeCreate()
    {
        if (!$this->title) {
            $this->title = 'Submission #' . strtoupper(Str::random(8));
        }

        if (!$this->slug) {
            $this->slug = Str::slug($this->title) . '-' . Str::random(8);
        }

        $this->is_enabled = false;

        $this->stampSubmissionMetadata();

        parent::beforeCreate();
    }

    /**
     * stampSubmissionMetadata captures the visitor IP and user agent for frontend submissions
     */
    protected function stampSubmissionMetadata(): void
    {
        if (App::runningInConsole() || App::runningInBackend()) {
            return;
        }

        $this->submitted_ip = Request::ip();
        $this->submitted_user_agent = Str::limit((string) Request::userAgent(), 250);
    }

    /**
     * rejectOtherSpamSubmissions rejects pending submissions sharing this record IP within the spam window
     */
    public function rejectOtherSpamSubmissions(): void
    {
        if (!$ip = $this->submitted_ip) {
            return;
        }

        $days = $this->getBlueprintDefinition()->getSpamSweepDays();
        if ($days <= 0) {
            return;
        }

        $others = $this->newQuery()
            ->where('submitted_ip', $ip)
            ->where('is_enabled', false)
            ->where('id', '<>', $this->getKey())
            ->where('created_at', '>=', now()->subDays($days))
            ->get();

        foreach ($others as $other) {
            $other->delete();
        }
    }

    /**
     * purgeRejectedRecords permanently deletes rejected submissions past the blueprint
     * retention period, running at most once per interval for performance.
     */
    public static function purgeRejectedRecords(string $uuid): int
    {
        if (!Cache::add('tailor.purge-submissions.'.$uuid, true, now()->addHours(6))) {
            return 0;
        }

        $model = static::inSectionUuid($uuid);

        $days = $model->getBlueprintDefinition()->getPurgeRejectedDays();
        if ($days <= 0) {
            return 0;
        }

        $records = $model->newQuery()
            ->onlyTrashed()
            ->where('deleted_at', '<', now()->subDays($days))
            ->get();

        foreach ($records as $record) {
            $record->forceDelete();
        }

        return $records->count();
    }

    /**
     * makeSubmissionTitle builds a title from the titleTemplate config or common fallback fields
     */
    protected function makeSubmissionTitle(): string
    {
        if ($template = $this->getBlueprintDefinition()->getTitleTemplate()) {
            $title = $this->parseSubmissionTitleTemplate($template);
        }
        else {
            $title = $this->findSubmissionTitleFallback();
        }

        $title = trim(preg_replace('/\s+/', ' ', (string) $title));

        return Str::limit($title, 191);
    }

    /**
     * parseSubmissionTitleTemplate renders a Twig title template with field values and the record
     */
    protected function parseSubmissionTitleTemplate(string $template): string
    {
        try {
            // Escaping is disabled since the result is stored as plain text
            return App::make('twig.environment')
                ->createTemplate('{% autoescape false %}'.$template.'{% endautoescape %}')
                ->render($this->attributes + ['record' => $this]);
        }
        catch (\Throwable $ex) {
            trace_log($ex);
            return '';
        }
    }

    /**
     * findSubmissionTitleFallback checks common field names for a usable title value
     */
    protected function findSubmissionTitleFallback(): string
    {
        foreach (['name', 'subject', 'author_name', 'full_name', 'email'] as $field) {
            if (!empty($this->attributes[$field])) {
                return (string) $this->attributes[$field];
            }
        }

        return '';
    }

    /**
     * defineListColumns
     */
    public function defineListColumns(ListElement $host)
    {
        $host->defineColumn('id', 'ID')->invisible();
        $host->defineColumn('title', 'Title')->searchable(true);

        $this->getContentFieldsetDefinition()->defineAllListColumns($host, ['except' => $this->fieldModifiers]);

        $host->defineColumn('submitted_ip', 'IP Address')->invisible()->searchable();
        $host->defineColumn('created_at', 'Submitted')->displayAs('datetime')->sortableDefault('desc');
        $host->defineColumn('status_code', 'Status')->shortLabel('')->displayAs('selectable')->sortable(false)->align('right');
        $this->applyCoreColumnModifiers($host);
    }

    /**
     * defineFilterScopes
     */
    public function defineFilterScopes(FilterElement $host)
    {
        $host->defineScope('status_code', 'Status')->displayAs('dropdown')->options('getStatusCodeOptions')->emptyOption('All Submissions')->modelScope('applyStatusFromFilter');

        $this->getContentFieldsetDefinition()->defineAllFilterScopes($host, ['except' => $this->fieldModifiers]);

        $host->defineScope('submitted_ip', 'IP Address')->displayAs('text');

        $this->applyCoreScopeModifiers($host);
    }

    /**
     * defineFormFields
     */
    public function defineFormFields(FormElement $host)
    {
        $host->addFormField('title', 'Title')->disabled()->cssClass('primary-title-field');
        $this->applyCoreFieldModifiers($host);
    }

    /**
     * defineSecondaryFormFields
     */
    public function defineSecondaryFormFields(FormElement $host)
    {
        $host->addFormField('is_enabled', 'Approved')->displayAs('switch')->defaults(false);
        $host->addFormField('created_at', 'Submitted')->displayAs('datepicker')->mode('datetime')->disabled()->context(['update', 'preview']);
        $host->addFormField('submitted_ip', 'IP Address')->disabled()->context(['update', 'preview']);
        $host->addFormField('submitted_user_agent', 'User Agent')->disabled()->context(['update', 'preview']);
        $this->applyCoreFieldModifiers($host);
    }
}
