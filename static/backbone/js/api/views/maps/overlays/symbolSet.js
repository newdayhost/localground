define(['config',
        'underscore',
        'lib/maps/overlays/symbolized'
    ],
    function (Config, _, Symbolized) {
        'use strict';

        var SymbolSet = function (opts) {
            this.overlays = null;
            this.symbol = null;

            this.initialize = function (opts) {
                this.overlays = {};
                this.app = opts.app;
                this.map = opts.map;
                this.symbol = opts.symbol;
            };
            this.addOverlay = function (key, model) {
                var configKey,
                    opts;

                if (!_.isUndefined(this.overlays[key])) { return; }
                if (model.get('geometry') == null) { return; }

                //if overlay doesn't exist, add it:
                configKey = model.getKey().split("_")[0];
                opts = {
                    app: this.app,
                    model: model,
                    symbol: this.symbol,
                    map: this.map,
                    infoBubbleTemplates: {
                        InfoBubbleTemplate: _.template(Config[configKey].InfoBubbleTemplate),
                        TipTemplate: _.template(Config[configKey].TipTemplate)
                    }
                };
                this.overlays[key] = new Symbolized(opts);
            };

            this.updateSymbol = function (symbol) {
                this.symbol = symbol;
                //this.render();
            };

            this.hideOverlays = function () {
                var key;
                for (key in this.overlays) {
                    this.overlays[key].hide();
                }
            };
            this.showOverlays = function () {
                var key;
                for (key in this.overlays) {
                    this.overlays[key].hide();
                }
            };
            this.getOverlays = function () {
                return _.values(this.overlays);
            };

            this.findMatches = function (dataManager) {
                var that = this,
                    match = false,
                    key = null,
                    matched = [],
                    keysToRemove;

                //1. find current matches:
                _.each(_.values(dataManager.collections), function (collection) {
                    collection.each(function (model) {
                        match = that.symbol.checkModel(model);
                        if (match) {
                            key = model.get("overlay_type") + "_" + model.get("id");
                            that.addOverlay(key, model);
                            matched.push(key);
                        }
                    });
                });

                //2. remove stale matches:
                keysToRemove = _.difference(_.keys(this.overlays), matched);
                console.log("to be removed: ", keysToRemove);
                _.each(keysToRemove, function (key) {
                    console.log(key);
                    that.overlays[key].hide();
                    delete that.overlays[key];
                });
            };

            this.destroyOverlays = function () {
                _.each(this.getOverlays(), function (overlay) {
                    overlay.hide();
                });
            };

            this.render = function () {
                _.each(this.getOverlays(), function (overlay) {
                    overlay.redraw();
                });
            };

            this.getBounds = function () {
                var bounds = new google.maps.LatLngBounds();
                _.each(this.getOverlays(), function (overlay) {
                    bounds.union(overlay.getBounds());
                });
                return bounds;
            };

            this.garbageCollection = function () {
                //remove all of the overlays that aren't a match.
            };

            this.initialize(opts);
        };
        return SymbolSet;
    });