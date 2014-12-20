define(["backbone",
        "collections/records",
        "highcharts"
    ],
    function (Backbone, Records) {
        "use strict";
        var ChartLoader = Backbone.View.extend({
            collection: null,
            xVariables: [],
            yVariables: [],
            initialize: function (opts) {
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.app.vent.on('form-data-changed', this.setCollection, this);
                this.app.vent.on('variable-added', this.getFields, this);
            },
            render: function () {
                if (!this.collection || this.collection.length == 0) {
                    return;
                }
                var that = this;
                this.$el.html("");
                this.collection.each(function (record) {
                    //console.log(record.toJSON());
                    that.$el.append(JSON.stringify(record.toJSON()));
                });
            },
            setCollection: function (data) {
                console.log('setting...');
                this.collection = data.records;
                // when the collection gets reset (loaded via ajax),
                // re-render the chart panel:
                this.listenTo(this.collection, "reset", this.render);
            }
        });
        return ChartLoader;
    });