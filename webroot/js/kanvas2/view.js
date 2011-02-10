;(function(window, Math){
	
	var View = function(min, max) {
		this.min = min;
		this.max = max;
		var x = min.x,
			y = min.y;
		this.width = this.getWidth(),
		this.height = this.getHeight();

		this.rect = new Rect(x, y, this.width, this.height);
		this.corners = {};
		this.options = {
			cornerSize : 10
		};
		this.init();
	};

	View.prototype.init = function() {
		this.addCorners();
	};

	View.prototype.draw = function(ctx) {
		this.rect.draw(ctx);
	};

	View.prototype.getWidth = function() {
		return this.max.x - this.min.x;
	};

	View.prototype.getHeight = function() {
		return this.max.y - this.min.y;
	};

	View.prototype.addCorners = function(angle) {
		var cW = this.options.cornerSize,
			cH = this.options.cornerSize,
			mX = cW / 2,
			mY = cH / 2;

		var tl = new Rect(this.min.x-mX, this.min.y-mY, cH, cW);

		var tr = new Rect(this.max.x-mX, this.min.y-mY, cH, cW);

		var br = new Rect(this.max.x-mX, this.max.y-mY, cH, cW);

		var bl = new Rect(this.min.x-mX, this.max.y-mY, cH, cW);

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
