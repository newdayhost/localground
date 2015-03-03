define(["underscore",
        "jquery",
        "marionette",
        "backbone",
        "form",
        "models/layer",
        "text!" + templateDir + "/sidepanel/layerEditor.html",
        "bootstrap-form-templates"
        ],
    function (_, $, Marionette, Backbone, Form, Layer, LayerEditorTemplate) {
        'use strict';

        var LayerEditor = Marionette.View.extend({

            events: {
                'click #marker_cancel': 'hide',
                'click .btn-primary': 'saveForm'
            },

            template: _.template(LayerEditorTemplate),

            initialize: function (opts) {
                $.extend(this, opts);
                if (_.isUndefined(this.model)) {
                    this.model = new Layer();
                }
                this.onRender();
            },

            onRender: function () {
                var JSONEditor = Backbone.Form.editors.TextArea.extend({
                        render: function () {
                            this.setValue(JSON.stringify(this.value));
                            return this;
                        },
                        getValue: function () {
                            return JSON.parse(this.$el.val());
                        }
                    }),
                    ModelForm = Form.extend({
                        schema: {
                            name: { type: "Text", title: "Name" },
                            description: { type: "Text", title: "Description" },
                            //tags: { type: "Text", title: "Tags", help: "Tag your layer here" },
                            source: { type: "Text", title: "Source", help: "List of the underlying data sources" },
                            symbols: { type: JSONEditor, title: "Symbols", help: "Add your symbol markup here" }
                        }
                    }),
                    context = { saveMessage: _.isUndefined(this.model.get("id")) ? "Add" : "Update" };
                this.$el.html(this.template(context));
                this.form = new ModelForm({
                    model: this.model
                });
                this.form.render();
                this.$el.find('.form').append(this.form.$el);
            },

            saveForm: function (e) {
                //does validation
                this.form.commit();

                //if the model is new, add additional attributes:
                if (this.model.isNew()) {
                    this.addNewModelData();
                }

                //do database commit:
                var isNew = this.model.isNew(),
                    that = this;
                this.model.save(null, {
                    success: function () {
                        //if the model is brand new, add it to the layers menu and
                        //turn it on.
                        if (isNew) {
                            that.app.vent.trigger("add-layer-to-menu", that.model);
                        }
                    }
                });

                //fire post-save event handlers:
                this.app.vent.trigger('show-layer-list');

                if (!_.isUndefined(e)) {
                    e.preventDefault();
                }
            },

            addNewModelData: function () {
                //add extras:
                //todo: slug doesn't make sense in this context. Remove.
                if (_.isUndefined(this.model.get("slug"))) {
                    this.model.set("slug", this.app.generateSlug());
                }
                if (_.isUndefined(this.model.get("project_id"))) {
                    this.model.set("project_id", this.app.getActiveProjectID());
                }
                if (_.isUndefined(this.model.get("overlay_type"))) {
                    this.model.set("overlay_type", "layer");
                }
            },

            ignore: function (e) {
                if (!_.isUndefined(e)) {
                    e.preventDefault();
                }
            },

            hide: function () {
                this.app.vent.trigger('show-layer-list');
            },

            show: function () {
                this.$el.show();
            }
        });
        return LayerEditor;
    });
