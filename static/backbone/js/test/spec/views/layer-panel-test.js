define([
    "views/maps/sidepanel/layerPanel",
    "collections/layers",
    "../../../test/spec-helper"
],
    function (LayerPanel, Layers) {
        'use strict';

        describe("LayerPanel: Initializes and renders child views when data added and removed", function () {

            it("Can initialize the LayerPanel with correct initialization params", function () {
                var layerPanel,
                    that = this;
                expect(function () {
                    layerPanel = new LayerPanel({ app: that.app });
                }).not.toThrow();
                expect(function () {
                    layerPanel = new LayerPanel({});
                }).toThrow();
            });

            it("Renders the appropriate HTML regions", function () {
                var layerPanel = new LayerPanel({ app: this.app });
                layerPanel.render();
                expect(layerPanel.$el).toContainElement('#layer-manager');
                expect(layerPanel.$el).toContainElement('#data-filter');
                expect(layerPanel.$el).toContainElement('#layers-menu');
            });

            it("Doesn't throw an exception on show event", function () {
                var layerPanel = new LayerPanel({
                    app: this.app,
                    selectedLayers: new Layers()
                });
                layerPanel.render();
                expect(function () {
                    layerPanel.onShow();
                }).not.toThrow();
            });

            it("Resizes panel on show event", function () {
                spyOn(LayerPanel.prototype, "resize");
                var layerPanel = new LayerPanel({
                    app: this.app,
                    selectedLayers: new Layers()
                });
                layerPanel.render();
                layerPanel.onShow();
                expect(layerPanel.resize).toHaveBeenCalled();
            });
        });

        describe("LayerPanel: Event Handlers are working", function () {

            it("Listens for the 'Add Layer' button click", function () {
                spyOn(LayerPanel.prototype, "showLayerEditor");
                var layerPanel = new LayerPanel({ app: this.app });
                layerPanel.render();
                layerPanel.$el.find('#add-layer').click();
                expect(layerPanel.showLayerEditor).toHaveBeenCalled();
            });

            it("Listens for the global 'show-layer-editor' event and responds", function () {
                spyOn(LayerPanel.prototype, "showLayerEditor");
                var layerPanel = new LayerPanel({ app: this.app });
                layerPanel.render();
                this.app.vent.trigger("show-layer-editor");
                expect(layerPanel.showLayerEditor).toHaveBeenCalled();
            });
        });
    });
