;(function (define) {

define([
    'jquery',
    'js/discovery/views/courses_listing',
    'js/discovery/views/course_card'
], function ($, CoursesListing, CourseCardView) {
   'use strict';

    return CoursesListing.extend({

        renderItems: function () {
            var latest = this.model.latest();
            // custom Trinity sort by most recent start date to least recent
            latest.sort(function(a, b) {
                return new Date(b.attributes.start).getTime() - new Date(a.attributes.start).getTime();
            });

            var items = latest.map(function (result) {
                var item = new CourseCardView({ model: result });
                return item.render().el;
            }, this);
            this.$list.append(items);
        }
    });

});


})(define || RequireJS.define);