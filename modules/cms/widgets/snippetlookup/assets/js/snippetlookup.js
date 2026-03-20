/*
 * SnippetLookupWidget
 */

class SnippetLookup
{
    static defaultWidgetAlias = 'ocsnippetlookup';

    // Open snippet selection popup
    static popup(config) {
        $.popup({
            adaptiveHeight: true,
            handler: this.defaultWidgetAlias + '::onLoadPopup'
        });

        // Queue for the next control found in the popup
        addEventListener('snippetlookup:ready', function(ev) {
            if (ev.target.snippetLookupInstance) {
                ev.target.snippetLookupInstance.setContext(config.onInsert);
            }
        }, { once: true });
    }

    static generateSnippetHtml(snippet) {
        let snippetCode = snippet.snippet,
            componentClass = snippet.componentClass,
            useAjax = snippet.useAjax === 'true';

        var template = [];

        if (componentClass) {
            snippetCode = this._generateUniqueComponentSnippetCode(snippetCode);
            template.push('<figure data-snippet="'+snippetCode+'"');
            template.push(' data-component="'+componentClass+'"');
        }
        else {
            template.push('<figure data-snippet="'+snippetCode+'"');
        }

        if (useAjax) {
            template.push(' data-ajax="true"');
        }

        template.push('>&nbsp;</figure>');

        return template.join('');
    }

    // If a component-based snippet was added, make sure that its code is unique,
    // as it will be used as a component alias.
    static _generateUniqueComponentSnippetCode(originalCode) {
        var updatedCode = originalCode,
            counter = 1,
            snippetFound = false;

        do {
            snippetFound = false;
            $('[data-control="richeditor"] textarea, [data-control="markdowneditor"] textarea').each(function() {
                var $textarea = $(this),
                    $codeDom = $('<div>' + $textarea.val() + '</div>');

                if ($('[data-snippet="'+updatedCode+'"][data-component]', $codeDom).length > 0) {
                    snippetFound = true;
                    updatedCode = originalCode + counter;
                    counter++;

                    return false;
                }
            })

        } while (snippetFound);

        return updatedCode;
    }

    // Used by markdown editor to attach snippet controls
    static processSnippets(content) {
        const figures = content.match(/\<figure[^\>]+data-snippet[^\>]+\>[^<]*\<\/figure\>/g);

        if (figures != null && figures.length > 0) {
            for (const figure of figures) {
                content = content.replace(figure, figure.replace('data-snippet="', 'data-control="snippet" data-snippet="'));
            }
        }

        return content;
    }

    // Snippet Detail Manager
    static snippetDetails = {};
    static snippetDetailQueue = [];
    static snippetDetailLoading = false;
    static snippetDetailTimer;

    static getSnippetDetails(code, componentClass) {
        const fullCode = componentClass
            ? code + '|' + componentClass
            : code;

        return new Promise((resolve) => {
            if (this.snippetDetails[code]) {
                resolve(this.snippetDetails[code]);
                return;
            }

            this.snippetDetailQueue.push([fullCode, code, resolve]);

            if (this.dataTrackInputTimer !== undefined) {
                clearTimeout(this.dataTrackInputTimer);
            }

            const requestDetails = () => {
                if (this.snippetDetailLoading) {
                    return;
                }

                const resolveQueue = [...this.snippetDetailQueue],
                    wantSnippets = resolveQueue.map(item => item[0]);

                this.snippetDetailLoading = true;
                this.snippetDetailQueue = [];

                oc.ajax(this.defaultWidgetAlias + '::onLoadSnippetDetails', {
                    data: {
                        codes: wantSnippets
                    }
                })
                .done((data) => {
                    if (data.details) {
                        Object.assign(this.snippetDetails, data.details);
                        this.snippetDetailLoading = false;

                        resolveQueue.forEach((item, key) => {
                            item[2](this.snippetDetails[item[1]]);
                        });

                        // Request queued items that were added during a pending request
                        if (this.snippetDetailQueue.length) {
                            requestDetails();
                        }
                    }
                });
            };

            this.dataTrackInputTimer = setTimeout(requestDetails, 100);
        });
    }
}

oc.snippetLookup = SnippetLookup;

if ($.FE) {
    $.FE.RegisterInsertSnippetCommand();
}
