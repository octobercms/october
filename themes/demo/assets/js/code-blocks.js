// Pages without code samples do not need the editor bundle or its styles.
(function () {
    const loader = document.currentScript;
    const scriptUrl = loader.dataset.script;
    const stylesheetUrl = loader.dataset.stylesheet;
    let requested = false;
    let stylesheet;

    function loadScript() {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.onerror = function () {
            // Keep the plain code readable and allow a later render to retry.
            requested = false;
            script.remove();
        };
        document.head.appendChild(script);
    }

    function loadCodeBlocks() {
        if (requested || !document.querySelector('.code-block > pre')) {
            return;
        }
        requested = true;

        if (stylesheet) {
            loadScript();
            return;
        }

        stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = stylesheetUrl;
        // CodeMirror measures its layout during initialization.
        stylesheet.onload = loadScript;
        stylesheet.onerror = function () {
            requested = false;
            stylesheet.remove();
            stylesheet = null;
        };
        document.head.appendChild(stylesheet);
    }

    // Expanding plain samples must also work while highlighting loads or fails.
    document.addEventListener('click', function (event) {
        const button = event.target.closest('.expand-code');
        if (button) {
            button.closest('.collapsed-code-block')?.classList.remove('collapsed');
        }
    });

    document.addEventListener('render', loadCodeBlocks);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCodeBlocks, { once: true });
    }
    else {
        loadCodeBlocks();
    }
})();
