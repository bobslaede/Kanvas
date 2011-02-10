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
			this.image.rotate(5);
		}
	};

	Kanvas.prototype.makeViewPort = function() {
		var min = new Vector(40,40),
			max = new Vector(this.image.width-40, this.image.height-40);

		this.view = new View(min, max);
		this.translation.x =  this.origin.x - this.view.getWidth() / 2;
		this.translation.y = this.origin.y - this.view.getHeight() / 2;
	};

	Kanvas.prototype.resizeCanvas = function() {
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
		if (this.action.type == 'resize') { // only redraw if the tool needs it
			this.resizeCanvas();
			this.draw();
		}
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
			case 'move':
				cursor = 'move';
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

		if (this.action.type == 'resize') {
			var inCorner = this.view.withinACorner(this.mouse),
				inRect = this.view.withinBounds(this.mouse);
			var showCorners = this.action.type == 'resize' && (this.action.options.inCorner || inCorner || inRect);
			if (showCorners && (this.action.options.inCorner || inCorner)) {
				cursor = this.action.options.inCorner || inCorner;
			}
			if (!(this.action.options.inCorner || inCorner) && (this.action.options.inBox || inRect)) {
				cursor = 'move';
			}
		}
		this.drawImage();
		this.drawView(showCorners);
		this.drawGrid();

		if (this.mouseActive) {
			if (this.action.type == 'resize') {
				this.resize();
				this.move();
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
		var inter = this.view.rect.withinRect(this.image.rect) ? '#000' : '#f00';
		this.drawShape(this.image.rect, {stroke : inter});
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

	Kanvas.prototype.drawLine = function(line) {
		this.ctx.save();
		this.ctx.translate(this.translation.x, this.translation.y);

		this.ctx.beginPath();

		this.ctx.moveTo(line.v1.x, line.v1.y);
		this.ctx.lineTo(line.v2.x, line.v2.y);

		this.ctx.strokeStyle = 'red';
		this.ctx.stroke();
		this.ctx.restore();
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
	
	Kanvas.prototype.drawGrid = function() {
		var min = this.image.rect.points[0].clone().multiplyScalar(1.4),
			max = this.image.rect.points[2].clone().multiplyScalar(1.4),
			origin = this.image.rect.origin,
			dia = Vector.distance(min, max),
			radi = dia / 2,
			space = 20,
			dash = 2,
			numGrid = ~~(dia / space);

		this.ctx.save();
		this.ctx.translate(this.translation.x, this.translation.y);
		this.ctx.translate(origin.x, origin.y);

		var c2 = (radi * radi);
		var ctx = this.ctx;
		var draw = function() {
			var x = 0-(~~radi) + .5,
				y = 0 + .5;
			for (var i = 0; i <= numGrid; i++) {
				var b = (x),
					b2 = (b * b),
					a = Math.sqrt(c2 - b2),
					startY = y+a,
					endY = y-a;
				for (var j = endY; j < startY; j += (dash * 2)) {
					ctx.moveTo(x, j+dash);
					ctx.lineTo(x, j);
				}
				x += space;
			}
		};

		var d = 90 * Math.PI / 180;
		this.ctx.beginPath();
		
		draw();
		this.ctx.rotate(d);
		draw();
		this.ctx.rotate(d);

		var grad = this.ctx.createRadialGradient(0, 0, 0,
				0, 0, radi);
		grad.addColorStop(0, 'rgba(0,0,0,.4)');
		grad.addColorStop(1, 'rgba(0,0,0,0)');
		this.ctx.strokeStyle = grad;
		this.ctx.stroke();


		// the circle, just for show...
	/*	
		this.ctx.beginPath();
		this.ctx.arc(0, 0, radi, 0, 2 * Math.PI, 0);
		this.ctx.strokeStyle = '#000';
		this.ctx.stroke();
*/
		
		this.ctx.restore();

		/*
		var space = 30,
			dash = 2,
			w = this.view.rect.width,
			h = this.view.rect.height,
			centerX = w / 2,
			centerY = h / 2,
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
		this.ctx.translate(this.translation.x, this.translation.y);
		this.ctx.translate(this.view.rect.points[0].x, this.view.rect.points[0].y);
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
		this.ctx.globalCompositionOperation = 'destination-out';
		this.ctx.restore();
		*/
	};

	Kanvas.prototype.rotate = function(angle) {
		var prevAngle = this.image.rect.a;
		this.image.rotate(angle);
		if (!this.view.rect.withinRect(this.image.rect)) {
			this.image.rect.rotateTo(prevAngle);
		}
		var min = this.image.rect.getMin();
		var max = this.image.rect.getMax();
		this.MIN_WIDTH = max.x - min.x;
		this.MIN_HEIGHT = max.y - min.y;
		this.draw();
//		this.image.rect.getIntersectionPoints(this.view.rect);
		return this;
	};

	Kanvas.prototype.resize = function() {
		var dir = this.action.options.inCorner;
		if (dir) {
			var mouse = this.mouse.clone();
			var minWidth = 50,
				minHeight = 50;
			switch (dir) {
				case 'tl':
					var v1 = mouse;
					var v2 = this.view.corners.br.origin.clone();
					var distX = Vector.distance(v1, new Vector(v2.x, v1.y));
					if (distX < minWidth || v1.x > v2.x) {
						v1.x = v2.x - minWidth;
					}
					var distY = Vector.distance(v1, new Vector(v1.x, v2.y));
					if (distY < minHeight || v1.y > v2.y) {
						v1.y = v2.y - minHeight;
					}
					var view = new View(v1, v2);
					break;
				case 'tr':
					var v1 = new Vector(this.view.corners.tl.origin.x, mouse.y);
					var v2 = new Vector(mouse.x, this.view.corners.br.origin.y);
					var distX = Vector.distance(v1, new Vector(v2.x, v1.y));
					if (distX < minWidth || v2.x < v1.x) {
						v2.x = v1.x + minWidth;
					}
					var distY = Vector.distance(v1, new Vector(v1.x, v2.y));
					if (distY < minHeight || v1.y > v2.y) {
						v1.y = v2.y - minHeight;
					}
					var view = new View(v1, v2);
					break;
				case 'br':
					var v1 = this.view.corners.tl.origin.clone();
					var v2 = mouse;
					var distX = Vector.distance(v1, new Vector(v2.x, v1.y));
					if (distX < minWidth || v2.x < v1.x) {
						v2.x = v1.x + minWidth;
					}
					var distY = Vector.distance(v1, new Vector(v1.x, v2.y));
					if (distY < minHeight || v2.y < v1.y) {
						v2.y = v1.y + minHeight;
					}
					var view = new View(v1, v2);
					break;
				case 'bl':
					var v1 = new Vector(mouse.x, this.view.corners.tl.origin.y);
					var v2 = new Vector(this.view.corners.br.origin.x, mouse.y);
					var distX = Vector.distance(v1, new Vector(v2.x, v1.y));
					if (distX < minWidth || v2.x < v1.x) {
						v1.x = v2.x - minWidth;
					}
					var distY = Vector.distance(v1, new Vector(v1.x, v2.y));
					if (distY < minHeight || v1.y > v2.y) {
						v2.y = v1.y + minHeight;
					}
					var view = new View(v1, v2);
					break;
			}
			if (view.rect.withinRect(this.image.rect)) {
				this.view = view;
			}
		}
	};

	Kanvas.prototype.move = function() {
		var inBox = this.action.options.inBox;
		if (inBox && !this.action.options.inCorner) {
			var pMin = this.view.min.clone(),
				pMax = this.view.max.clone(),
				mouse = this.mouse.clone();

			var diffX = this.action.start.clone().x - mouse.x;
			pMin.x -= diffX;
			pMax.x -= diffX;
			var diffY = this.action.start.clone().y - mouse.y;
			pMin.y -= diffY;
			pMax.y -= diffY;


			var view = new View(pMin, pMax);
			if (view.rect.withinRect(this.image.rect)) {
				this.action.start = mouse;
				this.view = view;
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
			this.action.options.inBox = this.view.withinBounds(this.mouse);
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
		//this.translation.x = this.origin.x - (width / 2);
		//this.translation.y = this.origin.y - (height / 2);
		this.draw();
	};
	
	return window['Kanvas'] = Kanvas;
	
})(window, Math);
