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
            events: {
                'dragover .draggable': 'ignore',
                'drop .draggable': 'addToAxis'
            },
            childTemplateText: _.template(VariableTemplate),
            initialize: function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-changed', this.getFields, this);
            },
            render: function () {
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
                    url: '/api/0/forms/' + data.id + '/fields/'
                });
                this.listenTo(this.fields, "reset", this.render);
                this.fields.fetch({ reset: true });
            },
            ignore: function (e) {
                e.preventDefault();
            },
            addToAxis: function (e) {
                alert("add");
                /*var field_id = event.dataTransfer.getData('Text'),
                    $elem = $('#' + field_id).removeClass("chosen").removeClass("highlighted");
                $(this).append($elem);
                alert("remove variable from chart");
                */
            }
        });
        return Variables;
    });