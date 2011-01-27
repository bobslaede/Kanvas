;(function($,window){
	
	var document = window.document;
	
	var Kanvas = function(canvas, image) {
		this.canvas = canvas;
		this.ctx = window.ctx = canvas.get(0).getContext('2d');

		this.mainDim = { width: 0, height: 0 };
		
		this.max = {};
		this.max.width = 600;
		this.max.height = 400;

		this.view = {};
		this.view.width = 0;
		this.view.height = 0;
		this.view.x = 0;
		this.view.y = 0;

		this.origImage = image;

		this.margin = 20;

		this.initialScale = 0;
		
		this.rect = null;
		this.viewRect = null;
		
		this.image = {};
		this.image.width = 0;
		this.image.height = 0;
		this.image.y = 0;
		this.image.x = 0;
		this.image.angle = 0;
		this.image.ratio = 0;
		this.image.scale = 1;
		this.image.offsetX = 0;
		this.image.offsetY = 0;
		this.image.wobble = 0;
		
		this.showShadow = true;

		this.mouseDown = false;
		this.mouse = new Vector(0,0);
		this.prevMouse = new Vector(0,0);
		this.startMouse = new Vector(0,0);
		
		this.tool = 'move';
		
		this.init();
	};
	
	Kanvas.prototype.rotate = function(angle) {
		this.image.angle = angle * Math.PI / 180;
		this.draw();
	};
	
	Kanvas.prototype.scale = function(scale) {
		this.image.scale = scale;
		this.draw();
	};

	Kanvas.prototype.init = function() {
		this.initPhoto();
		this.resizeCanvas();
	};

	Kanvas.prototype.initPhoto = function() {
		if (this.origImage && this.origImage.complete) {
			var MAX_HEIGHT = this.max.height,
					MAX_WIDTH = this.max.width,
					width = this.image.origWidth = this.origImage.width,
					height = this.image.origHeight = this.origImage.height,
					newW = MAX_WIDTH,
					newH = MAX_HEIGHT,
					ratio;

			ratio = width / height;
			if ((newW / newH) > ratio) {
				newW = newH * ratio;
			} else {
				newH = newW / ratio;
			}
			this.image.scale = (newW / width);
			//width = newW;
			//height = newH;
			this.image.ratio = width / height;
			this.image.width = width;
			this.image.height = height;
			this.view.width = newW;
			this.view.height = newH;
		}
	};
	
	Kanvas.prototype.resizeCanvas = function(e) {
		var width = $(window).width(),
				height = $(window).height(),
				margin = this.margin * 2;
			
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
		this.image.wobble = 0;
		this.draw();
	};
	
	Kanvas.prototype.draw = function() {
		this.ctx.clearRect(0, 0, this.mainDim.width, this.mainDim.height);
		this.drawViewPort();
		this.drawGrid();
		if (this.mouseDown === true) { // mouse down
			
			switch (this.tool) {
				case 'resize':
					
					break;
				case 'move':
					var diff = Vector.sub(this.mouse, this.prevMouse);
					this.image.offsetX += diff.x;
					this.image.offsetY += diff.y;
					
					this.prevMouse = this.mouse.clone();
					break;
			}
		}
		this.drawPhoto();
	};
	
	Kanvas.prototype.drawGrid = function() {
		var space = 30,
			dash = 2,
			w = this.view.width,
			h = this.view.height,
			centerX = this.view.width / 2,
			centerY = this.view.height / 2,
			startX = 0,
			startY = 0,
			endX = 0,
			endY = 0,
			numX = 0,
			numY = 0,
			spaceX = 0,
			spaceY = 0,
			absStartX = 0-centerX,
			absEndX = centerX,
			absStartY = 0-centerY,
			absEndY = centerY;

		numX = ~~(w / space);
		spaceX = numX * space;
		endX = spaceX / 2;
		startX = 0-(endX);

		numY = ~~(h / space);
		spaceY = numY * space;
		endY = spaceY / 2;
		startY = 0-(endY);

		this.ctx.save();
		this.ctx.translate(this.view.x, this.view.y);
		this.ctx.translate(centerX,centerY);
		this.ctx.globalCompositeOperation = 'xor';
		
		this.ctx.beginPath();
		for (var x = startX + 0.5; x <= endX+0.5; x+=space) {
			for (var d = absStartY; d < absEndY; d += dash*2) {
				this.ctx.moveTo(x,d);
				this.ctx.lineTo(x,d+dash);
			}
		}
		for (var y = startY + 0.5; y <= endY+0.5; y+=space) {
			for (var d = absStartX; d < absEndX; d+= dash*2) {
				this.ctx.moveTo(d,y);
				this.ctx.lineTo(d+dash,y);
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

		this.view.x = ~~(centerX - this.view.width / 2);
		this.view.y = ~~(centerY - this.view.height / 2);
		
		var x = 0, 
			y = 0;


		var top 	= new Line(new Vector(x, y), new Vector(x + this.view.width, y));
		var right 	= new Line(new Vector(x + this.view.width, y), new Vector(x + this.view.width, y + this.view.height));
		var bottom 	= new Line(new Vector(x, y + this.view.height), new Vector(x + this.view.width, y + this.view.height));
		var left 	= new Line(new Vector(x, y), new Vector(x, y + this.view.height));
		
		this.viewRect = new Rect(top, right, bottom, left);
		
		if (this.showShadow === true) {
			this.ctx.save();
			this.ctx.fillStyle = 'rgba(0,0,0,1)';
			this.ctx.translate(this.view.x, this.view.y);
			this.ctx.globalCompositeOperation = 'source-over';
			this.ctx.shadowColor = 'rgba(0,0,0,.5)';
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;
			this.ctx.shadowBlur = 16;
			this.ctx.fillRect(x, y, this.view.width, this.view.height);
			this.ctx.restore();
		}
		this.ctx.save();
		ctx.translate(this.view.x, this.view.y);

		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillRect(x, y, this.view.width, this.view.height);
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
		
		this.ctx.translate(this.image.offsetX + (this.view.width / 2), this.image.offsetY + (this.view.height / 2));
		this.ctx.rotate(this.image.angle);
		this.ctx.rotate(this.image.wobble);
		this.ctx.scale(this.image.scale, this.image.scale);
		try {
			this.ctx.drawImage(this.origImage, x - this.image.width / 2, y - this.image.height / 2);
		} catch(e) {}

		this.ctx.restore();
		this.drawRect();
	};
	
	Kanvas.prototype.drawRect = function() {
		var sOfX = this.image.offsetX,
			sOfY = this.image.offsetY,
			width = this.image.width * this.image.scale,
			height = this.image.height * this.image.scale;
		
		var tL = new Vector(sOfX, sOfY),
			tR = new Vector(sOfX + width, sOfY),
			bR = new Vector(sOfX + width, sOfY + height),
			bL = new Vector(sOfX, sOfY + height);

		this.rect = new Rect(
					new Line(tL, tR),
					new Line(tR, bR),
					new Line(bR, bL),
					new Line(bL, tL)
				);
		
		this.rect.rotate(this.image.angle);
		Rect.intersectRect(this.rect, this.viewRect);
	};
	
	Kanvas.prototype.onKeyDown = function(e) {
	};
	
	Kanvas.prototype.onKeyUp = function(e) {
	};
	
	Kanvas.prototype.onMouseDown = function(e) {
		var x = this.startMouse.x = e.clientX - this.view.x;
		var y = this.startMouse.y = e.clientY - this.view.y;
		this.prevMouse.x = x;
		this.prevMouse.y = y;
		this.mouseDown = true;
	};
	
	Kanvas.prototype.onMouseUp = function(e) {
		this.mouseDown = false;
		this.endDraw();
	};
	
	Kanvas.prototype.onMouseMove = function(e) {
		
		var x = this.mouse.x = e.clientX - this.view.x;
		var y = this.mouse.y = e.clientY - this.view.y;
		
		if (this.mouseDown === true) {
			this.draw();
			this.rect.draw();
		}
	};
	
	return window['Kanvas'] = Kanvas;
	
})(jQuery,window);
