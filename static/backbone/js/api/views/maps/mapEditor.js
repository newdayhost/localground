define(
	[
		"views/maps/basemap",
		"views/maps/sidepanel/dataPanel",
		"lib/maps/managers/dataManager",
		"views/maps/overlays/overlayManager",
		"infobubble"
		
	], function() {
	/**
	 * The top-level view class that harnesses all of the map editor
	 * functionality. Also coordinates event triggers across all of
	 * the constituent views.
	 * @class MapEditor
	 */
	localground.maps.views.MapEditor = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.MapEditor#
		 */
		
		el: "body",
		/** A {@link localground.maps.views.Basemap} object */
		basemap: null,
		/** A {@link localground.maps.managers.DataManager} object */
		dataManager: null,
		
		/** A {@link localground.maps.controls.OverlayManager} object */
		overlayManager: null,
		
		/** A object that coordinates events across objects */
		eventManager: _.extend({}, Backbone.Events),
		
		/** A {@link localground.maps.views.DataPanel} object */
		dataPanel: null,
		/** A Map InfoBubble */
		infoBubble: null,
		/**
		 * Initializes the BasemapView and all of the panels.
		 * @method initialize
		 * @param {Object} opts
		 * Dictionary of initialization options
		 */
		initialize: function(opts) {
			$.extend(this, opts);
			
			/*this.panelManager = new PanelManagerView([
				'data',
				'symbols',
				'presentations',
				'downloads'
			]);
			*/
			
			this.basemap = new localground.maps.views.Basemap({
				mapContainerID: "map_canvas",
				defaultLocation: opts.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: opts.activeMapTypeID,
				overlays: opts.overlays 
			});
			
			this.infoBubble = new InfoBubble({
				borderRadius: 5,
				maxHeight: 385,
				padding: 0,
				disableAnimation: true,
				map: this.basemap.map
			});
			
			this.dataManager = new localground.maps.managers.DataManager({
				eventManager: this.eventManager
			});
			
			/** Controls the map overlays */
			this.overlayManager = new localground.maps.views.OverlayManager({
				dataManager: this.dataManager,
				eventManager: this.eventManager,
				map: this.basemap.map
			});
			
			/** Controls the side panel overlay listings */
			this.dataPanel = new localground.maps.views.DataPanel({
				dataManager: this.dataManager,
				eventManager: this.eventManager,
				map: this.basemap.map
			});
			this.$el.find('#panels').append(this.dataPanel.render().el);
			
			//listen for projects being added or removed:
			this.attachEvents();
		},

		/**
		 * Adds event listeners to listen for window resize
		 */
		attachEvents: function(){
			var that = this;
			$(window).off('resize');
			$(window).on('resize', function(){
				that.dataPanel.resize();	
			});
			
			this.eventManager.on("show_bubble", function(model, latLng){
				console.log(model.get("id"));
				var name = model.get("name") || "untitled";
				//console.log(latLng);
				that.infoBubble.setContent(name);
				that.infoBubble.setPosition(latLng);
				that.infoBubble.open();
			});
		}
	});
	return localground.maps.views.MapEditor;
});
