define(["underscore",
        "charts/chart",
        "highcharts"
    ],
    function (_, Chart) {
        "use strict";
        var PieChart = Chart.extend({
            initialMessage: 'Please drag at least one numeric variable onto the y-axis ' +
                            'and at least one other variable onto the x-axis',
            xAxis: null,
            yAxis: null,
            initialize: function (opts) {
                Chart.prototype.initialize.apply(this, arguments);
                console.log('pie chart!!!!!');
                this.xAxis = opts.xAxis;
                this.yAxis = opts.yAxis;
                this.render();
            },
            render: function () {
                console.log('pie chart!');
                this.renderChart();
                /*
                if (this.yAxis.collection && this.yAxis.collection.length >= 1 &&
                        this.xAxis.collection.length == 1) {
                    this.renderChart();
                } else {
                    this.destroyChart();
                    this.showInitialMessage();
                }*/
            },
            transformData: function () {
                var collection = this.dataManager.getRecords(),
                    that = this,
                    i = 0;
                this.categories = [];
                this.seriesData = [];
                this.yAxis.collection.each(function (field) {
                    that.seriesData.push({
                        name: field.get("col_alias"),
                        data: []
                    });
                });
                collection.each(function (record) {
                    that.categories.push(record.get(that.xAxis.collection.at(0).get("col_name")));
                    i = 0;
                    that.yAxis.collection.each(function (field) {
                        that.seriesData[i].data.push(record.get(field.get("col_name")));
                        ++i;
                    });
                });
            },
            renderChart: function () {
                this.$el.css("height", "auto");
                this.setSize();
                //this.transformData();
                var chartOpts = {
                    chart: {
                        height: this.chartHeight
                    },
                    title: {
                        text: 'My Chart Title'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'series 1',
                        data: [
                            ['Firefox', 125],
                            ['IE', 70],
                            ['Chrome', 5]
                        ]
                    }]
                };
                //_.extend(chartOpts, { series: this.seriesData });
                this.$el.highcharts(chartOpts);
            }
        });
        return PieChart;
    });