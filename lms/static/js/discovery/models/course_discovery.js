//HACK: extend to filter out blank "" values for the facet options

(function(define) {
    define([
        'underscore',
        'backbone',
        'js/discovery/models/course_card',
        'js/discovery/models/facet_option',
        'js/discovery/models/course_discovery'
    ], function(_, Backbone, CourseCard, FacetOption, CourseDiscovery) {
        'use strict';

        return CourseDiscovery.extend({

            initialize: function() {
                this.courseCards = new Backbone.Collection([], {model: CourseCard});
                this.facetOptions = new Backbone.Collection([], {model: FacetOption});
            },

            parse: function(response) {
                var courses = response.results || [];
                var facets = response.facets || {};
                this.courseCards.add(_.pluck(courses, 'data'));

                this.set({
                    totalCount: response.total,
                    latestCount: courses.length
                });

                var options = this.facetOptions;
                _(facets).each(function(obj, key) {
                    _(obj.terms).each(function(count, term) {
                        if (term.trim() != '') { // <----
                            options.add({
                            facet: key,
                            term: term,
                            count: count
                        }, {merge: true});
                        }
                    });
                });
            },

        });
    });
})(define || RequireJS.define);
