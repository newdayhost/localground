define(["underscore", "models/base", "views/maps/overlays/symbol"], function (_, Base, Symbol) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="http://localground.org/api/0/layers/">http://localground.org/api/0/layers/</a>
     * Attributes: id, name, description, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            isVisible: false
        }),
        symbolMap: null,
        urlRoot: "/api/0/layers/",
        getNamePlural: function () {
            return "layers";
        },
        basic: false,
        initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            if (!_.isUndefined(this.get("id"))) {
                this.buildSymbolMap();
            }
            this.on("change:symbols", function () {
                this.buildSymbolMap();
            });
		},
        toJSON: function () {
            // ensure that the geometry object is serialized before it
            // gets sent to the server:
            var json = Base.prototype.toJSON.call(this);
            if (json.symbols != null) {
                json.symbols = JSON.stringify(json.symbols);
            }
            return json;
        },
		validate: function (attrs) {
            this.parseSymbolsFromString(attrs);
            if (!_.isArray(attrs.symbols) || _.isNull(attrs.symbols) || attrs.symbols.length == 0) {
                return 'Layer.symbols must be a JSON array with at least one entry';
            }
            //if valid, returns null;
            return null;
		},

        parseSymbolsFromString: function (attrs) {
            if (!_.isNull(attrs.symbols) && !_.isArray(attrs.symbols) && !_.isArray(attrs.symbols)) {
                try {
                    attrs.symbols = JSON.parse(attrs.symbols);
                } catch (e) {
                    //ignore
                }
            }
        },
        getKey: function () {
            if (this.collection) {
                return this.collection.key;
            }
            return "layers";
        },

        buildSymbolMap: function () {
            //set the basic flag:
            if (this.get("symbols").length == 1) {
                this.basic = true;
            }
            this.symbolMap = {};
            var i = 0,
                symbolList = this.get("symbols");
            //console.log(this.get("name"), symbolList);
            for (i = 0; i < symbolList.length; i++) {
                this.symbolMap[symbolList[i].rule] = new Symbol(symbolList[i]);
            }
        },

        getSymbols: function () {
            return _.values(this.symbolMap);
        },

        getSymbol: function (rule) {
            return this.symbolMap[rule];
        },

        getSymbolMap: function () {
            return this.symbolMap;
        },

        hideSymbols: function () {
            _.each(this.getSymbols(), function (symbol) {
                symbol.isShowingOnMap = false;
            });
        },

        showSymbols: function () {
            _.each(this.getSymbols(), function (symbol) {
                symbol.isShowingOnMap = true;
            });
        }
    });
    return Layer;
});