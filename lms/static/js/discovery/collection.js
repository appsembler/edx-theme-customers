;(function (define) {

define('edx-theme-codebase/js/discovery/collection',
    [
    'js/discovery/collection',
], function (Collection) {
    'use strict';

    return Collection.extend({
        pageSize: 100
    });

});


})(define || RequireJS.define);
