;(function(window, Math){
	
	var kImage = function(image, x, y, width, height) {
		this.image = image;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = x;
		this.angle = this.deg = 0;
		this.rect = new Rect(this.x, this.y, this.width, this.height);
	};

	kImage.prototype.rotate = function(angle) {
		this.angle = angle;
		this.deg = angle * Math.PI / 180;
	};
	
	return window['kImage'] = kImage;
	
})(window, Math);
