var Tone = require('tone');
var Snap = require('imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js');
window.Snap = Snap;
// window.mina = mina;
window.Tone = Tone;


// require('./core');
// require('./letter');

/**
 *  SVG elements must have:
 *  	viewbox with original dimensions
 *  	
 */

var AL = function(svgPath, callback) {

	/**
	 *  Array of all letters added to
	 *  this Animated Logo
	 *
	 *  @name  letters
	 *  @type {Array}
	 */
	this.letters = [];

	/**
	 *  SVG Spritesheet
	 *  
	 *  @type {[type]}
	 */
	this.spritesheet = null;

	this.loadSpritesheet(svgPath, callback);

};


AL.prototype.loadSpritesheet = function(svgPath, callback) {
	var self = this;

	Snap.load(svgPath, function (f) {
		self.spritesheet = f;
		callback();
	});
};


/**
 *  An individual letter.
 *
 *  @class  AL.Letter
 *  @param {[type]} options [description]
 */
AL.Letter = function(options, instance) {

	/**
	 *  ASCII
	 *
	 *  @attribute  keys
	 *  @type Array of Strings
	 */
	this.keys = options.keys || [];
	this.sounds = options.sounds || [];
	this.svgPath = options.svgPath;
	this.id = options.id;
	this.instance = instance;

	// Snap SVG elements, set by _parseFragment
	this.frames = [];

	// iterate thru the frames array
	this.framePos = 0;

	// these are also the max width/height for scaling
	this.width = options.width;
	this.height = options.height;

	// original array of graphics present within the svgPath
	this._gArray;

	// set by width and height
	this.scale = {w:1, h:1};

	if (this.svgPath) {
		this.load(this.svgPath);
	} else {
		this.getSpritesByID(this.id);
	}
}


AL.Letter.prototype.getSpritesByID = function(id) {
	var frag = this.instance.spritesheet.node.getElementById(id);
	var clonedFrag = Snap(frag).clone();
	this._parseFragment( clonedFrag );
}

/**
 *  load a spritesheet from an svgPath
 *  (if letter is standalone)
 *  
 *  @param  {[type]} svgPath [description]
 *  @return {[type]}         [description]
 */
AL.Letter.prototype.load = function(svgPath) {
	var self = this;

	Snap.load(self.svgPath, function (f) {
		self._parseFragment(f);
	});
}


AL.Letter.prototype._parseFragment = function(f) {
	var self = this;
	/**
	 *  @property {Snap SVG canvas} cnv The snap SVG
	 */
	self.cnv = Snap(self.width, self.height);
	self.cnv.node.setAttribute('id', self.id);

	self._gArray = f.selectAll('g');

	var svgWrapper = Snap(f.node);
	var viewBox = svgWrapper.attr('viewBox');
	self.origW = viewBox.w || viewBox.width;
	self.origH = viewBox.h || viewBox.height;

	self.cnv.add(Snap(self._gArray[0].clone()));
	self.cnv = Snap(this.cnv.node.children[2]); // total hack to find actual elt

	self.frames = self._gArray.forEach(function(frame) {
		var s = Snap(frame).clone();
		s.node.setAttribute('style', 'display:none;');
		return s;
	});


	if (self.width && self.height) {
		self.resize();
	}
}


AL.Letter.prototype.animateElt = function() {

}



/**
 *  Resize to a new width and height
 *  
 *  @method  resize
 *  @param  {Number} [_w] 		Width in px (optional)
 *  @param  {Number} [_h] 		Height in px (optional)
 *  @param  {Number} [_dur] 	Duration in ms (optional)
 *  
 */
AL.Letter.prototype.resize = function(_w, _h, _dur) {
	var self = this;
	var w = _w || self.width;
	var h = _h || self.height;
	var dur = _dur || 0;

	var percentW = w / self.origW;
	var percentH = h / self.origH;
	self.rescale(percentW, percentH, dur);
};

/**
 *  Resize by percentage of original SVG, similar to resize().
 *
 *  NOTE: If only 1 or 2 arguments are provided,
 *  it will scale both w and h by the first argument,
 *  and the last argument is assumed to be duration.
 *  
 *  @param  {Number} _percentW Number where 100% = 1.0, 0% = 0
 *  @param  {Number} _percentH Number where 100% = 1.0, 0% = 0
 *  @param  {Number} _dur      Duration in ms (optional)
 *  @return {[type]}           [description]
 */
AL.Letter.prototype.rescale = function(_percentW, _percentH, _dur) {
	var self = this;
	var myMatrix = new Snap.Matrix();

	// if only two arguments are provided,
	// assume it's a single percentage for both w and h
	// and that second argument is _dur
	if (arguments.length === 2) {
		_dur = _percentH;
	}

	// second argument is optional
	if (arguments.length < 3) {
		_percentH = _percentW;
	}

	self.scale = {
		'w': _percentW,
		'h': _percentH
	}

	var dur = _dur || 0;
	var transW = (self.width - _percentW*self.origW)/2;
	var transH = (self.height - _percentH*self.origH)/2;
	myMatrix.translate (transW, transH);
	myMatrix.scale(self.scale.w, self.scale.h);

	this.cnv.animate({ transform: myMatrix }, dur, mina.bounce);
};

AL.Letter.prototype.animate = function(_duration) {
	var duration = _duration || 500;
	this.framePos++;
	var nextFrag = this.frames[ this.framePos % this.frames.length].children();

	var i = 0;
	this.cnv.children().forEach(function( elt ) {
		var props = nextFrag[i].attr();
		var className = props.class;
		delete props.class;
		delete props.width;
		elt.stop();
		elt.animate(props, duration, mina.bounce);
		i++;
	});
	console.log(this.framePos);
	// var closedShapes = sprites[shifts%sprites.length].children();

};

/**
 *  Constructor function
 *
 *  @method  createLetter
 *  @param  {Object} options Options object
 *  @return {AL.Letter}
 */
AL.prototype.createLetter = function(options) {
	var letter = new AL.Letter(options, this);
	this.letters.push(letter);
	return letter;
}


module.exports = window.AL = AL;