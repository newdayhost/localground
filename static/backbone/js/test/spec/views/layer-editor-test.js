define([
    "jquery",
    "views/maps/sidepanel/layerEditor",
    "../../../test/spec-helper"
],
    function ($, LayerEditor) {
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
                var layerEditor = new LayerEditor({ app: this.app });
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

        describe("LayerEditor: Hide Editor triggers correct functionality", function () {
            it("hide triggers the 'show-layer-list' event", function () {
                spyOn(this.app.vent, 'trigger').and.callThrough();
                var layerEditor = new LayerEditor({ app: this.app });
                layerEditor.hide();
                expect(this.app.vent.trigger).toHaveBeenCalledWith('show-layer-list');
            });
        });

        describe("LayerEditor: Saves new info to a model correctly", function () {
            var newName = "A new layer name",
                newDescription = "A new description",
                newSource = "photos",
                newSymbols = '[{ "color": "#00F", "width": 40, "rule": "tags contains home", "title": "home" }]';

            it("Updates an existing model from the form", function () {
                spyOn(this.app.vent, 'trigger').and.callThrough();
                var model = this.layers.at(0),
                    layerEditor = new LayerEditor({ app: this.app, model: model });

                //update the form value & save the form:
                layerEditor.$el.find('input[name="name"]').val(newName);
                layerEditor.$el.find('input[name="description"]').val(newDescription);
                layerEditor.$el.find('input[name="source"]').val(newSource);
                layerEditor.$el.find('textarea[name="symbols"]').val(newSymbols);

                //commits form changes to the database:
                layerEditor.saveForm();

                //make sure that the underlying model has been updated:
                expect(model.get("name")).toEqual(newName);
                expect(model.get("description")).toEqual(newDescription);
                expect(model.get("source")).toEqual(newSource);
                expect(model.get("symbols")).toEqual(JSON.parse(newSymbols));

                // make sure that global event was triggered:
                expect(this.app.vent.trigger).toHaveBeenCalledWith('show-layer-list');
            });

            it("Creates a new model from the form", function () {
                spyOn(this.app.vent, 'trigger').and.callThrough();
                var layerEditor = new LayerEditor({ app: this.app });

                //update the form value & save the form:
                layerEditor.$el.find('input[name="name"]').val(newName);
                layerEditor.$el.find('input[name="description"]').val(newDescription);
                layerEditor.$el.find('input[name="source"]').val(newSource);
                layerEditor.$el.find('textarea[name="symbols"]').val(newSymbols);

                //before save, underlying model should be empty:
                expect(layerEditor.model.get("name")).toEqual("Untitled");
                expect(layerEditor.model.get("description")).toBeUndefined();
                expect(layerEditor.model.get("source")).toBeUndefined();
                expect(layerEditor.model.get("symbols")).toBeUndefined();

                //commits form changes to the database:
                layerEditor.saveForm();

                //make sure that the underlying model has been updated:
                expect(layerEditor.model.get("name")).toEqual(newName);
                expect(layerEditor.model.get("description")).toEqual(newDescription);
                expect(layerEditor.model.get("source")).toEqual(newSource);
                expect(layerEditor.model.get("symbols")).toEqual(JSON.parse(newSymbols));

                // make sure that global event was triggered:
                expect(this.app.vent.trigger).toHaveBeenCalledWith('show-layer-list');
                expect(this.app.vent.trigger).toHaveBeenCalledWith('add-layer', layerEditor.model);
            });

        });

        describe("LayerEditor: Event Handlers are working", function () {

            it("Listens for the 'Save' button click", function () {
                spyOn(LayerEditor.prototype, "saveForm");
                var layerEditor = new LayerEditor({ app: this.app });
                layerEditor.$el.find('.btn-primary').click();
                expect(layerEditor.saveForm).toHaveBeenCalled();
            });

            it("Listens for the 'Cancel' button click", function () {
                spyOn(LayerEditor.prototype, "hide");
                var layerEditor = new LayerEditor({ app: this.app });
                layerEditor.$el.find('#marker_cancel').click();
                expect(layerEditor.hide).toHaveBeenCalled();
            });

        });

    });
