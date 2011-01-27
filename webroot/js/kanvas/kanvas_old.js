;(function($,window){
	
	var document = window.document;
	
	var Kanvas = function(canvas, image) {
		this.canvas = canvas;
		this.ctx = canvas.get(0).getContext('2d');
		this.mainDim = { width: 0, height: 0 };
		this.view = { width: 600, height: 400 };
		this.view.x = 0;
		this.view.y = 0;
		this.origImage = image;

		this.margin = 20;

		this.image = {};
		this.image.width = 0;
		this.image.height = 0;
		this.image.origWidth = 0;
		this.image.origHeight = 0;
		this.image.y = 0;
		this.image.x = 0;
		this.image.angle = 0;
		this.image.origAngle = 0;
		this.image.origX = 0;
		this.image.origY = 0;
		this.image.ratio = 0;
		
		this.showShadow = true;

		this.mouse = {};
		this.mouse.active = false;
		this.mouse.sX = 0;
		this.mouse.sY = 0;
		this.mouse.eX = 0;
		this.mouse.eY = 0;
		
		this.mod = {};
		this.mod.shift = false;
		this.mod.ctrl = false;

		this.action = 'rotate';

		this.init();
	};
	
	Kanvas.prototype.init = function() {
		this.resizeCanvas();
		this.initPhoto();
		this.draw();
	};

	Kanvas.prototype.initPhoto = function() {
		if (this.origImage && this.origImage.complete) {
			var MAX_HEIGHT = this.view.height,
					MAX_WIDTH = this.view.width,
					width = this.origImage.width,
					height = this.origImage.height;
			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			this.image.ratio = width / height;
			this.image.width = width;
			this.image.height = height;
			this.image.origWidth = width;
			this.image.origHeight = height;
			this.image.y = (this.view.height / 2) - (height / 2);
			this.image.x = (this.view.width / 2) - (width / 2);
			this.image.origX = this.image.x;
			this.image.origY = this.image.y;
		}
	};
	
	Kanvas.prototype.resizeCanvas = function(e) {
		var width = $(window).width(),
				height = $(window).height(),
				margin = this.margin;
			
		if (height < this.view.height + margin) {
			height = this.view.height + margin;
		}
		if (width < this.view.width + margin) {
			width = this.view.width + margin;
		}
		this.canvas.attr({width: width, height: height});
		this.mainDim.width = width;
		this.mainDim.height = height;
		this.draw();
	};
	
	Kanvas.prototype.endDraw = function() {
		if (this.mouse.active === true) {
			switch (this.action) {
				case 'move':
					this.image.origX = this.image.x;
					this.image.origY = this.image.y;
					break;
				case 'resize':
					this.image.origWidth = this.image.width;
					this.image.origHeight = this.image.height;
					break;
				case 'rotate':

					break;
			}
		}
	};
	
	Kanvas.prototype.draw = function() {
		this.ctx.clearRect(0, 0, this.mainDim.width, this.mainDim.height);
		this.drawViewPort();
		if (this.mouse.active === true) { //active mouse
			// currently only moving
			switch (this.action) {
				case 'move':
					
					var diffX = this.mouse.eX - (this.mouse.sX - this.image.origX),
							diffY = this.mouse.eY - (this.mouse.sY - this.image.origY);
					this.image.x = diffX;
					this.image.y = diffY;
					
					break;
				case 'resize':

					var newWidth = this.mouse.eX - (this.mouse.sX - this.image.origWidth);
					var newHeight = this.mouse.eY - (this.mouse.sY - this.image.origHeight);
					
					if (this.mod.shift === false) { // keep ratio when not holding SHIFT
						newHeight = newWidth / this.image.ratio;
					}

					var newX = this.image.x + ((this.image.width - newWidth) / 2);
					var newY = this.image.y + ((this.image.height - newHeight) / 2);
					
					this.image.width = newWidth;
					this.image.height = newHeight;

					// when holding CTRL, dont expand from center
					if (this.mod.ctrl === false) {
						this.image.x = newX;
						this.image.y = newY;
					}
					
					break;
				case 'rotate':
					
					this.drawGrid();

					var diffX = this.mouse.eX - (this.mouse.sX - this.image.origX);
					
					this.image.angle = 0 - (diffX * Math.PI / 180);
					
					break;
			}
		}
		//this.drawGrid();
		this.drawPhoto();
	};
	
	Kanvas.prototype.drawGrid = function() {
		var space = 25,
				dash = 2;
		
		this.ctx.save();
		this.ctx.translate(this.view.x,this.view.y);
		this.ctx.globalCompositeOperation = 'xor';
		
		this.ctx.beginPath();
		// vert
		var e = this.view.height;
		for (var x = 0.5 + space, h = this.view.width; x <=h; x+=space) {
			for (var d = 0; d < e; d+=dash*2) {
				this.ctx.moveTo(x, d);
				this.ctx.lineTo(x, d+dash);
			}
		}
		e = this.view.width;
		for (var y = 0.5 + space, w = this.view.height; y <=w; y+=space) {
			for (var d = 0; d < e; d+=dash*2) {
				this.ctx.moveTo(d, y);
				this.ctx.lineTo(d+dash, y);
			}
		}
		
		this.ctx.strokeStyle = 'rgba(100,100,100,.4)';
		this.ctx.stroke();
		this.ctx.restore();
	};
	
	Kanvas.prototype.drawViewPort = function() {
		var centerX = this.mainDim.width / 2;
		var centerY = this.mainDim.height / 2;
		
		this.ctx.save();
		
		this.ctx.fillStyle = 'rgba(0,0,0,.5)';
		this.ctx.fillRect(0, 0, this.mainDim.width, this.mainDim.height);

		this.ctx.restore();
		this.ctx.save();

		this.ctx.fillStyle = 'rgba(0,0,0,1)';

		this.view.x = ~~(centerX - this.view.width / 2);
		this.view.y = ~~(centerY - this.view.height / 2);

		if (this.showShadow === true) {
			this.ctx.globalCompositeOperation = 'source-over';
			this.ctx.shadowColor = 'rgba(0,0,0,.5)';
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;
			this.ctx.shadowBlur = 16;
			this.ctx.fillRect(this.view.x, this.view.y, this.view.width, this.view.height);
		}
		this.ctx.restore();
		this.ctx.save();

		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillRect(this.view.x, this.view.y, this.view.width, this.view.height);
		this.ctx.restore();
	};

	Kanvas.prototype.drawPhoto = function() {
		
		this.ctx.save();
		this.ctx.globalCompositeOperation = 'xor';

		var startY = this.view.y,
				startX = this.view.x,
				width = this.image.width,
				height = this.image.height,
				angle = this.image.angle,
				y = this.image.y,
				x = this.image.x;

		this.ctx.translate(startX, startY);

		if (this.image.angle) {
			this.ctx.translate(x + (width / 2), y + (height / 2));
			this.ctx.rotate(this.image.angle);
			this.ctx.translate(- x -(width / 2), - y -(height / 2));
		}
		this.ctx.drawImage(this.origImage, x, y, width, height);

		this.ctx.restore();
		
	};
	
	Kanvas.prototype.onKeyDown = function(e) {
	};
	
	Kanvas.prototype.onKeyUp = function(e) {
	};
	
	Kanvas.prototype.onMouseDown = function(e) {
		var x = this.mouse.sX = e.clientX - this.view.x;
		var y = this.mouse.sY = e.clientY - this.view.y;
		var withinLeft = (x - this.image.x) > 0;
		var withinTop = (y - this.image.y) > 0;
		var withinBottom = (y - this.image.y) < this.image.height;
		var withinRight = (x - this.image.x) < this.image.width;
		if (withinLeft && withinRight && withinTop && withinBottom) { // only active when starting within the image
			this.mouse.active = true;
		}
	};
	
	Kanvas.prototype.onMouseUp = function(e) {
		this.endDraw();
		this.mouse.active = false;
		this.draw();
	};
	
	Kanvas.prototype.onMouseMove = function(e) {
		
		var x = e.clientX - this.view.x;
		var y = e.clientY - this.view.y;
		var withinLeft = (x - this.image.x) > 0;
		var withinTop = (y - this.image.y) > 0;
		var withinBottom = (y - this.image.y) < this.image.height;
		var withinRight = (x - this.image.x) < this.image.width;
		if (withinLeft && withinRight && withinTop && withinBottom) {
			this.canvas.css('cursor','pointer');
		} else {
			this.canvas.css('cursor','default');
		}
		
		this.mod.shift = e.shiftKey;
		this.mod.ctrl = e.ctrlKey;
		
		this.mouse.eX = e.clientX - this.view.x;
		this.mouse.eY = e.clientY - this.view.y;
		
		if (this.mouse.active === true) {
			this.canvas.css('cursor','move');
			this.draw();
		}
	};
	
	return window['Kanvas'] = Kanvas;
	
})(jQuery,window);
