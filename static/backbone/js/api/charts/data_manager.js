define(["collections/fields",
        "collections/records"
    ],
    function (Fields, Records) {
        'use strict';
        /**
         * The DataManager class's job is to load data, store it in
         * temporary memory, and keep track of which data set the user
         * is currently working on. It also has a few convenience classes
         * to access particular data elements.
         */
        var DataManager = function (app) {
            this.formData = null;
            this.activeFormID = null;
            this.initialize = function (opts) {
                this.app = opts.app;
                this.app.vent.on('form-changed', this.loadData, this);
                this.formData = {};
            };

            /**
             * Loads data only if it hasn't already been loaded,
             * and stores it in a JavaScript dictionary. E.g:
             *  this.loadData = {
                   form_1: { fields: FieldCollection, records: RecordCollection },
                   form_8: { fields: FieldCollection, records: RecordCollection }
             *  }
             */
            this.loadData = function (opts) {
                this.activeFormID = opts.id;
                var isNew = false;
                if (!this.formData[this.activeFormID]) {
                    this.formData[this.activeFormID] = {};
                }

                // if this data hasn't been loaded from data API, load it:
                if (!this.formData[this.activeFormID].fields) {
                    this._getFields(opts.id);
                    this._getRecords(opts.id);
                    isNew = true;
                }
                this.app.vent.trigger('form-data-changed', {
                    fields: this.formData[this.activeFormID].fields,
                    records: this.formData[this.activeFormID].records
                });
                if (!isNew) {
                    this.formData[this.activeFormID].fields.trigger('reset');
                    this.formData[this.activeFormID].records.trigger('reset');
                }
            };

            this._getFields = function (id) {
                var fields = new Fields([], {
                    formID: id
                });
                fields.fetch({ reset: true });
                this.formData[this.activeFormID].fields = fields;
            };

            this._getRecords = function (id) {
                var records = new Records([], {
                    url: '/api/0/forms/' + id + '/data/'
                });
                records.state.currentPage = 1;
                records.fetch({ reset: true });
                this.formData[this.activeFormID].records = records;
            };

            this.getRecords = function () {
                return this.formData[this.activeFormID].records;
            };

            this.getField = function (id) {
                return this.formData[this.activeFormID].fields.get(id);
            };

            this.initialize(app);
        };
        return DataManager;
    });
