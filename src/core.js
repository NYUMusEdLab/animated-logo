/**
 *  SVG elements must have:
 *  	viewbox with original dimensions
 *  	
 */

var AL = function(svgPath, options, onloadSprites, onloadSounds) {

	this.w = options.w;
	this.h = options.h;
	this.id = options.id;

	this.container = document.getElementById(this.id);

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

	// load spritesheet and do callback, i.e. create letters
	this._loadSpritesheet(svgPath, onloadSprites);

	// callback when sounds load
	Tone.Buffer.on('load', function() {
		if (onloadSounds) {
			onloadSounds();
		}
	});

};


AL.prototype._loadSpritesheet = function(svgPath, callback) {
	var self = this;

	Snap.load(svgPath, function (f) {
		self.spritesheet = f;
		self.cnv = Snap(f.node);
		self.cnv.appendTo(self.container);
		// self.container.setAttribute('cz-shortcut-listen', true);

		// get inline style from spritesheet
		// var styleElt = f.node.getElementsByTagName('style')[0];
		// document.body.appendChild(styleElt);

		callback();
	});
};

module.exports = AL;