define(["marionette",
        "backbone",
        "underscore",
        "jquery",
        "lib/appUtilities",
        "charts/forms_menu",
        "charts/axis",
        "charts/chart_loader",
        "charts/variables",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, $, appUtilities,
              FormsMenu, Axis, ChartLoader, Variables) {
        "use strict";

        var ChartEditor = new Marionette.Application();
        _.extend(ChartEditor, appUtilities);

        ChartEditor.addRegions({
            formsMenuRegion: "#forms_menu",
            yAxisRegion: "#y_axis",
            xAxisRegion: "#x_axis",
            chartRegion: "#chart_area",
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
            var opts = {
                app: this
            };
            ChartEditor.formsMenuRegion.show(new FormsMenu({
                app: this,
                $el: $('#forms_menu')
            }));
            ChartEditor.yAxisRegion.show(new Axis(opts));
            ChartEditor.xAxisRegion.show(new Axis(opts));
            ChartEditor.chartRegion.show(new ChartLoader(opts));
            ChartEditor.variableRegion.show(new Variables(opts));
            this.initAJAX(options);
        });

        return ChartEditor;
    });