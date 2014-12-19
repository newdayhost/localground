define(["jquery",
        "backbone",
        "highcharts"
    ],
    function ($, Backbone) {
        "use strict";
        var Axis = Backbone.View.extend({
            app: null,
            className: 'fill',
            events: {
                'drop': 'handleDrop',
                'dragover ': 'ignore'
            },
            initialize: function (opts) {
                this.app = opts.app;
            },
            render: function () {
                this.$el.html("");
            },
            ignore: function (e) {
                e.preventDefault();
            },
            handleDrop: function (e) {
                var fieldData = event.dataTransfer.getData('text/plain'),
                    $nodeCopy;
                fieldData = JSON.parse(fieldData);
                if ([2, 5].indexOf(fieldData.data_type) != -1) {
                   $nodeCopy = $('#' + fieldData.col_name).clone();
                    $nodeCopy.removeClass("highlighted");
                    $nodeCopy.attr('id', fieldData.col_name + "_new");
                    $(e.target).append($nodeCopy);
                } else {
                    alert("only numeric fields here: " + fieldData.data_type);
                    $('#' + fieldData.col_name).removeClass("highlighted");
                }
                e.preventDefault();
            }
        });
        return Axis;
    });