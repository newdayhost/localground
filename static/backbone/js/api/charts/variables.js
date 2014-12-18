define(["backbone",
        "underscore",
        "collections/fields",
        "text!../../templates/charts/variable.html",
        "highcharts"
    ],
    function (Backbone, _, Fields, VariableTemplate) {
        "use strict";
        var Variables = Backbone.View.extend({
            app: null,
            fields: null,
            childTemplateText: _.template(VariableTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-changed', this.getFields, this);
            },
            renderFields: function () {
                var that = this;
                if (!this.fields || this.fields.length == 0) {
                    return;
                }
                this.$el.html("");
                this.fields.each(function (field) {
                    that.$el.append(that.childTemplateText(field.toJSON()));
                });
            },
            getFields: function (data) {
                this.fields = new Fields([], {
                    url: '/api/0/forms/1/fields/'
                });
                this.listenTo(this.fields, "reset", this.renderFields);
                this.fields.fetch({ reset: true });
            }
        });
        return Variables;
    });