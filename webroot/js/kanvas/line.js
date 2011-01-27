;(function(window,Math){

	var Line = function(v1, v2) {
		this.v1 = v1;
		this.v2 = v2;
	};

	Line.prototype.intersect = function(line) {
		var i = Intersection.intersectLine(this, line);
		return !!i.points.length;
	};

	Line.prototype.draw = function() {
		var ctx = window.ctx || kanvas.ctx, x= 0, y = 0;
		if (window.kanvas) {
			x = window.kanvas.view.x;
			y = window.kanvas.view.y;
		}
		ctx.save();
		ctx.globalCompositeOperation = 'over';
		ctx.translate(x,y);
		ctx.strokeStyle = 'rgba(255,0,255,1)';
		ctx.beginPath();
		ctx.moveTo(this.v1.x, this.v1.y);
		ctx.lineTo(this.v2.x, this.v2.y);
		ctx.stroke();
		ctx.restore();
	};

	return window['Line'] = Line;

})(window,Math);
