
;(function(window, Math){
	
	var Shape = function() {
		this.points = [];
		this.fill = false;
	};

	Shape.prototype.addPoint = function() {
		for (var i = 0, l = arguments.length; i < l; i++) {
			this.points.push(arguments[i]);
		}
		return this;
	};

	Shape.prototype.withinBounds = function(vector) {
		var v0 = vector,
			j = this.points.length-1,
			res = [],
			v1,
			v2,
			test,
			max;
		for (var i = 0, l = j+1; i < l; i++) {
			v1 = this.points[i];
			v2 = this.points[j];
			if (v1 && v2) {
				test = (v1.x * v2.y - v1.y * v2.x - v0.x * v2.y + v0.y * v2.x + v0.x * v1.y - v0.y * v1.x);
				res.push(~~test);
			}
			j = i;
		}

		max = Math.max.apply(Math, res);

		return max < 0;
	};

	Shape.prototype.setOrigin = function() {
		var min = this.getMin(),
			max = this.getMax(),
		 	v = new Vector(
				(min.x + max.x) / 2,
				(min.y + max.y) / 2
			);
		this.origin = v;
		return this;
	};

	Shape.prototype.getMin = function() {
		return Vector.min.apply(Vector, this.points);
	};

	Shape.prototype.getMax = function() {
		return Vector.max.apply(Vector, this.points);
	};

	Shape.prototype.rotate = function(angle) {
		this.a = angle;
		this.d = this.a * Math.PI / 180;
		var x0 = this.origin.x,
			y0 = this.origin.y,
			cosT = Math.cos(this.d),
			sinT = Math.sin(this.d),
			v,
			i,
			v2,
			x,
			y;
		for (var i = 0, l = this.points.length; i < l; i++) {
			v = this.points[i];
			x = v.x;
			y = v.y;

			x2 = x0+(x-x0)*cosT+(y-y0)*sinT;
			y2 = y0-(x-x0)*sinT+(y-y0)*cosT;

			v2 = new Vector(x2, y2);

			this.points[i] = v2;
		}
		return this;
	};
	
	return window['Shape'] = Shape;
	
})(window, Math);
