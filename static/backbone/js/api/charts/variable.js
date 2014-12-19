define(["marionette",
        "underscore",
        "text!../../templates/charts/variable.html",
        "highcharts"
    ],
    function (Marionette, _, VariableTemplate) {
        "use strict";
        var Variable = Marionette.ItemView.extend({
            template: _.template(VariableTemplate),
            tagName: "span",
            modelEvents: {
                'change': 'render'
            },
            events: {
                'click .draggable': 'addToAxis',
                'dragstart .draggable': 'highlight'
            },
            highlight: function (e) {
                $(e.target).addClass("highlighted");
                event.dataTransfer.setData("text/plain", JSON.stringify({
                    col_name: this.model.get("col_name"),
                    data_type: this.model.get("data_type")
                }));
            },
            addToAxis: function (e) {
                alert("add");
                /*var field_id = event.dataTransfer.getData('Text'),
                    $elem = $('#' + field_id).removeClass("chosen").removeClass("highlighted");
                $(this).append($elem);
                alert("remove variable from chart");
                }
                */
            }
        });
        return Variable;
    });