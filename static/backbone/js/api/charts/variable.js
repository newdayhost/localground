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
                'click .fa-close': 'detach',
                'dragstart .draggable': 'highlight'
            },
            highlight: function (e) {
                $(e.target).addClass("highlighted");
                event.dataTransfer.setData("text/plain", this.model.get("id"));
            },
            detach: function (e) {
                console.log('remove');
                this.trigger("detach");
                //this.remove();
            }
        });
        return Variable;
    });