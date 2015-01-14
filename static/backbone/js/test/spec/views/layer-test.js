define([
    "views/maps/overlays/layer",
    "../../../test/spec-helper"
],
    function (LayerView) {
        'use strict';
        describe("Layer View: Map Layer can be initialized & drawn", function () {
            it("Can initialize a map layer", function () {
                var that = this;
                expect(function () {
                    var layerView = new LayerView({
                        dataManager: that.dataManager,
                        model: that.layers.at(0),
                        basemap: { map: { fitBounds: 'a' }},
                        app: that.app
                    });
                }).not.toThrow();
            });
        });
    });
