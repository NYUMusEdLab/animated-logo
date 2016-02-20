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
	this.frames = options.sounds || [];
	this.svgPath = options.svgPath;
	this.id = options.id;
	console.log(this.id);
	this.instance = instance;

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
	console.log(this.instance);
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

	self.cnv.add(Snap(self._gArray[1]));

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
 *  @param  {Number} [_w] optional width in px
 *  @param  {Number} [_h] 	optional height in px
 *  @param  {Number} [_dur] 	optional duration in ms
 *  
 */
AL.Letter.prototype.resize = function(_w, _h, _dur) {
	var self = this;
	var w = _w || self.width;
	var h = _h || self.height;
	var dur = _dur || 0;

	var myMatrix = new Snap.Matrix();

	self.scale = {
		'w': w / self.origW,
		'h': h / self.origH
	}

	myMatrix.translate ( (self.width - w)/2, (self.height - h)/2 );
	myMatrix.scale(self.scale.w, self.scale.h);

	self._gArray.animate({ transform: myMatrix }, dur, mina.bounce);

}

AL.prototype.createLetter = function(options) {
	var letter = new AL.Letter(options, this);
	this.letters.push(letter);
}


module.exports = window.AL = AL;