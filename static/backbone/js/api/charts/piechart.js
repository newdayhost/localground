define(["charts/chart",
        "highcharts"
    ],
    function (Chart) {
        "use strict";
        /**
         * The PieChart's job is to render a pie chart.
         */
        var PieChart = Chart.extend({
            initialMessage: 'Please drag one (and only one) variable onto the x-axis',
            xAxis: null,
            seriesName: null,
            initialize: function (opts) {
                Chart.prototype.initialize.apply(this, arguments);
                this.xAxis = opts.xAxis;
                this.render();
            },
            render: function () {
                if (this.xAxis.collection.length == 1) {
                    this.renderChart();
                } else {
                    this.destroyChart();
                    this.showInitialMessage();
                }
            },
            transformData: function () {
                var collection = this.dataManager.getRecords(),
                    key = this.xAxis.collection.at(0).get("col_name"),
                    lookup = {};
                this.seriesName = this.xAxis.collection.at(0).get("col_alias");
                this.seriesData = [];

                // loop that counts the number of times a particular
                // value appears in the collection:
                collection.each(function (record) {
                    if (lookup[record.get(key)] == null) {
                        lookup[record.get(key)] = 0;
                    }
                    lookup[record.get(key)] += 1;
                });

                // converts to form that is useable for highcharts
                for (key in lookup) {
                    this.seriesData.push([ key, lookup[key]]);
                }
            },
            renderChart: function () {
                this.$el.css("height", "auto");
                this.setSize();
                this.transformData();
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
                        name: this.seriesName,
                        data: this.seriesData
                    }]
                };
                this.$el.highcharts(chartOpts);
            }
        });
        return PieChart;
    });