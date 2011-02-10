;(function(window, Math){
	
	var Vector = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Vector.prototype.clone = function() {
		return new Vector(this.x, this.y);
	};

	Vector.prototype.multiplyScalar = function(scalar) {
	    this.x *= scalar;
	    this.y *= scalar;
			return this;
	};
	
	Vector.distance = function(v1, v2) {
		var dx = v1.x - v2.x;
		var dy = v1.y - v2.y;
		return Math.sqrt(dx * dx + dy * dy);
	};

	Vector.min = function() {
		var minX,
			minY,
			v;
		if (arguments.length >= 2) {
			minX = arguments[0].x;
			minY = arguments[0].y;
			for (var i = 0, l = arguments.length; i < l; i++) {
				v = arguments[i];
				minX = Math.min(minX, v.x);
				minY = Math.min(minY, v.y);
			}
			return new Vector(minX, minY);
		}
		return false;
	};

	Vector.max = function() {
		var maxX,
			maxY,
			v;
		if (arguments.length >= 2) {
			maxX = arguments[0].x;
			maxY = arguments[0].y;
			for (var i = 0, l = arguments.length; i < l; i++) {
				v = arguments[i];
				maxX = Math.max(maxX, v.x);
				maxY = Math.max(maxY, v.y);
			}
			return new Vector(maxX, maxY);
		}
		return false;
	};
	
	Vector.sub = function(v1, v2) {
		var tmpVec = new Vector(v1.x, v1.y);

		tmpVec.x -= v2.x;
		tmpVec.y -= v2.y;

		return tmpVec;
	};

	Vector.cross = function(v1, v2) {
		return v1.x * v2.y - v2.x * v1.y;
	};
	
	return window['Vector'] = Vector;
	
})(window, Math);
