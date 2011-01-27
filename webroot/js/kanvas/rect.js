;(function(window, Math){
	
	var Rect = function(top, right, bottom, left) {
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		this.left = left;
		this.origin = Rect.findCenter(this);
		this.scale = 1;
		this.angle = 0;
	};
	
	Rect.findCenter = function(rect) {
		var x = (rect.top.v1.x + rect.bottom.v1.x) / 2;
		var y = (rect.top.v2.y + rect.bottom.v2.y) / 2;
		return new Vector(x,y);
	};

	Rect.prototype.setScale = function(scale) {
		this.scale = scale;
		this.recalc();
	};
	
	Rect.intersectRect = function(r1, r2) {
		r1.top.draw();
		var i1 = Intersection.intersectLine(r1.top, r2.top);
		console.log(i1.points.length);
	};
	
	Rect.prototype.recalc = function() {
		if (this.scale != 1) {
			var oldAngle = this.angle;
			this.rotate(0);
			var width = this.top.v1.x + this.top.v2.x,
				height = this.right.v1.y + this.right.v2.y,
				x = this.top.v1.x,
				y = this.top.v1.y;
			
			var newWidth = width * this.scale,
				newHeight = height * this.scale;

			this.top = new Line(
					new Vector(this.top.v1.x, this.top.v1.y),
					new Vector(newWidth, this.top.v2.y)
				);
			this.right = new Line(
					new Vector(newWidth, this.top.v2.y),
					new Vector(newWidth, newHeight)
				);
			this.bottom = new Line(
					new Vector(this.top.v1.x, newHeight),
					new Vector(newWidth, newHeight)
				);
			this.left = new Line(
					new Vector(this.top.v1.x, newHeight),
					new Vector(this.top.v1.x, this.top.v1.y)
				);
			this.rotate(oldAngle);
		}
	};
	
	Rect.prototype.intersectLine = function(line) {
		
		var i1 = line.intersect(this.top);
		var i2 = line.intersect(this.right);
		var i3 = line.intersect(this.bottom);
		var i4 = line.intersect(this.left);
		

		return (i1 || i2 || i3 || i4);
	};
	
	Rect.prototype.draw = function() {
		this.top.draw();
		this.right.draw();
		this.bottom.draw();
		this.left.draw();
	};
	
	Rect.prototype.rotate = function(angle) {
		this.angle = angle;
		var radius = Math.sqrt(Math.pow(this.origin.x - this.top.v1.x, 2) + Math.pow(this.origin.y - this.top.v1.y, 2)),
			aA = Math.atan2((this.top.v1.y - this.origin.y), (this.top.v1.x - this.origin.x)),
			bA = Math.atan2((this.top.v2.y - this.origin.y), (this.top.v2.x - this.origin.x)),
			cA = Math.atan2((this.right.v2.y - this.origin.y), (this.right.v2.x - this.origin.x)),
			dA = Math.atan2((this.bottom.v2.y - this.origin.y), (this.bottom.v2.x - this.origin.x));

		this.top.v1.x = this.origin.x + radius * Math.cos(angle + aA);
		this.top.v1.y = this.origin.y + radius * Math.sin(angle + aA);
		this.top.v2.x = this.origin.x + radius * Math.cos(angle + bA);
		this.top.v2.y = this.origin.y + radius * Math.sin(angle + bA);
		this.right.v2.x = this.origin.x + radius * Math.cos(angle + cA);
		this.right.v2.y = this.origin.y + radius * Math.sin(angle + cA);
		this.bottom.v2.x = this.origin.x + radius * Math.cos(angle + dA);
		this.bottom.v2.y = this.origin.y + radius * Math.sin(angle + dA);
	};
	
	return window['Rect'] = Rect;
	
})(window, Math);
