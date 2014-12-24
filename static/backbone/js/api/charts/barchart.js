define(["underscore",
        "jquery",
        "backbone",
        "highcharts"
    ],
    function (_, $, Backbone) {
        "use strict";
        var BarChart = Backbone.View.extend({
            collection: null,
            timeoutID: null,
            xAxis: null,
            yAxis: null,
            chartHeight: 300,
            initialize: function (opts) {
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.xAxis = opts.xAxis;
                this.yAxis = opts.yAxis;
                this.app.vent.on("variable-changed", this.render, this);
                this.app.vent.on('form-data-changed', this.clear, this);
                this.app.vent.on('resized', this.resize, this);
            },
            render: function () {
                if (!this.yAxis.collection) { return; }
                if (this.yAxis.collection.length >= 1 &&
                        this.xAxis.collection.length == 1) {
                    this.renderHistogram();
                }
            },
            clear: function () {
                this.$el.empty();
            },
            renderHistogram: function () {
                this.setSize();
                var collection = this.dataManager.getRecords(),
                    categories = [],
                    seriesData = [],
                    that = this,
                    i = 0,
                    chartOpts = null;
                this.yAxis.collection.each(function (field) {
                    seriesData.push({
                        name: field.get("col_alias"),
                        data: []
                    });
                });
                collection.each(function (record) {
                    categories.push(record.get(that.xAxis.collection.at(0).get("col_name")));
                    i = 0;
                    that.yAxis.collection.each(function (field) {
                        seriesData[i].data.push(record.get(field.get("col_name")));
                        ++i;
                    });
                });
                chartOpts = {
                    chart: {
                        type: 'column',
                        height: this.chartHeight
                    },
                    title: {
                        text: 'My Chart Title'
                    },
                    xAxis: {
                        categories: categories
                    },
                    yAxis: {
                        min: 0
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table class="table table-condensed">',
                        pointFormat: '<tr><td>{series.name}: </td>' +
                            '<td style="border-right: solid 5px {series.color};">{point.y}</td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    }
                };
                _.extend(chartOpts, { series: seriesData });
                this.$el.highcharts(chartOpts);
            },
            setSize: function () {
                var newHeight = $(window).height() - $('nav').height(),
                    padding = $('#chart_area').outerHeight() - $('#chart_area').height();
                this.chartHeight = newHeight - padding - $('#x_axis').outerHeight();
            },
            resize: function () {
                // only resize after browser has finished resizing (i.e., don't call
                // this function continuously while browser is resizing).
                var that = this;
                clearTimeout(this.timeoutID);
                this.setSize();
                this.timeoutID = setTimeout(function () { that.render(); }, 500);
            }
        });
        return BarChart;
    });