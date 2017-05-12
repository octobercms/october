Changelog can be found here: http://octobercms.com/changelog

### Breaking changes Laravel 5.5

- Database queries now return Collections instead of arrays!
- Twig has been updated to v2.0
- `pluck()` should be renamed to `value()`
- `getRelatedIds()` called from BelongsToMany is renamed to `allRelatedIds()`
- `Mail::pretend()` has been removed, use `Config::set('mail.driver', 'log');` instead
