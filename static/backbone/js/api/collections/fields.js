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
            if (!this.url) {
                alert("The Records collection requires a url parameter upon initialization");
                return;
            }
            Base.prototype.initialize.apply(this, arguments);
        }
    });
    return Fields;
});
