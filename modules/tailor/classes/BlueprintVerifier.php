<?php namespace Tailor\Classes;

use App;
use File;
use Yaml;
use Tailor\Classes\Blueprint\EntryBlueprint;
use Symfony\Component\Yaml\Exception\ParseException;

/**
 * BlueprintVerifier super class responsible for validating blueprints
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class BlueprintVerifier
{
    /**
     * @var array registeredBlueprints tracks blueprints that have been validated
     */
    protected $registeredBlueprints = [];

    /**
     * @var array|null knownSources stores known blueprint handles and UUIDs for source validation
     */
    protected $knownSources;

    /**
     * @var array reservedFieldNames are field names that cannot be used as field names.
     * @see Tailor\Classes\SchemaBuilder
     */
    protected $reservedFieldNames = [
        // Properties
        'attributes',

        // Columns
        'site_id',
        'site_root_id',
        'created_user_id',
        'updated_user_id',
        'deleted_user_id',
        'relation_id',
        'relation_type',
        'field_name',
        'nest_left',
        'nest_right',
        'nest_depth',
        'blueprint_uuid',
        'is_version',
        'primary_id',
        'primary_attrs',
        'content_group',

        // Relations
        'primaryRecord',
        'drafts',
        'versions',
        'parent',
        'children',
    ];

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('tailor.blueprint.verifier');
    }

    /**
     * verifyBlueprint
     */
    public function verifyBlueprint(Blueprint $blueprint)
    {
        $this->validateYamlSyntax($blueprint);
        $this->validateSupportedTypes($blueprint);
        $this->validateUniqueBlueprint($blueprint);
        $this->validateFieldset($blueprint);
    }

    /**
     * clearCache resets all validation caches
     */
    public function clearCache(): void
    {
        $this->registeredBlueprints = [];
        $this->knownSources = null;
    }

    /**
     * sourceExists checks if a source exists as any blueprint (by handle or UUID)
     */
    protected function sourceExists(string $source): bool
    {
        $this->loadKnownSources();

        return isset($this->knownSources[$source]);
    }

    /**
     * loadKnownSources lazy-loads all blueprint handles and UUIDs for source validation
     */
    protected function loadKnownSources(): void
    {
        if ($this->knownSources !== null) {
            return;
        }

        $this->knownSources = [];

        foreach (Blueprint::listInProject() as $blueprint) {
            if ($handle = $blueprint->handle) {
                $this->knownSources[$handle] = true;
            }

            if ($uuid = $blueprint->uuid) {
                $this->knownSources[$uuid] = true;
            }
        }
    }

    /**
     * validateYamlSyntax checks the YAML syntax and parses attributes
     */
    protected function validateYamlSyntax(Blueprint $blueprint)
    {
        try {
            $blueprint->attributes = (array) Yaml::parse($blueprint->content);
        }
        catch (ParseException $ex) {
            $this->yamlToBlueprintException($blueprint, $ex);
        }
    }

    /**
     * validateSupportedTypes checks for valid blueprint types
     */
    protected function validateSupportedTypes(Blueprint $blueprint)
    {
        $supportedTypes = ['entry', 'stream', 'structure', 'single', 'mixin', 'global'];

        if (in_array($blueprint->type, $supportedTypes)) {
            return;
        }

        $lineNo = $this->findLineFromKeyValPair($blueprint->content, 'type', $blueprint->type);

        $typeAsString = implode(', ', $supportedTypes);
        throw new BlueprintException($blueprint, "Type must be one of: {$typeAsString}.", $lineNo);
    }

    /**
     * validateUniqueBlueprint checks for duplicate handles and UUIDs across blueprints
     */
    protected function validateUniqueBlueprint(Blueprint $blueprint)
    {
        $filePath = $blueprint->getFilePath();

        // Check handle uniqueness (all blueprints share the same namespace)
        if ($handle = $blueprint->handle) {
            $this->validateUniqueProperty($blueprint, 'handle', $handle, $filePath);
        }

        // Check UUID uniqueness
        if ($uuid = $blueprint->uuid) {
            $this->validateUniqueProperty($blueprint, 'uuid', $uuid, $filePath);
        }
    }

    /**
     * validateUniqueProperty checks a property value is unique across blueprints
     */
    protected function validateUniqueProperty(Blueprint $blueprint, string $property, string $key, string $filePath)
    {
        $cacheKey = $property . ':' . $key;

        if (isset($this->registeredBlueprints[$cacheKey])) {
            $existingPath = File::nicePath($this->registeredBlueprints[$cacheKey]);
            $value = $blueprint->$property;
            $lineNo = $this->findLineFromKeyValPair($blueprint->content, $property, $value);

            throw new BlueprintException(
                $blueprint,
                "Duplicate {$property} '{$value}'. Already defined in: {$existingPath}",
                $lineNo
            );
        }

        $this->registeredBlueprints[$cacheKey] = $filePath;
    }

    /**
     * validateFieldset
     */
    protected function validateFieldset(Blueprint $blueprint)
    {
        $fields = $blueprint->fields ?? [];

        if ($blueprint instanceof EntryBlueprint && is_array($blueprint->groups)) {
            foreach ($blueprint->groups as $group) {
                $fields += $group['fields'] ?? [];
            }
        }

        // Validate source references from raw config (before fieldset expansion)
        $this->validateSourceReferences($blueprint, $fields);

        $fieldset = FieldManager::instance()->makeFieldset(['fields' => $fields]);
        $fieldset->validate();

        // Check invalid and reserved field names
        foreach ($fieldset->getAllFields() as $fieldName => $fieldObj) {
            if (!preg_match('/^[a-zA-Z0-9\_]+$/', $fieldName)) {
                $lineNo = $this->findLineFromKeyValPair($blueprint->content, $fieldName, '');
                throw new BlueprintException($blueprint, "Invalid field name: {$fieldName}.", $lineNo);
            }

            if (in_array($fieldName, $this->reservedFieldNames)) {
                $lineNo = $this->findLineFromKeyValPair($blueprint->content, $fieldName, '');
                throw new BlueprintException($blueprint, "Field name is reserved: {$fieldName}.", $lineNo);
            }
        }
    }

    /**
     * validateSourceReferences validates source references in raw field config recursively
     */
    protected function validateSourceReferences(Blueprint $blueprint, array $fields)
    {
        foreach ($fields as $fieldName => $fieldConfig) {
            if (!is_array($fieldConfig)) {
                continue;
            }

            // Check source at this level
            $source = $fieldConfig['source'] ?? null;
            if ($source && !$this->sourceExists($source)) {
                $lineNo = $this->findLineFromKeyValPair($blueprint->content, 'source', $source);
                throw new BlueprintException(
                    $blueprint,
                    "Invalid source reference '{$source}'. No blueprint found with this handle or UUID.",
                    $lineNo
                );
            }

            // Recursively check nested fields in various structures
            $nestedFields = $fieldConfig['form']['fields']
                ?? $fieldConfig['fields']
                ?? null;

            if (is_array($nestedFields)) {
                $this->validateSourceReferences($blueprint, $nestedFields);
            }
        }
    }

    /**
     * findLineFromKeyValPair
     */
    protected function findLineFromKeyValPair($content, $key, $val)
    {
        $content = PHP_EOL.$content;
        $regex = '/\n\s*'.preg_quote($key, '/').':\s*'.preg_quote($val, '/').'\s*\n/';

        if (preg_match($regex, $content, $matches, PREG_OFFSET_CAPTURE)) {
            $charPos = $matches[0][1];

            // Find line number from char position
            list($before) = str_split($content, $charPos);
            return strlen($before) - strlen(str_replace("\n", "", $before)) + 1;
        }

        return 0;
    }

    /**
     * yamlToBlueprintException is a workaround to access protected property `rawMessage`
     */
    protected function yamlToBlueprintException($blueprint, $ex)
    {
        $lineNo = $ex->getParsedLine();
        $ex->setSnippet('');
        $ex->setParsedLine(-1);

        throw new BlueprintException(
            $blueprint,
            $ex->getMessage(),
            $lineNo,
            $ex
        );
    }
}
