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
            },

            setChart: function (data) {
                switch (data.chartType) {
                    case "bar":
                        this.ChartType = BarChart;
                        break;
                    case "scatter":
                        this.ChartType = BarChart;
                        break;
                    case "pie":
                        this.ChartType = BarChart;
                        break;
                }
                this.onShow();
            },

            onShow: function () {
                var opts = {
                        app: this.app,
                        dataManager: this.dataManager
                    },
                    xAxis = new Axis(_.extend(opts, { axisType: 'x' })),
                    yAxis = new Axis(_.extend(opts, { axisType: 'y' })),
                    chartOpts = _.extend(_.clone(opts), { xAxis: xAxis, yAxis: yAxis });
                this.xAxisRegion.show(xAxis);
                this.yAxisRegion.show(yAxis);
                this.chartRegion.show(new this.ChartType(chartOpts));
            },
            destroy: function () {
                this.remove();
            }
        });
        return ChartLoader;
    });
