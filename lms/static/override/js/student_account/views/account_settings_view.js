;(function (define, undefined) {
    'use strict';
    define([
        'gettext',
        'jquery',
        'underscore',
        'backbone',
        'edx-ui-toolkit/js/utils/html-utils',
        'js/student_account/views/account_section_view',
        'text!templates/student_account/account_settings.underscore'
    ], function (gettext, $, _, Backbone, HtmlUtils, AccountSectionView, accountSettingsTemplate) {

        var AccountSettingsView = Backbone.View.extend({

            navLink: '.account-nav-link',
            activeTab: 'aboutTabSections',
            accountSettingsTabs: [
                {name: 'aboutTabSections', id: 'about-tab', label: gettext('Account Information'), class: 'active'},
                {name: 'accountsTabSections', id: 'accounts-tab', label: gettext('Linked Accounts')},
                {name: 'ordersTabSections', id: 'orders-tab', label: gettext('Order History')}
            ],
            events: {
                'click .account-nav-link': 'changeTab'
            },

            initialize: function (options) {
                this.options = options;
                _.bindAll(this, 'render', 'changeTab', 'renderFields', 'showLoadingError');
            },

            render: function () {
                HtmlUtils.setHtml(this.$el, HtmlUtils.template(accountSettingsTemplate)({
                    accountSettingsTabs: this.accountSettingsTabs
                }));
                this.renderSection(this.options.tabSections[this.activeTab]);
                return this;
            },

            postRender: function() {
                this.$('#u-field-select-district').select2();
            },

            changeTab: function(e) {
                var $currentTab;

                e.preventDefault();
                $currentTab = $(e.target);
                this.activeTab = $currentTab.data('name');
                this.renderSection(this.options.tabSections[this.activeTab]);
                this.renderFields();

                $(this.navLink).removeClass('active');
                $currentTab.addClass('active');

                $(this.navLink).removeAttr('aria-describedby');
                $currentTab.attr('aria-describedby', 'header-subtitle-'+this.activeTab);
            },

            renderSection: function (tabSections) {
                var accountSectionView = new AccountSectionView({
                    activeTabName: this.activeTab,
                    sections: tabSections,
                    el: '.account-settings-sections'
                });

                accountSectionView.render();
            },

            renderFields: function () {
                var view = this;
                view.$('.ui-loading-indicator').addClass('is-hidden');

                _.each(view.$('.account-settings-section-body'), function (sectionEl, index) {
                    _.each(view.options.tabSections[view.activeTab][index].fields, function (field) {
                        if (field.view.enabled) {
                            $(sectionEl).append(field.view.render().el);
                        }
                    });
                });
                return this;
            },

            showLoadingError: function () {
                this.$('.ui-loading-indicator').addClass('is-hidden');
                this.$('.ui-loading-error').removeClass('is-hidden');
            }
        });

        return AccountSettingsView;
    });
}).call(this, define || RequireJS.define);