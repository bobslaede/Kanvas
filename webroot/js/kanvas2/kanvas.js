;(function(window, Math){

	
	var Kanvas = function(canvas, image) {
		this.canvas = canvas;
		this.canvasRaw = canvas.get(0);
		this.ctx = this.canvasRaw.getContext('2d');
		this.mouse = new Vector(-100, -100);
		this.mouseActive = false;
		this.origin = new Vector(0, 0);
		this.width = 0;
		this.height = 0;
		this.view;
		this.image = image;
		this.globalScale = 1;
		this.translation = new Vector(0, 0);

		this.MAX_WIDTH = 500;
		this.MAX_HEIGHT = 400;
		this.MIN_WIDTH = 0;
		this.MIN_HEIGHT = 0;
		this.MARGIN = 50;

		this.action = {};
		this.action.type = 'resize';
		this.action.options = {};

		this.init();
	};

	Kanvas.prototype.init = function() {
		this.loadImage();
		this.resizeCanvas();
		this.makeViewPort();
		this.draw();
	};

	Kanvas.prototype.loadImage = function() {
		if (this.image && this.image.complete) {
			var MAX_HEIGHT = this.MAX_HEIGHT,
				MAX_WIDTH = this.MAX_WIDTH,
				width = this.image.width,
				height = this.image.height,
				newW = MAX_WIDTH,
				newH = MAX_HEIGHT,
				ratio,
				x = 0,
				y = 0;

			ratio = width / height;
			if ((newW / newH) > ratio) {
				newW = newH * ratio;
			} else {
				newH = newW / ratio;
			}
			this.globalScale = (newW / width);
			width = newW;
			height = newH;
			this.MIN_WIDTH = width;
			this.MIN_HEIGHT = height;
			this.image = new kImage(this.image, x, y, width, height);
		}
	};

	Kanvas.prototype.makeViewPort = function() {
		var width = this.image.width,
			height = this.image.height,
			x = 0,
			y = 0;

		this.translation.x = this.origin.x - width / 2;
		this.translation.y = this.origin.y - height / 2;
		
		this.view = new View(x, y, width, height);
	};

	Kanvas.prototype.resizeCanvas = function(e) {
		var width = $(window).width(),
				height = $(window).height(),
				margin = this.margin * 2;
		if (width < this.MIN_WIDTH + this.MARGIN) width = this.MIN_WIDTH + this.MARGIN;
		if (height < this.MIN_HEIGHT + this.MARGIN) height = this.MIN_HEIGHT + this.MARGIN;
		this.canvas.attr({width: width, height: height});
		this.width = width;
		this.height = height;
		this.origin.x = this.width / 2;
		this.origin.y = this.height / 2;
	};

	Kanvas.prototype.update = function() {
		this.resizeCanvas();
		this.draw();
	};

	Kanvas.prototype.setCursor = function(type) {
		var cursor = 'default';
		switch(type) {
			default:
				cursor = 'default';
				break;
			case 'tl':
				cursor = 'nw-resize';
				break;
			case 'tr':
				cursor = 'ne-resize';
				break;
			case 'br':
				cursor = 'se-resize';
				break;
			case 'bl':
				cursor = 'sw-resize';
				break;
		}
		if (this.cursor != cursor) {
			this.canvas.css('cursor',cursor);
		}
		this.cursor = cursor;
	};

	Kanvas.prototype.draw = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		// this.drawVector(this.mouse);
		var cursor = 'default';

		var inCorner = this.view.withinACorner(this.mouse),
			inRect = this.view.withinBounds(this.mouse);
		var showCorners = this.action.type == 'resize' && (this.action.options.inCorner || inCorner || inRect);
		if (showCorners && (this.action.options.inCorner || inCorner)) {
			cursor = this.action.options.inCorner || inCorner;
		}
		this.drawView(showCorners);

		if (this.mouseActive) {
			if (this.action.type == 'resize') {
				this.resize();
			}
		}
		this.setCursor(cursor);
	};

	Kanvas.prototype.drawVector = function(vector) {
		this.ctx.save();
		this.ctx.translate(this.translation.x, this.translation.y);
		this.ctx.beginPath();
		this.ctx.arc(vector.x, vector.y, 2, 0, Math.PI * 2, 0);
		this.ctx.fill();
		this.ctx.restore();
	};

	Kanvas.prototype.drawImage = function() {
		
	};

	Kanvas.prototype.drawView = function(drawCorners) {
		this.drawShape(this.view.rect, {
				fill : false,
				stroke : 'rgba(0,0,0,.4)',
				lineJoin : 'round',
				lineWidth : 1
			});

		if (drawCorners) {
			var options = {
				fill : '#fff',
				stroke : 'rgba(0,0,0,1)',
				lineJoin : 'round',
				lineWidth : 1
			};
			for (var i in this.view.corners) {
				var c = this.view.corners[i];
				this.drawShape(c, options);
			}
		}
	};

	Kanvas.prototype.drawShape = function(shape, options) {
		this.ctx.save();

		this.ctx.translate(this.translation.x, this.translation.y);

		this.ctx.beginPath();
		this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
		for (var i = 0, l = shape.points.length, j = 1; i < l; i++, j++) {
			if (j == l) j = 0;
			var v = shape.points[j];
			this.ctx.lineTo(~~v.x, ~~v.y);
		}
		if (options && options.lineJoin) {
			this.ctx.lineJoin = options.lineJoin;
		}
		if (options && options.lineWidth) {
			this.ctx.lineWidth = options.lineWidth;
		}
		if (options && options.stroke) {
			this.ctx.strokeStyle = options.stroke;
			this.ctx.stroke();
		}
		if (options && options.fill) {
			this.ctx.fillStyle = options.fill;
			this.ctx.fill();
		}
		this.ctx.restore();
	};

	Kanvas.prototype.resize = function() {
		var dir = this.action.options.inCorner;
		if (dir) {
			var view = this.view.clone();
			var v = this.mouse.clone();
			switch (dir) {
				case 'tl':
					view.rect.points[0] = v;
					view.rect.points[1].y = v.y;
					view.rect.points[3].x = v.x;
					break;
				case 'tr':
					view.rect.points[1] = v;
					view.rect.points[0].y = v.y;
					view.rect.points[2].x = v.x;
					break;
				case 'br':
					view.rect.points[2] = v;
					view.rect.points[1].x = v.x;
					view.rect.points[3].y = v.y;
					break;
				case 'bl':
					view.rect.points[3] = v;
					view.rect.points[0].x = v.x;
					view.rect.points[2].y = v.y;
					break;
			}
			var height = view.getHeight();
			var width = view.getWidth();
			if (width > 40 && height > 40) {
				this.view = view;
				this.view.addCorners();
			}
		}
	};

	Kanvas.prototype.onMouseMove = function(e) {
		var x = e.offsetX - this.canvasRaw.offsetLeft - this.translation.x,
			y = e.offsetY - this.canvasRaw.offsetTop - this.translation.y;

		this.mouse.x = x;
		this.mouse.y = y;
		this.update();
	};

	Kanvas.prototype.onMouseDown = function(e) {
		this.mouseActive = true;
		var x = e.offsetX - this.canvasRaw.offsetLeft - this.translation.x,
			y = e.offsetY - this.canvasRaw.offsetTop - this.translation.y;
			this.action.start = new Vector(x, y);
		if (this.action.type == 'resize') {
			this.action.options.inCorner = this.view.withinACorner(this.mouse);
		}
	};

	Kanvas.prototype.onMouseUp = function(e) {
		this.mouseActive = false;
		this.action.options = {};
	};

	Kanvas.prototype.onResize = function(e) {
		this.resizeCanvas();
		var min = this.view.rect.getMin();
		var max = this.view.rect.getMax();
		var width = max.x - min.x;
		var height = max.y - min.y;
		this.translation.x = this.origin.x - (width / 2);
		this.translation.y = this.origin.y - (height / 2);
		this.draw();
	};
	
	return window['Kanvas'] = Kanvas;
	
})(window, Math);
