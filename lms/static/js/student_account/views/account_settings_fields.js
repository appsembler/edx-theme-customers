;(function (define, undefined) {
    'use strict';
    define([
        'gettext',
        'jquery',
        'underscore',
        'backbone',
        'js/views/fields',
        'text!templates/fields/field_text_account.underscore',
        'text!templates/fields/field_readonly_account.underscore',
        'text!templates/fields/field_link_account.underscore',
        'text!templates/fields/field_dropdown_account.underscore',
        'text!templates/fields/field_social_link_account.underscore',
        'text!templates/fields/field_order_history.underscore',
        'edx-ui-toolkit/js/utils/string-utils',
        'edx-ui-toolkit/js/utils/html-utils'
    ], function (
        gettext, $, _, Backbone,
        FieldViews,
        field_text_account_template,
        field_readonly_account_template,
        field_link_account_template,
        field_dropdown_account_template,
        field_social_link_template,
        field_order_history_template,
        StringUtils,
        HtmlUtils
    )
    {

        var AccountSettingsFieldViews = {
            ReadonlyFieldView: FieldViews.ReadonlyFieldView.extend({
                fieldTemplate: field_readonly_account_template
            }),
            TextFieldView: FieldViews.TextFieldView.extend({
                fieldTemplate: field_text_account_template
            }),
            DropdownFieldView: FieldViews.DropdownFieldView.extend({
                fieldTemplate: field_dropdown_account_template,
            }),
            DistrictDropdownFieldView: FieldViews.DropdownFieldView.extend({
                fieldTemplate: field_dropdown_account_template,
                render: function () {
                    HtmlUtils.setHtml(this.$el, HtmlUtils.template(this.fieldTemplate)({
                        id: this.options.valueAttribute,
                        mode: this.mode,
                        editable: this.editable,
                        title: this.options.title,
                        screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                        titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                        iconName: this.options.iconName,
                        showBlankOption: (!this.options.required || !this.modelValueIsSet()),
                        selectOptions: this.options.options,
                        message: this.helpMessage
                    }));
                    this.delegateEvents();
                    this.updateValueInField();

                    if (this.editable === 'toggle') {
                        this.showCanEditMessage(this.mode === 'display');
                    }

                    // only change from super here, and ugh setTimeout
                    // TODO:  couldn't find any kind of callback but by this
                    // point the field isn't actually rendered as HTML
                    setTimeout( function(){ $('#u-field-select-district').select2()}, 1000);
                    
                    return this;
                    
                }
            }),
            EmailFieldView: FieldViews.TextFieldView.extend({
                fieldTemplate: field_text_account_template,
                successMessage: function () {
                    return HtmlUtils.joinHtml(
                        this.indicators.success,
                        StringUtils.interpolate(
                            gettext('We\'ve sent a confirmation message to {new_email_address}. Click the link in the message to update your email address.'), /* jshint ignore:line */
                            {'new_email_address': this.fieldValue()}
                        )
                    );
                }
            }),
            LanguagePreferenceFieldView: FieldViews.DropdownFieldView.extend({
                fieldTemplate: field_dropdown_account_template,
                saveSucceeded: function () {
                    var data = {
                        'language': this.modelValue()
                    };

                    var view = this;
                    $.ajax({
                        type: 'POST',
                        url: '/i18n/setlang/',
                        data: data,
                        dataType: 'html',
                        success: function () {
                            view.showSuccessMessage();
                        },
                        error: function () {
                            view.showNotificationMessage(
                                HtmlUtils.joinHtml(
                                    view.indicators.error,
                                    gettext('You must sign out and sign back in before your language changes take effect.') // jshint ignore:line
                                )
                            );
                        }
                    });
                }

            }),
            PasswordFieldView: FieldViews.LinkFieldView.extend({
                fieldType: 'button',
                fieldTemplate: field_link_account_template,
                events: {
                    'click button': 'linkClicked'
                },
                initialize: function (options) {
                    this.options = _.extend({}, options);
                    this._super(options);
                    _.bindAll(this, 'resetPassword');
                },
                linkClicked: function (event) {
                    event.preventDefault();
                    this.resetPassword(event);
                },
                resetPassword: function () {
                    var data = {};
                    data[this.options.emailAttribute] = this.model.get(this.options.emailAttribute);

                    var view = this;
                    $.ajax({
                        type: 'POST',
                        url: view.options.linkHref,
                        data: data,
                        success: function () {
                            view.showSuccessMessage();
                        },
                        error: function (xhr) {
                            view.showErrorMessage(xhr);
                        }
                    });
                },
                successMessage: function () {
                    return HtmlUtils.joinHtml(
                        this.indicators.success,
                        StringUtils.interpolate(
                            gettext('We\'ve sent a message to {email_address}. Click the link in the message to reset your password.'), /* jshint ignore:line */
                            {'email_address': this.model.get(this.options.emailAttribute)}
                        )
                    );
                }
            }),
            LanguageProficienciesFieldView: FieldViews.DropdownFieldView.extend({
                fieldTemplate: field_dropdown_account_template,
                modelValue: function () {
                    var modelValue = this.model.get(this.options.valueAttribute);
                    if (_.isArray(modelValue) && modelValue.length > 0) {
                        return modelValue[0].code;
                    } else {
                        return null;
                    }
                },
                saveValue: function () {
                    if (this.persistChanges === true) {
                        var attributes = {},
                            value = this.fieldValue() ? [{'code': this.fieldValue()}] : [];
                        attributes[this.options.valueAttribute] = value;
                        this.saveAttributes(attributes);
                    }
                }
            }),
            AuthFieldView: FieldViews.LinkFieldView.extend({
                fieldTemplate: field_social_link_template,
                className: function () {
                    return 'u-field u-field-social u-field-' + this.options.valueAttribute;
                },
                initialize: function (options) {
                    this.options = _.extend({}, options);
                    this._super(options);
                    _.bindAll(this, 'redirect_to', 'disconnect', 'successMessage', 'inProgressMessage');
                },
                render: function () {
                    var linkTitle = '',
                        linkClass = '',
                        subTitle = '',
                        screenReaderTitle = StringUtils.interpolate(
                            gettext("Link your {accountName} account"),
                            {accountName: this.options.title}
                        );
                    if (this.options.connected) {
                        linkTitle = gettext('Unlink This Account');
                        linkClass = 'social-field-linked';
                        subTitle = StringUtils.interpolate(
                            gettext('You can use your {accountName} account to sign in to your {platformName} account.'), /* jshint ignore:line */
                            {accountName: this.options.title, platformName: this.options.platformName}
                        );
                        screenReaderTitle = StringUtils.interpolate(
                            gettext("Unlink your {accountName} account"),
                            {accountName: this.options.title}
                        );
                    } else if (this.options.acceptsLogins) {
                        linkTitle = gettext('Link Your Account');
                        linkClass = 'social-field-unlinked';
                        subTitle = StringUtils.interpolate(
                            gettext('Link your {accountName} account to your {platformName} account and use {accountName} to sign in to {platformName}.'), /* jshint ignore:line */
                            {accountName: this.options.title, platformName: this.options.platformName}
                        );
                    }

                    HtmlUtils.setHtml(this.$el, HtmlUtils.template(this.fieldTemplate)({
                        id: this.options.valueAttribute,
                        title: this.options.title,
                        screenReaderTitle: screenReaderTitle,
                        linkTitle: linkTitle,
                        subTitle: subTitle,
                        linkClass: linkClass,
                        linkHref: '#',
                        message: this.helpMessage
                    }));
                    this.delegateEvents();
                    return this;
                },
                linkClicked: function (event) {
                    event.preventDefault();

                    this.showInProgressMessage();

                    if (this.options.connected) {
                        this.disconnect();
                    } else {
                        // Direct the user to the providers site to start the authentication process.
                        // See python-social-auth docs for more information.
                        this.redirect_to(this.options.connectUrl);
                    }
                },
                redirect_to: function (url) {
                    window.location.href = url;
                },
                disconnect: function () {
                    var data = {};

                    // Disconnects the provider from the user's edX account.
                    // See python-social-auth docs for more information.
                    var view = this;
                    $.ajax({
                        type: 'POST',
                        url: this.options.disconnectUrl,
                        data: data,
                        dataType: 'html',
                        success: function () {
                            view.options.connected = false;
                            view.render();
                            view.showSuccessMessage();
                        },
                        error: function (xhr) {
                            view.showErrorMessage(xhr);
                        }
                    });
                },
                inProgressMessage: function () {
                    return HtmlUtils.joinHtml(this.indicators.inProgress, (
                        this.options.connected ? gettext('Unlinking') : gettext('Linking')
                    ));
                },
                successMessage: function () {
                    return HtmlUtils.joinHtml(this.indicators.success, gettext('Successfully unlinked.'));
                }
            }),
            
            OrderHistoryFieldView: FieldViews.ReadonlyFieldView.extend({
                fieldType: 'orderHistory',
                fieldTemplate: field_order_history_template,

                initialize: function (options) {
                    this.options = options;
                    this._super(options);
                    this.template = HtmlUtils.template(this.fieldTemplate);
                },

                render: function () {
                    HtmlUtils.setHtml(this.$el, this.template({
                        title: this.options.title,
                        totalPrice: this.options.totalPrice,
                        orderId: this.options.orderId,
                        orderDate: this.options.orderDate,
                        receiptUrl: this.options.receiptUrl,
                        valueAttribute: this.options.valueAttribute
                    }));
                    this.delegateEvents();
                    return this;
                }
            })
        };

        return AccountSettingsFieldViews;
    });
}).call(this, define || RequireJS.define);
