define(["collections/fields",
        "collections/records"
    ],
    function (Fields, Records) {
        'use strict';
        var DataManager = function (app) {
            this.formData = null;
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
                var key = 'form_' + opts.id,
                    isNew = false;
                if (!this.formData[key]) {
                    this.formData[key] = {};
                }

                // if this data hasn't been loaded from data API, load it:
                if (!this.formData[key].fields) {
                    this.getFields(opts.id);
                    this.getRecords(opts.id);
                    isNew = true;
                }
                this.app.vent.trigger('form-data-changed', {
                    fields: this.formData[key].fields,
                    records: this.formData[key].records
                });
                if (!isNew) {
                    this.formData[key].fields.trigger('reset');
                    this.formData[key].records.trigger('reset');
                }
            };

            this.getFields = function (id) {
                var key = 'form_' + id,
                    fields = new Fields([], {
                        url: '/api/0/forms/' + id + '/fields/'
                    });
                fields.fetch({ reset: true });
                this.formData[key].fields = fields;
            };

            this.getRecords = function (id) {
                var key = 'form_' + id,
                    records = new Records([], {
                        url: '/api/0/forms/' + id + '/data/'
                    });
                records.state.currentPage = 1;
                records.fetch({ reset: true });
                this.formData[key].records = records;
            };

            this.initialize(app);
        };
        return DataManager;
    });
