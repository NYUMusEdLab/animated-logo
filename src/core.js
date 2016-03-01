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
  
  this._initEventListeners();
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

/**
 * listen for keypress  
 * 
 */

AL.prototype._initEventListeners = function() {
  var self = this;
  var letters = self.letters;
  console.log(self);
  document.onkeypress = function(e){
    e = e || window.event;
    letters.forEach(function(letter){
      console.log(letter.keyCodes);
      if(letter.keyCodes.includes(e.which)){
        letter.trigger();
        e.preventDefault();
      }
    });  
  };
  // for "special" key events like arrow keys, etc
  document.onkeydown = function(e){
    e = e || window.event;
    letters.forEach(function(letter){
      // other keys
      var otherKeyCodes = [37,38,39,40];
      if(otherKeyCodes.includes(e.which) && letter.keyCodes.includes(e.which)){
        letter.trigger();
        e.preventDefault();
      }
    });  
  };
};

module.exports = AL;
