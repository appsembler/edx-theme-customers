(function(define) {
    define('edx-theme-codebase/js/discovery/models/search_state', [
        'edx-theme-codebase/js/discovery/models/course_discovery',
        'js/discovery/models/search_state',
    ], function(CourseDiscovery, SearchState) {
        'use strict';


        return SearchState.extend({

            initialize: function() {
                this.discovery = new CourseDiscovery();
                this.listenTo(this.discovery, 'sync', this.onSync, this);
                this.listenTo(this.discovery, 'error', this.onError, this);
            },

            cachedDiscovery: function() {
                var deferred = $.Deferred();
                var self = this;

                if (this.cached) {
                    deferred.resolveWith(this, [this.cached]);
                }
                else {
                    this.cached = new CourseDiscovery();
                    this.cached.fetch({
                        type: 'POST',
                        data: {
                            search_string: '',
                            page_size: this.pageSize,
                            page_index: 0
                        },
                        success: function(model, response, options) {
                            deferred.resolveWith(self, [model]);
                        }
                    });
                }
                return deferred.promise();
            }

        });
    });
})(define || RequireJS.define);
