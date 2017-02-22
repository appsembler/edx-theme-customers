;(function (define, undefined) {
    'use strict';
    define([
        'gettext', 'underscore', 'backbone'
    ], function (gettext, _, Backbone) {

        var UserTrinityUserProfileModel = Backbone.Model.extend({
            idAttribute: 'district',
            defaults: {
                district: ''
            }
        });

        return UserTrinityUserProfileModel;
    });
}).call(this, define || RequireJS.define);
