define(["charts/chart",
        "highcharts"
    ],
    function (Chart) {
        "use strict";
        var BarChart = Chart.extend({
            collection: null,
            xAxis: null,
            yAxis: null,
            initialize: function (opts) {
                console.log('BarChart');
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.xAxis = opts.xAxis;
                this.yAxis = opts.yAxis;
                this.app.vent.on("variable-added", this.addVariable, this);
            },
            render: function () {
                //console.log(this.xAxis);
                console.log(this.yAxis.collection);
                /*if (!this.collection || this.collection.length == 0) {
                    return;
                }
                var that = this;
                this.$el.empty();
                this.collection.each(function (record) {
                    //console.log(record.toJSON());
                    that.$el.append(JSON.stringify(record.toJSON()));
                });*/
            },
            addVariable: function (data) {
                console.log("add variable");
                if (data.axisType == 'x') {
                    this.xVariables.push(data.field);
                } else {
                    this.yVariables.push(data.field);
                }
                this.render();
            }
        });
        return BarChart;
    });