# Media Module

The Media module provides file and folder management for October CMS. It includes the Media Library API, a backend Media Manager interface, the `mediafinder` form widget for selecting media in forms, and a Twig filter for generating public URLs. Built on Laravel's Storage facade, the Media Library works with local disks, S3, Azure, or any other storage driver -- with path validation, extension allowlists, SVG sanitization, and caching handled transparently.

## Architecture Overview

The module has three layers:

- **MediaLibrary** - core API for file operations (list, upload, delete, move, search)
- **MediaManager** - the backend widget providing the visual file browser
- **MediaFinder** - a form widget for selecting files/images from the media library

## Key Services

| Service | Class | Description |
|---------|-------|-------------|
| `media.library` | `Media\Classes\MediaLibrary` | Core file operations API |
| `media.views` | `Media\Helpers\MediaView` | Video/audio markup processing |

## MediaLibrary API

The `MediaLibrary` class provides all file operations. Access via `MediaLibrary::instance()`.

### Listing and Searching

```php
$library = MediaLibrary::instance();

// List folder contents (sorted by title, filtered to images)
$items = $library->listFolderContents('/', 'title', 'image');

// Search across the entire library
$results = $library->findFiles('vacation');
```

### File Operations

```php
// Upload a file
$library->putFile('/photos/pic.jpg', $uploadedFile);

// Write raw contents
$library->put('/docs/readme.txt', $contents);

// Move and rename
$library->moveFile('/old/path.jpg', '/new/path.jpg');
$library->moveFolder('/old/folder', '/new/folder');

// Copy a folder
$library->copyFolder('/source', '/destination');

// Delete
$library->deleteFiles(['/photos/old.jpg', '/photos/temp.jpg']);
$library->deleteFolder('/temp');
```

### URL Generation

```php
$url = $library->getPathUrl('/photos/pic.jpg');
```

### MediaLibraryItem

Each item returned by `listFolderContents()` or `findFiles()` is a `MediaLibraryItem` with:

- `$path`, `$title`, `$type` (file or folder), `$size`, `$lastModified`, `$publicUrl`
- `isFile()`, `getFileType()` (image, video, audio, document)
- `sizeToString()`, `lastModifiedAsString()`

## MediaManager Widget

The MediaManager is a persistent backend widget available on all backend pages (if the user has permission). It provides a complete file management experience without requiring any third-party packages or custom integration:

- Grid, list, and tile view modes
- File upload with drag-and-drop
- Search, navigation, sorting, filtering (by type: image, video, audio, document)
- Create, delete, rename, and move folders and files
- Image cropping tool
- Thumbnail generation
- Duplicate file detection

## MediaFinder Form Widget

Select media files in backend forms:

```yaml
# Image mode
featured_image:
    type: mediafinder
    mode: image
    maxItems: 1
    imageWidth: 190
    imageHeight: 190

# File mode
download:
    type: mediafinder
    mode: file

# Folder mode
gallery_folder:
    type: mediafinder
    mode: folder
```

## Twig Integration

The module registers the `| media` filter for generating public URLs to media files:

```twig
<img src="{{ '/photos/hero.jpg' | media }}" />
```

Works with strings, arrays, collections, and file attachment objects.

## Storage

The Media Library uses Laravel's Storage facade with the `media` disk. By default this maps to `storage/app/media` but can be configured to use S3, Azure, or any other Laravel storage driver.

Features:

- **Caching** - file listings are cached (10-minute TTL by default) and invalidated on changes
- **Path validation** - prevents directory traversal attacks
- **Extension allowlist** - only configured file types can be uploaded
- **SVG sanitization** - scripts are stripped from SVG files
- **Filename normalization** - consistent file naming

## Configuration

Media settings are in `config/media.php`:

| Key | Description |
|-----|-------------|
| `item_cache_ttl` | Cache duration in minutes (default: `10`) |
| `auto_rename` | Auto-rename uploads (`null` or `'slug'`) |
| `clean_vectors` | Sanitize SVG files (default: `true`) |
| `default_extensions` | Allowed file extensions |
| `image_extensions` | Extensions classified as images |
| `video_extensions` | Extensions classified as video |
| `audio_extensions` | Extensions classified as audio |
| `ignore_files` | Filenames to ignore (e.g. `.svn`, `.git`) |
| `ignore_patterns` | Regex patterns to ignore (e.g. `^\..*`) |

## Extension Points

### Events

| Event | Description |
|-------|-------------|
| `media.file.beforeUpload` | Before a file is uploaded |
| `media.file.upload` | After a file is uploaded (path can be modified by reference) |
| `media.file.delete` | After a file is deleted |
| `media.file.rename` | After a file is renamed |
| `media.file.move` | After a file is moved |
| `media.folder.create` | After a folder is created |
| `media.folder.delete` | After a folder is deleted |
| `media.folder.rename` | After a folder is renamed |
| `media.folder.move` | After a folder is moved |

### Example

```php
Event::listen('media.file.upload', function ($manager, &$path, $uploadedFile) {
    // Modify the path or perform post-processing
});
```

## Permissions

| Permission | Description |
|------------|-------------|
| `media.library` | Access the Media Manager |
| `media.library.create` | Upload files |
| `media.library.delete` | Delete, rename, and move items |
