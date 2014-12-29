define(["marionette",
        "charts/variable",
        "collections/fields"
    ],
    function (Marionette, Variable, Fields) {
        "use strict";
        /**
         * The Axis class's job is to:
         * 1) detect when a new Field has been added to or removed from it, and
         * 2) notify the application every time its Field collection changes
         */
        var Axis = Marionette.CollectionView.extend({
            app: null,
            dataManager: null,
            collection: null,
            childView: Variable,
            axisType: null,
            className: 'fill',
            events: {
                'drop': 'handleDrop',
                'dragover ': 'ignore'
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.dataManager = opts.dataManager;
                this.axisType = opts.axisType;
                this.app.vent.on('form-data-changed', this.setCollection, this);
                this.on("childview:detach", this.handleRemove);
            },
            setCollection: function () {
                this.collection = new Fields([], { formID: this.dataManager.activeFormID });
                // re-render the variable panel:
                this.listenTo(this.collection, "reset", this.render);
                this.listenTo(this.collection, "add", this.render);
                this.listenTo(this.collection, "remove", this.render);
                this.collection.trigger('reset');
            },
            ignore: function (e) {
                e.preventDefault();
            },
            handleDrop: function (e) {
                var fieldID = event.dataTransfer.getData('text/plain'),
                    field = this.dataManager.getField(fieldID);
                this.collection.add(field);
                //notify the application that a variable has been added.
                this.app.vent.trigger('variable-changed');
                e.preventDefault();
            },
            handleRemove: function (childView) {
                this.collection.remove(childView.model);
                this.render();
                //notify the application that a variable has been removed.
                this.app.vent.trigger('variable-changed');
            }
        });
        return Axis;
    });