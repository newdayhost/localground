define(["backbone",
        "collections/records",
        "highcharts"
    ],
    function (Backbone, Records) {
        "use strict";
        var Variables = Backbone.View.extend({
            app: null,
            initialize: function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-changed', this.getData);
            },
            render: function () {
                console.log('RECS!!!', this.records);
                if (!this.records || this.records.length == 0) {
                    return;
                }
                var that = this;
                this.$el.html("");
                this.records.each(function (record) {
                    that.append(record.toJSON());
                });
            },
            getData: function (data) {
                var records = new Records([], {
                    url: data.url
                });
                records.on('reset', this.doSomething);
                records.state.currentPage = 1;
                console.log("fetching");
                records.fetch({ reset: true });
            },
            doSomething: function () {
                console.log("doSomething");
            }
        });
        return Variables;
    });