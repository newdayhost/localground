define(["backbone",
        "collections/records",
        "highcharts"
    ],
    function (Backbone, Records) {
        "use strict";
        var ChartLoader = Backbone.View.extend({
            records: null,
            xVariables: [],
            yVariables: [],
            initialize: function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-changed', this.getRecords, this);
                this.app.vent.on('variable-added', this.getFields, this);
            },
            render: function () {
                if (!this.records || this.records.length == 0) {
                    return;
                }
                var that = this;
                this.$el.html("");
                this.records.each(function (record) {
                    //console.log(record.toJSON());
                    that.$el.append(JSON.stringify(record.toJSON()));
                });
            },
            getRecords: function (data) {
                this.records = new Records([], {
                    url: '/api/0/forms/' + data.id + '/data/'
                });
                this.listenTo(this.records, "reset", this.render);
                this.records.state.currentPage = 1;
                this.records.fetch({ reset: true });
            }
        });
        return ChartLoader;
    });