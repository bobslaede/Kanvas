;(function(window){
	
	var Photo = function(stage) {
		this.ready = false;
		this.image = new Image();
		this.image.onload = this.initPhoto.bind(this);
		this.orig = { width: 0, height: 0};
		this.ctx = stage.ctx;
		this.stage = stage;
		this.MAX_WIDTH = 700;
		this.MAX_HEIGHT = 500;
		this.dim = { width: 0, height: 0};
		this.centerX = stage.mainDim.width / 2;
		this.centerY = stage.mainDim.height / 2;
		this.resizeBy = 0;
	};
	
	Photo.prototype.initPhoto = function() {
		if (this.image && this.image.complete) {
			this.orig.width = this.image.width;
			this.orig.height = this.image.height;
			var width = this.orig.width,
				height = this.orig.height;
			if (width > height) {
				if (width > this.MAX_WIDTH) {
					height *= this.MAX_WIDTH / width;
					width = this.MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= this.MAX_HEIGHT / height;
					height = this.MAX_HEIGHT;
				}
			}
			this.ready = true;
			this.init();
			this.resize(width, height);
			this.draw();
		}
	};
	
	Photo.prototype.addFromUrl = function(url) {
		this.ready = false;
		this.image.src = url;
	};

	Photo.prototype.init = function() {
		this.centerX = this.stage.mainDim.width / 2;
		this.centerY = this.stage.mainDim.height / 2;
	};
	
	Photo.prototype.crop = function() {
		
	};

	Photo.prototype.moveBy = function(x,y) {
		this.centerX = x + this.dim.width / 2;
		this.centerY = y + this.dim.height / 2;
	};
	
	Photo.prototype.resize = function(width, height) {
		this.dim.width = width;
		this.dim.height = height;
	};
	
	Photo.prototype.rotate = function() {
		
	};
	
	Photo.prototype.draw = function() {
		if (this.ready == false) {
			return;
		}
		var top =  0 - this.dim.height / 2,
			left = 0 - this.dim.width / 2;
		this.ctx.save();
		this.ctx.translate(this.centerX, this.centerY);
	//	this.ctx.rotate(1);
		this.ctx.globalCompositeOperation = 'xor';
		this.ctx.drawImage(this.image, left, top, this.dim.width, this.dim.height);
		this.ctx.restore();
	};
	
	return window['Photo'] = Photo;
	
})(window);
