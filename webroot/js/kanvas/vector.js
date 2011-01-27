;(function(window, Math){
	
	var Vector = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Vector.prototype.draw = function() {
		var ctx = window.ctx || kanvas.ctx, x= 0, y = 0;
		if (window.kanvas) {
			x = window.kanvas.view.x;
			y = window.kanvas.view.y;
		}
		ctx.save();
		ctx.translate(x,y);
		ctx.beginPath();
		ctx.arc(this.x, this.y, 2, Math.PI*2, 0);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	};
	
	Vector.prototype.clone = function() {
		return new Vector(this.x, this.y);
	};
	
	Vector.distance = function(v1, v2) {
		var dx = v1.x - v2.x;
		var dy = v1.y - v2.y;
		return Math.sqrt(dx * dx + dy * dy);
	};

	Vector.min = function(v1, v2) {
		return new Vector(
				Math.min(v1.x, v2.x),
				Math.min(v1.y, v2.y)
			);
	};

	Vector.max = function(v1, v2) {
		console.log(v1.y, v2.y);
		return new Vector(
				Math.max(v1.x, v2.x),
				Math.max(v1.y, v2.y)
			);
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
