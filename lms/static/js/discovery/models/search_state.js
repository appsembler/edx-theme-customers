;(function (define) {

define('edx-theme-codebase/js/discovery/models/search_state',
    [
    'js/discovery/models/search_state'
], function (SearchState) {
    'use strict';

    return SearchState.extend({

        pageSize: 100

    });

});


})(define || RequireJS.define);
