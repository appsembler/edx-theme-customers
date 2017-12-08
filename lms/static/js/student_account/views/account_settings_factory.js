(function(define, undefined) {
    'use strict';

    define('extension_deps', ['underscore'], function(_) {
        return function(extensionFieldsData) {
            var ext_deps = {};
            _.each(extensionFieldsData, function(extfield) {
                ext_deps[extfield.id] = extfield.js_model;
            });
            return ext_deps;
        }
    });

    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'logger',
        'js/student_account/models/user_account_model',
        'js/student_account/models/user_preferences_model',
        'js/student_account/views/account_settings_fields',
        'js/student_account/views/account_settings_view',
        'extension_deps',
        'edx-ui-toolkit/js/utils/string-utils'
    ], function(gettext, $, _, Backbone, Logger, UserAccountModel, UserPreferencesModel,
                 AccountSettingsFieldViews, AccountSettingsView, extension_deps, StringUtils) {
        return function(
            fieldsData,
            extensionFieldsData,
            ordersHistoryData,
            authData,
            userAccountsApiUrl,
            userPreferencesApiUrl,
            accountUserId,
            platformName
        ) {
            var accountSettingsElement, userAccountModel, userPreferencesModel, aboutSectionsData,
                accountsSectionData, ordersSectionData, accountSettingsView, showAccountSettingsPage,
                showLoadingError, orderNumber, getUserField, userFields, timeZoneDropdownField, countryDropdownField,
                fetchAccountExtensionModels;

            accountSettingsElement = $('.wrapper-account-settings');

            userAccountModel = new UserAccountModel();
            userAccountModel.url = userAccountsApiUrl;

            userPreferencesModel = new UserPreferencesModel();
            userPreferencesModel.url = userPreferencesApiUrl;

            aboutSectionsData = [
                {
                    title: gettext('Basic Account Information'),
                    subtitle: gettext('These settings include basic information about your account. You can also specify additional information and see your linked social accounts on this page.'),  // eslint-disable-line max-len
                    fields: [
                        {
                            view: new AccountSettingsFieldViews.ReadonlyFieldView({
                                model: userAccountModel,
                                title: gettext('Username'),
                                valueAttribute: 'username',
                                helpMessage: StringUtils.interpolate(
                                    gettext('The name that identifies you throughout {platform_name}. You cannot change your username.'),  // eslint-disable-line max-len
                                    {platform_name: platformName}
                                )
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.TextFieldView({
                                model: userAccountModel,
                                title: gettext('Full Name'),
                                valueAttribute: 'name',
                                helpMessage: gettext(
                                    'The name that is used for ID verification and appears on your certificates. Other learners never see your full name. Make sure to enter your name exactly as it appears on your government-issued photo ID, including any non-Roman characters.'  // eslint-disable-line max-len
                                ),
                                persistChanges: true
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.EmailFieldView({
                                model: userAccountModel,
                                title: gettext('Email Address'),
                                valueAttribute: 'email',
                                helpMessage: StringUtils.interpolate(
                                    gettext('The email address you use to sign in. Communications from {platform_name} and your courses are sent to this address.'),  // eslint-disable-line max-len
                                    {platform_name: platformName}
                                ),
                                persistChanges: true
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.PasswordFieldView({
                                model: userAccountModel,
                                title: gettext('Password'),
                                screenReaderTitle: gettext('Reset Your Password'),
                                valueAttribute: 'password',
                                emailAttribute: 'email',
                                linkTitle: gettext('Reset Your Password'),
                                linkHref: fieldsData.password.url,
                                helpMessage: StringUtils.interpolate(
                                    gettext('When you select "Reset Your Password", a message will be sent to the email address for your {platform_name} account. Click the link in the message to reset your password.'),  // eslint-disable-line max-len
                                    {platform_name: platformName}
                                )
                            })
                        }
                        // ,
                        // {
                        //     view: new AccountSettingsFieldViews.LanguagePreferenceFieldView({
                        //         model: userPreferencesModel,
                        //         title: gettext('Language'),
                        //         valueAttribute: 'pref-lang',
                        //         required: true,
                        //         refreshPageOnSave: true,
                        //         helpMessage: StringUtils.interpolate(
                        //             gettext('The language used throughout this site. This site is currently available in a limited number of languages.'),  // eslint-disable-line max-len
                        //             {platform_name: platformName}
                        //         ),
                        //         options: fieldsData.language.options,
                        //         persistChanges: true
                        //     })
                        // },
                        // {
                        //     view: new AccountSettingsFieldViews.DropdownFieldView({
                        //         model: userAccountModel,
                        //         required: true,
                        //         title: gettext('Country or Region'),
                        //         valueAttribute: 'country',
                        //         options: fieldsData.country.options,
                        //         persistChanges: true
                        //     })
                        // },
                        // {
                        //     view: new AccountSettingsFieldViews.TimeZoneFieldView({
                        //         model: userPreferencesModel,
                        //         required: true,
                        //         title: gettext('Time Zone'),
                        //         valueAttribute: 'time_zone',
                        //         helpMessage: gettext('Select the time zone for displaying course dates. If you do not specify a time zone, course dates, including assignment deadlines, will be displayed in your browser\'s local time zone.'), // eslint-disable-line max-len
                        //         groupOptions: [{
                        //             groupTitle: gettext('All Time Zones'),
                        //             selectOptions: fieldsData.time_zone.options,
                        //             nullValueOptionLabel: gettext('Default (Local Time Zone)')
                        //         }],
                        //         persistChanges: true
                        //     })
                        // }
                    ]
                }
                // ,
                // {
                //     title: gettext('Additional Information'),
                //     fields: [
                //         {
                //             view: new AccountSettingsFieldViews.DropdownFieldView({
                //                 model: userAccountModel,
                //                 title: gettext('Education Completed'),
                //                 valueAttribute: 'level_of_education',
                //                 options: fieldsData.level_of_education.options,
                //                 persistChanges: true
                //             })
                //         },
                //         {
                //             view: new AccountSettingsFieldViews.DropdownFieldView({
                //                 model: userAccountModel,
                //                 title: gettext('Gender'),
                //                 valueAttribute: 'gender',
                //                 options: fieldsData.gender.options,
                //                 persistChanges: true
                //             })
                //         },
                //         {
                //             view: new AccountSettingsFieldViews.DropdownFieldView({
                //                 model: userAccountModel,
                //                 title: gettext('Year of Birth'),
                //                 valueAttribute: 'year_of_birth',
                //                 options: fieldsData.year_of_birth.options,
                //                 persistChanges: true
                //             })
                //         },
                //         {
                //             view: new AccountSettingsFieldViews.LanguageProficienciesFieldView({
                //                 model: userAccountModel,
                //                 title: gettext('Preferred Language'),
                //                 valueAttribute: 'language_proficiencies',
                //                 options: fieldsData.preferred_language.options,
                //                 persistChanges: true
                //             })
                //         }
                //     ]
                // }
            ];

            // set TimeZoneField to listen to CountryField
            getUserField = function(list, search) {
                return _.find(list, function(field) {
                    return field.view.options.valueAttribute === search;
                }).view;
            };
            userFields = _.find(aboutSectionsData, function(section) {
                return section.title === gettext('Basic Account Information');
            }).fields;
            timeZoneDropdownField = getUserField(userFields, 'time_zone');
            countryDropdownField = getUserField(userFields, 'country');
            timeZoneDropdownField.listenToCountryView(countryDropdownField);

            accountsSectionData = [
                {
                    title: gettext('Linked Accounts'),
                    subtitle: StringUtils.interpolate(
                        gettext('You can link your social media accounts to simplify signing in to {platform_name}.'),
                        {platform_name: platformName}
                    ),

                    fields: _.map(authData.providers, function(provider) {
                        return {
                            'view': new AccountSettingsFieldViews.AuthFieldView({
                                title: provider.name,
                                valueAttribute: 'auth-' + provider.id,
                                helpMessage: '',
                                connected: provider.connected,
                                connectUrl: provider.connect_url,
                                acceptsLogins: provider.accepts_logins,
                                disconnectUrl: provider.disconnect_url,
                                platformName: platformName
                            })
                        };
                    })
                }
            ];

            ordersHistoryData.unshift(
                {
                    'title': gettext('ORDER NAME'),
                    'order_date': gettext('ORDER PLACED'),
                    'price': gettext('TOTAL'),
                    'number': gettext('ORDER NUMBER')
                }
            );

            ordersSectionData = [
                {
                    title: gettext('My Orders'),
                    subtitle: StringUtils.interpolate(
                        gettext('This page contains information about orders that you have placed with {platform_name}.'),  // eslint-disable-line max-len
                        {platform_name: platformName}
                    ),
                    fields: _.map(ordersHistoryData, function(order) {
                        orderNumber = order.number;
                        if (orderNumber === 'ORDER NUMBER') {
                            orderNumber = 'orderId';
                        }
                        return {
                            'view': new AccountSettingsFieldViews.OrderHistoryFieldView({
                                title: order.title,
                                totalPrice: order.price,
                                orderId: order.number,
                                orderDate: order.order_date,
                                receiptUrl: order.receipt_url,
                                valueAttribute: 'order-' + orderNumber
                            })
                        };
                    })
                }
            ];

            // extension fields
            var deps, ext_fields;
            var ext_deps_config = extension_deps(extensionFieldsData);

            // http://stackoverflow.com/a/17448869
            RequireJS.require(_.values(ext_deps_config), function() {
                // TODO: some defensive type checking
                deps = _.object(_.keys(ext_deps_config), arguments);
                ext_fields = _.map(extensionFieldsData, function(extfield) {
                    var model_inst, field_view_class;
                    model_inst = new deps[extfield.id]();
                    model_inst.url = extfield.api_url;
                    field_view_class = eval(extfield.js_field_view_class);
                    return {
                        'view': new field_view_class({ // TODO: determine which view
                            model: model_inst,
                            api_url: model_inst.url,
                            title: extfield.title,
                            valueAttribute: extfield.valueAttribute,
                            options: extfield.options,
                            persistChanges: extfield.persistChanges,
                            helpMessage: extfield.helpMessage
                            // TODO: screenReaderTitle
                        })
                    };
                });
                _.each(ext_fields, function(field) { 
                    userFields.push(field); // add to basic information
                });

                // move the model fetching inside the 
                // extension fields require() async call.
                userAccountModel.fetch({
                    success: function () {
                        // Fetch the user preferences model
                        userPreferencesModel.fetch({
                            success: function() {                                
                                fetchAccountExtensionModels();
                                accountSettingsView.render();
                                showAccountSettingsPage();                                
                            },
                            error: showLoadingError
                        });
                    },
                    error: showLoadingError
                });

            });  // end of extension fields require() async

            var accountSettingsView = new AccountSettingsView({
                model: userAccountModel,
                accountUserId: accountUserId,
                el: accountSettingsElement,
                tabSections: {
                    aboutTabSections: aboutSectionsData,
                    accountsTabSections: accountsSectionData,
                    ordersTabSections: ordersSectionData
                },
                userPreferencesModel: userPreferencesModel
            });



            showAccountSettingsPage = function() {
                // Record that the account settings page was viewed.
                Logger.log('edx.user.settings.viewed', {
                    page: 'account',
                    visibility: null,
                    user_id: accountUserId
                });
            };

            showLoadingError = function() {
                accountSettingsView.showLoadingError();
            };


            fetchAccountExtensionModels = function() {
                //fetch each of the extension field models
                // TODO: is it important to chain these as on success callbacks?
                _.each(ext_fields, function (el, index, list) {
                    el.view.model.fetch({error: showLoadingError});
                });
            };
            

            return {
                userAccountModel: userAccountModel,
                userPreferencesModel: userPreferencesModel,
                accountSettingsView: accountSettingsView
            };
        };
    });
}).call(this, define || RequireJS.define);
