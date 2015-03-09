define(['marionette',
        'underscore',
        'views/maps/overlays/symbolSet'
    ],
    function (Marionette, _, SymbolSet) {
        'use strict';

        var Layer = Marionette.ItemView.extend({
            /** A google.maps.Map object */
            map: null,
            dataManager: null,
            model: null,
            isShowingOnMap: false,
            symbolSetLookup: null,
            modelEvents: {
                'change:isShowingOnMap': 'visibilityChanged',
                'symbol-change': 'renderSymbol',
                'zoom-to-layer': 'zoomToExtent',
                'symbology-updated': 'applyNewSymbol'
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.model = opts.model; //a sidepanel LayerItem object
                this.dataManager = this.app.dataManager;
                this.map = this.app.map;
                this.symbolSetLookup = {};
                this.parseLayerItem();
                this.listenTo(this.app.vent, 'selected-projects-updated', this.parseLayerItem);
                this.app.vent.on("filter-applied", this.render.bind(this));
            },

            parseLayerItem: function () {
                var that = this;
                _.each(this.model.getSymbols(), function (symbol) {
                    if (_.isUndefined(that.symbolSetLookup[symbol.rule])) {
                        that.symbolSetLookup[symbol.rule] = new SymbolSet({
                            symbol: symbol,
                            app: that.app,
                            map: that.map
                        });
                    } else {
                        that.symbolSetLookup[symbol.rule].updateSymbol(symbol);
                    }
                    that.symbolSetLookup[symbol.rule].findMatches(that.dataManager);
                });
            },

            onBeforeDestroy: function () {
                this.destroyGoogleMapOverlays();
            },

            destroyGoogleMapOverlays: function () {
                var rule;
                for (rule in this.symbolSetLookup) {
                    this.symbolSetLookup[rule].destroyOverlays();
                }
            },

            applyNewSymbol: function () {
                //re-apply the layer rules to the available data:
                this.parseLayerItem();

                //and render:
                this.render();
            },

            renderSymbol: function (rule) {
                this.symbolSetLookup[rule].render();
            },

            visibilityChanged: function () {
                console.log("Model visibility changed");
                this.render();
            },

            render: function () {
                var rule;
                for (rule in this.symbolSetLookup) {
                    this.symbolSetLookup[rule].render();
                }
            },

            hideSymbol: function (rule) {
                this.symbolSetLookup[rule].hideOverlays();
            },

            /** Zooms to the extent of the collection */
            zoomToExtent: function () {
                var bounds = new google.maps.LatLngBounds(),
                    key;
                for (key in this.symbolSetLookup) {
                    bounds.union(this.symbolSetLookup[key].getBounds());
                }
                if (!bounds.isEmpty()) {
                    this.map.fitBounds(bounds);
                }
            }

        });
        return Layer;
    });
