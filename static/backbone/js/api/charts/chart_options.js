define(["marionette",
        "underscore",
        "collections/forms",
        "text!../../templates/charts/options.html"
    ],
    function (Marionette, _, Forms, OptionsTemplate) {
        "use strict";
        var ChartOpts = Marionette.ItemView.extend({
            template: _.template(OptionsTemplate),
            formItemTemplate: _.template('<option value="<%= id %>"><%= name %></option>'),
            app: null,
            collection: null,
            events: {
                'change #forms_menu': 'notifyFormChanged',
                'change #charts_menu': 'notifyChartChanged'
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.collection = new Forms();
                this.collection.fetch({reset: true});
                this.listenTo(this.collection, 'reset', this.render);
            },
            onRender: function () {
                if (this.collection.length == 0) { return; }
                var that = this,
                    $sel = this.$el.find('#forms_menu');
                $sel.empty();
                this.collection.each(function (form) {
                    $sel.append(that.formItemTemplate(form.toJSON()));
                });
            },
            notifyFormChanged: function (e) {
                this.app.vent.trigger('form-changed', {
                    id: $(e.target).val()
                });
                e.preventDefault();
            },
            notifyChartChanged: function (e) {
                this.app.vent.trigger('chart-changed', {
                    id: $(e.target).val()
                });
                e.preventDefault();
            }
        });
        return ChartOpts;
    });