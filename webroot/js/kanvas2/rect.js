;(function(window, Math){
	
	var Rect = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.origin = new Vector(x + width / 2, y + height / 2);
		this.points = [];
		this.points.push(new Vector(x, y)); // top left
		this.points.push(new Vector(x + width, y)); // top right
		this.points.push(new Vector(x + width, y + height)); // bottom right
		this.points.push(new Vector(x, y + height)); // bottom left
		this.setOrigin();
	};

	Rect.prototype = new Shape();

	Rect.prototype.updateDimensions = function() {
		var tl = this.points[0],
			tr = this.points[1],
			br = this.points[2],
			bl = this.points[3];
		this.width = Vector.distance(tl, tr);
		this.height = Vector.distance(tr, br);
		return this;
	};
	
	Rect.prototype.getIntersectionPoints = function(rect) {
		return;
		var p1 = this.points;
		var p2 = rect.points;
		var p2L = p2.length;
		for (var i = 0, l = p1.length, j = 1; i < l; i++, j++) {
			if (j == l) j = 0;
			var line1 = new Line(p1[i], p1[j]);
			for (var o = 0, p = p2L, q = 1; o < p; o++, q++) {
				if (q == p) q = 0;
				var line2 = new Line(p2[o], p2[q]);
				var v = line1.intersect(line2);
				kanvas.drawLine(line1);
				kanvas.drawLine(line2);
			}
		}
	};

	Rect.prototype.withinRect = function(rect) {
		var trues = 0,
			v;
		for (var i = 0, l = this.points.length; i < l; i++) {
			v = this.points[i];
			if (rect.withinBounds(v)) {
				trues++;
			}
		}
		return trues == l;
	};

	Rect.prototype.getBoundingBox = function() {
		var min = Vector.min.apply(Vector, this.points),
			max = Vector.max.apply(Vector, this.points),
			r = new Rect(min.x, min.y, max.x - min.x, max.y - min.y);
		return r;
	};
	
	return window['Rect'] = Rect;
	
})(window, Math);
