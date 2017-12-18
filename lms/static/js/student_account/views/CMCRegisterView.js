(function(define) {
    'use strict';
    define([
        'js/student_account/views/RegisterView'
    ],
        function(RegisterView) {
            return RegisterView.extend({

                setExtraData: function(data) {
                    // assign a username based on email address
                    // potentially a student may encounter an error
                    // with a duplicate username.  They don't see
                    // the hidden username field so we need a more helpful 
                    // error message than default
                    var re = /[^a-zA-Z0-9]/;
                    data.username = data.email.split('@')[0].replace(re, '');
                    return data;
                }

            });
        });
}).call(this, define || RequireJS.define);
