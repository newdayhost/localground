define([
    "views/maps/sidepanel/layerEditor",
    "../../../test/spec-helper"
],
    function (LayerEditor) {
        'use strict';

        describe("LayerEditor: Initializes and renders child views when data added and removed", function () {

            it("Can initialize a new LayerEditor", function () {
                var that = this,
                    layerEditor;
                expect(function () {
                    layerEditor = new LayerEditor({ app: that.app });
                }).not.toThrow();
            });
        });
    });
