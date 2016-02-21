var AL = require('./core');

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
	this.sounds = options.sounds ? this._loadSound(options.sounds) : [];
	this.svgPath = options.svgPath;
	this.id = options.id;
	this.instance = instance;

	// Snap SVG elements, set by _parseFragment
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

	// original array of graphics present within the svgPath
	this._gArray;

	// set by width and height
	this.scale = {w:1, h:1};

	if (this.svgPath) {
		this.load(this.svgPath);
	} else {
		this.getSpritesByID(this.id);
	}

	this._initEventListeners();
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

	// self._gArray = f.selectAll('g');
	self._gArray = f.selectAll('g');

	var svgWrapper = Snap(f.node);
	var viewBox = svgWrapper.attr('viewBox');

	if (viewBox) {
		self.svgOrigW = viewBox.w || viewBox.width;
		self.svgOrigH = viewBox.h || viewBox.height;
	} else {
		console.log('no viewbox');
	}

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

	var percentW = w / self.svgOrigW;
	var percentH = h / self.svgOrigH;
	self._applyResize(percentW, percentH, dur);
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
	// console.log(scaleW);
	self._applyResize(scaleW, scaleH, dur);
};


AL.Letter.prototype._applyResize = function(percentW, percentH, dur) {
	var self = this;
	var myMatrix = new Snap.Matrix();

	self.scale = {
		'w': percentW,
		'h': percentH
	}

	var transW = (self.width - percentW*self.svgOrigW)/2;
	var transH = (self.height - percentH*self.svgOrigH)/2;
	myMatrix.translate (transW, transH);
	myMatrix.scale(self.scale.w, self.scale.h);

	this.cnv.animate({ transform: myMatrix }, dur, mina.bounce);
}

/**
 *  Trigger animation
 *  @return {[type]} [description]
 */
AL.Letter.prototype.trigger = function(e, _time1, _hold, _time2) {
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
	var nextFrag = this.frames[ this.framePos % this.frames.length].children();

	var i = 0;
	this.cnv.children().forEach(function( elt ) {
		var props = nextFrag[i].attr();

		// dont override these attribtues
		delete props.style;
		delete props.class;

		elt.stop();
		elt.animate(props, duration, mina.bounce);
		i++;
	});
	this.framePos++;

	// var closedShapes = sprites[shifts%sprites.length].children();

};

AL.Letter.prototype.playSound = function() {
	this.sound.triggerAttackRelease();
};

AL.Letter.prototype._loadSound = function(sndPath) {
	this.sound = new Tone.Sampler(sndPath).toMaster();
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
		self.rescale(1.1, 300);
	});

	elt.addEventListener('mouseleave', function(e) {
		self.rescale(1, 500);
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