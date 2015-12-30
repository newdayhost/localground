define(["marionette",
        "underscore",
        "views/prints/printMap",
        "text!" + templateDir + "/prints/printMockup.html"
    ],
    function (Marionette,
              _,
              PrintMap,
              printMockupTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print mockup
         * @class PrintMockup
         */
        var PrintMockup = Marionette.LayoutView.extend({
            /**
             * @lends localground.prints.views.PrintMockup#
             */
            template: function () {
                return _.template(printMockupTemplate);
            },

            DEFAULT_TITLE: 'Click to enter a map title',
            DEFAULT_DESCRIPTION: 'Click to enter instructions',

            tagName: 'div',
            id: 'print-mockup',
            regions: {
                printMapRegion: "#print-map-canvas"
            },
            ui: {
                title: '#print-map-title',
                titleInput: '#print-map-title-input',
                description: '#print-map-description',
                descriptionInput: '#print-map-description-input'
            },
            events: {
                'click #print-map-title': 'showTitleInput',
                'click #print-map-description': 'showDescriptionInput',
                'blur #print-map-title-input': 'hideTitleInput',
                'blur #print-map-description-input': 'hideDescriptionInput'
            },
            /**
             * Initializes the printMockup
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.firstLoad = true;
                this.app = opts.app;
                this.opts = opts;
                this.controller = opts.controller;
                this.listenTo(this.controller, 'change-layout', this.changeLayout);
            },

            onShow: function () {
                this.printMap = new PrintMap(_.defaults({mapContainerID: "print-map-canvas"}, this.opts));
                this.printMapRegion.show(this.printMap);
                this.map = this.printMap.map;
                this.mapView = this.printMap;
            },

            resizeMap: function () {
                try {
                    google.maps.event.trigger(this.map, "resize");
                } catch (e) {
                    // for Jasmine tests
                }
                // initialCenter: this is a hack to make sure that the print modal
                // centers correctly on first load:
                if (this.firstLoad) {
                    try {
                        this.map.setCenter(this.printMap.initialCenter);
                    } catch (e1) {
                        // Jasmine tests
                    }
                }
                this.firstLoad = false;
            },

            changeLayout: function (choice) {
                this.el.className = choice;
                this.resizeMap();
            },

            showTitleInput: function () {
                this.ui.title.hide();
                this.ui.titleInput.show();
                this.ui.titleInput.focus();
            },

            showDescriptionInput: function () {
                this.ui.description.hide();
                this.ui.descriptionInput.show();
                this.ui.descriptionInput.focus();
            },

            hideTitleInput: function (event) {
                var newTitle = event.target.value;
                if (!newTitle) {
                    newTitle = this.DEFAULT_TITLE;
                }
                this.ui.title.text(newTitle);
                this.ui.titleInput.hide();
                this.ui.title.show();
            },

            hideDescriptionInput: function (event) {
                var newDescription = event.target.value;
                if (!newDescription) {
                    newDescription = this.DEFAULT_DESCRIPTION;
                }
                this.ui.description.text(newDescription);
                this.ui.descriptionInput.hide();
                this.ui.description.show();
            },

            getFormData : function () {
                return {
                    map_title: this.getTitle(),
                    instructions: this.getInstructions(),
                    zoom: this.map.zoom,
                    center: JSON.stringify({
                        "type": "Point",
                        "coordinates": [
                            this.map.center.lng(),
                            this.map.center.lat()
                        ]
                    }),
                    map_provider: this.mapView.tileManager.getMapTypeId()
                };
            },

            getTitle: function () {
                return this.ui.titleInput.val();
            },

            getInstructions: function () {
                return this.ui.descriptionInput.val();
            }
        });
        return PrintMockup;
    });