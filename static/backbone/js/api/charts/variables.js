define(["marionette",
        "charts/variable"
    ],
    function (Marionette, Variable) {
        "use strict";
        /**
         * The Variables class's job is to display the available variables,
         * given the user's table selection. The rendering of each variable
         * is delegated to the Variable class. The only thing that this view
         * needs to do is listen for updates to the collection.
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