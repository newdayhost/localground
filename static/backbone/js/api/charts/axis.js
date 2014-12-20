define(["jquery",
        "backbone",
        "highcharts"
    ],
    function ($, Backbone) {
        "use strict";
        var Axis = Backbone.View.extend({
            app: null,
            className: 'fill',
            axisType: null,
            events: {
                'drop': 'handleDrop',
                'dragover ': 'ignore'
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.axisType = opts.axisType;
                this.app.vent.on('form-data-changed', this.clearVariables, this);
            },
            render: function () {
                this.$el.html(this.axisType);
            },
            clearVariables: function () {
                this.$el.empty();
            },
            ignore: function (e) {
                e.preventDefault();
            },
            handleDrop: function (e) {
                var fieldData = event.dataTransfer.getData('text/plain'),
                    $nodeCopy;
                fieldData = JSON.parse(fieldData);
                
                // make a copy of the dragged node and add it to the axis
                // panel
                $nodeCopy = $('#' + fieldData.col_name).clone();
                $nodeCopy.removeClass("highlighted");
                $nodeCopy.attr('id', fieldData.col_name + "_new");
                $(e.target).append($nodeCopy);

                //notify the application that a variable has been dropped.
                this.app.vent.trigger('variable-added', {
                    col_name: fieldData.col_name,
                    axisType: this.axisType
                });
                e.preventDefault();
            }
        });
        return Axis;
    });