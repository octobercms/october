<?php namespace Cms\Classes\Partial;

/**
 * Fields
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Fields
{
    /**
     * defineSettingsFields
     */
    public function defineSettingsFields(): array
    {
        return [];
    }

    /**
     * defineSettingsButtons
     */
    public function defineSettingsButtons(): array
    {
        return [
            [
                'button' => "Snippet",
                'icon' => 'icon-code-snippet',
                'popupTitle' => "Define a Snippet Partial",
                'useViewBag' => true,
                'properties' => $this->defineSnippetFields()
            ]
        ];
    }

    /**
     * defineSnippetFields
     */
    public function defineSnippetFields(): array
    {
        return [
            'snippetCode' => [
                'title' => "Snippet Code",
                'description' => "Enter a code to make this partial available as a snippet in content editors.",
                'type' => 'string',
                'validation' => [
                    'required' => [
                        'message' => "Please enter the snippet code"
                    ]
                ]
            ],
            'snippetName' => [
                'title' => "Name",
                'description' => "The name is displayed in the snippet list in the editor when a snippet is added.",
                'type' => 'string',
                'validation' => [
                    'required' => [
                        'message' => "Please enter the snippet name"
                    ]
                ],
                'tab' => "Details"
            ],
            'snippetDescription' => [
                'title' => "Description",
                'description' => "The description is displayed in the snippet list in the editor when a snippet is added.",
                'type' => 'string',
                'tab' => "Details"
            ],
            // 'snippetIcon' => [
            //     'title' => "Icon",
            //     'description' => "xxx",
            //     'type' => 'dropdown',
            //     'optionsPreset' => 'icons'
            //     'tab' => "Details"
            // ],
            'snippetAjax' => [
                'title' => "AJAX Enabled",
                'description' => "Check this box to enable an AJAX requests for this snippet.",
                'type' => 'checkbox',
                'default' => false,
                'tab' => "Details"
            ],
            'snippetInline' => [
                'title' => "Inline Snippet",
                'description' => "Check this box to insert this snippet inline within the content instead of as a block.",
                'type' => 'checkbox',
                'default' => false,
                'tab' => "Details"
            ],
            'snippetProperties' => [
                'title' => '',
                'type' => 'table',
                'tab' => "Properties",
                'columns' => [
                    'title' => [
                        'type' => 'string',
                        'title' => "Property Title",
                        'validation' => [
                            'required' => [
                                'message' => "Please provide the property title"
                            ]
                        ]
                    ],
                    'property' => [
                        'type' => 'string',
                        'title' => "Code",
                        'validation' => [
                            'required' => [
                                'message' => "Please provide the property name"
                            ],
                            'regex' => [
                                'pattern' => '^[a-z][a-z0-9\\_]*$',
                                'modifiers' => 'i',
                                'message' => "Property code should start with a Latin letter and can contain only Latin letters, digits and underscores"
                            ]
                        ]
                    ],
                    'type' => [
                        'title' => "Type",
                        'type' => 'dropdown',
                        'placeholder' => "Select",
                        'options' => [
                            'string' => "String",
                            'checkbox' => "Checkbox",
                            'dropdown' => "Dropdown"
                        ],
                        'validation' => [
                            'required' => [
                                'message' => "Please select the property type"
                            ]
                        ]
                    ],
                    'default' => [
                        'type' => 'string',
                        'title' => "Default"
                    ],
                    'options' => [
                        'type' => 'string',
                        'title' => "Options"
                    ]
                ]
            ]
        ];
    }
}
