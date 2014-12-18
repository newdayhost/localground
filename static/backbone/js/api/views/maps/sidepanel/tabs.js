/**
 * Created by zmmachar on 10/15/14.
 */
define(["backbone",
        "underscore",
        "jquery",
        'views/maps/overlays/symbol',
        "text!" + templateDir + "/sidepanel/layerEntry.html"
    ],
    function (Backbone, $) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var Tabs = Backbone.View.extend({
            initialize: function (opts) {
                $.extend(this, opts);
            }
        });
        return Tabs;
    });