/**
 *  SVG elements must have:
 *    viewbox with original dimensions
 *    
 */

var ToneBuffer = require('tone/Tone/core/Buffer');

var AL = function(svgPath, options, onloadSprites, onloadSounds) {

  this.w = options.w;
  this.h = options.h;
  this.id = options.id;

  this.container = document.getElementById(this.id);

  /**
   *  Array of all symbols added to
   *  this Animated Logo
   *
   *  @name  symbols
   *  @type {Array}
   */
  this.symbols = [];

  /**
   *  SVG Spritesheet
   *  
   *  @type {[type]}
   */
  this.spritesheet = null;

  // load spritesheet and do callback, i.e. create symbols
  this._loadSpritesheet(svgPath, onloadSprites);

  // callback when sounds load
  ToneBuffer.on('load', function() {
    if (onloadSounds) {
      onloadSounds();
    }
  });
  
  this._initEventListeners();
};


AL.prototype._loadSpritesheet = function(svgPath, callback) {
  var self = this;

  Snap.load(svgPath, function (fragment) {
    self.spritesheet = fragment;
    self.snapElement = Snap(fragment.node);
    self.snapElement.appendTo(self.container);
    callback();
  });
};

/**
 * listen for keypress  
 * 
 */

AL.prototype._initEventListeners = function() {
  var self = this;
  var symbols = self.symbols;

  document.onkeypress = function(e){
    e = e || window.event;
    symbols.forEach(function(symbol){
      if(symbol.keyCodes.includes(e.which)){
        symbol.trigger();
        // e.preventDefault();
      }
    });  
  };
  // for "special" key events like arrow keys, etc
  document.onkeydown = function(e){
    e = e || window.event;
    symbols.forEach(function(symbol){
      // other keys
      var otherKeyCodes = [37,38,39,40];
      if(otherKeyCodes.includes(e.which) && symbol.keyCodes.includes(e.which)){
        symbol.trigger();
        // e.preventDefault();
      }
    });  
  };
};

module.exports = AL;
