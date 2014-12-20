define(["marionette",
        "charts/variable"
    ],
    function (Marionette, Variable) {
        "use strict";
        /**
         * The Variables Class's job is to display the user
         * the available variables, given the form selection.
         *
         * Listens for:
         *  - 'form-data-changed'
         */
        var Variables = Marionette.CollectionView.extend({
            app: null,
            collection: null,
            childView: Variable,
            initialize: function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-data-changed', this.setCollection, this);
            },
            setCollection: function (data) {
                this.collection = data.fields;
                // when the collection gets reset (loaded via ajax),
                // re-render the variable panel:
                this.listenTo(this.collection, "reset", this.render);
            }
        });
        return Variables;
    });