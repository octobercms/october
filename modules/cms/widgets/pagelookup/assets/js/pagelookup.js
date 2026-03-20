/*
 * PageLookup page
 *
 * Config:
 * - alias: null
 * - value: ''
 * - onInsert: null
 * - onShown: null
 * - singleMode: false
 * - includeTitle: false
 */

//
// Resolver logic
//

function processResolverLink(url) {
    return window.location.origin + window.location.pathname +'?_lookup_link='+encodeURIComponent(url);
}

function processResolverLinks(content) {
    return processResolverLinksForHtml(
        processResolverLinksForMarkdown(content)
    );
}

// [a link](october://static-pages@link/some/reference?cmsPage=foobar)
function processResolverLinksForMarkdown(markdownText) {
    const elements = markdownText.match(/\[.*?\]\(october:\/\/.*?\)/g);
    if (elements != null && elements.length > 0) {
        for (const el of elements) {
            const txt = el.match(/\[(.*?)\]/);
            const url = el.match(/\((october:\/\/.*?)\)/);
            if (txt !== null && url !== null) {
                const processedUrl = processResolverLink(url[1]);
                markdownText = markdownText.replace(el,'['+txt[1]+']('+processedUrl+')');
            }
        }
    }
    return markdownText;
}

// <a href="october://static-pages@link/some/reference?cmsPage=foobar"></a>
function processResolverLinksForHtml(htmlText) {
    const elements = htmlText.match(/(<a.*?october:\/\/.*?[^a]>)+?/g);
    if (elements != null && elements.length > 0) {
        for (const el of elements) {
            const url = el.match(/href="(.*?)"/);
            if (url !== null) {
                const processedUrl = processResolverLink(url[1]);
                htmlText = htmlText.replace(el, el.replace(url[1], processedUrl));
            }
        }
    }
    return htmlText;
}

class PageLookupWidget {
    static proxyCounter = 0;

    constructor(config) {
        this.config = this.getConfig(config);
        this.proxiedMethods = {};

        if (this.config.alias === null) {
            throw new Error('Page Lookup popup option "alias" is not set.');
        }

        this.$rootElement = $('<div />');
        this.$rootElement.one('hide.oc.popup', this.proxy(this.onPopupHidden));
        this.$rootElement.one('shown.oc.popup', this.proxy(this.onPopupShown));

        this.show();
    }

    dispose() {
        for (const key in this.proxiedMethods) {
            this.proxiedMethods[key] = null;
        }

        for (const propertyName of Object.getOwnPropertyNames(this)) {
            this[propertyName] = null;
        }
    }

    static processLink(url) {
        return processResolverLink(url);
    }

    static processLinks(content) {
        return processResolverLinks(content);
    }

    static popup(config) {
        return new this(config);
    }

    static get DEFAULTS() {
        return {
            alias: null,
            value: '',
            onInsert: null,
            onShown: null,
            singleMode: false,
            includeTitle: false,
            allowCustomUrl: true,
            allowedTypes: null,
            excludedTypes: null
        }
    }

    onRefreshReference = function(event) {
        var $select = $(event.target),
            val = $select.val();

        if (!val) {
            return;
        }

        // type::reference ID
        var parts = val.split('::', 2);
        var extraData = {
            type: parts[0],
            reference: parts[1]
        };

        oc.request(this.$popupElement.get(0), this.config.alias + '::onRefreshReference', {
            data: {
                PageLookupItem: extraData
            }
        });

        $select.empty().trigger('change.select2');
    }

    onInsertReference = function(event) {
        const { data, context } = event.detail;

        if (context.handler !== this.config.alias + '::onInsertReference') {
            return;
        }

        if (!data) {
            return;
        }

        if (this.config.onInsert) {
            this.config.onInsert.call(this, data);
        }
    }

    onPopupShown = function(event, element, popup) {
        this.$popupElement = popup;
        oc.Events.on(this.$popupElement.get(0), 'change', 'select[name=referenceSearch]', this.proxy(this.onRefreshReference));
        oc.Events.on(this.$popupElement.get(0), 'ajax:done', 'form', this.proxy(this.onInsertReference));

        if (this.config.onShown) {
            this.config.onShown.call(this);
        }
    }

    onPopupHidden = function(event, element, popup) {
        oc.Events.off(this.$popupElement.get(0), 'change', 'select[name=referenceSearch]', this.proxy(this.onRefreshReference));
        oc.Events.off(this.$popupElement.get(0), 'ajax:done', 'form', this.proxy(this.onInsertReference));

        this.dispose();
    }

    show() {
        var data = {
            pagelookup_flag: true,
            pagelookup_title: this.config.includeTitle,
            pagelookup_single: this.config.singleMode,
            pagelookup_allow_custom_url: this.config.allowCustomUrl,
            pagelookup_allowed_types: JSON.stringify(this.config.allowedTypes),
            pagelookup_excluded_types: JSON.stringify(this.config.excludedTypes),
            value: this.config.value
        };

        this.$rootElement.popup({
            extraData: data,
            size: 'large',
            handler: this.config.alias + '::onLoadPopup'
        });
    }

    hide() {
        if (this.$rootElement) {
            this.$rootElement.trigger('close.oc.popup');
        }
    }

    // Private
    proxy(method) {
        if (method.ocProxyId === undefined) {
            PageLookupWidget.proxyCounter++;
            method.ocProxyId = PageLookupWidget.proxyCounter;
        }

        if (this.proxiedMethods[method.ocProxyId] !== undefined) {
            return this.proxiedMethods[method.ocProxyId];
        }

        this.proxiedMethods[method.ocProxyId] = method.bind(this);

        return this.proxiedMethods[method.ocProxyId];
    }

    getConfig(config) {
        return {
            ...this.constructor.DEFAULTS,
            ...(typeof config === 'object' ? config : {})
        }
    }
}

oc.pageLookup = PageLookupWidget;

if ($.FE) {
    $.FE.RegisterInsertPageLinkCommand();
}
