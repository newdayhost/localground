define(["marionette",
        "underscore",
        "text!" + templateDir + "/modals/shareModal.html",
        "collections/views",
        "views/maps/sidepanel/shareModal/viewItem",
        "models/view"
    ],
    function (Marionette, _, shareModal, Views, ViewItem, View) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * share view modal
         * @class DataPanel
         */

        var ShareModal = Marionette.CompositeView.extend({
            id: 'share-modal',
            childView: ViewItem,
            childViewContainer: "#view-list-container",
            activeViewItem: null,
            template: function () {
                return _.template(shareModal);
            },

            ui: {
                saveName: '#save-view-name',
                urlModal: '#url-modal',
                loadButton: '.load'
            },

            events: {
                'click .view-item': 'selectView',
                'input #save-view-name': 'checkInput',
                'click .save': 'saveView',
                'click .delete-view': 'deleteView',
                'click .dismiss-modal': 'cleanUp',
                'click .load': 'loadView'
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = new Views();
                this.collection.comparator = function (model) {return -model.id; };
                this.app.vent.trigger('load-view-list', this.collection);
            },

            setSerializedEntities: function (serializedEntities) {
                this.serializedEntities = serializedEntities;
            },

            selectView: function (e) {
                var target = e.currentTarget;
                this.unsetActiveViewItem();
                this.setActiveViewItem(target);
                this.ui.saveName.val(target.firstChild.dataset.name);
            },

            unsetActiveViewItem: function () {
                if (this.activeViewItem) {
                    this.activeViewItem.classList.remove('active');
                    this.activeViewItem = null;
                    this.ui.loadButton.addClass('disabled');
                }
            },

            //WARNING: MAY RETURN UNDEFINED
            getActiveViewObject: function () {
                //Just grab the view from the collection by id
                return this.collection.get(this.activeViewItem.firstChild.dataset.id);
            },

            resetInput: function () {
                this.ui.saveName.val('');
            },

            setActiveViewItem: function (target) {
                this.activeViewItem = target;
                this.activeViewItem.classList.add('active');
                this.ui.loadButton.removeClass('disabled');
            },

            checkInput: function (e) {
                this.unsetActiveViewItem();
                var match = this.collection.findWhere({name: e.target.value});
                if (match) {
                    this.setActiveViewItem(document.getElementById('view-item-' + match.id));
                }
            },

            saveView: function (e) {
                var view = null;
                //A convenience method to make sure the collection is sorted properly
                if (this.activeViewItem) {
                    view = this.getActiveViewObject();
                }
                if (!view) {
                    view = new View({
                        name: this.ui.saveName.val(),
                        description: '',
                        tags: '',
                        slug: btoa(Math.random() * 1000000000).replace(/=/g, '-') //Generate random slug string
                    });
                }
                view.set('entities', this.serializedEntities);
                view.set('center', this.formatGeoJSON(this.app.map.getCenter()));
                view.set('zoom', this.app.map.getZoom());
                //TODO: can't remember where to fetch this id from
                view.set('basemap', 12);
                view.set('view_authority', 3);
                view.save(null, {success: function (newView) {
                    this.collection.add(newView);
                    this.collection.sort();
                    this.collection.trigger('reset');
                    this.ui.saveName.val('');
                }.bind(this)});
            },

            loadView: function () {
                var view = this.getActiveViewObject();
                //If all is well and we have the corresponding view...
                if (view) {
                    //Trigger event so that parent layout can handle
                    //dispatching calls to other children as needed
                    //Check dataPanel.js for listener
                    this.trigger('load-view', view);
                }
            },

            deleteView: function (e) {
                var model = this.collection.get(e.currentTarget.parentElement.dataset.id);
                if (model) {
                    model.destroy();
                    //this.collection.remove(model);
                }
                e.stopPropagation();
            },

            cleanUp: function () {
                this.unsetActiveViewItem();
                this.resetInput();
            },

            //Utility method that probably exists elsewhere
            //TODO: fix this before merge
            formatGeoJSON: function (center) {
                return JSON.stringify({
                    type: 'Point',
                    coordinates: [center.lat(), center.lng()]
                });
            }



        });
        return ShareModal;
    });