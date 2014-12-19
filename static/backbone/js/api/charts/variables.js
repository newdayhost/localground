define(["marionette",
        "jquery",
        "collections/fields",
        "charts/variable",
        "highcharts"
    ],
    function (Marionette, $, Fields, Variable) {
        "use strict";
        /**
         * The Variables Class's job is to display the user
         * the available variables, given the form selection.
         *
         * Listens for:
         *  - 'form-changed'
         *
         * Notifies when:
         *   - a variable has been dragged onto one of the axes.
         */
        var Variables = Marionette.CollectionView.extend({
            app: null,
            collection: null,
            childView: Variable,
            initialize: function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-changed', this.getFields, this);
            },
            getFields: function (data) {
                this.collection = new Fields([], {
                    url: '/api/0/forms/' + data.id + '/fields/'
                });
                this.listenTo(this.collection, "reset", this.render);
                this.collection.fetch({ reset: true });
            }
        });
        return Variables;
    });