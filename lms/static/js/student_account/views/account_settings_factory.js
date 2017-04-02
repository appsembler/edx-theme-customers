;(function (define, undefined) {
    'use strict';
    define("eucalyptus-theme-codebase/js/student_account/views/account_settings_factory", [
        'gettext', 'jquery', 'underscore', 'backbone', 'logger',
        'js/student_account/models/user_account_model',
        'js/student_account/models/user_preferences_model',
        'eucalyptus-theme-codebase/js/student_account/models/trinity_user_profile_model',
        'eucalyptus-theme-codebase/js/student_account/views/account_settings_fields',
        'eucalyptus-theme-codebase/js/student_account/views/account_settings_view',
        'edx-ui-toolkit/js/utils/string-utils'
    ], function (gettext, $, _, Backbone, Logger, UserAccountModel, UserPreferencesModel,
                 UserTrinityUserProfileModel,
                 AccountSettingsFieldViews, AccountSettingsView, StringUtils) {

        return function (
            fieldsData,
            ordersHistoryData,
            authData,
            userAccountsApiUrl,
            userPreferencesApiUrl,
            userTrinityUserProfileUrl,
            accountUserId,
            platformName
        ) {
            var accountSettingsElement, userAccountModel, userPreferencesModel, aboutSectionsData,
                accountsSectionData, ordersSectionData, accountSettingsView, showAccountSettingsPage,
                showLoadingError, orderNumber, userTrinityUserProfileModel;

            accountSettingsElement = $('.wrapper-account-settings');

            userAccountModel = new UserAccountModel();
            userAccountModel.url = userAccountsApiUrl;

            userPreferencesModel = new UserPreferencesModel();
            userPreferencesModel.url = userPreferencesApiUrl;

            // specific to Trinity fields e.g., District (school district)
            userTrinityUserProfileModel = new UserTrinityUserProfileModel();
            userTrinityUserProfileModel.url = userTrinityUserProfileUrl;            

            aboutSectionsData = [
                 {
                    title: gettext('Basic Account Information'),
                    subtitle: gettext('These settings include basic information about your account. You can also specify additional information and see your linked social accounts on this page.'), /* jshint ignore:line */
                    fields: [
                        {
                            view: new AccountSettingsFieldViews.ReadonlyFieldView({
                                model: userAccountModel,
                                title: gettext('Username'),
                                valueAttribute: 'username',
                                helpMessage: StringUtils.interpolate(
                                    gettext('The name that identifies you throughout {platform_name}. You cannot change your username.'), /* jshint ignore:line */
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
                                    'The name that is used for ID verification and appears on your certificates. Other learners never see your full name. Make sure to enter your name exactly as it appears on your government-issued photo ID, including any non-Roman characters.' /* jshint ignore:line */
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
                                    gettext('The email address you use to sign in. Communications from {platform_name} and your courses are sent to this address.'), /* jshint ignore:line */
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
                                    gettext('When you select "Reset Your Password", a message will be sent to the email address for your {platform_name} account. Click the link in the message to reset your password.'), /* jshint ignore:line */
                                    {platform_name: platformName}
                                )
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.LanguagePreferenceFieldView({
                                model: userPreferencesModel,
                                title: gettext('Language'),
                                valueAttribute: 'pref-lang',
                                required: true,
                                refreshPageOnSave: true,
                                helpMessage: StringUtils.interpolate(
                                    gettext('The language used throughout this site. This site is currently available in a limited number of languages.'), /* jshint ignore:line */
                                    {platform_name: platformName}
                                ),
                                options: fieldsData.language.options,
                                persistChanges: true
                            })
                        },
                        // Trinity: not wanted 
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
                        {
                            view: new AccountSettingsFieldViews.DropdownFieldView({
                                model: userPreferencesModel,
                                required: true,
                                title: gettext('Time Zone'),
                                valueAttribute: 'time_zone',
                                enabled: fieldsData.time_zone.enabled,
                                helpMessage: gettext(
                                    'Select the time zone for displaying course dates. If you do not specify a ' +
                                    'time zone here, course dates, including assignment deadlines, are displayed in ' +
                                    'Coordinated Universal Time (UTC).'
                                ),
                                options: fieldsData.time_zone.options,
                                persistChanges: true
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.DistrictDropdownFieldView({
                                model: userTrinityUserProfileModel,
                                required: true,
                                title: gettext('District'),
                                valueAttribute: 'district',
                                options: fieldsData['district']['options'],
                                helpMessage: 'Your Texas school district.',
                                persistChanges: true
                            })
                        }                        
                    ]
                },
                {
                    title: gettext('Additional Information'),
                    fields: [
                        // not wanted by Trinity
                        // {
                        //     view: new AccountSettingsFieldViews.DropdownFieldView({
                        //         model: userAccountModel,
                        //         title: gettext('Education Completed'),
                        //         valueAttribute: 'level_of_education',
                        //         options: fieldsData.level_of_education.options,
                        //         persistChanges: true
                        //     })
                        // },
                        // {
                        //     view: new AccountSettingsFieldViews.DropdownFieldView({
                        //         model: userAccountModel,
                        //         title: gettext('Gender'),
                        //         valueAttribute: 'gender',
                        //         options: fieldsData.gender.options,
                        //         persistChanges: true
                        //     })
                        // },
                        {
                            view: new AccountSettingsFieldViews.DropdownFieldView({
                                model: userAccountModel,
                                title: gettext('Year of Birth'),
                                valueAttribute: 'year_of_birth',
                                options: fieldsData.year_of_birth.options,
                                persistChanges: true
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.LanguageProficienciesFieldView({
                                model: userAccountModel,
                                title: gettext('Preferred Language'),
                                valueAttribute: 'language_proficiencies',
                                options: fieldsData.preferred_language.options,
                                persistChanges: true
                            })
                        }
                    ]
                }
            ];

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
                        gettext('This page contains information about orders that you have placed with {platform_name}.'),  /* jshint ignore:line */
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

            accountSettingsView = new AccountSettingsView({
                model: userAccountModel,
                accountUserId: accountUserId,
                el: accountSettingsElement,
                tabSections: {
                    aboutTabSections: aboutSectionsData
                    // Not wanted for Gateway Courses
                    // accountsTabSections: accountsSectionData,
                    // ordersTabSections: ordersSectionData
                },
                userPreferencesModel: userPreferencesModel
            });

            accountSettingsView.render();

            showAccountSettingsPage = function () {
                // Record that the account settings page was viewed.
                Logger.log('edx.user.settings.viewed', {
                    page: "account",
                    visibility: null,
                    user_id: accountUserId
                });

                // Render the fields
                accountSettingsView.renderFields();
            };

            showLoadingError = function () {
                accountSettingsView.showLoadingError();
            };

            userAccountModel.fetch({
                success: function () {
                    // Fetch the user preferences model
                    userPreferencesModel.fetch({
                        success: function() {
                            // Fetch the trinity user profile model
                            userTrinityUserProfileModel.fetch({
                                success: showAccountSettingsPage,
                                error: showLoadingError
                            })
                        },
                        error: showLoadingError
                    });
                },
                error: showLoadingError
            });

            return {
                userAccountModel: userAccountModel,
                userPreferencesModel: userPreferencesModel,
                userTrinityUserProfileModel: userTrinityUserProfileModel,
                accountSettingsView: accountSettingsView
            };
        };
    });
}).call(this, define || RequireJS.define);
