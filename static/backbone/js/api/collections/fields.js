define(["jquery", "models/field", "collections/base"], function ($, Field, Base) {
    "use strict";
    /**
     * @class localground.collections.Photos
     */
    var Fields = Base.extend({
        model: Field,
        name: 'Form Fields',
        url: null,
		initialize: function (recs, opts) {
            $.extend(this, opts);
            if (!this.formID) {
                alert("The Fields collection requires a formID parameter upon initialization");
                return;
            }
			this.url = '/api/0/forms/' + this.formID + '/fields/';
            Base.prototype.initialize.apply(this, arguments);
        }
    });
    return Fields;
});
