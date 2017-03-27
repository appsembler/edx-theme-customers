;(function (define) {
    'use strict';
    define('eucalyptus-theme-codebase/js/student_account/logistration_factory',
           [
            'jquery',
            'eucalyptus-theme-codebase/js/student_account/views/AccessView'
        ],
        function($, AccessView) {
            return function(options) {
                var $logistrationElement = $('#login-and-registration-container');

                new AccessView(_.extend(options, {el: $logistrationElement}));
            };
        }
    );
}).call(this, define || RequireJS.define);
