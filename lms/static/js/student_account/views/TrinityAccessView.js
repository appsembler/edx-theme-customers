;(function (define) {
    'use strict';
    define([
            '/js/student_account/views/AccessView',
            'js/student_account/models/RegisterModel',
            'edx-theme-codebase/js/student_account/views/TrinityRegisterView'
        ],
        function(AccessView, RegisterModel, RegisterView) {

        return AccessView.View.extend({

                register: function( data ) {
                    var model = new RegisterModel({}, {
                        method: data.method,
                        url: data.submit_url
                    });

                    this.subview.register =  new RegisterView({
                        fields: data.fields,
                        model: model,
                        thirdPartyAuth: this.thirdPartyAuth,
                        platformName: this.platformName
                    });

                    // Listen for 'auth-complete' event so we can enroll/redirect the user appropriately.
                    this.listenTo( this.subview.register, 'auth-complete', this.authComplete );
                }
    });
}).call(this, define || RequireJS.define);