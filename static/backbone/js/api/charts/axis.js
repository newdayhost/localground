define(["backbone",
        "highcharts"
    ],
    function (Backbone) {
        "use strict";
        var Axis = Backbone.View.extend({
            app: null,
            initialize: function (opts) {
                this.app = opts.app;
            },
            render: function () {
                this.$el.html("hello");
            }
        });
        return Axis;
    });