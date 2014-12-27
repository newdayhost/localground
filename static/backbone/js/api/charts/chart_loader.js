define(["marionette",
        "underscore",
        "jquery",
        "charts/axis",
        "charts/barchart",
        "charts/piechart",
        "text!../../templates/charts/chart_loader.html"
    ],
    function (Marionette, _, $, Axis, BarChart, PieChart, ChartTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var ChartLoader = Marionette.LayoutView.extend({
            app: null,
            dataManager: null,
            activeChart: null,
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
                this.app.vent.on('resized', this.resize, this);
            },

            setChart: function (data) {
                if (data.chartType == "bar") {
                    console.log("bar chart");
                    this.ChartType = BarChart;
                } else if (data.chartType == "scatter") {
                    console.log("scatter plot");
                    this.ChartType = BarChart;
                } else if (data.chartType == "pie") {
                    console.log("pie chart");
                    this.ChartType = PieChart;
                }
                if (this.activeChart) {
                    this.activeChart.destroyChart();
                }
                this.activeChart = new this.ChartType(this.getChartOptions());
                this.chartRegion.show(this.activeChart);
                //this.onShow();
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
                if (this.activeChart) {
                    this.activeChart.destroyChart();
                }
                this.activeChart = new this.ChartType(this.getChartOptions());
                this.xAxisRegion.show(this.xAxis);
                this.yAxisRegion.show(this.yAxis);
                this.chartRegion.show(this.activeChart);
                this.resize();
            },
            resize: function () {
                var newHeight = $(window).height() - $('nav').height(),
                    padding = $('#y_axis').outerHeight() - $('#y_axis').height();
                $('#y_axis').height(newHeight - padding - $('#x_axis').outerHeight());
            },
            destroy: function () {
                this.remove();
            }
        });
        return ChartLoader;
    });
