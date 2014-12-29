define(["marionette",
        "underscore",
        "text!../../templates/charts/variable.html",
        "highcharts"
    ],
    function (Marionette, _, VariableTemplate) {
        "use strict";
        /**
         * The Variable's job is to provide a handle to drag
         * each column / field to either the x- or y-axis. Typically
         * initialized by the Variables CollectionView.
         */
        var Variable = Marionette.ItemView.extend({
            template: _.template(VariableTemplate),
            tagName: "span",
            modelEvents: {
                'change': 'render'
            },
            events: {
                'click .fa-close': 'detach',
                'dragstart .draggable': 'highlight',
                'dragend .draggable': 'unhighlight'
            },
            highlight: function (e) {
                $(e.target).addClass("highlighted");
                event.dataTransfer.setData("text/plain", this.model.get("id"));
            },
            unhighlight: function (e) {
                $(e.target).removeClass("highlighted");
            },
            detach: function (e) {
                this.trigger("detach");
                e.preventDefault();
            }
        });
        return Variable;
    });