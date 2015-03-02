define([
    "views/maps/sidepanel/layerEditor",
    "../../../test/spec-helper"
],
    function (LayerEditor) {
        'use strict';

        describe("LayerEditor: Initializes correctly", function () {

            it("Can initialize a new LayerEditor", function () {
                var that = this,
                    layerEditor;
                expect(function () {
                    layerEditor = new LayerEditor({ app: that.app });
                }).not.toThrow();
            });

            it("Renders an empty form when no model is defined", function () {
                var that = this,
                    layerEditor;
                layerEditor = new LayerEditor({ app: that.app });
                expect(layerEditor.$el.find('form').length).toEqual(1);
                expect(layerEditor.$el.find('input[name="name"]').val()).toEqual("Untitled");
            });

            it("Renders a populated form when a model is defined", function () {
                var that = this,
                    model = this.layers.at(0),
                    layerEditor = new LayerEditor({ app: that.app, model: model });

                expect(layerEditor.$el.find('form').length).toEqual(1);
                expect(layerEditor.$el.find('input[name="name"]').val()).toEqual(model.get("name"));
                expect(layerEditor.$el.find('input[name="description"]').val()).toEqual(model.get("description"));
                expect(layerEditor.$el.find('input[name="source"]').val()).toEqual(model.get("source"));
                expect(JSON.parse(layerEditor.$el.find('textarea[name="symbols"]').val())).toEqual(model.get("symbols"));
            });
        });

        describe("LayerEditor: Updates existing layer correctly", function () {
            it("Renders a populated form when a model is defined", function () {
                var that = this,
                    model = this.layers.at(0),
                    layerEditor = new LayerEditor({ app: that.app, model: model }),
                    newName = "A new layer name";

                //update the form value & save the form:
                layerEditor.$el.find('input[name="name"]').val(newName);
                layerEditor.saveForm();

                //make sure that the underlying model has been updated:
                expect(model.get("name")).toEqual(newName);
            });
        });
    });
