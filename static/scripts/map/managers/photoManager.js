localground.photoManager = function(data){
	this.name = 'Photos';
    this.id = this.overlayType = self.overlayTypes.PHOTO
    this.data = [];
};

localground.photoManager.prototype = new localground.manager();

localground.photoManager.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
        me.data.push(new localground.photo(this));        
    });
};

localground.photoManager.prototype.makeViewable = function() {
	//call default renderer:
	localground.manager.prototype.makeViewable.call(this);
    
    //destroy draggable event handlers:
    $('.thumbsmall').draggable("destroy");
    $('.thumbsmall').removeClass('can_drag').removeClass('ui-draggable').removeClass('activated')
};

localground.photoManager.prototype.doViewportUpdates = function() {
	$.each(this.data, function() {
		this.setImageIcon();
		if(!this.inView())
			this.getListingElement().hide();
		else
			this.getListingElement().show();
	});
};