(function(define) {
    'use strict';
    define('edx-theme-codebase/js/student_account/logistration_factory',
        ['underscore',
        'jquery',
        'edx-theme-codebase/js/student_account/views/CMCAccessView'
    ],
        function(_, $, CMCAccessView) {
            return function(options) {
                var $logistrationElement = $('#login-and-registration-container');

                new CMCAccessView(_.extend(options, {el: $logistrationElement}));
            };
        }
    );
}).call(this, define || RequireJS.define);
