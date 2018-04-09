;(function (define) {
    'use strict';
    define('edx-theme-codebase/js/student_account/logistration_factory',
           [
            'jquery',
            'edx-theme-codebase/js/student_account/views/TrinityAccessView'
        ],
        function($, AccessView) {
            return function(options) {
                var $logistrationElement = $('#login-and-registration-container');

                new AccessView(_.extend(options, {el: $logistrationElement}));
            };
        }
    );
}).call(this, define || RequireJS.define);
