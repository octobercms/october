# Input Preset

Automatically converts text entered in a source input to a formatted value in a destination input. Useful for generating slugs, URLs, file names, or camelCase identifiers from a title field.

Includes a transliteration engine supporting Vietnamese, Latin, Greek, Turkish, Russian, Ukrainian, Czech, Polish, Latvian, Arabic, Persian, Lithuanian, Serbian, Azerbaijani, Romanian, and Belarusian character sets.

## Basic Usage

```html
<input type="text" id="title" placeholder="Type a title" />
<input type="text"
    data-input-preset="#title"
    data-input-preset-type="slug"
    placeholder="Auto-generated slug" />
```

## JavaScript API

```js
$('#slug').inputPreset({
    inputPreset: '#title',
    inputPresetType: 'file'
})
```

### Engine API

```js
oc.InputPresetEngine.formatValue({ inputPresetType: 'slug' }, 'My Title')
// Returns: "my-title"
```

### Data Attributes

| Attribute | Description |
|---|---|
| `data-input-preset` | CSS selector for the source input |
| `data-input-preset-type` | Conversion type: `slug` (default), `url`, `file`, `camel`, `snake`, `exact`, `namespace` |
| `data-input-preset-closest-parent` | CSS selector for a common parent scope |
| `data-input-preset-prefix-input` | CSS selector for an input whose value prefixes the result |
| `data-input-preset-remove-words` | Filter English stop words (default: `true`) |

### Conversion Types

| Type | Input | Output |
|---|---|---|
| `slug` | My Blog Post | `my-blog-post` |
| `url` | My Blog Post | `/my-blog-post` |
| `file` | My Blog Post | `my-blog-post` |
| `camel` | My Blog Post | `myBlogPost` |
| `snake` | My Blog Post | `my_blog_post` |
| `namespace` | My Blog Post | `MyBlogPost` |
| `exact` | My Blog Post | `My Blog Post` |

### Events

| Event | Description |
|---|---|
| `oc.inputPreset.beforeUpdate` | Before the destination value is updated |
| `oc.inputPreset.afterUpdate` | After the destination value is updated |
