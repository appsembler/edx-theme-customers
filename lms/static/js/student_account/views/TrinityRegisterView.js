;(function (define) {
    'use strict';
    define('edx-theme-codebase/js/student_account/views/RegisterView',
           [
            'jquery',
            'js/student_account/views/RegisterView'
        ],
        function($, RegisterView) {

        return RegisterView.extend({

            postRender: function() {
                var $container = $(this.el);
                this.$form = $container.find('form');
                this.$errors = $container.find('.submission-error');
                this.$submitButton = $container.find(this.submitButton);
                
                $('#register-district').select2();  
            }
    });
}).call(this, define || RequireJS.define);


