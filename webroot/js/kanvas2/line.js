;(function(window, Math){

	var Line = function(v1, v2) {
		this.v1 = v1;
		this.v2 = v2;
	};

	Line.prototype.intersect = function(line) {
		return new Vector(this.v1.x, this.v2.y);
	};

	return window['Line'] = Line;

})(window, Math);
