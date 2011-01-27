;(function(window,Math){

	var Intersection = function(type) {
		this.points = [];
		this.type = type || -1;
	};

	Intersection.TYPE_NOINTERSECTION = 0;
	Intersection.TYPE_COINCIDENT = 1;
	Intersection.TYPE_INTERSECTION = 2;
	Intersection.TYPE_PARALLEL = 3;

	/* math: http://flassari.is */
	Intersection.intersectLine = function(lineA, lineB) {
		var result = new Intersection();
		var p1 = lineA.v1,
			p2 = lineA.v2,
			p3 = lineB.v1,
			p4 = lineB.v2,
			x1 = p1.x,
			x2 = p2.x,
			x3 = p3.x,
			x4 = p4.x,
			y1 = p1.y,
			y2 = p2.y,
			y3 = p3.y,
			y4 = p4.y,
			z1 = (x1 - x2),
			z2 = (x3 - x4),
			z3 = (y1 - y2),
			z4 = (y3 - y4),
			d = z1 * z4 - z3 * z2;
		
		if (d == 0) {
			return result;
		}
			
		var pre = (x1 * y2 - y1 * x2),
			post = (x3 * y4 - y3 * x4);
		
		var x = (pre * z2 - z1 * post) / d,
			y = (pre * z4 - z3 * post) / d;
		
		if (
				x < Math.min(x1, x2) || 
				x > Math.max(x1, x2) || 
				x < Math.min(x3, x4) ||
				x > Math.max(x3, x4)
			) {
			return result;
		}
		if (
				y < Math.min(y1, y2) || 
				y > Math.max(y1, y2) || 
				y < Math.min(y3, y4) ||
				y > Math.max(y3, y4)
			) {
			return result;
		}
		
		if (x && y) {
			var v = new Vector(x, y);
			result.points.push(v);
			v.draw();
		}
		
		return result;
	};


	Intersection.prototype.setType = function(type) {
		this.type = type;
	};

	Intersection.prototype.add = function(intersection) {
		if (intersection.points) {
			this.points = this.points.concat(intersection.points);
		}
		return this;
	};

	return window['Intersection'] = Intersection;

})(window,Math);
