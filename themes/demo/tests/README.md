# Frontend asset checks

From the repository root, serve the checked-in files with `python3 -m http.server 8765`.
Open these pages in a browser; both must report PASS for every assertion:

- `/themes/demo/tests/code-blocks.html`: starts without code, then simulates AJAX insertion and repeated render events.
- `/themes/demo/tests/code-blocks.html?initial`: includes code before the deferred loader runs.

The fixture loads the real jQuery, loader, CodeMirror bundle and CSS. It checks
request deduplication, PHP/Twig content preservation, repeated/replaced fragments,
read-only editors and the expand control. It does not require an installed CMS.

For a CMS integration smoke test, visit the home, Components and AJAX demo pages.
Home must not request `codeblocks.min.js` or `codeblocks.min.css`; Components and
AJAX must still highlight samples and expand collapsed code. Check the three
homepage feature illustrations load when approaching the viewport, with their
space reserved by width/height attributes. The hero image remains eager.
