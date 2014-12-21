define(["marionette",
        "backbone",
        "underscore",
        "jquery",
        "lib/appUtilities",
        "charts/chart_data_manager",
        "charts/forms_menu",
        "charts/variables",
        "charts/chart_loader",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, $, appUtilities, DataManager,
              FormsMenu, Variables, ChartLoader) {
        "use strict";

        var ChartEditor = new Marionette.Application();
        _.extend(ChartEditor, appUtilities);

        ChartEditor.addRegions({
            formsMenuRegion: "#forms_menu",
            chartLoaderRegion: "#chart_loader",
            variableRegion: "#variables"
        });

        ChartEditor.navigate = function (route, options) {
            options = options || {};
            Backbone.history.navigate(route, options);
        };

        ChartEditor.getCurrentRoute = function () {
            return Backbone.history.fragment;
        };

        ChartEditor.on("start", function () {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });

        ChartEditor.addInitializer(function (options) {
            var opts = { app: this },
                dataManager = new DataManager({ app: this });
            ChartEditor.formsMenuRegion.show(new FormsMenu(_.extend(opts, { $el: $('#forms_menu') })));
            ChartEditor.variableRegion.show(new Variables(opts));
            ChartEditor.chartLoaderRegion.show(new ChartLoader(_.extend(opts, {dataManager: dataManager})));
            this.initAJAX(options);
        });

        return ChartEditor;
    });