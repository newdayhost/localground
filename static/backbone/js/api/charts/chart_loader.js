define(["marionette",
        "underscore",
        "jquery",
        "charts/axis",
        "charts/barchart",
        "charts/piechart",
        "charts/scatterplot",
        "text!../../templates/charts/chart_loader.html"
    ],
    function (Marionette, _, $, Axis, BarChart, PieChart, ScatterPlot, ChartTemplate) {
        'use strict';
        /**
         * The ChartLoader's job is to initialize the x-axis, y-axis,
         * and the appropriate chart type, depending on the user's selection.
         * It listens for the "chart-type-changed" event in order to respond
         * to user feedback.
         */
        var ChartLoader = Marionette.LayoutView.extend({
            app: null,
            dataManager: null,
            activeChart: null,
            chartType: "bar",
            template: function () {
                return _.template(ChartTemplate);
            },
            regions: {
                xAxisRegion: "#x_axis",
                yAxisRegion: "#y_axis",
                chartRegion: "#chart_area"
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                opts = {
                    app: this.app,
                    dataManager: this.dataManager
                };
                this.xAxis = new Axis(_.extend(opts, { axisType: 'x' }));
                this.yAxis = new Axis(_.extend(opts, { axisType: 'y' }));
                this.setChart({ chartType: this.chartType });
                this.addEventListeners();
            },

            addEventListeners: function () {
                this.app.vent.on('chart-type-changed', this.setChart, this);
                this.app.vent.on('resized', this.resize, this);
            },

            setChart: function (data) {
                var opts = {
                    app: this.app,
                    dataManager: this.dataManager
                };

                //destroy existing chart if it exists:
                if (this.activeChart) {
                    this.activeChart.destroyChart();
                }

                //initialize new chart:
                if (data.chartType == "bar") {
                    this.activeChart = new BarChart(
                        _.extend(opts, {
                            xAxis: this.xAxis,
                            yAxis: this.yAxis
                        })
                    );
                    // show the y-axis for a bar chart:
                    this.yAxisRegion.$el.show();
                } else if (data.chartType == "scatter") {
                    this.activeChart = new ScatterPlot(
                        _.extend(opts, {
                            xAxis: this.xAxis,
                            yAxis: this.yAxis
                        })
                    );
                    // show the y-axis for a bar chart:
                    this.yAxisRegion.$el.show();
                } else if (data.chartType == "pie") {
                    this.activeChart = new PieChart(
                        _.extend(opts, { xAxis: this.xAxis })
                    );
                    //hide the y-axis for a pie chart:
                    this.yAxisRegion.$el.hide();
                }
                //only show if the charRegion has already been rendered:
                if (this.chartRegion.$el.get(0)) {
                    this.chartRegion.show(this.activeChart);
                }
            },
            onShow: function () {
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
