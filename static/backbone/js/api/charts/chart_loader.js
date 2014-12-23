define(["marionette",
        "underscore",
        "charts/axis",
        "charts/barchart",
        "text!../../templates/charts/chart_loader.html"
    ],
    function (Marionette, _, Axis, BarChart, ChartTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var ChartLoader = Marionette.LayoutView.extend({
            app: null,
            dataManager: null,
            ChartType: BarChart,
            template: function () {
                return _.template(ChartTemplate);
            },

            regions: {
                xAxisRegion: "#x_axis",
                yAxisRegion: "#y_axis",
                chartRegion: "#chart_area"
            },
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.app.vent.on('chart-type-changed', this.setChart, this);
            },

            setChart: function (data) {
                if (data.chartType == "bar") {
                    this.ChartType = BarChart;
                } else if (data.chartType == "scatter") {
                    this.ChartType = BarChart;
                } else if (data.chartType == "pie") {
                    this.ChartType = BarChart;
                }
                this.onShow();
            },

            getChartOptions: function () {
                return {
                    app: this.app,
                    dataManager: this.dataManager,
                    xAxis: this.xAxis,
                    yAxis: this.yAxis
                };
            },
            onShow: function () {
                var opts = {
                    app: this.app,
                    dataManager: this.dataManager
                };
                this.xAxis = new Axis(_.extend(opts, { axisType: 'x' }));
                this.yAxis = new Axis(_.extend(opts, { axisType: 'y' }));
                this.xAxisRegion.show(this.xAxis);
                this.yAxisRegion.show(this.yAxis);
                this.chartRegion.show(new this.ChartType(this.getChartOptions()));
            },
            destroy: function () {
                this.remove();
            }
        });
        return ChartLoader;
    });
