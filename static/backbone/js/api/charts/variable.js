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
                    id: this.model.get("id"),
                    col_name: this.model.get("col_name"),
                    data_type: this.model.get("data_type")
                }));
            }
        });
        return Variable;
    });