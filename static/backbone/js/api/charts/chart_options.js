define(["marionette",
        "underscore",
        "jquery",
        "collections/forms",
        "text!../../templates/charts/options.html"
    ],
    function (Marionette, _, $, Forms, OptionsTemplate) {
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
                this.app.vent.on('resized', this.resize, this);
            },
            onRender: function () {
                if (this.collection.length == 0) { return; }
                var that = this,
                    $sel = this.$el.find('#forms_menu');
                $sel.empty();
                this.collection.each(function (form) {
                    $sel.append(that.formItemTemplate(form.toJSON()));
                });
                this.notifyFormChanged();
                this.resize();
            },
            notifyFormChanged: function (e) {
                this.app.vent.trigger('form-changed', {
                    id: this.$el.find('#forms_menu').val()
                });
                if (e) { e.preventDefault(); }
            },
            notifyChartChanged: function (e) {
                this.app.vent.trigger('chart-changed', {
                    id: this.$el.find('#forms_menu').val()
                });
                if (e) { e.preventDefault(); }
            },
            resize: function () {
                var newHeight = $(window).height() - $('nav').height(),
                    padding = $('#controls').outerHeight() - $('#controls').height();
                $('#controls').height(newHeight - padding);
            }
        });
        return ChartOpts;
    });