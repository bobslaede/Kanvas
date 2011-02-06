;(function(window, Math){
	
	var View = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rect = new Rect(x, y, width, height);
		this.corners = {};
		this.options = {
			cornerSize : 10
		};
		this.init();
	};

	View.prototype.init = function() {
		this.addCorners();
	};

	View.prototype.clone = function() {
		return new View(this.x, this.y, this.width, this.height);
	};

	View.prototype.draw = function(ctx) {
		this.rect.draw(ctx);
	};

	View.prototype.getWidth = function() {
		//return Vector.distance(this.rect.points[0], this.rect.points[1]);
		return this.rect.points[1].x - this.rect.points[0].x;
	};

	View.prototype.getHeight = function() {
		// return Vector.distance(this.rect.points[1], this.rect.points[2]);
		return this.rect.points[2].y - this.rect.points[1].y;
	};

	View.prototype.addCorners = function(angle) {
		var cW = this.options.cornerSize,
			cH = this.options.cornerSize,
			mX = cW / 2,
			mY = cH / 2;

		var tl = new Rect(this.rect.points[0].x-mX, this.rect.points[0].y-mY, cH, cW);

		var tr = new Rect(this.rect.points[1].x-mX, this.rect.points[1].y-mY, cH, cW);

		var br = new Rect(this.rect.points[2].x-mX, this.rect.points[2].y-mY, cH, cW);

		var bl = new Rect(this.rect.points[3].x-mX, this.rect.points[3].y-mY, cH, cW);

		this.corners.tl = tl
		this.corners.tr = tr;
		this.corners.br = br;
		this.corners.bl = bl;
	};

	View.prototype.withinACorner = function(vector, corner) {
		if (corner) {
			return this.corners[corner].withinBounds(vector);
		} else {
			for (var i in this.corners) {
				if (this.corners[i].withinBounds(vector)) {
					return i;
				}
			}
		}
	};

	View.prototype.withinBounds = function(vector) {
		return this.rect.withinBounds(vector);
	};
	
	return window['View'] = View;
	
})(window);
