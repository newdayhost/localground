define(["backbone",
        "highcharts"
    ],
    function (Backbone) {
        "use strict";
        var ChartLoader = Backbone.View.extend({
            initialize: function (opts) {
                this.opts = opts;
            },
            render: function () {
                this.$el.html("hello");
            }
        });
        return ChartLoader;
    });