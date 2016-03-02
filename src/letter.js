var Tone = require('tone');
var AL = require('./core');

/**
 *  An individual letter.
 *
 *  @class  AL.Letter
 *  @param {[type]} options [description]
 */
AL.Letter = function(options, parentLogo) {

  /**
   *  ASCII
   *
   *  @attribute  keys
   *  @type Array of Strings
   */
  this.keys = options.keys || [];
  
  /** 
   * convert keys to ascii
   * @attribute keyCodes
   * @type Array of Integers
   */
  var keyCodes = [];

  if (options.keys) {
    options.keys.forEach(function(key){
      typeof key === "string" ? (keyCodes.push(key.toUpperCase().charCodeAt(0))) : keyCodes.push(key);
    });
  }
  this.keyCodes = keyCodes;
  
  this.sounds = options.sounds ? this._loadSound(options.sounds) : [];

  // path to an SVG file (optional)
  this.svgPath = options.svgPath;

  // this.defaultAnimation = options.defaultAnimation || 'morph';

  /**
   *  @property {String} options.mina Different types of
   *                                  animation as defined
   *                                  in snap.svg.js.
   *                                  Options include 'ease', 
   *                                  'easein', 'easeout', 'easeinout',
   *                                  'elastic', 'backin', 'backout',
   *                                  'linear', 'bounce' (default).
   */
  this.mina = options.mina || 'bounce';
  this.animationType = options.animationType || 'morph';

  /**
   *  id of the symbol, which will be "shape-<name_of_orig_export>_<illustrator_label_name>"
   */
  this.source_id = options.source_id;

  /**
   *  unique id of this instance of the element
   */
  this.id = options.destination_id || options.id + String(Math.random() * 10000000000000000);

  this.parentLogo = parentLogo;

  // original array of <g> elements present within the svgPath
  this._gArray = [];

  /**
   *  @property {Array} frames Frames on the animation as
   *                           Snap Elements,
   *                           as set by _parseFragment
   */
  this.frames = [];

  // iterate thru the frames array
  this.framePos = 0;

  /**
   *  Options object can include an animation
   *  envelope that specifies custom transitions
   *
   *  @name  animEnv
   *  @type {Object}
   */
  this.animEnv = options.animEnv || {
    attack: undefined,
    sustain: undefined,
    release: undefined
  };

  // width/height of the entire SVG containing area
  // these are also the max width/height for scaling
  this.width = options.width;
  this.height = options.height;

  // width and height of the original svg
  this.svgOrigW;
  this.svgOrigH;

  // set by width and height
  this.scale = {w:1, h:1};

  this.x = options.x;
  this.y = options.y;

  if (this.svgPath) {
    this.load(this.svgPath);
  } else {
    this.getSpritesByID(this.source_id);
  }

  this._initEventListeners();
}

AL.Letter.prototype.getSpritesByID = function(source_id) {
  var frag = this.parentLogo.spritesheet.node.getElementById(source_id);
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

  Snap.load(self.svgPath, function (fragment) {
    self._parseFragment(fragment);
  });
}


AL.Letter.prototype._parseFragment = function(f) {
  var self = this;

  self._gArray = f.selectAll('g');

  var svgWrapper = Snap(f.node);
  var viewBox = svgWrapper.attr('viewBox');

  if (viewBox) {
    self.svgOrigW = viewBox.w || viewBox.width;
    self.svgOrigH = viewBox.h || viewBox.height;
    if (!self.width) {
      self.width = self.svgOrigW;
      self.height = self.svgOrigH;
    }
  } else {
    // console.log('no viewbox');
  }


  /**
   *  @property {Snap SVG canvas} snapElement The snap SVG
   */
  self.snapElement = Snap(self.width, self.height);
  self.snapElement.node.setAttribute('id', self.id);

  // position element according to its x and y relative to the parentLogo's width and height
  self.snapElement.node.setAttribute('style', 'left: ' + self.x / self.parentLogo.w * 100 + '% ; top: ' + self.y / self.parentLogo.h * 100 + '%');

  // append to the AL parentLogo's container html element
  self.snapElement.appendTo(self.parentLogo.container);

  if (self._gArray.length > 0) {
    self.snapElement.add(Snap(self._gArray[0].clone()));
  }

  self.snapElement = Snap(this.snapElement.node.children[2]); // total hack to find actual elt

  self.frames = self._gArray.forEach(function(frame) {
    var s = Snap(frame).clone();
    s.node.setAttribute('style', 'display:none;');
    return s;
  });


  if (self.width && self.height) {
    self.resize();
  }
}


/**
 *  Resize to a new width and height
 *  
 *  @method  resize
 *  @param  {Number} [_w]     Width in px (optional)
 *  @param  {Number} [_h]     Height in px (optional)
 *  @param  {Number} [_dur]   Duration in ms (optional)
 *  
 */
AL.Letter.prototype.resize = function(_w, _h, _dur, anim) {
  var self = this;
  var w = _w || self.width;
  var h = _h || self.height;
  var dur = _dur || 0;

  var percentW = w / self.svgOrigW;
  var percentH = h / self.svgOrigH;
  self._applyResize(percentW, percentH, dur, anim);
  // self.rescale(0.9);
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
AL.Letter.prototype.rescale = function(_percentW, _percentH, _dur, anim) {
  var self = this;

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

  var scaleW = _percentW * (self.width / self.svgOrigW);
  var scaleH = _percentH * (self.height / self.svgOrigH);
  var dur = _dur || 0;

  self._applyResize(scaleW, scaleH, dur, anim);
};


AL.Letter.prototype._applyResize = function(percentW, percentH, dur, anim) {
  var self = this;
  var myMatrix = new Snap.Matrix();
  var anim = mina[anim] || mina.bounce;

  self.scale = {
    'w': percentW,
    'h': percentH
  }

  var transW = (self.width - percentW*self.svgOrigW)/2;
  var transH = (self.height - percentH*self.svgOrigH)/2;
  myMatrix.translate (transW, transH);
  myMatrix.scale(self.scale.w, self.scale.h);

  this.snapElement.animate({ transform: myMatrix }, dur, mina.bounce);
}

/**
 *  Trigger animation
 *  @return {[type]} [description]
 */
AL.Letter.prototype.trigger = function(_time1, _hold, _time2) {
  var self = this;

  var time1 = _time1 || this.animEnv.attack || 30;
  var delay = _hold || this.animEnv.sustain || 100;
  var time2 = _time2 || this.animEnv.release || 500;

  this.playSound();
  this.animate(time1);
  this._scheduledAnim = setTimeout(
    function() {
      self.animate(time2)
    }, delay, false);
};

/**
 *  do next animation
 *
 *  @method  animate
 *  @param  {Number} _duration Duration in ms
 */
AL.Letter.prototype.animate = function(_duration) {
  var duration = _duration || 500;
  this.framePos++;
  var nextFrag = this.frames[ this.framePos % this.frames.length].children();

  if (this.animationType === 'rotate') {
    this.rotate(360, duration);
    return;
  }

  var i = 0;
  this.snapElement.children().forEach(function( elt ) {
    try {
      var props = nextFrag[i].attr();
      // dont override these attribtues
      delete props.style;
      delete props.class;

      elt.stop();
      elt.animate(props, duration, mina[this.mina]);
    } catch(e) {
      return;
    }
    i++;
  });

};

/**
 *  rotate by an angle in degrees
 *  @param  {[type]} deg [description]
 *  @return {[type]}     [description]
 */
AL.Letter.prototype.rotate = function(deg, dur) {
  var self = this;
  var myMatrix = new Snap.Matrix();

  myMatrix.scale(self.scale.w, self.scale.h);

  this.snapElement.animate({ transform: myMatrix }, dur/8, mina.elastic );

  function rotatePart(when) {
    setTimeout(function() {
      myMatrix.rotate(deg/8, self.width/2, self.height/2);
      self.snapElement.animate({ transform: myMatrix }, dur/8, mina.elastic );
    }, when); 
  }

  for (var i = 1; i <= 8; i++) {
    rotatePart(i * dur/8);
  }
};

AL.Letter.prototype.playSound = function() {
  try {
    this.sound.stop();
    this.sound.start();
  } catch(e) {}
};

AL.Letter.prototype._loadSound = function(sndPath) {
  this.sound = new Tone.Player(sndPath).toMaster();
  this.sound.retrigger = true;
};


AL.Letter.prototype._initEventListeners = function() {
  var self = this;
  var elt = document.getElementById(this.id);

  elt.addEventListener('mousedown', function(e) {
    self.trigger();
  });

  elt.addEventListener('touchstart', function(e) {
    self.trigger();
    e.preventDefault();
  });

  elt.addEventListener('mouseover', function(e) {
    self.rescale(1, 300);
  });

  elt.addEventListener('mouseleave', function(e) {
    self.rescale(0.9, 500);
  });
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

module.exports = AL;
