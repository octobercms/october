oc.registerControl('settings-nav', class extends oc.ControlBase {
    init() {
        this.treeName = this.config.treeName || 'settingsNav';
        this.statusCookieName = this.treeName + 'GroupStatus';
        this.searchCookieName = this.treeName + 'Search';
        this.$searchInput = this.element.querySelector(this.config.searchInput);
        this.rememberSearch = !(this.config.rememberSearch === 'false' || this.config.rememberSearch === '0');
    }

    connect() {
        this.listen('click', 'li > div.group', this.toggleGroup);
        this.listen('click', '[data-clear-search]', this.clearSearch);
        this.listen('input', this.$searchInput, this.handleSearchChange);
        this.listen('scrollbar:ready', '[data-control=scrollbar]', this.initScrollbar);

        window.addEventListener('scroll', this.proxy(this.toggleScrollState));

        this.initSearch();

        this.element.style.visibility = 'hidden';
        document.body.classList.add('has-settings-nav');
    }

    disconnect() {
        window.removeEventListener('scroll', this.proxy(this.toggleScrollState));

        document.body.classList.remove('has-settings-nav');
    }

    // Toggle scroll state
    //

    toggleScrollState() {
        if (window.scrollY > 0) {
            this.element.classList.add('is-full');
        } else {
            this.element.classList.remove('is-full');
        }
    }

    // Scrollbars
    //

    initScrollbar(event) {
        var activeItem = this.element.querySelector('li.active'),
            active = activeItem ? activeItem.closest('[data-group-code]') : null;

        if (active) {
            const $group = active.closest('li');
            if ($group) {
                this.expandGroup($group, 0);
            }

            oc.fetchControl(event.delegateTarget, 'scrollbar')
                ?.gotoElement(active);
        }

        this.element.style.visibility = 'visible';
    }

    // Groups
    //

    toggleGroup(event) {
        event.preventDefault();
        const
            $group = event.delegateTarget.closest('li'),
            status = $group.dataset.status;

        if (status === undefined || status === 'expanded') {
            this.collapseGroup($group);
        }
        else {
            this.expandGroup($group);
        }
    }

    collapseGroup($group) {
        const $list = $group.querySelector(':scope > ul');

        $list.style.overflow = 'hidden';
        $($list).animate({ height: 0 }, {
            duration: 100,
            queue: false,
            complete: () => {
                $list.style.overflow = 'visible';
                $list.style.display = 'none';
                $group.dataset.status = 'collapsed';
                $(window).trigger('oc.updateUi');
                this.saveGroupStatus($group.dataset.groupCode, true);
            }
        });
    }

    expandGroup($group, duration) {
        const $list = $group.querySelector(':scope > ul');

        duration = duration === undefined ? 100 : duration;
        $list.style.overflow = 'hidden';
        $list.style.height = 0;

        $($list).animate({ height: $list.scrollHeight }, {
            duration: duration,
            queue: false,
            complete: () => {
                $list.style.overflow = 'visible';
                $list.style.height = 'auto';
                $list.style.display = '';
                $group.dataset.status = 'expanded';
                $(window).trigger('oc.updateUi');
                this.saveGroupStatus($group.dataset.groupCode, false);
            }
        })
    }

    saveGroupStatus(groupCode, collapsed) {
        var collapsedGroups = Cookies.get(this.statusCookieName),
            updatedGroups = [];

        if (collapsedGroups === undefined) {
            collapsedGroups = '';
        }

        collapsedGroups.split('|').forEach((element) => {
            if (groupCode != element) {
                updatedGroups.push(element);
            }
        })

        if (collapsed) {
            updatedGroups.push(groupCode);
        }

        Cookies.set(
            this.statusCookieName,
            updatedGroups.join('|'),
            { expires: 30, path: '/' }
        );
    }

    // Search
    //

    initSearch() {
        if (this.rememberSearch) {
            var searchTerm = Cookies.get(this.searchCookieName);
            if (searchTerm !== undefined && searchTerm.length > 0) {
                this.$searchInput.value = searchTerm;
                this.applySearch();
            }
        }
    }

    handleSearchChange(event) {
        var lastValue = this.$searchInput.dataset.lastSearchValue;

        if (lastValue !== undefined && lastValue == this.$searchInput.value) {
            return;
        }

        this.$searchInput.dataset.lastSearchValue = this.$searchInput.value;

        if (this.dataTrackInputTimer !== undefined) {
            window.clearTimeout(this.dataTrackInputTimer);
        }

        this.dataTrackInputTimer = window.setTimeout(() => {
            this.applySearch();
        }, 300);

        Cookies.set(this.searchCookieName, this.$searchInput.value.trim(), { expires: 30, path: '/' });
    }

    clearSearch() {
        this.$searchInput.value = '';

        this.element.classList.remove('is-search-active');

        this.element.querySelectorAll('li').forEach((el) => {
            el.classList.remove('oc-hide');
        });

        Cookies.remove(this.searchCookieName);
    }

    applySearch() {
        var query = this.$searchInput.value.trim(),
            words = query.toLowerCase().split(' '),
            visibleGroups = [],
            visibleItems = [],
            $el = $(this.element);

        if (query.length === 0) {
            this.clearSearch();
            return;
        }

        this.element.classList.add('is-search-active');

        // Find visible groups and items
        $('ul.top-level > li', $el).each((index, item) => {
            var $li = $(item);
            if (this.textContainsWords($('div.group h3', $li).text(), words)) {
                visibleGroups.push($li.get(0));

                $('ul li', $li).each((index, item) => {
                    visibleItems.push(item);
                });
            }
            else {
                $('ul li', $li).each((index, item) => {
                    if (
                        this.textContainsWords($(item).text(), words) ||
                        this.textContainsWords($(item).data('keywords'), words)
                    ) {
                        visibleGroups.push($li.get(0));
                        visibleItems.push(item);
                    }
                })
            }
        })

        // Hide invisible groups and items
        $('ul.top-level > li', $el).each((index, item) => {
            var $li = $(item),
                groupIsVisible = $.inArray(item, visibleGroups) !== -1;

            $li.toggleClass('oc-hide', !groupIsVisible);
            if (groupIsVisible) {
                this.expandGroup($li.get(0), 0);
            }

            $('ul li', $li).each((index, item) => {
                var $itemLi = $(item);

                $itemLi.toggleClass('oc-hide', $.inArray(item, visibleItems) == -1);
            })
        });

        $(window).trigger('resize');

        return false;
    }

    textContainsWords(text, words) {
        text = text.toLowerCase();

        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) === -1) {
                return false;
            }
        }

        return true;
    }

});
