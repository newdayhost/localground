define(["marionette",
        "backbone",
        "underscore",
        "jquery",
        "lib/appUtilities",
        "charts/data_manager",
        "charts/variables",
        "charts/chart_loader",
        "charts/chart_options",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, $, appUtilities, DataManager, Variables, ChartLoader, ChartOptions) {
        "use strict";

        var ChartEditor = Marionette.Application.extend(_.extend(appUtilities, {
            navigate: function (route, options) {
                options = options || {};
                Backbone.history.navigate(route, options);
            },
            getCurrentRoute: function () {
                return Backbone.history.fragment;
            },
            initialize: function () {
                this.addRegions({
                    chartOptionsRegion: "#chart_options",
                    chartLoaderRegion: "#chart_loader",
                    variableRegion: "#variables"
                });
                this.on("start", function () {
                    if (Backbone.history) {
                        Backbone.history.start();
                    }
                });

                this.addInitializer(function (options) {
                    var that = this,
                        opts = { app: this },
                        dataManager = new DataManager({ app: this });
                    this.variableRegion.show(new Variables(opts));
                    this.chartOptionsRegion.show(new ChartOptions(opts));
                    this.chartLoaderRegion.show(new ChartLoader(_.extend(opts, {dataManager: dataManager})));
                    this.initAJAX(options);
                    $(window).on('resize', function () {
                        that.vent.trigger('resized');
                    });
                });
            }
        }));
        return ChartEditor;
    });