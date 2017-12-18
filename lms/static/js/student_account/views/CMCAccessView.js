(function(define) {
    'use strict';
    define([
        'js/student_account/views/AccessView',
        'js/student_account/models/RegisterModel',
        'edx-theme-codebase/js/student_account/views/CMCRegisterView'
        ],
        function(AccessView, RegisterModel, CMCRegisterView) {

             // use CMCRegisterView
            _.extend(AccessView.prototype.load, {                
                register: function(data) {
                    var model = new RegisterModel({}, {
                        method: data.method,
                        url: data.submit_url
                    });

                    this.subview.register = new CMCRegisterView({
                        fields: data.fields,
                        model: model,
                        thirdPartyAuth: this.thirdPartyAuth,
                        platformName: this.platformName,
                        prologue: data.prologue,
                        epilogue: data.epilogue
                    });

                    // Listen for 'auth-complete' event so we can enroll/redirect the user appropriately.
                    this.listenTo(this.subview.register, 'auth-complete', this.authComplete);
                }
            });

            return AccessView;
        });
}).call(this, define || RequireJS.define);