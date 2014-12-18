define(["backbone",
        "jquery",
        "collections/forms",
        "collections/records"
    ],
    function (Backbone, $, Forms, Records) {
        'use strict';
        /**
         * Class that controls the available projects menu,
         * Extends Backbone.View.
         * @class ProjectsMenu
         */
        var FormsMenu = Backbone.View.extend({
            /**
             * @lends localground.maps.views.ProjectsMenu#
             */
            collection: null,
            app: null,
            events: {
                'click .change-form': 'getFormVariables'
            },
            childTemplate: _.template(
                '<li><a class="change-form" href="#" target="<%= id %>"><%= name %></a></li>'
            ),
            initialize: function (opts) {
                this.app = opts.app;
                this.$el = opts.$el;
                this.collection = new Forms();
                this.collection.fetch({reset: true});
                this.listenTo(this.collection, 'reset', this.render);
            },
            render: function () {
                if (this.collection.length == 0) {
                    return;
                }
                var that = this;
                this.$el.empty();
                this.collection.each(function (form) {
                    that.$el.append(that.childTemplate(form.toJSON()));
                });
            },

            getFormVariables: function (e) {
                try {
                    this.app.vent.trigger('form-changed', {
                        id: $(e.target).attr('target')
                    });
                } catch (ex) {
                    console.log(ex);
                }
                e.preventDefault();
            }
        });
        return FormsMenu;
    });
