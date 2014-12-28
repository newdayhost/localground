define(["jquery",
        "backbone",
        "highcharts"
    ],
    function ($, Backbone) {
        "use strict";
        /**
         * The Chart's job is to serve as an abstract base class for
         * rendering a chart. All charts should inherit from this class. It
         * controls some generic functionality around resizing, and
         * adding / removing variables and data.
         */
        var Chart = Backbone.View.extend({
            collection: null,
            timeoutID: null,
            initialMessage: 'Initial message goes here',
            xAxis: null,
            chartHeight: 300,
            initialize: function (opts) {
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.addEventListeners();
                this.xAxis = opts.xAxis;
            },
            addEventListeners: function () {
                this.app.vent.on("variable-changed", this.render, this);
                this.app.vent.on('form-data-changed', this.render, this);
                this.app.vent.on('resized', this.resize, this);
            },
            render: function () {
                console.log("override the render method with your chart's renderer");
            },
            destroyChart: function () {
                if (this.$el.highcharts()) {
                    this.$el.highcharts().destroy();
                }
            },
            showInitialMessage: function () {
                this.setSize();
                this.$el.empty();
                this.$el.height(this.chartHeight);
                this.$el.html($('<div class="v-align"></div>').html(this.initialMessage));
            },
            transformData: function () {
                console.log("override the transformData method with your chart's renderer");
            },
            setSize: function () {
                // chart height = height(window) - height(top menu) - height(x-axis):
                var newHeight = $(window).height() - $('nav').height(),
                    padding = $('#chart_area').outerHeight() - $('#chart_area').height();
                this.chartHeight = newHeight - padding - $('#x_axis').outerHeight();
            },
            resize: function () {
                // timeouts used so that only resize after browser has
                // finished resizing (i.e., don't call this function
                // continuously while browser is resizing).
                var that = this;
                clearTimeout(this.timeoutID);
                this.setSize();
                this.timeoutID = setTimeout(function () { that.render(); }, 500);
            }
        });
        return Chart;
    });