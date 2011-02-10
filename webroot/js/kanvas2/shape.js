
;(function(window, Math){
	
	var Shape = function() {
		this.init();
	};

	Shape.prototype.init = function() {
		this.points = [];
		this.a = 0;
		this.d = 0;
		this.scale = 1;
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
			v1,
			v2,
			test,
			max;
		for (var i = 0, l = j+1; i < l; i++) {
			v1 = this.points[i];
			v2 = this.points[j];
			if (v1 && v2) {
				test = (v1.x * v2.y - v1.y * v2.x - v0.x * v2.y + v0.y * v2.x + v0.x * v1.y - v0.y * v1.x);
				if (test > 0) return false;
			}
			j = i;
		}

		return true;
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

	Shape.prototype.scaleTo = function(scalar) {
		var prevS = this.scale;
		var newS = scalar - this.scale;
		console.log(prevS, scalar, newS);
		return this.scaleBy(scalar);
	};

	Shape.prototype.scaleBy = function(scalar) {
		this.scale += scalar;
		for (var i = 0, l = this.points.length; i < l; i++) {
			this.points[i].multiplyScalar(this.scale);
		}
		this.setOrigin();
		return this;
	};
	
	Shape.prototype.rotateTo = function(angle) {
		var prevA = this.a;
		var newA = angle - prevA;
		return this.rotateBy(newA);
	};

	Shape.prototype.rotate = function(angle) {
		return this.rotateTo(angle);
	};

	Shape.prototype.rotateBy = function(angle) {
		this.a += angle;
		this.d = angle * Math.PI / 180;
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
