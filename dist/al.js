/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Tone = __webpack_require__(1);
	var Snap = __webpack_require__(2);
	window.Snap = Snap;
	window.Tone = Tone;

	Snap.plugin( function( Snap, Element, Paper, global ) {
	   Element.prototype.polyAnimate = function( destPoints, duration, easing, callback ) {
	   var poly = this;
	    Snap.animate( this.attr('points'), destPoints,  
	       function( val ){ poly.attr({ points: val }) }, duration, easing, callback)
	    };
	});

	var AL = __webpack_require__(3);
	__webpack_require__(4);

	module.exports = window.AL = AL;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function (root) {
		"use strict";
		var Tone;
		//constructs the main Tone object
		function Main(func){
			Tone = func();
		}
		//invokes each of the modules with the main Tone object as the argument
		function Module(func){
			func(Tone);
		}
		/**
		 *  Tone.js
		 *  @author Yotam Mann
		 *  @license http://opensource.org/licenses/MIT MIT License
		 *  @copyright 2014-2015 Yotam Mann
		 */
		Main(function () {
		    
		    //////////////////////////////////////////////////////////////////////////
		    //	WEB AUDIO CONTEXT
		    ///////////////////////////////////////////////////////////////////////////
		    //borrowed from underscore.js
		    function isUndef(val) {
		        return val === void 0;
		    }
		    //borrowed from underscore.js
		    function isFunction(val) {
		        return typeof val === 'function';
		    }
		    var audioContext;
		    //polyfill for AudioContext and OfflineAudioContext
		    if (isUndef(window.AudioContext)) {
		        window.AudioContext = window.webkitAudioContext;
		    }
		    if (isUndef(window.OfflineAudioContext)) {
		        window.OfflineAudioContext = window.webkitOfflineAudioContext;
		    }
		    if (!isUndef(AudioContext)) {
		        audioContext = new AudioContext();
		    } else {
		        throw new Error('Web Audio is not supported in this browser');
		    }
		    //SHIMS////////////////////////////////////////////////////////////////////
		    if (!isFunction(AudioContext.prototype.createGain)) {
		        AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
		    }
		    if (!isFunction(AudioContext.prototype.createDelay)) {
		        AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
		    }
		    if (!isFunction(AudioContext.prototype.createPeriodicWave)) {
		        AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;
		    }
		    if (!isFunction(AudioBufferSourceNode.prototype.start)) {
		        AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
		    }
		    if (!isFunction(AudioBufferSourceNode.prototype.stop)) {
		        AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
		    }
		    if (!isFunction(OscillatorNode.prototype.start)) {
		        OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
		    }
		    if (!isFunction(OscillatorNode.prototype.stop)) {
		        OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;
		    }
		    if (!isFunction(OscillatorNode.prototype.setPeriodicWave)) {
		        OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable;
		    }
		    //extend the connect function to include Tones
		    AudioNode.prototype._nativeConnect = AudioNode.prototype.connect;
		    AudioNode.prototype.connect = function (B, outNum, inNum) {
		        if (B.input) {
		            if (Array.isArray(B.input)) {
		                if (isUndef(inNum)) {
		                    inNum = 0;
		                }
		                this.connect(B.input[inNum]);
		            } else {
		                this.connect(B.input, outNum, inNum);
		            }
		        } else {
		            try {
		                if (B instanceof AudioNode) {
		                    this._nativeConnect(B, outNum, inNum);
		                } else {
		                    this._nativeConnect(B, outNum);
		                }
		            } catch (e) {
		                throw new Error('error connecting to node: ' + B);
		            }
		        }
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	TONE
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  @class  Tone is the base class of all other classes. It provides 
			 *          a lot of methods and functionality to all classes that extend
			 *          it. 
			 *  
			 *  @constructor
			 *  @alias Tone
			 *  @param {number} [inputs=1] the number of input nodes
			 *  @param {number} [outputs=1] the number of output nodes
			 */
		    var Tone = function (inputs, outputs) {
		        /**
				 *  the input node(s)
				 *  @type {GainNode|Array}
				 */
		        if (isUndef(inputs) || inputs === 1) {
		            this.input = this.context.createGain();
		        } else if (inputs > 1) {
		            this.input = new Array(inputs);
		        }
		        /**
				 *  the output node(s)
				 *  @type {GainNode|Array}
				 */
		        if (isUndef(outputs) || outputs === 1) {
		            this.output = this.context.createGain();
		        } else if (outputs > 1) {
		            this.output = new Array(inputs);
		        }
		    };
		    /**
			 *  Set the parameters at once. Either pass in an
			 *  object mapping parameters to values, or to set a
			 *  single parameter, by passing in a string and value.
			 *  The last argument is an optional ramp time which 
			 *  will ramp any signal values to their destination value
			 *  over the duration of the rampTime.
			 *  @param {Object|string} params
			 *  @param {number=} value
			 *  @param {Time=} rampTime
			 *  @returns {Tone} this
			 *  @example
			 * //set values using an object
			 * filter.set({
			 * 	"frequency" : 300,
			 * 	"type" : highpass
			 * });
			 *  @example
			 * filter.set("type", "highpass");
			 *  @example
			 * //ramp to the value 220 over 3 seconds. 
			 * oscillator.set({
			 * 	"frequency" : 220
			 * }, 3);
			 */
		    Tone.prototype.set = function (params, value, rampTime) {
		        if (this.isObject(params)) {
		            rampTime = value;
		        } else if (this.isString(params)) {
		            var tmpObj = {};
		            tmpObj[params] = value;
		            params = tmpObj;
		        }
		        for (var attr in params) {
		            value = params[attr];
		            var parent = this;
		            if (attr.indexOf('.') !== -1) {
		                var attrSplit = attr.split('.');
		                for (var i = 0; i < attrSplit.length - 1; i++) {
		                    parent = parent[attrSplit[i]];
		                }
		                attr = attrSplit[attrSplit.length - 1];
		            }
		            var param = parent[attr];
		            if (isUndef(param)) {
		                continue;
		            }
		            if (Tone.Signal && param instanceof Tone.Signal || Tone.Param && param instanceof Tone.Param) {
		                if (param.value !== value) {
		                    if (isUndef(rampTime)) {
		                        param.value = value;
		                    } else {
		                        param.rampTo(value, rampTime);
		                    }
		                }
		            } else if (param instanceof AudioParam) {
		                if (param.value !== value) {
		                    param.value = value;
		                }
		            } else if (param instanceof Tone) {
		                param.set(value);
		            } else if (param !== value) {
		                parent[attr] = value;
		            }
		        }
		        return this;
		    };
		    /**
			 *  Get the object's attributes. Given no arguments get
			 *  will return all available object properties and their corresponding
			 *  values. Pass in a single attribute to retrieve or an array
			 *  of attributes. The attribute strings can also include a "."
			 *  to access deeper properties.
			 *  @example
			 * osc.get();
			 * //returns {"type" : "sine", "frequency" : 440, ...etc}
			 *  @example
			 * osc.get("type");
			 * //returns { "type" : "sine"}
			 * @example
			 * //use dot notation to access deep properties
			 * synth.get(["envelope.attack", "envelope.release"]);
			 * //returns {"envelope" : {"attack" : 0.2, "release" : 0.4}}
			 *  @param {Array=|string|undefined} params the parameters to get, otherwise will return 
			 *  					                  all available.
			 *  @returns {Object}
			 */
		    Tone.prototype.get = function (params) {
		        if (isUndef(params)) {
		            params = this._collectDefaults(this.constructor);
		        } else if (this.isString(params)) {
		            params = [params];
		        }
		        var ret = {};
		        for (var i = 0; i < params.length; i++) {
		            var attr = params[i];
		            var parent = this;
		            var subRet = ret;
		            if (attr.indexOf('.') !== -1) {
		                var attrSplit = attr.split('.');
		                for (var j = 0; j < attrSplit.length - 1; j++) {
		                    var subAttr = attrSplit[j];
		                    subRet[subAttr] = subRet[subAttr] || {};
		                    subRet = subRet[subAttr];
		                    parent = parent[subAttr];
		                }
		                attr = attrSplit[attrSplit.length - 1];
		            }
		            var param = parent[attr];
		            if (this.isObject(params[attr])) {
		                subRet[attr] = param.get();
		            } else if (Tone.Signal && param instanceof Tone.Signal) {
		                subRet[attr] = param.value;
		            } else if (Tone.Param && param instanceof Tone.Param) {
		                subRet[attr] = param.value;
		            } else if (param instanceof AudioParam) {
		                subRet[attr] = param.value;
		            } else if (param instanceof Tone) {
		                subRet[attr] = param.get();
		            } else if (!isFunction(param) && !isUndef(param)) {
		                subRet[attr] = param;
		            }
		        }
		        return ret;
		    };
		    /**
			 *  collect all of the default attributes in one
			 *  @private
			 *  @param {function} constr the constructor to find the defaults from
			 *  @return {Array} all of the attributes which belong to the class
			 */
		    Tone.prototype._collectDefaults = function (constr) {
		        var ret = [];
		        if (!isUndef(constr.defaults)) {
		            ret = Object.keys(constr.defaults);
		        }
		        if (!isUndef(constr._super)) {
		            var superDefs = this._collectDefaults(constr._super);
		            //filter out repeats
		            for (var i = 0; i < superDefs.length; i++) {
		                if (ret.indexOf(superDefs[i]) === -1) {
		                    ret.push(superDefs[i]);
		                }
		            }
		        }
		        return ret;
		    };
		    /**
			 *  @returns {string} returns the name of the class as a string
			 */
		    Tone.prototype.toString = function () {
		        for (var className in Tone) {
		            var isLetter = className[0].match(/^[A-Z]$/);
		            var sameConstructor = Tone[className] === this.constructor;
		            if (isFunction(Tone[className]) && isLetter && sameConstructor) {
		                return className;
		            }
		        }
		        return 'Tone';
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	CLASS VARS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  A static pointer to the audio context accessible as Tone.context. 
			 *  @type {AudioContext}
			 */
		    Tone.context = audioContext;
		    /**
			 *  The audio context.
			 *  @type {AudioContext}
			 */
		    Tone.prototype.context = Tone.context;
		    /**
			 *  the default buffer size
			 *  @type {number}
			 *  @static
			 *  @const
			 */
		    Tone.prototype.bufferSize = 2048;
		    /**
			 *  The delay time of a single frame (128 samples according to the spec). 
			 *  @type {number}
			 *  @static
			 *  @const
			 */
		    Tone.prototype.blockTime = 128 / Tone.context.sampleRate;
		    ///////////////////////////////////////////////////////////////////////////
		    //	CONNECTIONS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  disconnect and dispose
			 *  @returns {Tone} this
			 */
		    Tone.prototype.dispose = function () {
		        if (!this.isUndef(this.input)) {
		            if (this.input instanceof AudioNode) {
		                this.input.disconnect();
		            }
		            this.input = null;
		        }
		        if (!this.isUndef(this.output)) {
		            if (this.output instanceof AudioNode) {
		                this.output.disconnect();
		            }
		            this.output = null;
		        }
		        return this;
		    };
		    /**
			 *  a silent connection to the DesinationNode
			 *  which will ensure that anything connected to it
			 *  will not be garbage collected
			 *  
			 *  @private
			 */
		    var _silentNode = null;
		    /**
			 *  makes a connection to ensure that the node will not be garbage collected
			 *  until 'dispose' is explicitly called
			 *
			 *  use carefully. circumvents JS and WebAudio's normal Garbage Collection behavior
			 *  @returns {Tone} this
			 */
		    Tone.prototype.noGC = function () {
		        this.output.connect(_silentNode);
		        return this;
		    };
		    AudioNode.prototype.noGC = function () {
		        this.connect(_silentNode);
		        return this;
		    };
		    /**
			 *  connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
			 *  @param  {Tone | AudioParam | AudioNode} unit 
			 *  @param {number} [outputNum=0] optionally which output to connect from
			 *  @param {number} [inputNum=0] optionally which input to connect to
			 *  @returns {Tone} this
			 */
		    Tone.prototype.connect = function (unit, outputNum, inputNum) {
		        if (Array.isArray(this.output)) {
		            outputNum = this.defaultArg(outputNum, 0);
		            this.output[outputNum].connect(unit, 0, inputNum);
		        } else {
		            this.output.connect(unit, outputNum, inputNum);
		        }
		        return this;
		    };
		    /**
			 *  disconnect the output
			 *  @returns {Tone} this
			 */
		    Tone.prototype.disconnect = function (outputNum) {
		        if (Array.isArray(this.output)) {
		            outputNum = this.defaultArg(outputNum, 0);
		            this.output[outputNum].disconnect();
		        } else {
		            this.output.disconnect();
		        }
		        return this;
		    };
		    /**
			 *  connect together all of the arguments in series
			 *  @param {...AudioParam|Tone|AudioNode} nodes
			 *  @returns {Tone} this
			 */
		    Tone.prototype.connectSeries = function () {
		        if (arguments.length > 1) {
		            var currentUnit = arguments[0];
		            for (var i = 1; i < arguments.length; i++) {
		                var toUnit = arguments[i];
		                currentUnit.connect(toUnit);
		                currentUnit = toUnit;
		            }
		        }
		        return this;
		    };
		    /**
			 *  fan out the connection from the first argument to the rest of the arguments
			 *  @param {...AudioParam|Tone|AudioNode} nodes
			 *  @returns {Tone} this
			 */
		    Tone.prototype.connectParallel = function () {
		        var connectFrom = arguments[0];
		        if (arguments.length > 1) {
		            for (var i = 1; i < arguments.length; i++) {
		                var connectTo = arguments[i];
		                connectFrom.connect(connectTo);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Connect the output of this node to the rest of the nodes in series.
			 *  @example
			 *  //connect a node to an effect, panVol and then to the master output
			 *  node.chain(effect, panVol, Tone.Master);
			 *  @param {...AudioParam|Tone|AudioNode} nodes
			 *  @returns {Tone} this
			 */
		    Tone.prototype.chain = function () {
		        if (arguments.length > 0) {
		            var currentUnit = this;
		            for (var i = 0; i < arguments.length; i++) {
		                var toUnit = arguments[i];
		                currentUnit.connect(toUnit);
		                currentUnit = toUnit;
		            }
		        }
		        return this;
		    };
		    /**
			 *  connect the output of this node to the rest of the nodes in parallel.
			 *  @param {...AudioParam|Tone|AudioNode} nodes
			 *  @returns {Tone} this
			 */
		    Tone.prototype.fan = function () {
		        if (arguments.length > 0) {
		            for (var i = 0; i < arguments.length; i++) {
		                this.connect(arguments[i]);
		            }
		        }
		        return this;
		    };
		    //give native nodes chain and fan methods
		    AudioNode.prototype.chain = Tone.prototype.chain;
		    AudioNode.prototype.fan = Tone.prototype.fan;
		    ///////////////////////////////////////////////////////////////////////////
		    //	UTILITIES / HELPERS / MATHS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  If the `given` parameter is undefined, use the `fallback`. 
			 *  If both `given` and `fallback` are object literals, it will
			 *  return a deep copy which includes all of the parameters from both 
			 *  objects. If a parameter is undefined in given, it will return
			 *  the fallback property. 
			 *  <br><br>
			 *  WARNING: if object is self referential, it will go into an an 
			 *  infinite recursive loop.
			 *  
			 *  @param  {*} given    
			 *  @param  {*} fallback 
			 *  @return {*}          
			 */
		    Tone.prototype.defaultArg = function (given, fallback) {
		        if (this.isObject(given) && this.isObject(fallback)) {
		            var ret = {};
		            //make a deep copy of the given object
		            for (var givenProp in given) {
		                ret[givenProp] = this.defaultArg(fallback[givenProp], given[givenProp]);
		            }
		            for (var fallbackProp in fallback) {
		                ret[fallbackProp] = this.defaultArg(given[fallbackProp], fallback[fallbackProp]);
		            }
		            return ret;
		        } else {
		            return isUndef(given) ? fallback : given;
		        }
		    };
		    /**
			 *  returns the args as an options object with given arguments
			 *  mapped to the names provided. 
			 *
			 *  if the args given is an array containing only one object, it is assumed
			 *  that that's already the options object and will just return it. 
			 *  
			 *  @param  {Array} values  the 'arguments' object of the function
			 *  @param  {Array} keys the names of the arguments as they
			 *                                 should appear in the options object
			 *  @param {Object=} defaults optional defaults to mixin to the returned 
			 *                            options object                              
			 *  @return {Object}       the options object with the names mapped to the arguments
			 */
		    Tone.prototype.optionsObject = function (values, keys, defaults) {
		        var options = {};
		        if (values.length === 1 && this.isObject(values[0])) {
		            options = values[0];
		        } else {
		            for (var i = 0; i < keys.length; i++) {
		                options[keys[i]] = values[i];
		            }
		        }
		        if (!this.isUndef(defaults)) {
		            return this.defaultArg(options, defaults);
		        } else {
		            return options;
		        }
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    // TYPE CHECKING
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  test if the arg is undefined
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is undefined
			 *  @function
			 */
		    Tone.prototype.isUndef = isUndef;
		    /**
			 *  test if the arg is a function
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is a function
			 *  @function
			 */
		    Tone.prototype.isFunction = isFunction;
		    /**
			 *  Test if the argument is a number.
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is a number
			 */
		    Tone.prototype.isNumber = function (arg) {
		        return typeof arg === 'number';
		    };
		    /**
			 *  Test if the given argument is an object literal (i.e. `{}`);
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is an object literal.
			 */
		    Tone.prototype.isObject = function (arg) {
		        return Object.prototype.toString.call(arg) === '[object Object]' && arg.constructor === Object;
		    };
		    /**
			 *  Test if the argument is a boolean.
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is a boolean
			 */
		    Tone.prototype.isBoolean = function (arg) {
		        return typeof arg === 'boolean';
		    };
		    /**
			 *  Test if the argument is an Array
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is an array
			 */
		    Tone.prototype.isArray = function (arg) {
		        return Array.isArray(arg);
		    };
		    /**
			 *  Test if the argument is a string.
			 *  @param {*} arg the argument to test
			 *  @returns {boolean} true if the arg is a string
			 */
		    Tone.prototype.isString = function (arg) {
		        return typeof arg === 'string';
		    };
		    /**
			 *  An empty function.
			 *  @static
			 */
		    Tone.noOp = function () {
		    };
		    /**
			 *  Make the property not writable. Internal use only. 
			 *  @private
			 *  @param  {string}  property  the property to make not writable
			 */
		    Tone.prototype._readOnly = function (property) {
		        if (Array.isArray(property)) {
		            for (var i = 0; i < property.length; i++) {
		                this._readOnly(property[i]);
		            }
		        } else {
		            Object.defineProperty(this, property, {
		                writable: false,
		                enumerable: true
		            });
		        }
		    };
		    /**
			 *  Make an attribute writeable. Interal use only. 
			 *  @private
			 *  @param  {string}  property  the property to make writable
			 */
		    Tone.prototype._writable = function (property) {
		        if (Array.isArray(property)) {
		            for (var i = 0; i < property.length; i++) {
		                this._writable(property[i]);
		            }
		        } else {
		            Object.defineProperty(this, property, { writable: true });
		        }
		    };
		    /**
			 * Possible play states. 
			 * @enum {string}
			 */
		    Tone.State = {
		        Started: 'started',
		        Stopped: 'stopped',
		        Paused: 'paused'
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    // GAIN CONVERSIONS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Equal power gain scale. Good for cross-fading.
			 *  @param  {NormalRange} percent (0-1)
			 *  @return {Number}         output gain (0-1)
			 */
		    Tone.prototype.equalPowerScale = function (percent) {
		        var piFactor = 0.5 * Math.PI;
		        return Math.sin(percent * piFactor);
		    };
		    /**
			 *  Convert decibels into gain.
			 *  @param  {Decibels} db
			 *  @return {Number}   
			 */
		    Tone.prototype.dbToGain = function (db) {
		        return Math.pow(2, db / 6);
		    };
		    /**
			 *  Convert gain to decibels.
			 *  @param  {Number} gain (0-1)
			 *  @return {Decibels}   
			 */
		    Tone.prototype.gainToDb = function (gain) {
		        return 20 * (Math.log(gain) / Math.LN10);
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	TIMING
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Return the current time of the clock + a single buffer frame. 
			 *  If this value is used to schedule a value to change, the earliest
			 *  it could be scheduled is the following frame. 
			 *  @return {number} the currentTime from the AudioContext
			 */
		    Tone.prototype.now = function () {
		        return this.context.currentTime;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	INHERITANCE
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  have a child inherit all of Tone's (or a parent's) prototype
			 *  to inherit the parent's properties, make sure to call 
			 *  Parent.call(this) in the child's constructor
			 *
			 *  based on closure library's inherit function
			 *
			 *  @static
			 *  @param  {function} 	child  
			 *  @param  {function=} parent (optional) parent to inherit from
			 *                             if no parent is supplied, the child
			 *                             will inherit from Tone
			 */
		    Tone.extend = function (child, parent) {
		        if (isUndef(parent)) {
		            parent = Tone;
		        }
		        function TempConstructor() {
		        }
		        TempConstructor.prototype = parent.prototype;
		        child.prototype = new TempConstructor();
		        /** @override */
		        child.prototype.constructor = child;
		        child._super = parent;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	CONTEXT
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  array of callbacks to be invoked when a new context is added
			 *  @private 
			 *  @private
			 */
		    var newContextCallbacks = [];
		    /**
			 *  invoke this callback when a new context is added
			 *  will be invoked initially with the first context
			 *  @private 
			 *  @static
			 *  @param {function(AudioContext)} callback the callback to be invoked
			 *                                           with the audio context
			 */
		    Tone._initAudioContext = function (callback) {
		        //invoke the callback with the existing AudioContext
		        callback(Tone.context);
		        //add it to the array
		        newContextCallbacks.push(callback);
		    };
		    /**
			 *  Tone automatically creates a context on init, but if you are working
			 *  with other libraries which also create an AudioContext, it can be
			 *  useful to set your own. If you are going to set your own context, 
			 *  be sure to do it at the start of your code, before creating any objects.
			 *  @static
			 *  @param {AudioContext} ctx The new audio context to set
			 */
		    Tone.setContext = function (ctx) {
		        //set the prototypes
		        Tone.prototype.context = ctx;
		        Tone.context = ctx;
		        //invoke all the callbacks
		        for (var i = 0; i < newContextCallbacks.length; i++) {
		            newContextCallbacks[i](ctx);
		        }
		    };
		    /**
			 *  Bind this to a touchstart event to start the audio on mobile devices. 
			 *  <br>
			 *  http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api/12569290#12569290
			 *  @static
			 */
		    Tone.startMobile = function () {
		        var osc = Tone.context.createOscillator();
		        var silent = Tone.context.createGain();
		        silent.gain.value = 0;
		        osc.connect(silent);
		        silent.connect(Tone.context.destination);
		        var now = Tone.context.currentTime;
		        osc.start(now);
		        osc.stop(now + 1);
		    };
		    //setup the context
		    Tone._initAudioContext(function (audioContext) {
		        //set the blockTime
		        Tone.prototype.blockTime = 128 / audioContext.sampleRate;
		        _silentNode = audioContext.createGain();
		        _silentNode.gain.value = 0;
		        _silentNode.connect(audioContext.destination);
		    });
		    Tone.version = 'r6';
		    console.log('%c * Tone.js ' + Tone.version + ' * ', 'background: #000; color: #fff');
		    return Tone;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Base class for all Signals. Used Internally. 
			 *
			 *  @constructor
			 *  @extends {Tone}
			 */
		    Tone.SignalBase = function () {
		    };
		    Tone.extend(Tone.SignalBase);
		    /**
			 *  When signals connect to other signals or AudioParams, 
			 *  they take over the output value of that signal or AudioParam. 
			 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
			 *
			 *  @override
			 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
			 *  @param {number} [outputNumber=0] The output number to connect from.
			 *  @param {number} [inputNumber=0] The input number to connect to.
			 *  @returns {Tone.SignalBase} this
			 */
		    Tone.SignalBase.prototype.connect = function (node, outputNumber, inputNumber) {
		        //zero it out so that the signal can have full control
		        if (Tone.Signal && Tone.Signal === node.constructor || Tone.Param && Tone.Param === node.constructor || Tone.TimelineSignal && Tone.TimelineSignal === node.constructor) {
		            //cancel changes
		            node._param.cancelScheduledValues(0);
		            //reset the value
		            node._param.value = 0;
		            //mark the value as overridden
		            node.overridden = true;
		        } else if (node instanceof AudioParam) {
		            node.cancelScheduledValues(0);
		            node.value = 0;
		        }
		        Tone.prototype.connect.call(this, node, outputNumber, inputNumber);
		        return this;
		    };
		    return Tone.SignalBase;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Wraps the native Web Audio API 
			 *         [WaveShaperNode](http://webaudio.github.io/web-audio-api/#the-waveshapernode-interface).
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @param {function|Array|Number} mapping The function used to define the values. 
			 *                                    The mapping function should take two arguments: 
			 *                                    the first is the value at the current position 
			 *                                    and the second is the array position. 
			 *                                    If the argument is an array, that array will be
			 *                                    set as the wave shaping function. The input
			 *                                    signal is an AudioRange [-1, 1] value and the output
			 *                                    signal can take on any numerical values. 
			 *                                    
			 *  @param {Number} [bufferLen=1024] The length of the WaveShaperNode buffer.
			 *  @example
			 * var timesTwo = new Tone.WaveShaper(function(val){
			 * 	return val * 2;
			 * }, 2048);
			 *  @example
			 * //a waveshaper can also be constructed with an array of values
			 * var invert = new Tone.WaveShaper([1, -1]);
			 */
		    Tone.WaveShaper = function (mapping, bufferLen) {
		        /**
				 *  the waveshaper
				 *  @type {WaveShaperNode}
				 *  @private
				 */
		        this._shaper = this.input = this.output = this.context.createWaveShaper();
		        /**
				 *  the waveshapers curve
				 *  @type {Float32Array}
				 *  @private
				 */
		        this._curve = null;
		        if (Array.isArray(mapping)) {
		            this.curve = mapping;
		        } else if (isFinite(mapping) || this.isUndef(mapping)) {
		            this._curve = new Float32Array(this.defaultArg(mapping, 1024));
		        } else if (this.isFunction(mapping)) {
		            this._curve = new Float32Array(this.defaultArg(bufferLen, 1024));
		            this.setMap(mapping);
		        }
		    };
		    Tone.extend(Tone.WaveShaper, Tone.SignalBase);
		    /**
			 *  Uses a mapping function to set the value of the curve. 
			 *  @param {function} mapping The function used to define the values. 
			 *                            The mapping function take two arguments: 
			 *                            the first is the value at the current position 
			 *                            which goes from -1 to 1 over the number of elements
			 *                            in the curve array. The second argument is the array position. 
			 *  @returns {Tone.WaveShaper} this
			 *  @example
			 * //map the input signal from [-1, 1] to [0, 10]
			 * shaper.setMap(function(val, index){
			 * 	return (val + 1) * 5;
			 * })
			 */
		    Tone.WaveShaper.prototype.setMap = function (mapping) {
		        for (var i = 0, len = this._curve.length; i < len; i++) {
		            var normalized = i / len * 2 - 1;
		            this._curve[i] = mapping(normalized, i);
		        }
		        this._shaper.curve = this._curve;
		        return this;
		    };
		    /**
			 * The array to set as the waveshaper curve. For linear curves
			 * array length does not make much difference, but for complex curves
			 * longer arrays will provide smoother interpolation. 
			 * @memberOf Tone.WaveShaper#
			 * @type {Array}
			 * @name curve
			 */
		    Object.defineProperty(Tone.WaveShaper.prototype, 'curve', {
		        get: function () {
		            return this._shaper.curve;
		        },
		        set: function (mapping) {
		            this._curve = new Float32Array(mapping);
		            this._shaper.curve = this._curve;
		        }
		    });
		    /**
			 * Specifies what type of oversampling (if any) should be used when 
			 * applying the shaping curve. Can either be "none", "2x" or "4x". 
			 * @memberOf Tone.WaveShaper#
			 * @type {string}
			 * @name oversample
			 */
		    Object.defineProperty(Tone.WaveShaper.prototype, 'oversample', {
		        get: function () {
		            return this._shaper.oversample;
		        },
		        set: function (oversampling) {
		            if ([
		                    'none',
		                    '2x',
		                    '4x'
		                ].indexOf(oversampling) !== -1) {
		                this._shaper.oversample = oversampling;
		            } else {
		                throw new Error('invalid oversampling: ' + oversampling);
		            }
		        }
		    });
		    /**
			 *  Clean up.
			 *  @returns {Tone.WaveShaper} this
			 */
		    Tone.WaveShaper.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._shaper.disconnect();
		        this._shaper = null;
		        this._curve = null;
		        return this;
		    };
		    return Tone.WaveShaper;
		});
		Module(function (Tone) {
		    
		    ///////////////////////////////////////////////////////////////////////////
		    //	TYPES
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 * Units which a value can take on.
			 * @enum {String}
			 */
		    Tone.Type = {
		        /** 
				 *  The default value is a number which can take on any value between [-Infinity, Infinity]
				 */
		        Default: 'number',
		        /**
				 *  Time can be described in a number of ways. Read more [Time](https://github.com/Tonejs/Tone.js/wiki/Time).
				 *
				 *  <ul>
				 *  <li>Numbers, which will be taken literally as the time (in seconds).</li>
				 *  <li>Notation, ("4n", "8t") describes time in BPM and time signature relative values.</li>
				 *  <li>TransportTime, ("4:3:2") will also provide tempo and time signature relative times 
				 *  in the form BARS:QUARTERS:SIXTEENTHS.</li>
				 *  <li>Frequency, ("8hz") is converted to the length of the cycle in seconds.</li>
				 *  <li>Now-Relative, ("+1") prefix any of the above with "+" and it will be interpreted as 
				 *  "the current time plus whatever expression follows".</li>
				 *  <li>Expressions, ("3:0 + 2 - (1m / 7)") any of the above can also be combined 
				 *  into a mathematical expression which will be evaluated to compute the desired time.</li>
				 *  <li>No Argument, for methods which accept time, no argument will be interpreted as 
				 *  "now" (i.e. the currentTime).</li>
				 *  </ul>
				 *  
				 *  @typedef {Time}
				 */
		        Time: 'time',
		        /**
				 *  Frequency can be described similar to time, except ultimately the
				 *  values are converted to frequency instead of seconds. A number
				 *  is taken literally as the value in hertz. Additionally any of the 
				 *  Time encodings can be used. Note names in the form
				 *  of NOTE OCTAVE (i.e. C4) are also accepted and converted to their
				 *  frequency value. 
				 *  @typedef {Frequency}
				 */
		        Frequency: 'frequency',
		        /** 
				 *  Normal values are within the range [0, 1].
				 *  @typedef {NormalRange}
				 */
		        NormalRange: 'normalRange',
		        /** 
				 *  AudioRange values are between [-1, 1].
				 *  @typedef {AudioRange}
				 */
		        AudioRange: 'audioRange',
		        /** 
				 *  Decibels are a logarithmic unit of measurement which is useful for volume
				 *  because of the logarithmic way that we perceive loudness. 0 decibels 
				 *  means no change in volume. -10db is approximately half as loud and 10db 
				 *  is twice is loud. 
				 *  @typedef {Decibels}
				 */
		        Decibels: 'db',
		        /** 
				 *  Half-step note increments, i.e. 12 is an octave above the root. and 1 is a half-step up.
				 *  @typedef {Interval}
				 */
		        Interval: 'interval',
		        /** 
				 *  Beats per minute. 
				 *  @typedef {BPM}
				 */
		        BPM: 'bpm',
		        /** 
				 *  The value must be greater than or equal to 0.
				 *  @typedef {Positive}
				 */
		        Positive: 'positive',
		        /** 
				 *  A cent is a hundredth of a semitone. 
				 *  @typedef {Cents}
				 */
		        Cents: 'cents',
		        /** 
				 *  Angle between 0 and 360. 
				 *  @typedef {Degrees}
				 */
		        Degrees: 'degrees',
		        /** 
				 *  A number representing a midi note.
				 *  @typedef {MIDI}
				 */
		        MIDI: 'midi',
		        /** 
				 *  A colon-separated representation of time in the form of
				 *  BARS:QUARTERS:SIXTEENTHS. 
				 *  @typedef {TransportTime}
				 */
		        TransportTime: 'transportTime',
		        /** 
				 *  Ticks are the basic subunit of the Transport. They are
				 *  the smallest unit of time that the Transport supports.
				 *  @typedef {Ticks}
				 */
		        Ticks: 'tick',
		        /** 
				 *  A frequency represented by a letter name, 
				 *  accidental and octave. This system is known as
				 *  [Scientific Pitch Notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation).
				 *  @typedef {Note}
				 */
		        Note: 'note',
		        /** 
				 *  One millisecond is a thousandth of a second. 
				 *  @typedef {Milliseconds}
				 */
		        Milliseconds: 'milliseconds',
		        /** 
				 *  A string representing a duration relative to a measure. 
				 *  <ul>
				 *  	<li>"4n" = quarter note</li>
				 *   	<li>"2m" = two measures</li>
				 *    	<li>"8t" = eighth-note triplet</li>
				 *  </ul>
				 *  @typedef {Notation}
				 */
		        Notation: 'notation'
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	MATCHING TESTS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Test if a function is "now-relative", i.e. starts with "+".
			 *  
			 *  @param {String} str The string to test
			 *  @return {boolean} 
			 *  @method isNowRelative
			 *  @lends Tone.prototype.isNowRelative
			 */
		    Tone.prototype.isNowRelative = function () {
		        var nowRelative = new RegExp(/^\s*\+(.)+/i);
		        return function (note) {
		            return nowRelative.test(note);
		        };
		    }();
		    /**
			 *  Tests if a string is in Ticks notation. 
			 *  
			 *  @param {String} str The string to test
			 *  @return {boolean} 
			 *  @method isTicks
			 *  @lends Tone.prototype.isTicks
			 */
		    Tone.prototype.isTicks = function () {
		        var tickFormat = new RegExp(/^\d+i$/i);
		        return function (note) {
		            return tickFormat.test(note);
		        };
		    }();
		    /**
			 *  Tests if a string is musical notation.
			 *  i.e.:
			 *  <ul>
			 *  	<li>4n = quarter note</li>
			 *   	<li>2m = two measures</li>
			 *    	<li>8t = eighth-note triplet</li>
			 *  </ul>
			 *  
			 *  @param {String} str The string to test
			 *  @return {boolean} 
			 *  @method isNotation
			 *  @lends Tone.prototype.isNotation
			 */
		    Tone.prototype.isNotation = function () {
		        var notationFormat = new RegExp(/^[0-9]+[mnt]$/i);
		        return function (note) {
		            return notationFormat.test(note);
		        };
		    }();
		    /**
			 *  Test if a string is in the transportTime format. 
			 *  "Bars:Beats:Sixteenths"
			 *  @param {String} transportTime
			 *  @return {boolean} 
			 *  @method isTransportTime
			 *  @lends Tone.prototype.isTransportTime
			 */
		    Tone.prototype.isTransportTime = function () {
		        var transportTimeFormat = new RegExp(/^(\d+(\.\d+)?\:){1,2}(\d+(\.\d+)?)?$/i);
		        return function (transportTime) {
		            return transportTimeFormat.test(transportTime);
		        };
		    }();
		    /**
			 *  Test if a string is in Scientific Pitch Notation: i.e. "C4". 
			 *  @param  {String}  note The note to test
			 *  @return {boolean}      true if it's in the form of a note
			 *  @method isNote
			 *  @lends Tone.prototype.isNote
			 *  @function
			 */
		    Tone.prototype.isNote = function () {
		        var noteFormat = new RegExp(/^[a-g]{1}(b|#|x|bb)?-?[0-9]+$/i);
		        return function (note) {
		            return noteFormat.test(note);
		        };
		    }();
		    /**
			 *  Test if the input is in the format of number + hz
			 *  i.e.: 10hz
			 *
			 *  @param {String} freq 
			 *  @return {boolean} 
			 *  @function
			 */
		    Tone.prototype.isFrequency = function () {
		        var freqFormat = new RegExp(/^\d*\.?\d+hz$/i);
		        return function (freq) {
		            return freqFormat.test(freq);
		        };
		    }();
		    ///////////////////////////////////////////////////////////////////////////
		    //	TO SECOND CONVERSIONS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  @private
			 *  @return  {Object}  The Transport's BPM if the Transport exists, 
			 *                         otherwise returns reasonable defaults.
			 */
		    function getTransportBpm() {
		        if (Tone.Transport && Tone.Transport.bpm) {
		            return Tone.Transport.bpm.value;
		        } else {
		            return 120;
		        }
		    }
		    /**
			 *  @private
			 *  @return  {Object}  The Transport's Time Signature if the Transport exists, 
			 *                         otherwise returns reasonable defaults.
			 */
		    function getTransportTimeSignature() {
		        if (Tone.Transport && Tone.Transport.timeSignature) {
		            return Tone.Transport.timeSignature;
		        } else {
		            return 4;
		        }
		    }
		    /**
			 *
			 *  convert notation format strings to seconds
			 *  
			 *  @param  {String} notation     
			 *  @param {BPM=} bpm 
			 *  @param {number=} timeSignature 
			 *  @return {number} 
			 *                
			 */
		    Tone.prototype.notationToSeconds = function (notation, bpm, timeSignature) {
		        bpm = this.defaultArg(bpm, getTransportBpm());
		        timeSignature = this.defaultArg(timeSignature, getTransportTimeSignature());
		        var beatTime = 60 / bpm;
		        //special case: 1n = 1m
		        if (notation === '1n') {
		            notation = '1m';
		        }
		        var subdivision = parseInt(notation, 10);
		        var beats = 0;
		        if (subdivision === 0) {
		            beats = 0;
		        }
		        var lastLetter = notation.slice(-1);
		        if (lastLetter === 't') {
		            beats = 4 / subdivision * 2 / 3;
		        } else if (lastLetter === 'n') {
		            beats = 4 / subdivision;
		        } else if (lastLetter === 'm') {
		            beats = subdivision * timeSignature;
		        } else {
		            beats = 0;
		        }
		        return beatTime * beats;
		    };
		    /**
			 *  convert transportTime into seconds.
			 *  
			 *  ie: 4:2:3 == 4 measures + 2 quarters + 3 sixteenths
			 *
			 *  @param  {TransportTime} transportTime 
			 *  @param {BPM=} bpm 
			 *  @param {number=} timeSignature
			 *  @return {number}               seconds
			 */
		    Tone.prototype.transportTimeToSeconds = function (transportTime, bpm, timeSignature) {
		        bpm = this.defaultArg(bpm, getTransportBpm());
		        timeSignature = this.defaultArg(timeSignature, getTransportTimeSignature());
		        var measures = 0;
		        var quarters = 0;
		        var sixteenths = 0;
		        var split = transportTime.split(':');
		        if (split.length === 2) {
		            measures = parseFloat(split[0]);
		            quarters = parseFloat(split[1]);
		        } else if (split.length === 1) {
		            quarters = parseFloat(split[0]);
		        } else if (split.length === 3) {
		            measures = parseFloat(split[0]);
		            quarters = parseFloat(split[1]);
		            sixteenths = parseFloat(split[2]);
		        }
		        var beats = measures * timeSignature + quarters + sixteenths / 4;
		        return beats * (60 / bpm);
		    };
		    /**
			 *  Convert ticks into seconds
			 *  @param  {Ticks} ticks 
			 *  @param {BPM=} bpm 
			 *  @return {number}               seconds
			 */
		    Tone.prototype.ticksToSeconds = function (ticks, bpm) {
		        if (this.isUndef(Tone.Transport)) {
		            return 0;
		        }
		        ticks = parseFloat(ticks);
		        bpm = this.defaultArg(bpm, getTransportBpm());
		        var tickTime = 60 / bpm / Tone.Transport.PPQ;
		        return tickTime * ticks;
		    };
		    /**
			 *  Convert a frequency into seconds.
			 *  Accepts numbers and strings: i.e. "10hz" or 
			 *  10 both return 0.1. 
			 *  
			 *  @param  {Frequency} freq 
			 *  @return {number}      
			 */
		    Tone.prototype.frequencyToSeconds = function (freq) {
		        return 1 / parseFloat(freq);
		    };
		    /**
			 *  Convert a sample count to seconds.
			 *  @param  {number} samples 
			 *  @return {number}         
			 */
		    Tone.prototype.samplesToSeconds = function (samples) {
		        return samples / this.context.sampleRate;
		    };
		    /**
			 *  Convert from seconds to samples. 
			 *  @param  {number} seconds 
			 *  @return {number} The number of samples        
			 */
		    Tone.prototype.secondsToSamples = function (seconds) {
		        return seconds * this.context.sampleRate;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	FROM SECOND CONVERSIONS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Convert seconds to transportTime in the form 
			 *  	"measures:quarters:sixteenths"
			 *
			 *  @param {Number} seconds 
			 *  @param {BPM=} bpm 
			 *  @param {Number=} timeSignature
			 *  @return {TransportTime}  
			 */
		    Tone.prototype.secondsToTransportTime = function (seconds, bpm, timeSignature) {
		        bpm = this.defaultArg(bpm, getTransportBpm());
		        timeSignature = this.defaultArg(timeSignature, getTransportTimeSignature());
		        var quarterTime = 60 / bpm;
		        var quarters = seconds / quarterTime;
		        var measures = Math.floor(quarters / timeSignature);
		        var sixteenths = quarters % 1 * 4;
		        quarters = Math.floor(quarters) % timeSignature;
		        var progress = [
		            measures,
		            quarters,
		            sixteenths
		        ];
		        return progress.join(':');
		    };
		    /**
			 *  Convert a number in seconds to a frequency.
			 *  @param  {number} seconds 
			 *  @return {number}         
			 */
		    Tone.prototype.secondsToFrequency = function (seconds) {
		        return 1 / seconds;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	GENERALIZED CONVERSIONS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Convert seconds to the closest transportTime in the form 
			 *  	measures:quarters:sixteenths
			 *
			 *  @method toTransportTime
			 *  
			 *  @param {Time} time 
			 *  @param {BPM=} bpm 
			 *  @param {number=} timeSignature
			 *  @return {TransportTime}  
			 *  
			 *  @lends Tone.prototype.toTransportTime
			 */
		    Tone.prototype.toTransportTime = function (time, bpm, timeSignature) {
		        var seconds = this.toSeconds(time);
		        return this.secondsToTransportTime(seconds, bpm, timeSignature);
		    };
		    /**
			 *  Convert a frequency representation into a number.
			 *  	
			 *  @param  {Frequency} freq 
			 *  @param {number=} 	now 	if passed in, this number will be 
			 *                        		used for all 'now' relative timings
			 *  @return {number}      the frequency in hertz
			 */
		    Tone.prototype.toFrequency = function (freq, now) {
		        if (this.isFrequency(freq)) {
		            return parseFloat(freq);
		        } else if (this.isNotation(freq) || this.isTransportTime(freq)) {
		            return this.secondsToFrequency(this.toSeconds(freq, now));
		        } else if (this.isNote(freq)) {
		            return this.noteToFrequency(freq);
		        } else {
		            return freq;
		        }
		    };
		    /**
			 *  Convert the time representation into ticks.
			 *  Now-Relative timing will be relative to the current
			 *  Tone.Transport.ticks. 
			 *  @param  {Time} time
			 *  @return {Ticks}   
			 */
		    Tone.prototype.toTicks = function (time) {
		        if (this.isUndef(Tone.Transport)) {
		            return 0;
		        }
		        var bpm = Tone.Transport.bpm.value;
		        //get the seconds
		        var plusNow = 0;
		        if (this.isNowRelative(time)) {
		            time = time.replace('+', '');
		            plusNow = Tone.Transport.ticks;
		        } else if (this.isUndef(time)) {
		            return Tone.Transport.ticks;
		        }
		        var seconds = this.toSeconds(time);
		        var quarter = 60 / bpm;
		        var quarters = seconds / quarter;
		        var tickNum = quarters * Tone.Transport.PPQ;
		        //align the tick value
		        return Math.round(tickNum + plusNow);
		    };
		    /**
			 *  convert a time into samples
			 *  
			 *  @param  {Time} time
			 *  @return {number}         
			 */
		    Tone.prototype.toSamples = function (time) {
		        var seconds = this.toSeconds(time);
		        return Math.round(seconds * this.context.sampleRate);
		    };
		    /**
			 *  Convert Time into seconds.
			 *  
			 *  Unlike the method which it overrides, this takes into account 
			 *  transporttime and musical notation.
			 *
			 *  Time : 1.40
			 *  Notation: 4n|1m|2t
			 *  TransportTime: 2:4:1 (measure:quarters:sixteens)
			 *  Now Relative: +3n
			 *  Math: 3n+16n or even complicated expressions ((3n*2)/6 + 1)
			 *
			 *  @override
			 *  @param  {Time} time       
			 *  @param {number=} 	now 	if passed in, this number will be 
			 *                        		used for all 'now' relative timings
			 *  @return {number} 
			 */
		    Tone.prototype.toSeconds = function (time, now) {
		        now = this.defaultArg(now, this.now());
		        if (this.isNumber(time)) {
		            return time;    //assuming that it's seconds
		        } else if (this.isString(time)) {
		            var plusTime = 0;
		            if (this.isNowRelative(time)) {
		                time = time.replace('+', '');
		                plusTime = now;
		            }
		            var betweenParens = time.match(/\(([^)(]+)\)/g);
		            if (betweenParens) {
		                //evaluate the expressions between the parenthesis
		                for (var j = 0; j < betweenParens.length; j++) {
		                    //remove the parens
		                    var symbol = betweenParens[j].replace(/[\(\)]/g, '');
		                    var symbolVal = this.toSeconds(symbol);
		                    time = time.replace(betweenParens[j], symbolVal);
		                }
		            }
		            //test if it is quantized
		            if (time.indexOf('@') !== -1) {
		                var quantizationSplit = time.split('@');
		                if (!this.isUndef(Tone.Transport)) {
		                    var toQuantize = quantizationSplit[0].trim();
		                    //if there's no argument it should be evaluated as the current time
		                    if (toQuantize === '') {
		                        toQuantize = undefined;
		                    }
		                    //if it's now-relative, it should be evaluated by `quantize`
		                    if (plusTime > 0) {
		                        toQuantize = '+' + toQuantize;
		                        plusTime = 0;
		                    }
		                    var subdivision = quantizationSplit[1].trim();
		                    time = Tone.Transport.quantize(toQuantize, subdivision);
		                } else {
		                    throw new Error('quantization requires Tone.Transport');
		                }
		            } else {
		                var components = time.split(/[\(\)\-\+\/\*]/);
		                if (components.length > 1) {
		                    var originalTime = time;
		                    for (var i = 0; i < components.length; i++) {
		                        var symb = components[i].trim();
		                        if (symb !== '') {
		                            var val = this.toSeconds(symb);
		                            time = time.replace(symb, val);
		                        }
		                    }
		                    try {
		                        //eval is evil
		                        time = eval(time);    // jshint ignore:line
		                    } catch (e) {
		                        throw new EvalError('cannot evaluate Time: ' + originalTime);
		                    }
		                } else if (this.isNotation(time)) {
		                    time = this.notationToSeconds(time);
		                } else if (this.isTransportTime(time)) {
		                    time = this.transportTimeToSeconds(time);
		                } else if (this.isFrequency(time)) {
		                    time = this.frequencyToSeconds(time);
		                } else if (this.isTicks(time)) {
		                    time = this.ticksToSeconds(time);
		                } else {
		                    time = parseFloat(time);
		                }
		            }
		            return time + plusTime;
		        } else {
		            return now;
		        }
		    };
		    /**
			 *  Convert a Time to Notation. Values will be thresholded to the nearest 128th note. 
			 *  @param {Time} time 
			 *  @param {BPM=} bpm 
			 *  @param {number=} timeSignature
			 *  @return {Notation}  
			 */
		    Tone.prototype.toNotation = function (time, bpm, timeSignature) {
		        var testNotations = [
		            '1m',
		            '2n',
		            '4n',
		            '8n',
		            '16n',
		            '32n',
		            '64n',
		            '128n'
		        ];
		        var retNotation = toNotationHelper.call(this, time, bpm, timeSignature, testNotations);
		        //try the same thing but with tripelets
		        var testTripletNotations = [
		            '1m',
		            '2n',
		            '2t',
		            '4n',
		            '4t',
		            '8n',
		            '8t',
		            '16n',
		            '16t',
		            '32n',
		            '32t',
		            '64n',
		            '64t',
		            '128n'
		        ];
		        var retTripletNotation = toNotationHelper.call(this, time, bpm, timeSignature, testTripletNotations);
		        //choose the simpler expression of the two
		        if (retTripletNotation.split('+').length < retNotation.split('+').length) {
		            return retTripletNotation;
		        } else {
		            return retNotation;
		        }
		    };
		    /**
			 *  Helper method for Tone.toNotation
			 *  @private
			 */
		    function toNotationHelper(time, bpm, timeSignature, testNotations) {
		        var seconds = this.toSeconds(time);
		        var threshold = this.notationToSeconds(testNotations[testNotations.length - 1], bpm, timeSignature);
		        var retNotation = '';
		        for (var i = 0; i < testNotations.length; i++) {
		            var notationTime = this.notationToSeconds(testNotations[i], bpm, timeSignature);
		            //account for floating point errors (i.e. round up if the value is 0.999999)
		            var multiple = seconds / notationTime;
		            var floatingPointError = 0.000001;
		            if (1 - multiple % 1 < floatingPointError) {
		                multiple += floatingPointError;
		            }
		            multiple = Math.floor(multiple);
		            if (multiple > 0) {
		                if (multiple === 1) {
		                    retNotation += testNotations[i];
		                } else {
		                    retNotation += multiple.toString() + '*' + testNotations[i];
		                }
		                seconds -= multiple * notationTime;
		                if (seconds < threshold) {
		                    break;
		                } else {
		                    retNotation += ' + ';
		                }
		            }
		        }
		        if (retNotation === '') {
		            retNotation = '0';
		        }
		        return retNotation;
		    }
		    /**
			 *  Convert the given value from the type specified by units
			 *  into a number.
			 *  @param  {*} val the value to convert
			 *  @return {Number}     the number which the value should be set to
			 */
		    Tone.prototype.fromUnits = function (val, units) {
		        if (this.convert || this.isUndef(this.convert)) {
		            switch (units) {
		            case Tone.Type.Time:
		                return this.toSeconds(val);
		            case Tone.Type.Frequency:
		                return this.toFrequency(val);
		            case Tone.Type.Decibels:
		                return this.dbToGain(val);
		            case Tone.Type.NormalRange:
		                return Math.min(Math.max(val, 0), 1);
		            case Tone.Type.AudioRange:
		                return Math.min(Math.max(val, -1), 1);
		            case Tone.Type.Positive:
		                return Math.max(val, 0);
		            default:
		                return val;
		            }
		        } else {
		            return val;
		        }
		    };
		    /**
			 * Convert a number to the specified units.
			 * @param  {number} val the value to convert
			 * @return {number}
			 */
		    Tone.prototype.toUnits = function (val, units) {
		        if (this.convert || this.isUndef(this.convert)) {
		            switch (units) {
		            case Tone.Type.Decibels:
		                return this.gainToDb(val);
		            default:
		                return val;
		            }
		        } else {
		            return val;
		        }
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	FREQUENCY CONVERSIONS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Note to scale index
			 *  @type  {Object}
			 */
		    var noteToScaleIndex = {
		        'cbb': -2,
		        'cb': -1,
		        'c': 0,
		        'c#': 1,
		        'cx': 2,
		        'dbb': 0,
		        'db': 1,
		        'd': 2,
		        'd#': 3,
		        'dx': 4,
		        'ebb': 2,
		        'eb': 3,
		        'e': 4,
		        'e#': 5,
		        'ex': 6,
		        'fbb': 3,
		        'fb': 4,
		        'f': 5,
		        'f#': 6,
		        'fx': 7,
		        'gbb': 5,
		        'gb': 6,
		        'g': 7,
		        'g#': 8,
		        'gx': 9,
		        'abb': 7,
		        'ab': 8,
		        'a': 9,
		        'a#': 10,
		        'ax': 11,
		        'bbb': 9,
		        'bb': 10,
		        'b': 11,
		        'b#': 12,
		        'bx': 13
		    };
		    /**
			 *  scale index to note (sharps)
			 *  @type  {Array}
			 */
		    var scaleIndexToNote = [
		        'C',
		        'C#',
		        'D',
		        'D#',
		        'E',
		        'F',
		        'F#',
		        'G',
		        'G#',
		        'A',
		        'A#',
		        'B'
		    ];
		    /**
			 *  The [concert pitch](https://en.wikipedia.org/wiki/Concert_pitch, 
			 *  A4's values in Hertz. 
			 *  @type {Frequency}
			 *  @static
			 */
		    Tone.A4 = 440;
		    /**
			 *  Convert a note name to frequency. 
			 *  @param  {String} note
			 *  @return {number}     
			 *  @example
			 * var freq = tone.noteToFrequency("A4"); //returns 440
			 */
		    Tone.prototype.noteToFrequency = function (note) {
		        //break apart the note by frequency and octave
		        var parts = note.split(/(-?\d+)/);
		        if (parts.length === 3) {
		            var index = noteToScaleIndex[parts[0].toLowerCase()];
		            var octave = parts[1];
		            var noteNumber = index + (parseInt(octave, 10) + 1) * 12;
		            return this.midiToFrequency(noteNumber);
		        } else {
		            return 0;
		        }
		    };
		    /**
			 *  Convert a frequency to a note name (i.e. A4, C#5).
			 *  @param  {number} freq
			 *  @return {String}         
			 */
		    Tone.prototype.frequencyToNote = function (freq) {
		        var log = Math.log(freq / Tone.A4) / Math.LN2;
		        var noteNumber = Math.round(12 * log) + 57;
		        var octave = Math.floor(noteNumber / 12);
		        if (octave < 0) {
		            noteNumber += -12 * octave;
		        }
		        var noteName = scaleIndexToNote[noteNumber % 12];
		        return noteName + octave.toString();
		    };
		    /**
			 *  Convert an interval (in semitones) to a frequency ratio.
			 *
			 *  @param  {Interval} interval the number of semitones above the base note
			 *  @return {number}          the frequency ratio
			 *  @example
			 * tone.intervalToFrequencyRatio(0); // returns 1
			 * tone.intervalToFrequencyRatio(12); // returns 2
			 */
		    Tone.prototype.intervalToFrequencyRatio = function (interval) {
		        return Math.pow(2, interval / 12);
		    };
		    /**
			 *  Convert a midi note number into a note name. 
			 *
			 *  @param  {MIDI} midiNumber the midi note number
			 *  @return {String}            the note's name and octave
			 *  @example
			 * tone.midiToNote(60); // returns "C3"
			 */
		    Tone.prototype.midiToNote = function (midiNumber) {
		        var octave = Math.floor(midiNumber / 12) - 1;
		        var note = midiNumber % 12;
		        return scaleIndexToNote[note] + octave;
		    };
		    /**
			 *  Convert a note to it's midi value. 
			 *
			 *  @param  {String} note the note name (i.e. "C3")
			 *  @return {MIDI} the midi value of that note
			 *  @example
			 * tone.noteToMidi("C3"); // returns 60
			 */
		    Tone.prototype.noteToMidi = function (note) {
		        //break apart the note by frequency and octave
		        var parts = note.split(/(\d+)/);
		        if (parts.length === 3) {
		            var index = noteToScaleIndex[parts[0].toLowerCase()];
		            var octave = parts[1];
		            return index + (parseInt(octave, 10) + 1) * 12;
		        } else {
		            return 0;
		        }
		    };
		    /**
			 *  Convert a MIDI note to frequency value. 
			 *
			 *  @param  {MIDI} midi The midi number to convert.
			 *  @return {Frequency} the corresponding frequency value
			 *  @example
			 * tone.midiToFrequency(57); // returns 440
			 */
		    Tone.prototype.midiToFrequency = function (midi) {
		        return Tone.A4 * Math.pow(2, (midi - 69) / 12);
		    };
		    return Tone;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Param wraps the native Web Audio's AudioParam to provide
			 *         additional unit conversion functionality. It also
			 *         serves as a base-class for classes which have a single,
			 *         automatable parameter. 
			 *  @extends {Tone}
			 *  @param  {AudioParam}  param  The parameter to wrap.
			 *  @param  {Tone.Type} units The units of the audio param.
			 *  @param  {Boolean} convert If the param should be converted.
			 */
		    Tone.Param = function () {
		        var options = this.optionsObject(arguments, [
		            'param',
		            'units',
		            'convert'
		        ], Tone.Param.defaults);
		        /**
				 *  The native parameter to control
				 *  @type  {AudioParam}
				 *  @private
				 */
		        this._param = this.input = options.param;
		        /**
				 *  The units of the parameter
				 *  @type {Tone.Type}
				 */
		        this.units = options.units;
		        /**
				 *  If the value should be converted or not
				 *  @type {Boolean}
				 */
		        this.convert = options.convert;
		        /**
				 *  True if the signal value is being overridden by 
				 *  a connected signal.
				 *  @readOnly
				 *  @type  {boolean}
				 *  @private
				 */
		        this.overridden = false;
		        if (!this.isUndef(options.value)) {
		            this.value = options.value;
		        }
		    };
		    Tone.extend(Tone.Param);
		    /**
			 *  Defaults
			 *  @type  {Object}
			 *  @const
			 */
		    Tone.Param.defaults = {
		        'units': Tone.Type.Default,
		        'convert': true,
		        'param': undefined
		    };
		    /**
			 * The current value of the parameter. 
			 * @memberOf Tone.Param#
			 * @type {Number}
			 * @name value
			 */
		    Object.defineProperty(Tone.Param.prototype, 'value', {
		        get: function () {
		            return this._toUnits(this._param.value);
		        },
		        set: function (value) {
		            var convertedVal = this._fromUnits(value);
		            this._param.value = convertedVal;
		        }
		    });
		    /**
			 *  Convert the given value from the type specified by Tone.Param.units
			 *  into the destination value (such as Gain or Frequency).
			 *  @private
			 *  @param  {*} val the value to convert
			 *  @return {number}     the number which the value should be set to
			 */
		    Tone.Param.prototype._fromUnits = function (val) {
		        if (this.convert || this.isUndef(this.convert)) {
		            switch (this.units) {
		            case Tone.Type.Time:
		                return this.toSeconds(val);
		            case Tone.Type.Frequency:
		                return this.toFrequency(val);
		            case Tone.Type.Decibels:
		                return this.dbToGain(val);
		            case Tone.Type.NormalRange:
		                return Math.min(Math.max(val, 0), 1);
		            case Tone.Type.AudioRange:
		                return Math.min(Math.max(val, -1), 1);
		            case Tone.Type.Positive:
		                return Math.max(val, 0);
		            default:
		                return val;
		            }
		        } else {
		            return val;
		        }
		    };
		    /**
			 * Convert the parameters value into the units specified by Tone.Param.units.
			 * @private
			 * @param  {number} val the value to convert
			 * @return {number}
			 */
		    Tone.Param.prototype._toUnits = function (val) {
		        if (this.convert || this.isUndef(this.convert)) {
		            switch (this.units) {
		            case Tone.Type.Decibels:
		                return this.gainToDb(val);
		            default:
		                return val;
		            }
		        } else {
		            return val;
		        }
		    };
		    /**
			 *  the minimum output value
			 *  @type {Number}
			 *  @private
			 */
		    Tone.Param.prototype._minOutput = 0.00001;
		    /**
			 *  Schedules a parameter value change at the given time.
			 *  @param {*}	value The value to set the signal.
			 *  @param {Time}  time The time when the change should occur.
			 *  @returns {Tone.Param} this
			 *  @example
			 * //set the frequency to "G4" in exactly 1 second from now. 
			 * freq.setValueAtTime("G4", "+1");
			 */
		    Tone.Param.prototype.setValueAtTime = function (value, time) {
		        value = this._fromUnits(value);
		        this._param.setValueAtTime(value, this.toSeconds(time));
		        return this;
		    };
		    /**
			 *  Creates a schedule point with the current value at the current time.
			 *  This is useful for creating an automation anchor point in order to 
			 *  schedule changes from the current value. 
			 *
			 *  @param {number=} now (Optionally) pass the now value in. 
			 *  @returns {Tone.Param} this
			 */
		    Tone.Param.prototype.setRampPoint = function (now) {
		        now = this.defaultArg(now, this.now());
		        var currentVal = this._param.value;
		        this._param.setValueAtTime(currentVal, now);
		        return this;
		    };
		    /**
			 *  Schedules a linear continuous change in parameter value from the 
			 *  previous scheduled parameter value to the given value.
			 *  
			 *  @param  {number} value   
			 *  @param  {Time} endTime 
			 *  @returns {Tone.Param} this
			 */
		    Tone.Param.prototype.linearRampToValueAtTime = function (value, endTime) {
		        value = this._fromUnits(value);
		        this._param.linearRampToValueAtTime(value, this.toSeconds(endTime));
		        return this;
		    };
		    /**
			 *  Schedules an exponential continuous change in parameter value from 
			 *  the previous scheduled parameter value to the given value.
			 *  
			 *  @param  {number} value   
			 *  @param  {Time} endTime 
			 *  @returns {Tone.Param} this
			 */
		    Tone.Param.prototype.exponentialRampToValueAtTime = function (value, endTime) {
		        value = this._fromUnits(value);
		        value = Math.max(this._minOutput, value);
		        this._param.exponentialRampToValueAtTime(value, this.toSeconds(endTime));
		        return this;
		    };
		    /**
			 *  Schedules an exponential continuous change in parameter value from 
			 *  the current time and current value to the given value over the 
			 *  duration of the rampTime.
			 *  
			 *  @param  {number} value   The value to ramp to.
			 *  @param  {Time} rampTime the time that it takes the 
			 *                               value to ramp from it's current value
			 *  @returns {Tone.Param} this
			 *  @example
			 * //exponentially ramp to the value 2 over 4 seconds. 
			 * signal.exponentialRampToValue(2, 4);
			 */
		    Tone.Param.prototype.exponentialRampToValue = function (value, rampTime) {
		        var now = this.now();
		        // exponentialRampToValueAt cannot ever ramp from 0, apparently.
		        // More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1125600#c2
		        var currentVal = this.value;
		        this.setValueAtTime(Math.max(currentVal, this._minOutput), now);
		        this.exponentialRampToValueAtTime(value, now + this.toSeconds(rampTime));
		        return this;
		    };
		    /**
			 *  Schedules an linear continuous change in parameter value from 
			 *  the current time and current value to the given value over the 
			 *  duration of the rampTime.
			 *  
			 *  @param  {number} value   The value to ramp to.
			 *  @param  {Time} rampTime the time that it takes the 
			 *                               value to ramp from it's current value
			 *  @returns {Tone.Param} this
			 *  @example
			 * //linearly ramp to the value 4 over 3 seconds. 
			 * signal.linearRampToValue(4, 3);
			 */
		    Tone.Param.prototype.linearRampToValue = function (value, rampTime) {
		        var now = this.now();
		        this.setRampPoint(now);
		        this.linearRampToValueAtTime(value, now + this.toSeconds(rampTime));
		        return this;
		    };
		    /**
			 *  Start exponentially approaching the target value at the given time with
			 *  a rate having the given time constant.
			 *  @param {number} value        
			 *  @param {Time} startTime    
			 *  @param {number} timeConstant 
			 *  @returns {Tone.Param} this 
			 */
		    Tone.Param.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
		        value = this._fromUnits(value);
		        // The value will never be able to approach without timeConstant > 0.
		        // http://www.w3.org/TR/webaudio/#dfn-setTargetAtTime, where the equation
		        // is described. 0 results in a division by 0.
		        value = Math.max(this._minOutput, value);
		        timeConstant = Math.max(this._minOutput, timeConstant);
		        this._param.setTargetAtTime(value, this.toSeconds(startTime), timeConstant);
		        return this;
		    };
		    /**
			 *  Sets an array of arbitrary parameter values starting at the given time
			 *  for the given duration.
			 *  	
			 *  @param {Array} values    
			 *  @param {Time} startTime 
			 *  @param {Time} duration  
			 *  @returns {Tone.Param} this
			 */
		    Tone.Param.prototype.setValueCurveAtTime = function (values, startTime, duration) {
		        for (var i = 0; i < values.length; i++) {
		            values[i] = this._fromUnits(values[i]);
		        }
		        this._param.setValueCurveAtTime(values, this.toSeconds(startTime), this.toSeconds(duration));
		        return this;
		    };
		    /**
			 *  Cancels all scheduled parameter changes with times greater than or 
			 *  equal to startTime.
			 *  
			 *  @param  {Time} startTime
			 *  @returns {Tone.Param} this
			 */
		    Tone.Param.prototype.cancelScheduledValues = function (startTime) {
		        this._param.cancelScheduledValues(this.toSeconds(startTime));
		        return this;
		    };
		    /**
			 *  Ramps to the given value over the duration of the rampTime. 
			 *  Automatically selects the best ramp type (exponential or linear)
			 *  depending on the `units` of the signal
			 *  
			 *  @param  {number} value   
			 *  @param  {Time} rampTime the time that it takes the 
			 *                               value to ramp from it's current value
			 *  @returns {Tone.Param} this
			 *  @example
			 * //ramp to the value either linearly or exponentially 
			 * //depending on the "units" value of the signal
			 * signal.rampTo(0, 10);
			 */
		    Tone.Param.prototype.rampTo = function (value, rampTime) {
		        rampTime = this.defaultArg(rampTime, 0);
		        if (this.units === Tone.Type.Frequency || this.units === Tone.Type.BPM) {
		            this.exponentialRampToValue(value, rampTime);
		        } else {
		            this.linearRampToValue(value, rampTime);
		        }
		        return this;
		    };
		    /**
			 *  Clean up
			 *  @returns {Tone.Param} this
			 */
		    Tone.Param.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._param = null;
		        return this;
		    };
		    return Tone.Param;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A thin wrapper around the Native Web Audio GainNode.
			 *         The GainNode is a basic building block of the Web Audio
			 *         API and is useful for routing audio and adjusting gains. 
			 *  @extends {Tone}
			 *  @param  {Number=}  gain  The initial gain of the GainNode
			 *  @param {Tone.Type=} units The units of the gain parameter. 
			 */
		    Tone.Gain = function () {
		        var options = this.optionsObject(arguments, [
		            'gain',
		            'units'
		        ], Tone.Gain.defaults);
		        /**
				 *  The GainNode
				 *  @type  {GainNode}
				 *  @private
				 */
		        this.input = this.output = this._gainNode = this.context.createGain();
		        /**
				 *  The gain parameter of the gain node.
				 *  @type {AudioParam}
				 *  @signal
				 */
		        this.gain = new Tone.Param({
		            'param': this._gainNode.gain,
		            'units': options.units,
		            'value': options.gain,
		            'convert': options.convert
		        });
		        this._readOnly('gain');
		    };
		    Tone.extend(Tone.Gain);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.Gain.defaults = {
		        'gain': 1,
		        'convert': true
		    };
		    /**
			 *  Clean up.
			 *  @return  {Tone.Gain}  this
			 */
		    Tone.Gain.prototype.dispose = function () {
		        Tone.Param.prototype.dispose.call(this);
		        this._gainNode.disconnect();
		        this._gainNode = null;
		        this._writable('gain');
		        this.gain.dispose();
		        this.gain = null;
		    };
		    return Tone.Gain;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  A signal is an audio-rate value. Tone.Signal is a core component of the library.
			 *          Unlike a number, Signals can be scheduled with sample-level accuracy. Tone.Signal
			 *          has all of the methods available to native Web Audio 
			 *          [AudioParam](http://webaudio.github.io/web-audio-api/#the-audioparam-interface)
			 *          as well as additional conveniences. Read more about working with signals 
			 *          [here](https://github.com/Tonejs/Tone.js/wiki/Signals).
			 *
			 *  @constructor
			 *  @extends {Tone.Param}
			 *  @param {Number|AudioParam} [value] Initial value of the signal. If an AudioParam
			 *                                     is passed in, that parameter will be wrapped
			 *                                     and controlled by the Signal. 
			 *  @param {string} [units=Number] unit The units the signal is in. 
			 *  @example
			 * var signal = new Tone.Signal(10);
			 */
		    Tone.Signal = function () {
		        var options = this.optionsObject(arguments, [
		            'value',
		            'units'
		        ], Tone.Signal.defaults);
		        /**
				 * The node where the constant signal value is scaled.
				 * @type {GainNode}
				 * @private
				 */
		        this.output = this._gain = this.context.createGain();
		        options.param = this._gain.gain;
		        Tone.Param.call(this, options);
		        /**
				 * The node where the value is set.
				 * @type {Tone.Param}
				 * @private
				 */
		        this.input = this._param = this._gain.gain;
		        //connect the const output to the node output
		        Tone.Signal._constant.chain(this._gain);
		    };
		    Tone.extend(Tone.Signal, Tone.Param);
		    /**
			 *  The default values
			 *  @type  {Object}
			 *  @static
			 *  @const
			 */
		    Tone.Signal.defaults = {
		        'value': 0,
		        'units': Tone.Type.Default,
		        'convert': true
		    };
		    /**
			 *  When signals connect to other signals or AudioParams, 
			 *  they take over the output value of that signal or AudioParam. 
			 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
			 *
			 *  @override
			 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
			 *  @param {number} [outputNumber=0] The output number to connect from.
			 *  @param {number} [inputNumber=0] The input number to connect to.
			 *  @returns {Tone.SignalBase} this
			 *  @method
			 */
		    Tone.Signal.prototype.connect = Tone.SignalBase.prototype.connect;
		    /**
			 *  dispose and disconnect
			 *  @returns {Tone.Signal} this
			 */
		    Tone.Signal.prototype.dispose = function () {
		        Tone.Param.prototype.dispose.call(this);
		        this._param = null;
		        this._gain.disconnect();
		        this._gain = null;
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	STATIC
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Generates a constant output of 1.
			 *  @static
			 *  @private
			 *  @const
			 *  @type {AudioBufferSourceNode}
			 */
		    Tone.Signal._constant = null;
		    /**
			 *  initializer function
			 */
		    Tone._initAudioContext(function (audioContext) {
		        var buffer = audioContext.createBuffer(1, 128, audioContext.sampleRate);
		        var arr = buffer.getChannelData(0);
		        for (var i = 0; i < arr.length; i++) {
		            arr[i] = 1;
		        }
		        Tone.Signal._constant = audioContext.createBufferSource();
		        Tone.Signal._constant.channelCount = 1;
		        Tone.Signal._constant.channelCountMode = 'explicit';
		        Tone.Signal._constant.buffer = buffer;
		        Tone.Signal._constant.loop = true;
		        Tone.Signal._constant.start(0);
		        Tone.Signal._constant.noGC();
		    });
		    return Tone.Signal;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A Timeline class for scheduling and maintaining state
			 *         along a timeline. All events must have a "time" property. 
			 *         Internally, events are stored in time order for fast 
			 *         retrieval.
			 *  @extends {Tone}
			 *  @param {Positive} [memory=Infinity] The number of previous events that are retained.
			 */
		    Tone.Timeline = function () {
		        var options = this.optionsObject(arguments, ['memory'], Tone.Timeline.defaults);
		        /**
				 *  The array of scheduled timeline events
				 *  @type  {Array}
				 *  @private
				 */
		        this._timeline = [];
		        /**
				 *  An array of items to remove from the list. 
				 *  @type {Array}
				 *  @private
				 */
		        this._toRemove = [];
		        /**
				 *  Flag if the tieline is mid iteration
				 *  @private
				 *  @type {Boolean}
				 */
		        this._iterating = false;
		        /**
				 *  The memory of the timeline, i.e.
				 *  how many events in the past it will retain
				 *  @type {Positive}
				 */
		        this.memory = options.memory;
		    };
		    Tone.extend(Tone.Timeline);
		    /**
			 *  the default parameters
			 *  @static
			 *  @const
			 */
		    Tone.Timeline.defaults = { 'memory': Infinity };
		    /**
			 *  The number of items in the timeline.
			 *  @type {Number}
			 *  @memberOf Tone.Timeline#
			 *  @name length
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Timeline.prototype, 'length', {
		        get: function () {
		            return this._timeline.length;
		        }
		    });
		    /**
			 *  Insert an event object onto the timeline. Events must have a "time" attribute.
			 *  @param  {Object}  event  The event object to insert into the 
			 *                           timeline. 
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.addEvent = function (event) {
		        //the event needs to have a time attribute
		        if (this.isUndef(event.time)) {
		            throw new Error('events must have a time attribute');
		        }
		        event.time = this.toSeconds(event.time);
		        if (this._timeline.length) {
		            var index = this._search(event.time);
		            this._timeline.splice(index + 1, 0, event);
		        } else {
		            this._timeline.push(event);
		        }
		        //if the length is more than the memory, remove the previous ones
		        if (this.length > this.memory) {
		            var diff = this.length - this.memory;
		            this._timeline.splice(0, diff);
		        }
		        return this;
		    };
		    /**
			 *  Remove an event from the timeline.
			 *  @param  {Object}  event  The event object to remove from the list.
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.removeEvent = function (event) {
		        if (this._iterating) {
		            this._toRemove.push(event);
		        } else {
		            var index = this._timeline.indexOf(event);
		            if (index !== -1) {
		                this._timeline.splice(index, 1);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Get the event whose time is less than or equal to the given time.
			 *  @param  {Number}  time  The time to query.
			 *  @returns {Object} The event object set after that time.
			 */
		    Tone.Timeline.prototype.getEvent = function (time) {
		        time = this.toSeconds(time);
		        var index = this._search(time);
		        if (index !== -1) {
		            return this._timeline[index];
		        } else {
		            return null;
		        }
		    };
		    /**
			 *  Get the event which is scheduled after the given time.
			 *  @param  {Number}  time  The time to query.
			 *  @returns {Object} The event object after the given time
			 */
		    Tone.Timeline.prototype.getEventAfter = function (time) {
		        time = this.toSeconds(time);
		        var index = this._search(time);
		        if (index + 1 < this._timeline.length) {
		            return this._timeline[index + 1];
		        } else {
		            return null;
		        }
		    };
		    /**
			 *  Get the event before the event at the given time.
			 *  @param  {Number}  time  The time to query.
			 *  @returns {Object} The event object before the given time
			 */
		    Tone.Timeline.prototype.getEventBefore = function (time) {
		        time = this.toSeconds(time);
		        var index = this._search(time);
		        if (index - 1 >= 0) {
		            return this._timeline[index - 1];
		        } else {
		            return null;
		        }
		    };
		    /**
			 *  Cancel events after the given time
			 *  @param  {Time}  time  The time to query.
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.cancel = function (after) {
		        if (this._timeline.length > 1) {
		            after = this.toSeconds(after);
		            var index = this._search(after);
		            if (index >= 0) {
		                this._timeline = this._timeline.slice(0, index);
		            } else {
		                this._timeline = [];
		            }
		        } else if (this._timeline.length === 1) {
		            //the first item's time
		            if (this._timeline[0].time >= after) {
		                this._timeline = [];
		            }
		        }
		        return this;
		    };
		    /**
			 *  Cancel events before or equal to the given time.
			 *  @param  {Time}  time  The time to cancel before.
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.cancelBefore = function (time) {
		        if (this._timeline.length) {
		            time = this.toSeconds(time);
		            var index = this._search(time);
		            if (index >= 0) {
		                this._timeline = this._timeline.slice(index + 1);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Does a binary serach on the timeline array and returns the 
			 *  event which is after or equal to the time.
			 *  @param  {Number}  time  
			 *  @return  {Number} the index in the timeline array 
			 *  @private
			 */
		    Tone.Timeline.prototype._search = function (time) {
		        var beginning = 0;
		        var len = this._timeline.length;
		        var end = len;
		        // continue searching while [imin,imax] is not empty
		        while (beginning <= end && beginning < len) {
		            // calculate the midpoint for roughly equal partition
		            var midPoint = Math.floor(beginning + (end - beginning) / 2);
		            var event = this._timeline[midPoint];
		            if (event.time === time) {
		                //choose the last one that has the same time
		                for (var i = midPoint; i < this._timeline.length; i++) {
		                    var testEvent = this._timeline[i];
		                    if (testEvent.time === time) {
		                        midPoint = i;
		                    }
		                }
		                return midPoint;
		            } else if (event.time > time) {
		                //search lower
		                end = midPoint - 1;
		            } else if (event.time < time) {
		                //search upper
		                beginning = midPoint + 1;
		            }
		        }
		        return beginning - 1;
		    };
		    /**
			 *  Internal iterator. Applies extra safety checks for 
			 *  removing items from the array. 
			 *  @param  {Function}  callback 
			 *  @param  {Number=}    lowerBound     
			 *  @param  {Number=}    upperBound    
			 *  @private
			 */
		    Tone.Timeline.prototype._iterate = function (callback, lowerBound, upperBound) {
		        this._iterating = true;
		        lowerBound = this.defaultArg(lowerBound, 0);
		        upperBound = this.defaultArg(upperBound, this._timeline.length - 1);
		        for (var i = lowerBound; i <= upperBound; i++) {
		            callback(this._timeline[i]);
		        }
		        this._iterating = false;
		        if (this._toRemove.length > 0) {
		            for (var j = 0; j < this._toRemove.length; j++) {
		                var index = this._timeline.indexOf(this._toRemove[j]);
		                if (index !== -1) {
		                    this._timeline.splice(index, 1);
		                }
		            }
		            this._toRemove = [];
		        }
		    };
		    /**
			 *  Iterate over everything in the array
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.forEach = function (callback) {
		        this._iterate(callback);
		        return this;
		    };
		    /**
			 *  Iterate over everything in the array at or before the given time.
			 *  @param  {Time}  time The time to check if items are before
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.forEachBefore = function (time, callback) {
		        //iterate over the items in reverse so that removing an item doesn't break things
		        time = this.toSeconds(time);
		        var upperBound = this._search(time);
		        if (upperBound !== -1) {
		            this._iterate(callback, 0, upperBound);
		        }
		        return this;
		    };
		    /**
			 *  Iterate over everything in the array after the given time.
			 *  @param  {Time}  time The time to check if items are before
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.forEachAfter = function (time, callback) {
		        //iterate over the items in reverse so that removing an item doesn't break things
		        time = this.toSeconds(time);
		        var lowerBound = this._search(time);
		        this._iterate(callback, lowerBound + 1);
		        return this;
		    };
		    /**
			 *  Iterate over everything in the array at or after the given time. Similar to 
			 *  forEachAfter, but includes the item(s) at the given time.
			 *  @param  {Time}  time The time to check if items are before
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.forEachFrom = function (time, callback) {
		        //iterate over the items in reverse so that removing an item doesn't break things
		        time = this.toSeconds(time);
		        var lowerBound = this._search(time);
		        //work backwards until the event time is less than time
		        while (lowerBound >= 0 && this._timeline[lowerBound].time >= time) {
		            lowerBound--;
		        }
		        this._iterate(callback, lowerBound + 1);
		        return this;
		    };
		    /**
			 *  Iterate over everything in the array at the given time
			 *  @param  {Time}  time The time to check if items are before
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.Timeline} this
			 */
		    Tone.Timeline.prototype.forEachAtTime = function (time, callback) {
		        //iterate over the items in reverse so that removing an item doesn't break things
		        time = this.toSeconds(time);
		        var upperBound = this._search(time);
		        if (upperBound !== -1) {
		            this._iterate(function (event) {
		                if (event.time === time) {
		                    callback(event);
		                }
		            }, 0, upperBound);
		        }
		        return this;
		    };
		    /**
			 *  Clean up.
			 *  @return  {Tone.Timeline}  this
			 */
		    Tone.Timeline.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._timeline = null;
		        this._toRemove = null;
		    };
		    return Tone.Timeline;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A signal which adds the method getValueAtTime. 
			 *         Code and inspiration from https://github.com/jsantell/web-audio-automation-timeline
			 *  @extends {Tone.Param}
			 *  @param {Number=} value The initial value of the signal
			 *  @param {String=} units The conversion units of the signal.
			 */
		    Tone.TimelineSignal = function () {
		        var options = this.optionsObject(arguments, [
		            'value',
		            'units'
		        ], Tone.Signal.defaults);
		        //constructors
		        Tone.Signal.apply(this, options);
		        options.param = this._param;
		        Tone.Param.call(this, options);
		        /**
				 *  The scheduled events
				 *  @type {Tone.Timeline}
				 *  @private
				 */
		        this._events = new Tone.Timeline(10);
		        /**
				 *  The initial scheduled value
				 *  @type {Number}
				 *  @private
				 */
		        this._initial = this._fromUnits(this._param.value);
		    };
		    Tone.extend(Tone.TimelineSignal, Tone.Param);
		    /**
			 *  The event types of a schedulable signal.
			 *  @enum {String}
			 */
		    Tone.TimelineSignal.Type = {
		        Linear: 'linear',
		        Exponential: 'exponential',
		        Target: 'target',
		        Set: 'set'
		    };
		    /**
			 * The current value of the signal. 
			 * @memberOf Tone.TimelineSignal#
			 * @type {Number}
			 * @name value
			 */
		    Object.defineProperty(Tone.TimelineSignal.prototype, 'value', {
		        get: function () {
		            return this._toUnits(this._param.value);
		        },
		        set: function (value) {
		            var convertedVal = this._fromUnits(value);
		            this._initial = convertedVal;
		            this._param.value = convertedVal;
		        }
		    });
		    ///////////////////////////////////////////////////////////////////////////
		    //	SCHEDULING
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Schedules a parameter value change at the given time.
			 *  @param {*}	value The value to set the signal.
			 *  @param {Time}  time The time when the change should occur.
			 *  @returns {Tone.TimelineSignal} this
			 *  @example
			 * //set the frequency to "G4" in exactly 1 second from now. 
			 * freq.setValueAtTime("G4", "+1");
			 */
		    Tone.TimelineSignal.prototype.setValueAtTime = function (value, startTime) {
		        value = this._fromUnits(value);
		        startTime = this.toSeconds(startTime);
		        this._events.addEvent({
		            'type': Tone.TimelineSignal.Type.Set,
		            'value': value,
		            'time': startTime
		        });
		        //invoke the original event
		        this._param.setValueAtTime(value, startTime);
		        return this;
		    };
		    /**
			 *  Schedules a linear continuous change in parameter value from the 
			 *  previous scheduled parameter value to the given value.
			 *  
			 *  @param  {number} value   
			 *  @param  {Time} endTime 
			 *  @returns {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.linearRampToValueAtTime = function (value, endTime) {
		        value = this._fromUnits(value);
		        endTime = this.toSeconds(endTime);
		        this._events.addEvent({
		            'type': Tone.TimelineSignal.Type.Linear,
		            'value': value,
		            'time': endTime
		        });
		        this._param.linearRampToValueAtTime(value, endTime);
		        return this;
		    };
		    /**
			 *  Schedules an exponential continuous change in parameter value from 
			 *  the previous scheduled parameter value to the given value.
			 *  
			 *  @param  {number} value   
			 *  @param  {Time} endTime 
			 *  @returns {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.exponentialRampToValueAtTime = function (value, endTime) {
		        value = this._fromUnits(value);
		        value = Math.max(this._minOutput, value);
		        endTime = this.toSeconds(endTime);
		        this._events.addEvent({
		            'type': Tone.TimelineSignal.Type.Exponential,
		            'value': value,
		            'time': endTime
		        });
		        this._param.exponentialRampToValueAtTime(value, endTime);
		        return this;
		    };
		    /**
			 *  Start exponentially approaching the target value at the given time with
			 *  a rate having the given time constant.
			 *  @param {number} value        
			 *  @param {Time} startTime    
			 *  @param {number} timeConstant 
			 *  @returns {Tone.TimelineSignal} this 
			 */
		    Tone.TimelineSignal.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
		        value = this._fromUnits(value);
		        value = Math.max(this._minOutput, value);
		        timeConstant = Math.max(this._minOutput, timeConstant);
		        startTime = this.toSeconds(startTime);
		        this._events.addEvent({
		            'type': Tone.TimelineSignal.Type.Target,
		            'value': value,
		            'time': startTime,
		            'constant': timeConstant
		        });
		        this._param.setTargetAtTime(value, startTime, timeConstant);
		        return this;
		    };
		    /**
			 *  Cancels all scheduled parameter changes with times greater than or 
			 *  equal to startTime.
			 *  
			 *  @param  {Time} startTime
			 *  @returns {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.cancelScheduledValues = function (after) {
		        this._events.cancel(after);
		        this._param.cancelScheduledValues(this.toSeconds(after));
		        return this;
		    };
		    /**
			 *  Sets the computed value at the given time. This provides
			 *  a point from which a linear or exponential curve
			 *  can be scheduled after. Will cancel events after 
			 *  the given time and shorten the currently scheduled
			 *  linear or exponential ramp so that it ends at `time` .
			 *  This is to avoid discontinuities and clicks in envelopes. 
			 *  @param {Time} time When to set the ramp point
			 *  @returns {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.setRampPoint = function (time) {
		        time = this.toSeconds(time);
		        //get the value at the given time
		        var val = this.getValueAtTime(time);
		        //reschedule the next event to end at the given time
		        var after = this._searchAfter(time);
		        if (after) {
		            //cancel the next event(s)
		            this.cancelScheduledValues(time);
		            if (after.type === Tone.TimelineSignal.Type.Linear) {
		                this.linearRampToValueAtTime(val, time);
		            } else if (after.type === Tone.TimelineSignal.Type.Exponential) {
		                this.exponentialRampToValueAtTime(val, time);
		            }
		        }
		        this.setValueAtTime(val, time);
		        return this;
		    };
		    /**
			 *  Do a linear ramp to the given value between the start and finish times.
			 *  @param {Number} value The value to ramp to.
			 *  @param {Time} start The beginning anchor point to do the linear ramp
			 *  @param {Time} finish The ending anchor point by which the value of
			 *                       the signal will equal the given value.
			 *  @returns {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.linearRampToValueBetween = function (value, start, finish) {
		        this.setRampPoint(start);
		        this.linearRampToValueAtTime(value, finish);
		        return this;
		    };
		    /**
			 *  Do a exponential ramp to the given value between the start and finish times.
			 *  @param {Number} value The value to ramp to.
			 *  @param {Time} start The beginning anchor point to do the exponential ramp
			 *  @param {Time} finish The ending anchor point by which the value of
			 *                       the signal will equal the given value.
			 *  @returns {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.exponentialRampToValueBetween = function (value, start, finish) {
		        this.setRampPoint(start);
		        this.exponentialRampToValueAtTime(value, finish);
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	GETTING SCHEDULED VALUES
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Returns the value before or equal to the given time
			 *  @param  {Number}  time  The time to query
			 *  @return  {Object}  The event at or before the given time.
			 *  @private
			 */
		    Tone.TimelineSignal.prototype._searchBefore = function (time) {
		        return this._events.getEvent(time);
		    };
		    /**
			 *  The event after the given time
			 *  @param  {Number}  time  The time to query.
			 *  @return  {Object}  The next event after the given time
			 *  @private
			 */
		    Tone.TimelineSignal.prototype._searchAfter = function (time) {
		        return this._events.getEventAfter(time);
		    };
		    /**
			 *  Get the scheduled value at the given time. This will
			 *  return the unconverted (raw) value.
			 *  @param  {Number}  time  The time in seconds.
			 *  @return  {Number}  The scheduled value at the given time.
			 */
		    Tone.TimelineSignal.prototype.getValueAtTime = function (time) {
		        var after = this._searchAfter(time);
		        var before = this._searchBefore(time);
		        var value = this._initial;
		        //if it was set by
		        if (before === null) {
		            value = this._initial;
		        } else if (before.type === Tone.TimelineSignal.Type.Target) {
		            var previous = this._events.getEventBefore(before.time);
		            var previouVal;
		            if (previous === null) {
		                previouVal = this._initial;
		            } else {
		                previouVal = previous.value;
		            }
		            value = this._exponentialApproach(before.time, previouVal, before.value, before.constant, time);
		        } else if (after === null) {
		            value = before.value;
		        } else if (after.type === Tone.TimelineSignal.Type.Linear) {
		            value = this._linearInterpolate(before.time, before.value, after.time, after.value, time);
		        } else if (after.type === Tone.TimelineSignal.Type.Exponential) {
		            value = this._exponentialInterpolate(before.time, before.value, after.time, after.value, time);
		        } else {
		            value = before.value;
		        }
		        return value;
		    };
		    /**
			 *  When signals connect to other signals or AudioParams, 
			 *  they take over the output value of that signal or AudioParam. 
			 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
			 *
			 *  @override
			 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
			 *  @param {number} [outputNumber=0] The output number to connect from.
			 *  @param {number} [inputNumber=0] The input number to connect to.
			 *  @returns {Tone.TimelineSignal} this
			 *  @method
			 */
		    Tone.TimelineSignal.prototype.connect = Tone.SignalBase.prototype.connect;
		    ///////////////////////////////////////////////////////////////////////////
		    //	AUTOMATION CURVE CALCULATIONS
		    //	MIT License, copyright (c) 2014 Jordan Santell
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Calculates the the value along the curve produced by setTargetAtTime
			 *  @private
			 */
		    Tone.TimelineSignal.prototype._exponentialApproach = function (t0, v0, v1, timeConstant, t) {
		        return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
		    };
		    /**
			 *  Calculates the the value along the curve produced by linearRampToValueAtTime
			 *  @private
			 */
		    Tone.TimelineSignal.prototype._linearInterpolate = function (t0, v0, t1, v1, t) {
		        return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
		    };
		    /**
			 *  Calculates the the value along the curve produced by exponentialRampToValueAtTime
			 *  @private
			 */
		    Tone.TimelineSignal.prototype._exponentialInterpolate = function (t0, v0, t1, v1, t) {
		        v0 = Math.max(this._minOutput, v0);
		        return v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0));
		    };
		    /**
			 *  Clean up.
			 *  @return {Tone.TimelineSignal} this
			 */
		    Tone.TimelineSignal.prototype.dispose = function () {
		        Tone.Signal.prototype.dispose.call(this);
		        Tone.Param.prototype.dispose.call(this);
		        this._events.dispose();
		        this._events = null;
		    };
		    return Tone.TimelineSignal;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Pow applies an exponent to the incoming signal. The incoming signal
			 *         must be AudioRange.
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @param {Positive} exp The exponent to apply to the incoming signal, must be at least 2. 
			 *  @example
			 * var pow = new Tone.Pow(2);
			 * var sig = new Tone.Signal(0.5).connect(pow);
			 * //output of pow is 0.25. 
			 */
		    Tone.Pow = function (exp) {
		        /**
				 * the exponent
				 * @private
				 * @type {number}
				 */
		        this._exp = this.defaultArg(exp, 1);
		        /**
				 *  @type {WaveShaperNode}
				 *  @private
				 */
		        this._expScaler = this.input = this.output = new Tone.WaveShaper(this._expFunc(this._exp), 8192);
		    };
		    Tone.extend(Tone.Pow, Tone.SignalBase);
		    /**
			 * The value of the exponent.
			 * @memberOf Tone.Pow#
			 * @type {number}
			 * @name value
			 */
		    Object.defineProperty(Tone.Pow.prototype, 'value', {
		        get: function () {
		            return this._exp;
		        },
		        set: function (exp) {
		            this._exp = exp;
		            this._expScaler.setMap(this._expFunc(this._exp));
		        }
		    });
		    /**
			 *  the function which maps the waveshaper
			 *  @param   {number} exp
			 *  @return {function}
			 *  @private
			 */
		    Tone.Pow.prototype._expFunc = function (exp) {
		        return function (val) {
		            return Math.pow(Math.abs(val), exp);
		        };
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Pow} this
			 */
		    Tone.Pow.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._expScaler.dispose();
		        this._expScaler = null;
		        return this;
		    };
		    return Tone.Pow;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Envelope is an [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope)
			 *          envelope generator. Tone.Envelope outputs a signal which 
			 *          can be connected to an AudioParam or Tone.Signal. 
			 *          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/ADSR_parameter.svg">
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {Time} [attack] The amount of time it takes for the envelope to go from 
			 *                         0 to it's maximum value. 
			 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
			 *                       	to fall to the sustain value. 
			 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
			 *                                	the release is triggered. 
			 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0. 
			 *  @example
			 * //an amplitude envelope
			 * var gainNode = Tone.context.createGain();
			 * var env = new Tone.Envelope({
			 * 	"attack" : 0.1,
			 * 	"decay" : 0.2,
			 * 	"sustain" : 1,
			 * 	"release" : 0.8,
			 * });
			 * env.connect(gainNode.gain);
			 */
		    Tone.Envelope = function () {
		        //get all of the defaults
		        var options = this.optionsObject(arguments, [
		            'attack',
		            'decay',
		            'sustain',
		            'release'
		        ], Tone.Envelope.defaults);
		        /** 
				 *  When triggerAttack is called, the attack time is the amount of
				 *  time it takes for the envelope to reach it's maximum value. 
				 *  @type {Time}
				 */
		        this.attack = options.attack;
		        /**
				 *  After the attack portion of the envelope, the value will fall
				 *  over the duration of the decay time to it's sustain value. 
				 *  @type {Time}
				 */
		        this.decay = options.decay;
		        /**
				 * 	The sustain value is the value 
				 * 	which the envelope rests at after triggerAttack is
				 * 	called, but before triggerRelease is invoked. 
				 *  @type {NormalRange}
				 */
		        this.sustain = options.sustain;
		        /**
				 *  After triggerRelease is called, the envelope's
				 *  value will fall to it's miminum value over the
				 *  duration of the release time. 
				 *  @type {Time}
				 */
		        this.release = options.release;
		        /**
				 *  the next time the envelope is at standby
				 *  @type {number}
				 *  @private
				 */
		        this._attackCurve = Tone.Envelope.Type.Linear;
		        /**
				 *  the next time the envelope is at standby
				 *  @type {number}
				 *  @private
				 */
		        this._releaseCurve = Tone.Envelope.Type.Exponential;
		        /**
				 *  the minimum output value
				 *  @type {number}
				 *  @private
				 */
		        this._minOutput = 0.00001;
		        /**
				 *  the signal
				 *  @type {Tone.TimelineSignal}
				 *  @private
				 */
		        this._sig = this.output = new Tone.TimelineSignal();
		        this._sig.setValueAtTime(this._minOutput, 0);
		        //set the attackCurve initially
		        this.attackCurve = options.attackCurve;
		        this.releaseCurve = options.releaseCurve;
		    };
		    Tone.extend(Tone.Envelope);
		    /**
			 *  the default parameters
			 *  @static
			 *  @const
			 */
		    Tone.Envelope.defaults = {
		        'attack': 0.01,
		        'decay': 0.1,
		        'sustain': 0.5,
		        'release': 1,
		        'attackCurve': 'linear',
		        'releaseCurve': 'exponential'
		    };
		    /**
			 *  the envelope time multipler
			 *  @type {number}
			 *  @private
			 */
		    Tone.Envelope.prototype._timeMult = 0.25;
		    /**
			 * Read the current value of the envelope. Useful for 
			 * syncronizing visual output to the envelope. 
			 * @memberOf Tone.Envelope#
			 * @type {Number}
			 * @name value
			 * @readOnly
			 */
		    Object.defineProperty(Tone.Envelope.prototype, 'value', {
		        get: function () {
		            return this._sig.value;
		        }
		    });
		    /**
			 * The slope of the attack. Either "linear" or "exponential". 
			 * @memberOf Tone.Envelope#
			 * @type {string}
			 * @name attackCurve
			 * @example
			 * env.attackCurve = "linear";
			 */
		    Object.defineProperty(Tone.Envelope.prototype, 'attackCurve', {
		        get: function () {
		            return this._attackCurve;
		        },
		        set: function (type) {
		            if (type === Tone.Envelope.Type.Linear || type === Tone.Envelope.Type.Exponential) {
		                this._attackCurve = type;
		            } else {
		                throw Error('attackCurve must be either "linear" or "exponential". Invalid type: ', type);
		            }
		        }
		    });
		    /**
			 * The slope of the Release. Either "linear" or "exponential".
			 * @memberOf Tone.Envelope#
			 * @type {string}
			 * @name releaseCurve
			 * @example
			 * env.releaseCurve = "linear";
			 */
		    Object.defineProperty(Tone.Envelope.prototype, 'releaseCurve', {
		        get: function () {
		            return this._releaseCurve;
		        },
		        set: function (type) {
		            if (type === Tone.Envelope.Type.Linear || type === Tone.Envelope.Type.Exponential) {
		                this._releaseCurve = type;
		            } else {
		                throw Error('releaseCurve must be either "linear" or "exponential". Invalid type: ', type);
		            }
		        }
		    });
		    /**
			 *  Trigger the attack/decay portion of the ADSR envelope. 
			 *  @param  {Time} [time=now] When the attack should start.
			 *  @param {NormalRange} [velocity=1] The velocity of the envelope scales the vales.
			 *                               number between 0-1
			 *  @returns {Tone.Envelope} this
			 *  @example
			 *  //trigger the attack 0.5 seconds from now with a velocity of 0.2
			 *  env.triggerAttack("+0.5", 0.2);
			 */
		    Tone.Envelope.prototype.triggerAttack = function (time, velocity) {
		        //to seconds
		        var now = this.now() + this.blockTime;
		        time = this.toSeconds(time, now);
		        var attack = this.toSeconds(this.attack) + time;
		        var decay = this.toSeconds(this.decay);
		        velocity = this.defaultArg(velocity, 1);
		        //attack
		        if (this._attackCurve === Tone.Envelope.Type.Linear) {
		            this._sig.linearRampToValueBetween(velocity, time, attack);
		        } else {
		            this._sig.exponentialRampToValueBetween(velocity, time, attack);
		        }
		        //decay
		        this._sig.setValueAtTime(velocity, attack);
		        this._sig.exponentialRampToValueAtTime(this.sustain * velocity, attack + decay);
		        return this;
		    };
		    /**
			 *  Triggers the release of the envelope.
			 *  @param  {Time} [time=now] When the release portion of the envelope should start. 
			 *  @returns {Tone.Envelope} this
			 *  @example
			 *  //trigger release immediately
			 *  env.triggerRelease();
			 */
		    Tone.Envelope.prototype.triggerRelease = function (time) {
		        var now = this.now() + this.blockTime;
		        time = this.toSeconds(time, now);
		        var release = this.toSeconds(this.release);
		        if (this._releaseCurve === Tone.Envelope.Type.Linear) {
		            this._sig.linearRampToValueBetween(this._minOutput, time, time + release);
		        } else {
		            this._sig.exponentialRampToValueBetween(this._minOutput, time, release + time);
		        }
		        return this;
		    };
		    /**
			 *  triggerAttackRelease is shorthand for triggerAttack, then waiting
			 *  some duration, then triggerRelease. 
			 *  @param {Time} duration The duration of the sustain.
			 *  @param {Time} [time=now] When the attack should be triggered.
			 *  @param {number} [velocity=1] The velocity of the envelope. 
			 *  @returns {Tone.Envelope} this
			 *  @example
			 * //trigger the attack and then the release after 0.6 seconds.
			 * env.triggerAttackRelease(0.6);
			 */
		    Tone.Envelope.prototype.triggerAttackRelease = function (duration, time, velocity) {
		        time = this.toSeconds(time);
		        this.triggerAttack(time, velocity);
		        this.triggerRelease(time + this.toSeconds(duration));
		        return this;
		    };
		    /**
			 *  Borrows the connect method from Tone.Signal. 
			 *  @function
			 *  @private
			 */
		    Tone.Envelope.prototype.connect = Tone.Signal.prototype.connect;
		    /**
			 *  Disconnect and dispose.
			 *  @returns {Tone.Envelope} this
			 */
		    Tone.Envelope.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._sig.dispose();
		        this._sig = null;
		        return this;
		    };
		    /**
			 *  The phase of the envelope. 
			 *  @enum {string}
			 */
		    Tone.Envelope.Phase = {
		        Attack: 'attack',
		        Decay: 'decay',
		        Sustain: 'sustain',
		        Release: 'release',
		        Standby: 'standby'
		    };
		    /**
			 *  The phase of the envelope. 
			 *  @enum {string}
			 */
		    Tone.Envelope.Type = {
		        Linear: 'linear',
		        Exponential: 'exponential'
		    };
		    return Tone.Envelope;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.AmplitudeEnvelope is a Tone.Envelope connected to a gain node. 
			 *          Unlike Tone.Envelope, which outputs the envelope's value, Tone.AmplitudeEnvelope accepts
			 *          an audio signal as the input and will apply the envelope to the amplitude
			 *          of the signal. Read more about ADSR Envelopes on [Wikipedia](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope).
			 *  
			 *  @constructor
			 *  @extends {Tone.Envelope}
			 *  @param {Time|Object} [attack] The amount of time it takes for the envelope to go from 
			 *                               0 to it's maximum value. 
			 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
			 *                       	to fall to the sustain value. 
			 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
			 *                                	the release is triggered. 
			 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0. 
			 *  @example
			 * var ampEnv = new Tone.AmplitudeEnvelope({
			 * 	"attack": 0.1,
			 * 	"decay": 0.2,
			 * 	"sustain": 1.0,
			 * 	"release": 0.8
			 * }).toMaster();
			 * //create an oscillator and connect it
			 * var osc = new Tone.Oscillator().connect(ampEnv).start();
			 * //trigger the envelopes attack and release "8t" apart
			 * ampEnv.triggerAttackRelease("8t");
			 */
		    Tone.AmplitudeEnvelope = function () {
		        Tone.Envelope.apply(this, arguments);
		        /**
				 *  the input node
				 *  @type {GainNode}
				 *  @private
				 */
		        this.input = this.output = new Tone.Gain();
		        this._sig.connect(this.output.gain);
		    };
		    Tone.extend(Tone.AmplitudeEnvelope, Tone.Envelope);
		    /**
			 *  Clean up
			 *  @return  {Tone.AmplitudeEnvelope}  this
			 */
		    Tone.AmplitudeEnvelope.prototype.dispose = function () {
		        this.input.dispose();
		        this.input = null;
		        Tone.Envelope.prototype.dispose.call(this);
		        return this;
		    };
		    return Tone.AmplitudeEnvelope;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Wrapper around the native Web Audio's 
			 *          [AnalyserNode](http://webaudio.github.io/web-audio-api/#idl-def-AnalyserNode).
			 *          Extracts FFT or Waveform data from the incoming signal.
			 *  @extends {Tone}
			 *  @param {Number=} size The size of the FFT. Value must be a power of 
			 *                       two in the range 32 to 32768.
			 *  @param {String=} type The return type of the analysis, either "fft", or "waveform". 
			 */
		    Tone.Analyser = function () {
		        var options = this.optionsObject(arguments, [
		            'size',
		            'type'
		        ], Tone.Analyser.defaults);
		        /**
				 *  The analyser node.
				 *  @private
				 *  @type {AnalyserNode}
				 */
		        this._analyser = this.input = this.context.createAnalyser();
		        /**
				 *  The analysis type
				 *  @type {String}
				 *  @private
				 */
		        this._type = options.type;
		        /**
				 *  The return type of the analysis
				 *  @type {String}
				 *  @private
				 */
		        this._returnType = options.returnType;
		        /**
				 *  The buffer that the FFT data is written to
				 *  @type {TypedArray}
				 *  @private
				 */
		        this._buffer = null;
		        //set the values initially
		        this.size = options.size;
		        this.type = options.type;
		        this.returnType = options.returnType;
		        this.minDecibels = options.minDecibels;
		        this.maxDecibels = options.maxDecibels;
		    };
		    Tone.extend(Tone.Analyser);
		    /**
			 *  The default values.
			 *  @type {Object}
			 *  @const
			 */
		    Tone.Analyser.defaults = {
		        'size': 2048,
		        'returnType': 'byte',
		        'type': 'fft',
		        'smoothing': 0.8,
		        'maxDecibels': -30,
		        'minDecibels': -100
		    };
		    /**
			 *  Possible return types of Tone.Analyser.value
			 *  @enum {String}
			 */
		    Tone.Analyser.Type = {
		        Waveform: 'waveform',
		        FFT: 'fft'
		    };
		    /**
			 *  Possible return types of Tone.Analyser.value
			 *  @enum {String}
			 */
		    Tone.Analyser.ReturnType = {
		        Byte: 'byte',
		        Float: 'float'
		    };
		    /**
			 *  Run the analysis given the current settings and return the 
			 *  result as a TypedArray. 
			 *  @returns {TypedArray}
			 */
		    Tone.Analyser.prototype.analyse = function () {
		        if (this._type === Tone.Analyser.Type.FFT) {
		            if (this._returnType === Tone.Analyser.ReturnType.Byte) {
		                this._analyser.getByteFrequencyData(this._buffer);
		            } else {
		                this._analyser.getFloatFrequencyData(this._buffer);
		            }
		        } else if (this._type === Tone.Analyser.Type.Waveform) {
		            if (this._returnType === Tone.Analyser.ReturnType.Byte) {
		                this._analyser.getByteTimeDomainData(this._buffer);
		            } else {
		                this._analyser.getFloatTimeDomainData(this._buffer);
		            }
		        }
		        return this._buffer;
		    };
		    /**
			 *  The size of analysis. This must be a power of two in the range 32 to 32768.
			 *  @memberOf Tone.Analyser#
			 *  @type {Number}
			 *  @name size
			 */
		    Object.defineProperty(Tone.Analyser.prototype, 'size', {
		        get: function () {
		            return this._analyser.frequencyBinCount;
		        },
		        set: function (size) {
		            this._analyser.fftSize = size * 2;
		            this.type = this._type;
		        }
		    });
		    /**
			 *  The return type of Tone.Analyser.value, either "byte" or "float". 
			 *  When the type is set to "byte" the range of values returned in the array
			 *  are between 0-255, when set to "float" the values are between 0-1. 
			 *  @memberOf Tone.Analyser#
			 *  @type {String}
			 *  @name type
			 */
		    Object.defineProperty(Tone.Analyser.prototype, 'returnType', {
		        get: function () {
		            return this._returnType;
		        },
		        set: function (type) {
		            if (type === Tone.Analyser.ReturnType.Byte) {
		                this._buffer = new Uint8Array(this._analyser.frequencyBinCount);
		            } else if (type === Tone.Analyser.ReturnType.Float) {
		                this._buffer = new Float32Array(this._analyser.frequencyBinCount);
		            } else {
		                throw new Error('Invalid Return Type: ' + type);
		            }
		            this._returnType = type;
		        }
		    });
		    /**
			 *  The analysis function returned by Tone.Analyser.value, either "fft" or "waveform". 
			 *  @memberOf Tone.Analyser#
			 *  @type {String}
			 *  @name type
			 */
		    Object.defineProperty(Tone.Analyser.prototype, 'type', {
		        get: function () {
		            return this._type;
		        },
		        set: function (type) {
		            if (type !== Tone.Analyser.Type.Waveform && type !== Tone.Analyser.Type.FFT) {
		                throw new Error('Invalid Type: ' + type);
		            }
		            this._type = type;
		        }
		    });
		    /**
			 *  0 represents no time averaging with the last analysis frame.
			 *  @memberOf Tone.Analyser#
			 *  @type {NormalRange}
			 *  @name smoothing
			 */
		    Object.defineProperty(Tone.Analyser.prototype, 'smoothing', {
		        get: function () {
		            return this._analyser.smoothingTimeConstant;
		        },
		        set: function (val) {
		            this._analyser.smoothingTimeConstant = val;
		        }
		    });
		    /**
			 *  The smallest decibel value which is analysed by the FFT. 
			 *  @memberOf Tone.Analyser#
			 *  @type {Decibels}
			 *  @name minDecibels
			 */
		    Object.defineProperty(Tone.Analyser.prototype, 'minDecibels', {
		        get: function () {
		            return this._analyser.minDecibels;
		        },
		        set: function (val) {
		            this._analyser.minDecibels = val;
		        }
		    });
		    /**
			 *  The largest decibel value which is analysed by the FFT. 
			 *  @memberOf Tone.Analyser#
			 *  @type {Decibels}
			 *  @name maxDecibels
			 */
		    Object.defineProperty(Tone.Analyser.prototype, 'maxDecibels', {
		        get: function () {
		            return this._analyser.maxDecibels;
		        },
		        set: function (val) {
		            this._analyser.maxDecibels = val;
		        }
		    });
		    /**
			 *  Clean up.
			 *  @return  {Tone.Analyser}  this
			 */
		    Tone.Analyser.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._analyser.disconnect();
		        this._analyser = null;
		        this._buffer = null;
		    };
		    return Tone.Analyser;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Compressor is a thin wrapper around the Web Audio 
			 *         [DynamicsCompressorNode](http://webaudio.github.io/web-audio-api/#the-dynamicscompressornode-interface).
			 *         Compression reduces the volume of loud sounds or amplifies quiet sounds 
			 *         by narrowing or "compressing" an audio signal's dynamic range. 
			 *         Read more on [Wikipedia](https://en.wikipedia.org/wiki/Dynamic_range_compression).
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {Decibels|Object} [threshold] The value above which the compression starts to be applied.
			 *  @param {Positive} [ratio] The gain reduction ratio.
			 *  @example
			 * var comp = new Tone.Compressor(-30, 3);
			 */
		    Tone.Compressor = function () {
		        var options = this.optionsObject(arguments, [
		            'threshold',
		            'ratio'
		        ], Tone.Compressor.defaults);
		        /**
				 *  the compressor node
				 *  @type {DynamicsCompressorNode}
				 *  @private
				 */
		        this._compressor = this.input = this.output = this.context.createDynamicsCompressor();
		        /**
				 *  the threshold vaue
				 *  @type {Decibels}
				 *  @signal
				 */
		        this.threshold = this._compressor.threshold;
		        /**
				 *  The attack parameter
				 *  @type {Time}
				 *  @signal
				 */
		        this.attack = new Tone.Param(this._compressor.attack, Tone.Type.Time);
		        /**
				 *  The release parameter
				 *  @type {Time}
				 *  @signal
				 */
		        this.release = new Tone.Param(this._compressor.release, Tone.Type.Time);
		        /**
				 *  The knee parameter
				 *  @type {Decibels}
				 *  @signal
				 */
		        this.knee = this._compressor.knee;
		        /**
				 *  The ratio value
				 *  @type {Number}
				 *  @signal
				 */
		        this.ratio = this._compressor.ratio;
		        //set the defaults
		        this._readOnly([
		            'knee',
		            'release',
		            'attack',
		            'ratio',
		            'threshold'
		        ]);
		        this.set(options);
		    };
		    Tone.extend(Tone.Compressor);
		    /**
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Compressor.defaults = {
		        'ratio': 12,
		        'threshold': -24,
		        'release': 0.25,
		        'attack': 0.003,
		        'knee': 30
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.Compressor} this
			 */
		    Tone.Compressor.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'knee',
		            'release',
		            'attack',
		            'ratio',
		            'threshold'
		        ]);
		        this._compressor.disconnect();
		        this._compressor = null;
		        this.attack.dispose();
		        this.attack = null;
		        this.release.dispose();
		        this.release = null;
		        this.threshold = null;
		        this.ratio = null;
		        this.knee = null;
		        return this;
		    };
		    return Tone.Compressor;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Add a signal and a number or two signals. When no value is
			 *         passed into the constructor, Tone.Add will sum <code>input[0]</code>
			 *         and <code>input[1]</code>. If a value is passed into the constructor, 
			 *         the it will be added to the input.
			 *  
			 *  @constructor
			 *  @extends {Tone.Signal}
			 *  @param {number=} value If no value is provided, Tone.Add will sum the first
			 *                         and second inputs. 
			 *  @example
			 * var signal = new Tone.Signal(2);
			 * var add = new Tone.Add(2);
			 * signal.connect(add);
			 * //the output of add equals 4
			 *  @example
			 * //if constructed with no arguments
			 * //it will add the first and second inputs
			 * var add = new Tone.Add();
			 * var sig0 = new Tone.Signal(3).connect(add, 0, 0);
			 * var sig1 = new Tone.Signal(4).connect(add, 0, 1);
			 * //the output of add equals 7. 
			 */
		    Tone.Add = function (value) {
		        Tone.call(this, 2, 0);
		        /**
				 *  the summing node
				 *  @type {GainNode}
				 *  @private
				 */
		        this._sum = this.input[0] = this.input[1] = this.output = this.context.createGain();
		        /**
				 *  @private
				 *  @type {Tone.Signal}
				 */
		        this._param = this.input[1] = new Tone.Signal(value);
		        this._param.connect(this._sum);
		    };
		    Tone.extend(Tone.Add, Tone.Signal);
		    /**
			 *  Clean up.
			 *  @returns {Tone.Add} this
			 */
		    Tone.Add.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._sum.disconnect();
		        this._sum = null;
		        this._param.dispose();
		        this._param = null;
		        return this;
		    };
		    return Tone.Add;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Multiply two incoming signals. Or, if a number is given in the constructor, 
			 *          multiplies the incoming signal by that value. 
			 *
			 *  @constructor
			 *  @extends {Tone.Signal}
			 *  @param {number=} value Constant value to multiple. If no value is provided,
			 *                         it will return the product of the first and second inputs
			 *  @example
			 * var mult = new Tone.Multiply();
			 * var sigA = new Tone.Signal(3);
			 * var sigB = new Tone.Signal(4);
			 * sigA.connect(mult, 0, 0);
			 * sigB.connect(mult, 0, 1);
			 * //output of mult is 12.
			 *  @example
			 * var mult = new Tone.Multiply(10);
			 * var sig = new Tone.Signal(2).connect(mult);
			 * //the output of mult is 20. 
			 */
		    Tone.Multiply = function (value) {
		        Tone.call(this, 2, 0);
		        /**
				 *  the input node is the same as the output node
				 *  it is also the GainNode which handles the scaling of incoming signal
				 *  
				 *  @type {GainNode}
				 *  @private
				 */
		        this._mult = this.input[0] = this.output = this.context.createGain();
		        /**
				 *  the scaling parameter
				 *  @type {AudioParam}
				 *  @private
				 */
		        this._param = this.input[1] = this.output.gain;
		        this._param.value = this.defaultArg(value, 0);
		    };
		    Tone.extend(Tone.Multiply, Tone.Signal);
		    /**
			 *  clean up
			 *  @returns {Tone.Multiply} this
			 */
		    Tone.Multiply.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._mult.disconnect();
		        this._mult = null;
		        this._param = null;
		        return this;
		    };
		    return Tone.Multiply;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Negate the incoming signal. i.e. an input signal of 10 will output -10
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @example
			 * var neg = new Tone.Negate();
			 * var sig = new Tone.Signal(-2).connect(neg);
			 * //output of neg is positive 2. 
			 */
		    Tone.Negate = function () {
		        /**
				 *  negation is done by multiplying by -1
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._multiply = this.input = this.output = new Tone.Multiply(-1);
		    };
		    Tone.extend(Tone.Negate, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.Negate} this
			 */
		    Tone.Negate.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._multiply.dispose();
		        this._multiply = null;
		        return this;
		    };
		    return Tone.Negate;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Subtract the signal connected to <code>input[1]</code> from the signal connected 
			 *         to <code>input[0]</code>. If an argument is provided in the constructor, the 
			 *         signals <code>.value</code> will be subtracted from the incoming signal.
			 *
			 *  @extends {Tone.Signal}
			 *  @constructor
			 *  @param {number=} value The value to subtract from the incoming signal. If the value
			 *                         is omitted, it will subtract the second signal from the first.
			 *  @example
			 * var sub = new Tone.Subtract(1);
			 * var sig = new Tone.Signal(4).connect(sub);
			 * //the output of sub is 3. 
			 *  @example
			 * var sub = new Tone.Subtract();
			 * var sigA = new Tone.Signal(10);
			 * var sigB = new Tone.Signal(2.5);
			 * sigA.connect(sub, 0, 0);
			 * sigB.connect(sub, 0, 1);
			 * //output of sub is 7.5
			 */
		    Tone.Subtract = function (value) {
		        Tone.call(this, 2, 0);
		        /**
				 *  the summing node
				 *  @type {GainNode}
				 *  @private
				 */
		        this._sum = this.input[0] = this.output = this.context.createGain();
		        /**
				 *  negate the input of the second input before connecting it
				 *  to the summing node.
				 *  @type {Tone.Negate}
				 *  @private
				 */
		        this._neg = new Tone.Negate();
		        /**
				 *  the node where the value is set
				 *  @private
				 *  @type {Tone.Signal}
				 */
		        this._param = this.input[1] = new Tone.Signal(value);
		        this._param.chain(this._neg, this._sum);
		    };
		    Tone.extend(Tone.Subtract, Tone.Signal);
		    /**
			 *  Clean up.
			 *  @returns {Tone.SignalBase} this
			 */
		    Tone.Subtract.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._neg.dispose();
		        this._neg = null;
		        this._sum.disconnect();
		        this._sum = null;
		        this._param.dispose();
		        this._param = null;
		        return this;
		    };
		    return Tone.Subtract;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  GreaterThanZero outputs 1 when the input is strictly greater than zero
			 *  
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @example
			 * var gt0 = new Tone.GreaterThanZero();
			 * var sig = new Tone.Signal(0.01).connect(gt0);
			 * //the output of gt0 is 1. 
			 * sig.value = 0;
			 * //the output of gt0 is 0. 
			 */
		    Tone.GreaterThanZero = function () {
		        /**
				 *  @type {Tone.WaveShaper}
				 *  @private
				 */
		        this._thresh = this.output = new Tone.WaveShaper(function (val) {
		            if (val <= 0) {
		                return 0;
		            } else {
		                return 1;
		            }
		        });
		        /**
				 *  scale the first thresholded signal by a large value.
				 *  this will help with values which are very close to 0
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._scale = this.input = new Tone.Multiply(10000);
		        //connections
		        this._scale.connect(this._thresh);
		    };
		    Tone.extend(Tone.GreaterThanZero, Tone.SignalBase);
		    /**
			 *  dispose method
			 *  @returns {Tone.GreaterThanZero} this
			 */
		    Tone.GreaterThanZero.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._scale.dispose();
		        this._scale = null;
		        this._thresh.dispose();
		        this._thresh = null;
		        return this;
		    };
		    return Tone.GreaterThanZero;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  EqualZero outputs 1 when the input is equal to 
			 *          0 and outputs 0 otherwise. 
			 *  
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @example
			 * var eq0 = new Tone.EqualZero();
			 * var sig = new Tone.Signal(0).connect(eq0);
			 * //the output of eq0 is 1. 
			 */
		    Tone.EqualZero = function () {
		        /**
				 *  scale the incoming signal by a large factor
				 *  @private
				 *  @type {Tone.Multiply}
				 */
		        this._scale = this.input = new Tone.Multiply(10000);
		        /**
				 *  @type {Tone.WaveShaper}
				 *  @private
				 */
		        this._thresh = new Tone.WaveShaper(function (val) {
		            if (val === 0) {
		                return 1;
		            } else {
		                return 0;
		            }
		        }, 128);
		        /**
				 *  threshold the output so that it's 0 or 1
				 *  @type {Tone.GreaterThanZero}
				 *  @private
				 */
		        this._gtz = this.output = new Tone.GreaterThanZero();
		        //connections
		        this._scale.chain(this._thresh, this._gtz);
		    };
		    Tone.extend(Tone.EqualZero, Tone.SignalBase);
		    /**
			 *  Clean up.
			 *  @returns {Tone.EqualZero} this
			 */
		    Tone.EqualZero.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._gtz.dispose();
		        this._gtz = null;
		        this._scale.dispose();
		        this._scale = null;
		        this._thresh.dispose();
		        this._thresh = null;
		        return this;
		    };
		    return Tone.EqualZero;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Output 1 if the signal is equal to the value, otherwise outputs 0. 
			 *          Can accept two signals if connected to inputs 0 and 1.
			 *  
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {number=} value The number to compare the incoming signal to
			 *  @example
			 * var eq = new Tone.Equal(3);
			 * var sig = new Tone.Signal(3).connect(eq);
			 * //the output of eq is 1. 
			 */
		    Tone.Equal = function (value) {
		        Tone.call(this, 2, 0);
		        /**
				 *  subtract the value from the incoming signal
				 *  
				 *  @type {Tone.Add}
				 *  @private
				 */
		        this._sub = this.input[0] = new Tone.Subtract(value);
		        /**
				 *  @type {Tone.EqualZero}
				 *  @private
				 */
		        this._equals = this.output = new Tone.EqualZero();
		        this._sub.connect(this._equals);
		        this.input[1] = this._sub.input[1];
		    };
		    Tone.extend(Tone.Equal, Tone.SignalBase);
		    /**
			 * The value to compare to the incoming signal.
			 * @memberOf Tone.Equal#
			 * @type {number}
			 * @name value
			 */
		    Object.defineProperty(Tone.Equal.prototype, 'value', {
		        get: function () {
		            return this._sub.value;
		        },
		        set: function (value) {
		            this._sub.value = value;
		        }
		    });
		    /**
			 *  Clean up.
			 *  @returns {Tone.Equal} this
			 */
		    Tone.Equal.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._equals.dispose();
		        this._equals = null;
		        this._sub.dispose();
		        this._sub = null;
		        return this;
		    };
		    return Tone.Equal;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Select between any number of inputs, sending the one 
			 *         selected by the gate signal to the output
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {number} [sourceCount=2] the number of inputs the switch accepts
			 *  @example
			 * var sel = new Tone.Select(2);
			 * var sigA = new Tone.Signal(10).connect(sel, 0, 0);
			 * var sigB = new Tone.Signal(20).connect(sel, 0, 1);
			 * sel.gate.value = 0;
			 * //sel outputs 10 (the value of sigA);
			 * sel.gate.value = 1;
			 * //sel outputs 20 (the value of sigB);
			 */
		    Tone.Select = function (sourceCount) {
		        sourceCount = this.defaultArg(sourceCount, 2);
		        Tone.call(this, sourceCount, 1);
		        /**
				 *  the control signal
				 *  @type {Number}
				 *  @signal
				 */
		        this.gate = new Tone.Signal(0);
		        this._readOnly('gate');
		        //make all the inputs and connect them
		        for (var i = 0; i < sourceCount; i++) {
		            var switchGate = new SelectGate(i);
		            this.input[i] = switchGate;
		            this.gate.connect(switchGate.selecter);
		            switchGate.connect(this.output);
		        }
		    };
		    Tone.extend(Tone.Select, Tone.SignalBase);
		    /**
			 *  Open a specific input and close the others.
			 *  @param {number} which The gate to open. 
			 *  @param {Time} [time=now] The time when the switch will open
			 *  @returns {Tone.Select} this
			 *  @example
			 * //open input 1 in a half second from now
			 * sel.select(1, "+0.5");
			 */
		    Tone.Select.prototype.select = function (which, time) {
		        //make sure it's an integer
		        which = Math.floor(which);
		        this.gate.setValueAtTime(which, this.toSeconds(time));
		        return this;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Select} this
			 */
		    Tone.Select.prototype.dispose = function () {
		        this._writable('gate');
		        this.gate.dispose();
		        this.gate = null;
		        for (var i = 0; i < this.input.length; i++) {
		            this.input[i].dispose();
		            this.input[i] = null;
		        }
		        Tone.prototype.dispose.call(this);
		        return this;
		    };
		    ////////////START HELPER////////////
		    /**
			 *  helper class for Tone.Select representing a single gate
			 *  @constructor
			 *  @extends {Tone}
			 *  @private
			 */
		    var SelectGate = function (num) {
		        /**
				 *  the selector
				 *  @type {Tone.Equal}
				 */
		        this.selecter = new Tone.Equal(num);
		        /**
				 *  the gate
				 *  @type {GainNode}
				 */
		        this.gate = this.input = this.output = this.context.createGain();
		        //connect the selecter to the gate gain
		        this.selecter.connect(this.gate.gain);
		    };
		    Tone.extend(SelectGate);
		    /**
			 *  clean up
			 *  @private
			 */
		    SelectGate.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this.selecter.dispose();
		        this.gate.disconnect();
		        this.selecter = null;
		        this.gate = null;
		    };
		    ////////////END HELPER////////////
		    //return Tone.Select
		    return Tone.Select;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class IfThenElse has three inputs. When the first input (if) is true (i.e. === 1), 
			 *         then it will pass the second input (then) through to the output, otherwise, 
			 *         if it's not true (i.e. === 0) then it will pass the third input (else) 
			 *         through to the output. 
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @example
			 * var ifThenElse = new Tone.IfThenElse();
			 * var ifSignal = new Tone.Signal(1).connect(ifThenElse.if);
			 * var pwmOsc = new Tone.PWMOscillator().connect(ifThenElse.then);
			 * var pulseOsc = new Tone.PulseOscillator().connect(ifThenElse.else);
			 * //ifThenElse outputs pwmOsc
			 * signal.value = 0;
			 * //now ifThenElse outputs pulseOsc
			 */
		    Tone.IfThenElse = function () {
		        Tone.call(this, 3, 0);
		        /**
				 *  the selector node which is responsible for the routing
				 *  @type {Tone.Select}
				 *  @private
				 */
		        this._selector = this.output = new Tone.Select(2);
		        //the input mapping
		        this.if = this.input[0] = this._selector.gate;
		        this.then = this.input[1] = this._selector.input[1];
		        this.else = this.input[2] = this._selector.input[0];
		    };
		    Tone.extend(Tone.IfThenElse, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.IfThenElse} this
			 */
		    Tone.IfThenElse.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._selector.dispose();
		        this._selector = null;
		        this.if = null;
		        this.then = null;
		        this.else = null;
		        return this;
		    };
		    return Tone.IfThenElse;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class [OR](https://en.wikipedia.org/wiki/OR_gate)
			 *         the inputs together. True if at least one of the inputs is true. 
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @param {number} [inputCount=2] the input count
			 *  @example
			 * var or = new Tone.OR(2);
			 * var sigA = new Tone.Signal(0)connect(or, 0, 0);
			 * var sigB = new Tone.Signal(1)connect(or, 0, 1);
			 * //output of or is 1 because at least
			 * //one of the inputs is equal to 1. 
			 */
		    Tone.OR = function (inputCount) {
		        inputCount = this.defaultArg(inputCount, 2);
		        Tone.call(this, inputCount, 0);
		        /**
				 *  a private summing node
				 *  @type {GainNode}
				 *  @private
				 */
		        this._sum = this.context.createGain();
		        /**
				 *  @type {Tone.Equal}
				 *  @private
				 */
		        this._gtz = this.output = new Tone.GreaterThanZero();
		        //make each of the inputs an alias
		        for (var i = 0; i < inputCount; i++) {
		            this.input[i] = this._sum;
		        }
		        this._sum.connect(this._gtz);
		    };
		    Tone.extend(Tone.OR, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.OR} this
			 */
		    Tone.OR.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._gtz.dispose();
		        this._gtz = null;
		        this._sum.disconnect();
		        this._sum = null;
		        return this;
		    };
		    return Tone.OR;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class [AND](https://en.wikipedia.org/wiki/Logical_conjunction)
			 *         returns 1 when all the inputs are equal to 1 and returns 0 otherwise.
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @param {number} [inputCount=2] the number of inputs. NOTE: all inputs are
			 *                                 connected to the single AND input node
			 *  @example
			 * var and = new Tone.AND(2);
			 * var sigA = new Tone.Signal(0).connect(and, 0, 0);
			 * var sigB = new Tone.Signal(1).connect(and, 0, 1);
			 * //the output of and is 0. 
			 */
		    Tone.AND = function (inputCount) {
		        inputCount = this.defaultArg(inputCount, 2);
		        Tone.call(this, inputCount, 0);
		        /**
				 *  @type {Tone.Equal}
				 *  @private
				 */
		        this._equals = this.output = new Tone.Equal(inputCount);
		        //make each of the inputs an alias
		        for (var i = 0; i < inputCount; i++) {
		            this.input[i] = this._equals;
		        }
		    };
		    Tone.extend(Tone.AND, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.AND} this
			 */
		    Tone.AND.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._equals.dispose();
		        this._equals = null;
		        return this;
		    };
		    return Tone.AND;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Just an alias for Tone.EqualZero, but has the same effect as a NOT operator. 
			 *          Outputs 1 when input equals 0. 
			 *  
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @example
			 * var not = new Tone.NOT();
			 * var sig = new Tone.Signal(1).connect(not);
			 * //output of not equals 0. 
			 * sig.value = 0;
			 * //output of not equals 1.
			 */
		    Tone.NOT = Tone.EqualZero;
		    return Tone.NOT;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Output 1 if the signal is greater than the value, otherwise outputs 0.
			 *          can compare two signals or a signal and a number. 
			 *  
			 *  @constructor
			 *  @extends {Tone.Signal}
			 *  @param {number} [value=0] the value to compare to the incoming signal
			 *  @example
			 * var gt = new Tone.GreaterThan(2);
			 * var sig = new Tone.Signal(4).connect(gt);
			 * //output of gt is equal 1. 
			 */
		    Tone.GreaterThan = function (value) {
		        Tone.call(this, 2, 0);
		        /**
				 *  subtract the amount from the incoming signal
				 *  @type {Tone.Subtract}
				 *  @private
				 */
		        this._param = this.input[0] = new Tone.Subtract(value);
		        this.input[1] = this._param.input[1];
		        /**
				 *  compare that amount to zero
				 *  @type {Tone.GreaterThanZero}
				 *  @private
				 */
		        this._gtz = this.output = new Tone.GreaterThanZero();
		        //connect
		        this._param.connect(this._gtz);
		    };
		    Tone.extend(Tone.GreaterThan, Tone.Signal);
		    /**
			 *  dispose method
			 *  @returns {Tone.GreaterThan} this
			 */
		    Tone.GreaterThan.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._param.dispose();
		        this._param = null;
		        this._gtz.dispose();
		        this._gtz = null;
		        return this;
		    };
		    return Tone.GreaterThan;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Output 1 if the signal is less than the value, otherwise outputs 0.
			 *          Can compare two signals or a signal and a number. 
			 *  
			 *  @constructor
			 *  @extends {Tone.Signal}
			 *  @param {number=} value The value to compare to the incoming signal. 
			 *                            If no value is provided, it will compare 
			 *                            <code>input[0]</code> and <code>input[1]</code>
			 *  @example
			 * var lt = new Tone.LessThan(2);
			 * var sig = new Tone.Signal(-1).connect(lt);
			 * //if (sig < 2) lt outputs 1
			 */
		    Tone.LessThan = function (value) {
		        Tone.call(this, 2, 0);
		        /**
				 *  negate the incoming signal
				 *  @type {Tone.Negate}
				 *  @private
				 */
		        this._neg = this.input[0] = new Tone.Negate();
		        /**
				 *  input < value === -input > -value
				 *  @type {Tone.GreaterThan}
				 *  @private
				 */
		        this._gt = this.output = new Tone.GreaterThan();
		        /**
				 *  negate the signal coming from the second input
				 *  @private
				 *  @type {Tone.Negate}
				 */
		        this._rhNeg = new Tone.Negate();
		        /**
				 *  the node where the value is set
				 *  @private
				 *  @type {Tone.Signal}
				 */
		        this._param = this.input[1] = new Tone.Signal(value);
		        //connect
		        this._neg.connect(this._gt);
		        this._param.connect(this._rhNeg);
		        this._rhNeg.connect(this._gt, 0, 1);
		    };
		    Tone.extend(Tone.LessThan, Tone.Signal);
		    /**
			 *  Clean up.
			 *  @returns {Tone.LessThan} this
			 */
		    Tone.LessThan.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._neg.dispose();
		        this._neg = null;
		        this._gt.dispose();
		        this._gt = null;
		        this._rhNeg.dispose();
		        this._rhNeg = null;
		        this._param.dispose();
		        this._param = null;
		        return this;
		    };
		    return Tone.LessThan;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Return the absolute value of an incoming signal. 
			 *  
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @example
			 * var signal = new Tone.Signal(-1);
			 * var abs = new Tone.Abs();
			 * signal.connect(abs);
			 * //the output of abs is 1. 
			 */
		    Tone.Abs = function () {
		        Tone.call(this, 1, 0);
		        /**
				 *  @type {Tone.LessThan}
				 *  @private
				 */
		        this._ltz = new Tone.LessThan(0);
		        /**
				 *  @type {Tone.Select}
				 *  @private
				 */
		        this._switch = this.output = new Tone.Select(2);
		        /**
				 *  @type {Tone.Negate}
				 *  @private
				 */
		        this._negate = new Tone.Negate();
		        //two signal paths, positive and negative
		        this.input.connect(this._switch, 0, 0);
		        this.input.connect(this._negate);
		        this._negate.connect(this._switch, 0, 1);
		        //the control signal
		        this.input.chain(this._ltz, this._switch.gate);
		    };
		    Tone.extend(Tone.Abs, Tone.SignalBase);
		    /**
			 *  dispose method
			 *  @returns {Tone.Abs} this
			 */
		    Tone.Abs.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._switch.dispose();
		        this._switch = null;
		        this._ltz.dispose();
		        this._ltz = null;
		        this._negate.dispose();
		        this._negate = null;
		        return this;
		    };
		    return Tone.Abs;
		});
		Module(function (Tone) {
		    
		    /**
			 * 	@class  Outputs the greater of two signals. If a number is provided in the constructor
			 * 	        it will use that instead of the signal. 
			 * 	
			 *  @constructor
			 *  @extends {Tone.Signal}
			 *  @param {number=} max Max value if provided. if not provided, it will use the
			 *                       signal value from input 1. 
			 *  @example
			 * var max = new Tone.Max(2);
			 * var sig = new Tone.Signal(3).connect(max);
			 * //max outputs 3
			 * sig.value = 1;
			 * //max outputs 2
			 *  @example
			 * var max = new Tone.Max();
			 * var sigA = new Tone.Signal(3);
			 * var sigB = new Tone.Signal(4);
			 * sigA.connect(max, 0, 0);
			 * sigB.connect(max, 0, 1);
			 * //output of max is 4.
			 */
		    Tone.Max = function (max) {
		        Tone.call(this, 2, 0);
		        this.input[0] = this.context.createGain();
		        /**
				 *  the max signal
				 *  @type {Tone.Signal}
				 *  @private
				 */
		        this._param = this.input[1] = new Tone.Signal(max);
		        /**
				 *  @type {Tone.Select}
				 *  @private
				 */
		        this._ifThenElse = this.output = new Tone.IfThenElse();
		        /**
				 *  @type {Tone.Select}
				 *  @private
				 */
		        this._gt = new Tone.GreaterThan();
		        //connections
		        this.input[0].chain(this._gt, this._ifThenElse.if);
		        this.input[0].connect(this._ifThenElse.then);
		        this._param.connect(this._ifThenElse.else);
		        this._param.connect(this._gt, 0, 1);
		    };
		    Tone.extend(Tone.Max, Tone.Signal);
		    /**
			 * 	Clean up.
			 *  @returns {Tone.Max} this
			 */
		    Tone.Max.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._param.dispose();
		        this._ifThenElse.dispose();
		        this._gt.dispose();
		        this._param = null;
		        this._ifThenElse = null;
		        this._gt = null;
		        return this;
		    };
		    return Tone.Max;
		});
		Module(function (Tone) {
		    
		    /**
			 * 	@class  Outputs the lesser of two signals. If a number is given 
			 * 	        in the constructor, it will use a signal and a number. 
			 * 	
			 *  @constructor
			 *  @extends {Tone.Signal}
			 *  @param {number} min The minimum to compare to the incoming signal
			 *  @example
			 * var min = new Tone.Min(2);
			 * var sig = new Tone.Signal(3).connect(min);
			 * //min outputs 2
			 * sig.value = 1;
			 * //min outputs 1
			 * 	 @example
			 * var min = new Tone.Min();
			 * var sigA = new Tone.Signal(3);
			 * var sigB = new Tone.Signal(4);
			 * sigA.connect(min, 0, 0);
			 * sigB.connect(min, 0, 1);
			 * //output of min is 3.
			 */
		    Tone.Min = function (min) {
		        Tone.call(this, 2, 0);
		        this.input[0] = this.context.createGain();
		        /**
				 *  @type {Tone.Select}
				 *  @private
				 */
		        this._ifThenElse = this.output = new Tone.IfThenElse();
		        /**
				 *  @type {Tone.Select}
				 *  @private
				 */
		        this._lt = new Tone.LessThan();
		        /**
				 *  the min signal
				 *  @type {Tone.Signal}
				 *  @private
				 */
		        this._param = this.input[1] = new Tone.Signal(min);
		        //connections
		        this.input[0].chain(this._lt, this._ifThenElse.if);
		        this.input[0].connect(this._ifThenElse.then);
		        this._param.connect(this._ifThenElse.else);
		        this._param.connect(this._lt, 0, 1);
		    };
		    Tone.extend(Tone.Min, Tone.Signal);
		    /**
			 *  clean up
			 *  @returns {Tone.Min} this
			 */
		    Tone.Min.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._param.dispose();
		        this._ifThenElse.dispose();
		        this._lt.dispose();
		        this._param = null;
		        this._ifThenElse = null;
		        this._lt = null;
		        return this;
		    };
		    return Tone.Min;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Signal-rate modulo operator. Only works in AudioRange [-1, 1] and for modulus
			 *         values in the NormalRange. 
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {NormalRange} modulus The modulus to apply.
			 *  @example
			 * var mod = new Tone.Modulo(0.2)
			 * var sig = new Tone.Signal(0.5).connect(mod);
			 * //mod outputs 0.1
			 */
		    Tone.Modulo = function (modulus) {
		        Tone.call(this, 1, 1);
		        /**
				 *  A waveshaper gets the integer multiple of 
				 *  the input signal and the modulus.
				 *  @private
				 *  @type {Tone.WaveShaper}
				 */
		        this._shaper = new Tone.WaveShaper(Math.pow(2, 16));
		        /**
				 *  the integer multiple is multiplied by the modulus
				 *  @type  {Tone.Multiply}
				 *  @private
				 */
		        this._multiply = new Tone.Multiply();
		        /**
				 *  and subtracted from the input signal
				 *  @type  {Tone.Subtract}
				 *  @private
				 */
		        this._subtract = this.output = new Tone.Subtract();
		        /**
				 *  the modulus signal
				 *  @type  {Tone.Signal}
				 *  @private
				 */
		        this._modSignal = new Tone.Signal(modulus);
		        //connections
		        this.input.fan(this._shaper, this._subtract);
		        this._modSignal.connect(this._multiply, 0, 0);
		        this._shaper.connect(this._multiply, 0, 1);
		        this._multiply.connect(this._subtract, 0, 1);
		        this._setWaveShaper(modulus);
		    };
		    Tone.extend(Tone.Modulo, Tone.SignalBase);
		    /**
			 *  @param  {number}  mod  the modulus to apply
			 *  @private
			 */
		    Tone.Modulo.prototype._setWaveShaper = function (mod) {
		        this._shaper.setMap(function (val) {
		            var multiple = Math.floor((val + 0.0001) / mod);
		            return multiple;
		        });
		    };
		    /**
			 * The modulus value.
			 * @memberOf Tone.Modulo#
			 * @type {NormalRange}
			 * @name value
			 */
		    Object.defineProperty(Tone.Modulo.prototype, 'value', {
		        get: function () {
		            return this._modSignal.value;
		        },
		        set: function (mod) {
		            this._modSignal.value = mod;
		            this._setWaveShaper(mod);
		        }
		    });
		    /**
			 * clean up
			 *  @returns {Tone.Modulo} this
			 */
		    Tone.Modulo.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._shaper.dispose();
		        this._shaper = null;
		        this._multiply.dispose();
		        this._multiply = null;
		        this._subtract.dispose();
		        this._subtract = null;
		        this._modSignal.dispose();
		        this._modSignal = null;
		        return this;
		    };
		    return Tone.Modulo;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class AudioToGain converts an input in AudioRange [-1,1] to NormalRange [0,1]. 
			 *         See Tone.GainToAudio.
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @example
			 *  var a2g = new Tone.AudioToGain();
			 */
		    Tone.AudioToGain = function () {
		        /**
				 *  @type {WaveShaperNode}
				 *  @private
				 */
		        this._norm = this.input = this.output = new Tone.WaveShaper(function (x) {
		            return (x + 1) / 2;
		        });
		    };
		    Tone.extend(Tone.AudioToGain, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.AudioToGain} this
			 */
		    Tone.AudioToGain.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._norm.dispose();
		        this._norm = null;
		        return this;
		    };
		    return Tone.AudioToGain;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Evaluate an expression at audio rate. <br><br>
			 *         Parsing code modified from https://code.google.com/p/tapdigit/
			 *         Copyright 2011 2012 Ariya Hidayat, New BSD License
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @param {string} expr the expression to generate
			 *  @example
			 * //adds the signals from input[0] and input[1].
			 * var expr = new Tone.Expr("$0 + $1");
			 */
		    Tone.Expr = function () {
		        var expr = this._replacements(Array.prototype.slice.call(arguments));
		        var inputCount = this._parseInputs(expr);
		        /**
				 *  hold onto all of the nodes for disposal
				 *  @type {Array}
				 *  @private
				 */
		        this._nodes = [];
		        /**
				 *  The inputs. The length is determined by the expression. 
				 *  @type {Array}
				 */
		        this.input = new Array(inputCount);
		        //create a gain for each input
		        for (var i = 0; i < inputCount; i++) {
		            this.input[i] = this.context.createGain();
		        }
		        //parse the syntax tree
		        var tree = this._parseTree(expr);
		        //evaluate the results
		        var result;
		        try {
		            result = this._eval(tree);
		        } catch (e) {
		            this._disposeNodes();
		            throw new Error('Could evaluate expression: ' + expr);
		        }
		        /**
				 *  The output node is the result of the expression
				 *  @type {Tone}
				 */
		        this.output = result;
		    };
		    Tone.extend(Tone.Expr, Tone.SignalBase);
		    //some helpers to cut down the amount of code
		    function applyBinary(Constructor, args, self) {
		        var op = new Constructor();
		        self._eval(args[0]).connect(op, 0, 0);
		        self._eval(args[1]).connect(op, 0, 1);
		        return op;
		    }
		    function applyUnary(Constructor, args, self) {
		        var op = new Constructor();
		        self._eval(args[0]).connect(op, 0, 0);
		        return op;
		    }
		    function getNumber(arg) {
		        return arg ? parseFloat(arg) : undefined;
		    }
		    function literalNumber(arg) {
		        return arg && arg.args ? parseFloat(arg.args) : undefined;
		    }
		    /*
			 *  the Expressions that Tone.Expr can parse.
			 *
			 *  each expression belongs to a group and contains a regexp 
			 *  for selecting the operator as well as that operators method
			 *  
			 *  @type {Object}
			 *  @private
			 */
		    Tone.Expr._Expressions = {
		        //values
		        'value': {
		            'signal': {
		                regexp: /^\d+\.\d+|^\d+/,
		                method: function (arg) {
		                    var sig = new Tone.Signal(getNumber(arg));
		                    return sig;
		                }
		            },
		            'input': {
		                regexp: /^\$\d/,
		                method: function (arg, self) {
		                    return self.input[getNumber(arg.substr(1))];
		                }
		            }
		        },
		        //syntactic glue
		        'glue': {
		            '(': { regexp: /^\(/ },
		            ')': { regexp: /^\)/ },
		            ',': { regexp: /^,/ }
		        },
		        //functions
		        'func': {
		            'abs': {
		                regexp: /^abs/,
		                method: applyUnary.bind(this, Tone.Abs)
		            },
		            'min': {
		                regexp: /^min/,
		                method: applyBinary.bind(this, Tone.Min)
		            },
		            'max': {
		                regexp: /^max/,
		                method: applyBinary.bind(this, Tone.Max)
		            },
		            'if': {
		                regexp: /^if/,
		                method: function (args, self) {
		                    var op = new Tone.IfThenElse();
		                    self._eval(args[0]).connect(op.if);
		                    self._eval(args[1]).connect(op.then);
		                    self._eval(args[2]).connect(op.else);
		                    return op;
		                }
		            },
		            'gt0': {
		                regexp: /^gt0/,
		                method: applyUnary.bind(this, Tone.GreaterThanZero)
		            },
		            'eq0': {
		                regexp: /^eq0/,
		                method: applyUnary.bind(this, Tone.EqualZero)
		            },
		            'mod': {
		                regexp: /^mod/,
		                method: function (args, self) {
		                    var modulus = literalNumber(args[1]);
		                    var op = new Tone.Modulo(modulus);
		                    self._eval(args[0]).connect(op);
		                    return op;
		                }
		            },
		            'pow': {
		                regexp: /^pow/,
		                method: function (args, self) {
		                    var exp = literalNumber(args[1]);
		                    var op = new Tone.Pow(exp);
		                    self._eval(args[0]).connect(op);
		                    return op;
		                }
		            },
		            'a2g': {
		                regexp: /^a2g/,
		                method: function (args, self) {
		                    var op = new Tone.AudioToGain();
		                    self._eval(args[0]).connect(op);
		                    return op;
		                }
		            }
		        },
		        //binary expressions
		        'binary': {
		            '+': {
		                regexp: /^\+/,
		                precedence: 1,
		                method: applyBinary.bind(this, Tone.Add)
		            },
		            '-': {
		                regexp: /^\-/,
		                precedence: 1,
		                method: function (args, self) {
		                    //both unary and binary op
		                    if (args.length === 1) {
		                        return applyUnary(Tone.Negate, args, self);
		                    } else {
		                        return applyBinary(Tone.Subtract, args, self);
		                    }
		                }
		            },
		            '*': {
		                regexp: /^\*/,
		                precedence: 0,
		                method: applyBinary.bind(this, Tone.Multiply)
		            },
		            '>': {
		                regexp: /^\>/,
		                precedence: 2,
		                method: applyBinary.bind(this, Tone.GreaterThan)
		            },
		            '<': {
		                regexp: /^</,
		                precedence: 2,
		                method: applyBinary.bind(this, Tone.LessThan)
		            },
		            '==': {
		                regexp: /^==/,
		                precedence: 3,
		                method: applyBinary.bind(this, Tone.Equal)
		            },
		            '&&': {
		                regexp: /^&&/,
		                precedence: 4,
		                method: applyBinary.bind(this, Tone.AND)
		            },
		            '||': {
		                regexp: /^\|\|/,
		                precedence: 5,
		                method: applyBinary.bind(this, Tone.OR)
		            }
		        },
		        //unary expressions
		        'unary': {
		            '-': {
		                regexp: /^\-/,
		                method: applyUnary.bind(this, Tone.Negate)
		            },
		            '!': {
		                regexp: /^\!/,
		                method: applyUnary.bind(this, Tone.NOT)
		            }
		        }
		    };
		    /**
			 *  @param   {string} expr the expression string
			 *  @return  {number}      the input count
			 *  @private
			 */
		    Tone.Expr.prototype._parseInputs = function (expr) {
		        var inputArray = expr.match(/\$\d/g);
		        var inputMax = 0;
		        if (inputArray !== null) {
		            for (var i = 0; i < inputArray.length; i++) {
		                var inputNum = parseInt(inputArray[i].substr(1)) + 1;
		                inputMax = Math.max(inputMax, inputNum);
		            }
		        }
		        return inputMax;
		    };
		    /**
			 *  @param   {Array} args 	an array of arguments
			 *  @return  {string} the results of the replacements being replaced
			 *  @private
			 */
		    Tone.Expr.prototype._replacements = function (args) {
		        var expr = args.shift();
		        for (var i = 0; i < args.length; i++) {
		            expr = expr.replace(/\%/i, args[i]);
		        }
		        return expr;
		    };
		    /**
			 *  tokenize the expression based on the Expressions object
			 *  @param   {string} expr 
			 *  @return  {Object}      returns two methods on the tokenized list, next and peek
			 *  @private
			 */
		    Tone.Expr.prototype._tokenize = function (expr) {
		        var position = -1;
		        var tokens = [];
		        while (expr.length > 0) {
		            expr = expr.trim();
		            var token = getNextToken(expr);
		            tokens.push(token);
		            expr = expr.substr(token.value.length);
		        }
		        function getNextToken(expr) {
		            for (var type in Tone.Expr._Expressions) {
		                var group = Tone.Expr._Expressions[type];
		                for (var opName in group) {
		                    var op = group[opName];
		                    var reg = op.regexp;
		                    var match = expr.match(reg);
		                    if (match !== null) {
		                        return {
		                            type: type,
		                            value: match[0],
		                            method: op.method
		                        };
		                    }
		                }
		            }
		            throw new SyntaxError('Unexpected token ' + expr);
		        }
		        return {
		            next: function () {
		                return tokens[++position];
		            },
		            peek: function () {
		                return tokens[position + 1];
		            }
		        };
		    };
		    /**
			 *  recursively parse the string expression into a syntax tree
			 *  
			 *  @param   {string} expr 
			 *  @return  {Object}
			 *  @private
			 */
		    Tone.Expr.prototype._parseTree = function (expr) {
		        var lexer = this._tokenize(expr);
		        var isUndef = this.isUndef.bind(this);
		        function matchSyntax(token, syn) {
		            return !isUndef(token) && token.type === 'glue' && token.value === syn;
		        }
		        function matchGroup(token, groupName, prec) {
		            var ret = false;
		            var group = Tone.Expr._Expressions[groupName];
		            if (!isUndef(token)) {
		                for (var opName in group) {
		                    var op = group[opName];
		                    if (op.regexp.test(token.value)) {
		                        if (!isUndef(prec)) {
		                            if (op.precedence === prec) {
		                                return true;
		                            }
		                        } else {
		                            return true;
		                        }
		                    }
		                }
		            }
		            return ret;
		        }
		        function parseExpression(precedence) {
		            if (isUndef(precedence)) {
		                precedence = 5;
		            }
		            var expr;
		            if (precedence < 0) {
		                expr = parseUnary();
		            } else {
		                expr = parseExpression(precedence - 1);
		            }
		            var token = lexer.peek();
		            while (matchGroup(token, 'binary', precedence)) {
		                token = lexer.next();
		                expr = {
		                    operator: token.value,
		                    method: token.method,
		                    args: [
		                        expr,
		                        parseExpression(precedence)
		                    ]
		                };
		                token = lexer.peek();
		            }
		            return expr;
		        }
		        function parseUnary() {
		            var token, expr;
		            token = lexer.peek();
		            if (matchGroup(token, 'unary')) {
		                token = lexer.next();
		                expr = parseUnary();
		                return {
		                    operator: token.value,
		                    method: token.method,
		                    args: [expr]
		                };
		            }
		            return parsePrimary();
		        }
		        function parsePrimary() {
		            var token, expr;
		            token = lexer.peek();
		            if (isUndef(token)) {
		                throw new SyntaxError('Unexpected termination of expression');
		            }
		            if (token.type === 'func') {
		                token = lexer.next();
		                return parseFunctionCall(token);
		            }
		            if (token.type === 'value') {
		                token = lexer.next();
		                return {
		                    method: token.method,
		                    args: token.value
		                };
		            }
		            if (matchSyntax(token, '(')) {
		                lexer.next();
		                expr = parseExpression();
		                token = lexer.next();
		                if (!matchSyntax(token, ')')) {
		                    throw new SyntaxError('Expected )');
		                }
		                return expr;
		            }
		            throw new SyntaxError('Parse error, cannot process token ' + token.value);
		        }
		        function parseFunctionCall(func) {
		            var token, args = [];
		            token = lexer.next();
		            if (!matchSyntax(token, '(')) {
		                throw new SyntaxError('Expected ( in a function call "' + func.value + '"');
		            }
		            token = lexer.peek();
		            if (!matchSyntax(token, ')')) {
		                args = parseArgumentList();
		            }
		            token = lexer.next();
		            if (!matchSyntax(token, ')')) {
		                throw new SyntaxError('Expected ) in a function call "' + func.value + '"');
		            }
		            return {
		                method: func.method,
		                args: args,
		                name: name
		            };
		        }
		        function parseArgumentList() {
		            var token, expr, args = [];
		            while (true) {
		                expr = parseExpression();
		                if (isUndef(expr)) {
		                    // TODO maybe throw exception?
		                    break;
		                }
		                args.push(expr);
		                token = lexer.peek();
		                if (!matchSyntax(token, ',')) {
		                    break;
		                }
		                lexer.next();
		            }
		            return args;
		        }
		        return parseExpression();
		    };
		    /**
			 *  recursively evaluate the expression tree
			 *  @param   {Object} tree 
			 *  @return  {AudioNode}      the resulting audio node from the expression
			 *  @private
			 */
		    Tone.Expr.prototype._eval = function (tree) {
		        if (!this.isUndef(tree)) {
		            var node = tree.method(tree.args, this);
		            this._nodes.push(node);
		            return node;
		        }
		    };
		    /**
			 *  dispose all the nodes
			 *  @private
			 */
		    Tone.Expr.prototype._disposeNodes = function () {
		        for (var i = 0; i < this._nodes.length; i++) {
		            var node = this._nodes[i];
		            if (this.isFunction(node.dispose)) {
		                node.dispose();
		            } else if (this.isFunction(node.disconnect)) {
		                node.disconnect();
		            }
		            node = null;
		            this._nodes[i] = null;
		        }
		        this._nodes = null;
		    };
		    /**
			 *  clean up
			 */
		    Tone.Expr.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._disposeNodes();
		    };
		    return Tone.Expr;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Convert an incoming signal between 0, 1 to an equal power gain scale.
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @example
			 * var eqPowGain = new Tone.EqualPowerGain();
			 */
		    Tone.EqualPowerGain = function () {
		        /**
				 *  @type {Tone.WaveShaper}
				 *  @private
				 */
		        this._eqPower = this.input = this.output = new Tone.WaveShaper(function (val) {
		            if (Math.abs(val) < 0.001) {
		                //should output 0 when input is 0
		                return 0;
		            } else {
		                return this.equalPowerScale(val);
		            }
		        }.bind(this), 4096);
		    };
		    Tone.extend(Tone.EqualPowerGain, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.EqualPowerGain} this
			 */
		    Tone.EqualPowerGain.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._eqPower.dispose();
		        this._eqPower = null;
		        return this;
		    };
		    return Tone.EqualPowerGain;
		});
		Module(function (Tone) {
		    
		    /**
			 * @class  Tone.Crossfade provides equal power fading between two inputs. 
			 *         More on crossfading technique [here](https://en.wikipedia.org/wiki/Fade_(audio_engineering)#Crossfading).
			 *
			 * @constructor
			 * @extends {Tone}
			 * @param {NormalRange} [initialFade=0.5]
			 * @example
			 * var crossFade = new Tone.CrossFade(0.5);
			 * //connect effect A to crossfade from
			 * //effect output 0 to crossfade input 0
			 * effectA.connect(crossFade, 0, 0);
			 * //connect effect B to crossfade from
			 * //effect output 0 to crossfade input 1
			 * effectB.connect(crossFade, 0, 1);
			 * crossFade.fade.value = 0;
			 * // ^ only effectA is output
			 * crossFade.fade.value = 1;
			 * // ^ only effectB is output
			 * crossFade.fade.value = 0.5;
			 * // ^ the two signals are mixed equally. 
			 */
		    Tone.CrossFade = function (initialFade) {
		        Tone.call(this, 2, 1);
		        /**
				 *  Alias for <code>input[0]</code>. 
				 *  @type {GainNode}
				 */
		        this.a = this.input[0] = this.context.createGain();
		        /**
				 *  Alias for <code>input[1]</code>. 
				 *  @type {GainNode}
				 */
		        this.b = this.input[1] = this.context.createGain();
		        /**
				 * 	The mix between the two inputs. A fade value of 0
				 * 	will output 100% <code>input[0]</code> and 
				 * 	a value of 1 will output 100% <code>input[1]</code>. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.fade = new Tone.Signal(this.defaultArg(initialFade, 0.5), Tone.Type.NormalRange);
		        /**
				 *  equal power gain cross fade
				 *  @private
				 *  @type {Tone.EqualPowerGain}
				 */
		        this._equalPowerA = new Tone.EqualPowerGain();
		        /**
				 *  equal power gain cross fade
				 *  @private
				 *  @type {Tone.EqualPowerGain}
				 */
		        this._equalPowerB = new Tone.EqualPowerGain();
		        /**
				 *  invert the incoming signal
				 *  @private
				 *  @type {Tone}
				 */
		        this._invert = new Tone.Expr('1 - $0');
		        //connections
		        this.a.connect(this.output);
		        this.b.connect(this.output);
		        this.fade.chain(this._equalPowerB, this.b.gain);
		        this.fade.chain(this._invert, this._equalPowerA, this.a.gain);
		        this._readOnly('fade');
		    };
		    Tone.extend(Tone.CrossFade);
		    /**
			 *  clean up
			 *  @returns {Tone.CrossFade} this
			 */
		    Tone.CrossFade.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable('fade');
		        this._equalPowerA.dispose();
		        this._equalPowerA = null;
		        this._equalPowerB.dispose();
		        this._equalPowerB = null;
		        this.fade.dispose();
		        this.fade = null;
		        this._invert.dispose();
		        this._invert = null;
		        this.a.disconnect();
		        this.a = null;
		        this.b.disconnect();
		        this.b = null;
		        return this;
		    };
		    return Tone.CrossFade;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Filter is a filter which allows for all of the same native methods
			 *          as the [BiquadFilterNode](http://webaudio.github.io/web-audio-api/#the-biquadfilternode-interface). 
			 *          Tone.Filter has the added ability to set the filter rolloff at -12 
			 *          (default), -24 and -48. 
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {Frequency|Object} [frequency] The cutoff frequency of the filter.
			 *  @param {string=} type The type of filter.
			 *  @param {number=} rolloff The drop in decibels per octave after the cutoff frequency.
			 *                            3 choices: -12, -24, and -48
			 *  @example
			 *  var filter = new Tone.Filter(200, "highpass");
			 */
		    Tone.Filter = function () {
		        Tone.call(this);
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'type',
		            'rolloff'
		        ], Tone.Filter.defaults);
		        /**
				 *  the filter(s)
				 *  @type {Array}
				 *  @private
				 */
		        this._filters = [];
		        /**
				 *  The cutoff frequency of the filter. 
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
		        /**
				 *  The detune parameter
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = new Tone.Signal(0, Tone.Type.Cents);
		        /**
				 *  The gain of the filter, only used in certain filter types
				 *  @type {Number}
				 *  @signal
				 */
		        this.gain = new Tone.Signal({
		            'value': options.gain,
		            'convert': false
		        });
		        /**
				 *  The Q or Quality of the filter
				 *  @type {Positive}
				 *  @signal
				 */
		        this.Q = new Tone.Signal(options.Q);
		        /**
				 *  the type of the filter
				 *  @type {string}
				 *  @private
				 */
		        this._type = options.type;
		        /**
				 *  the rolloff value of the filter
				 *  @type {number}
				 *  @private
				 */
		        this._rolloff = options.rolloff;
		        //set the rolloff;
		        this.rolloff = options.rolloff;
		        this._readOnly([
		            'detune',
		            'frequency',
		            'gain',
		            'Q'
		        ]);
		    };
		    Tone.extend(Tone.Filter);
		    /**
			 *  the default parameters
			 *
			 *  @static
			 *  @type {Object}
			 */
		    Tone.Filter.defaults = {
		        'type': 'lowpass',
		        'frequency': 350,
		        'rolloff': -12,
		        'Q': 1,
		        'gain': 0
		    };
		    /**
			 * The type of the filter. Types: "lowpass", "highpass", 
			 * "bandpass", "lowshelf", "highshelf", "notch", "allpass", or "peaking". 
			 * @memberOf Tone.Filter#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.Filter.prototype, 'type', {
		        get: function () {
		            return this._type;
		        },
		        set: function (type) {
		            var types = [
		                'lowpass',
		                'highpass',
		                'bandpass',
		                'lowshelf',
		                'highshelf',
		                'notch',
		                'allpass',
		                'peaking'
		            ];
		            if (types.indexOf(type) === -1) {
		                throw new Error('Tone.Filter does not have filter type ' + type);
		            }
		            this._type = type;
		            for (var i = 0; i < this._filters.length; i++) {
		                this._filters[i].type = type;
		            }
		        }
		    });
		    /**
			 * The rolloff of the filter which is the drop in db
			 * per octave. Implemented internally by cascading filters.
			 * Only accepts the values -12, -24, -48 and -96.
			 * @memberOf Tone.Filter#
			 * @type {number}
			 * @name rolloff
			 */
		    Object.defineProperty(Tone.Filter.prototype, 'rolloff', {
		        get: function () {
		            return this._rolloff;
		        },
		        set: function (rolloff) {
		            rolloff = parseInt(rolloff, 10);
		            var possibilities = [
		                -12,
		                -24,
		                -48,
		                -96
		            ];
		            var cascadingCount = possibilities.indexOf(rolloff);
		            //check the rolloff is valid
		            if (cascadingCount === -1) {
		                throw new Error('Filter rolloff can only be -12, -24, -48 or -96');
		            }
		            cascadingCount += 1;
		            this._rolloff = rolloff;
		            //first disconnect the filters and throw them away
		            this.input.disconnect();
		            for (var i = 0; i < this._filters.length; i++) {
		                this._filters[i].disconnect();
		                this._filters[i] = null;
		            }
		            this._filters = new Array(cascadingCount);
		            for (var count = 0; count < cascadingCount; count++) {
		                var filter = this.context.createBiquadFilter();
		                filter.type = this._type;
		                this.frequency.connect(filter.frequency);
		                this.detune.connect(filter.detune);
		                this.Q.connect(filter.Q);
		                this.gain.connect(filter.gain);
		                this._filters[count] = filter;
		            }
		            //connect them up
		            var connectionChain = [this.input].concat(this._filters).concat([this.output]);
		            this.connectSeries.apply(this, connectionChain);
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @return {Tone.Filter} this
			 */
		    Tone.Filter.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        for (var i = 0; i < this._filters.length; i++) {
		            this._filters[i].disconnect();
		            this._filters[i] = null;
		        }
		        this._filters = null;
		        this._writable([
		            'detune',
		            'frequency',
		            'gain',
		            'Q'
		        ]);
		        this.frequency.dispose();
		        this.Q.dispose();
		        this.frequency = null;
		        this.Q = null;
		        this.detune.dispose();
		        this.detune = null;
		        this.gain.dispose();
		        this.gain = null;
		        return this;
		    };
		    return Tone.Filter;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Split the incoming signal into three bands (low, mid, high)
			 *         with two crossover frequency controls. 
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {Frequency|Object} [lowFrequency] the low/mid crossover frequency
			 *  @param {Frequency} [highFrequency] the mid/high crossover frequency
			 */
		    Tone.MultibandSplit = function () {
		        var options = this.optionsObject(arguments, [
		            'lowFrequency',
		            'highFrequency'
		        ], Tone.MultibandSplit.defaults);
		        /**
				 *  the input
				 *  @type {GainNode}
				 *  @private
				 */
		        this.input = this.context.createGain();
		        /**
				 *  the outputs
				 *  @type {Array}
				 *  @private
				 */
		        this.output = new Array(3);
		        /**
				 *  The low band. Alias for <code>output[0]</code>
				 *  @type {Tone.Filter}
				 */
		        this.low = this.output[0] = new Tone.Filter(0, 'lowpass');
		        /**
				 *  the lower filter of the mid band
				 *  @type {Tone.Filter}
				 *  @private
				 */
		        this._lowMidFilter = new Tone.Filter(0, 'highpass');
		        /**
				 *  The mid band output. Alias for <code>output[1]</code>
				 *  @type {Tone.Filter}
				 */
		        this.mid = this.output[1] = new Tone.Filter(0, 'lowpass');
		        /**
				 *  The high band output. Alias for <code>output[2]</code>
				 *  @type {Tone.Filter}
				 */
		        this.high = this.output[2] = new Tone.Filter(0, 'highpass');
		        /**
				 *  The low/mid crossover frequency.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.lowFrequency = new Tone.Signal(options.lowFrequency, Tone.Type.Frequency);
		        /**
				 *  The mid/high crossover frequency.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.highFrequency = new Tone.Signal(options.highFrequency, Tone.Type.Frequency);
		        /**
				 *  The quality of all the filters
				 *  @type {Number}
				 *  @signal
				 */
		        this.Q = new Tone.Signal(options.Q);
		        this.input.fan(this.low, this.high);
		        this.input.chain(this._lowMidFilter, this.mid);
		        //the frequency control signal
		        this.lowFrequency.connect(this.low.frequency);
		        this.lowFrequency.connect(this._lowMidFilter.frequency);
		        this.highFrequency.connect(this.mid.frequency);
		        this.highFrequency.connect(this.high.frequency);
		        //the Q value
		        this.Q.connect(this.low.Q);
		        this.Q.connect(this._lowMidFilter.Q);
		        this.Q.connect(this.mid.Q);
		        this.Q.connect(this.high.Q);
		        this._readOnly([
		            'high',
		            'mid',
		            'low',
		            'highFrequency',
		            'lowFrequency'
		        ]);
		    };
		    Tone.extend(Tone.MultibandSplit);
		    /**
			 *  @private
			 *  @static
			 *  @type {Object}
			 */
		    Tone.MultibandSplit.defaults = {
		        'lowFrequency': 400,
		        'highFrequency': 2500,
		        'Q': 1
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.MultibandSplit} this
			 */
		    Tone.MultibandSplit.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'high',
		            'mid',
		            'low',
		            'highFrequency',
		            'lowFrequency'
		        ]);
		        this.low.dispose();
		        this.low = null;
		        this._lowMidFilter.dispose();
		        this._lowMidFilter = null;
		        this.mid.dispose();
		        this.mid = null;
		        this.high.dispose();
		        this.high = null;
		        this.lowFrequency.dispose();
		        this.lowFrequency = null;
		        this.highFrequency.dispose();
		        this.highFrequency = null;
		        this.Q.dispose();
		        this.Q = null;
		        return this;
		    };
		    return Tone.MultibandSplit;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.EQ3 is a three band EQ with control over low, mid, and high gain as
			 *         well as the low and high crossover frequencies.
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  
			 *  @param {Decibels|Object} [lowLevel] The gain applied to the lows.
			 *  @param {Decibels} [midLevel] The gain applied to the mid.
			 *  @param {Decibels} [highLevel] The gain applied to the high.
			 *  @example
			 * var eq = new Tone.EQ3(-10, 3, -20);
			 */
		    Tone.EQ3 = function () {
		        var options = this.optionsObject(arguments, [
		            'low',
		            'mid',
		            'high'
		        ], Tone.EQ3.defaults);
		        /**
				 *  the output node
				 *  @type {GainNode}
				 *  @private
				 */
		        this.output = this.context.createGain();
		        /**
				 *  the multiband split
				 *  @type {Tone.MultibandSplit}
				 *  @private
				 */
		        this._multibandSplit = this.input = new Tone.MultibandSplit({
		            'lowFrequency': options.lowFrequency,
		            'highFrequency': options.highFrequency
		        });
		        /**
				 *  The gain for the lower signals
				 *  @type  {Tone.Gain}
				 *  @private
				 */
		        this._lowGain = new Tone.Gain(options.low, Tone.Type.Decibels);
		        /**
				 *  The gain for the mid signals
				 *  @type  {Tone.Gain}
				 *  @private
				 */
		        this._midGain = new Tone.Gain(options.mid, Tone.Type.Decibels);
		        /**
				 * The gain in decibels of the high part
				 * @type {Tone.Gain}
				 * @private
				 */
		        this._highGain = new Tone.Gain(options.high, Tone.Type.Decibels);
		        /**
				 * The gain in decibels of the low part
				 * @type {Decibels}
				 * @signal
				 */
		        this.low = this._lowGain.gain;
		        /**
				 * The gain in decibels of the mid part
				 * @type {Decibels}
				 * @signal
				 */
		        this.mid = this._midGain.gain;
		        /**
				 * The gain in decibels of the high part
				 * @type {Decibels}
				 * @signal
				 */
		        this.high = this._highGain.gain;
		        /**
				 *  The Q value for all of the filters. 
				 *  @type {Positive}
				 *  @signal
				 */
		        this.Q = this._multibandSplit.Q;
		        /**
				 *  The low/mid crossover frequency. 
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.lowFrequency = this._multibandSplit.lowFrequency;
		        /**
				 *  The mid/high crossover frequency. 
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.highFrequency = this._multibandSplit.highFrequency;
		        //the frequency bands
		        this._multibandSplit.low.chain(this._lowGain, this.output);
		        this._multibandSplit.mid.chain(this._midGain, this.output);
		        this._multibandSplit.high.chain(this._highGain, this.output);
		        this._readOnly([
		            'low',
		            'mid',
		            'high',
		            'lowFrequency',
		            'highFrequency'
		        ]);
		    };
		    Tone.extend(Tone.EQ3);
		    /**
			 *  the default values
			 */
		    Tone.EQ3.defaults = {
		        'low': 0,
		        'mid': 0,
		        'high': 0,
		        'lowFrequency': 400,
		        'highFrequency': 2500
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.EQ3} this
			 */
		    Tone.EQ3.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'low',
		            'mid',
		            'high',
		            'lowFrequency',
		            'highFrequency'
		        ]);
		        this._multibandSplit.dispose();
		        this._multibandSplit = null;
		        this.lowFrequency = null;
		        this.highFrequency = null;
		        this._lowGain.dispose();
		        this._lowGain = null;
		        this._midGain.dispose();
		        this._midGain = null;
		        this._highGain.dispose();
		        this._highGain = null;
		        this.low = null;
		        this.mid = null;
		        this.high = null;
		        this.Q = null;
		        return this;
		    };
		    return Tone.EQ3;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Performs a linear scaling on an input signal.
			 *          Scales a NormalRange input to between
			 *          outputMin and outputMax.
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {number} [outputMin=0] The output value when the input is 0. 
			 *  @param {number} [outputMax=1]	The output value when the input is 1. 
			 *  @example
			 * var scale = new Tone.Scale(50, 100);
			 * var signal = new Tone.Signal(0.5).connect(scale);
			 * //the output of scale equals 75
			 */
		    Tone.Scale = function (outputMin, outputMax) {
		        /** 
				 *  @private
				 *  @type {number}
				 */
		        this._outputMin = this.defaultArg(outputMin, 0);
		        /** 
				 *  @private
				 *  @type {number}
				 */
		        this._outputMax = this.defaultArg(outputMax, 1);
		        /** 
				 *  @private
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._scale = this.input = new Tone.Multiply(1);
		        /** 
				 *  @private
				 *  @type {Tone.Add}
				 *  @private
				 */
		        this._add = this.output = new Tone.Add(0);
		        this._scale.connect(this._add);
		        this._setRange();
		    };
		    Tone.extend(Tone.Scale, Tone.SignalBase);
		    /**
			 * The minimum output value. This number is output when 
			 * the value input value is 0. 
			 * @memberOf Tone.Scale#
			 * @type {number}
			 * @name min
			 */
		    Object.defineProperty(Tone.Scale.prototype, 'min', {
		        get: function () {
		            return this._outputMin;
		        },
		        set: function (min) {
		            this._outputMin = min;
		            this._setRange();
		        }
		    });
		    /**
			 * The maximum output value. This number is output when 
			 * the value input value is 1. 
			 * @memberOf Tone.Scale#
			 * @type {number}
			 * @name max
			 */
		    Object.defineProperty(Tone.Scale.prototype, 'max', {
		        get: function () {
		            return this._outputMax;
		        },
		        set: function (max) {
		            this._outputMax = max;
		            this._setRange();
		        }
		    });
		    /**
			 *  set the values
			 *  @private
			 */
		    Tone.Scale.prototype._setRange = function () {
		        this._add.value = this._outputMin;
		        this._scale.value = this._outputMax - this._outputMin;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Scale} this
			 */
		    Tone.Scale.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._add.dispose();
		        this._add = null;
		        this._scale.dispose();
		        this._scale = null;
		        return this;
		    };
		    return Tone.Scale;
		});
		Module(function (Tone) {
		    /**
			 *  @class  Performs an exponential scaling on an input signal.
			 *          Scales a NormalRange value [0,1] exponentially
			 *          to the output range of outputMin to outputMax.
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {number} [outputMin=0] The output value when the input is 0. 
			 *  @param {number} [outputMax=1]	The output value when the input is 1. 
			 *  @param {number} [exponent=2] The exponent which scales the incoming signal.
			 *  @example
			 * var scaleExp = new Tone.ScaleExp(0, 100, 2);
			 * var signal = new Tone.Signal(0.5).connect(scaleExp);
			 */
		    Tone.ScaleExp = function (outputMin, outputMax, exponent) {
		        /**
				 *  scale the input to the output range
				 *  @type {Tone.Scale}
				 *  @private
				 */
		        this._scale = this.output = new Tone.Scale(outputMin, outputMax);
		        /**
				 *  @private
				 *  @type {Tone.Pow}
				 *  @private
				 */
		        this._exp = this.input = new Tone.Pow(this.defaultArg(exponent, 2));
		        this._exp.connect(this._scale);
		    };
		    Tone.extend(Tone.ScaleExp, Tone.SignalBase);
		    /**
			 * Instead of interpolating linearly between the <code>min</code> and 
			 * <code>max</code> values, setting the exponent will interpolate between
			 * the two values with an exponential curve. 
			 * @memberOf Tone.ScaleExp#
			 * @type {number}
			 * @name exponent
			 */
		    Object.defineProperty(Tone.ScaleExp.prototype, 'exponent', {
		        get: function () {
		            return this._exp.value;
		        },
		        set: function (exp) {
		            this._exp.value = exp;
		        }
		    });
		    /**
			 * The minimum output value. This number is output when 
			 * the value input value is 0. 
			 * @memberOf Tone.ScaleExp#
			 * @type {number}
			 * @name min
			 */
		    Object.defineProperty(Tone.ScaleExp.prototype, 'min', {
		        get: function () {
		            return this._scale.min;
		        },
		        set: function (min) {
		            this._scale.min = min;
		        }
		    });
		    /**
			 * The maximum output value. This number is output when 
			 * the value input value is 1. 
			 * @memberOf Tone.ScaleExp#
			 * @type {number}
			 * @name max
			 */
		    Object.defineProperty(Tone.ScaleExp.prototype, 'max', {
		        get: function () {
		            return this._scale.max;
		        },
		        set: function (max) {
		            this._scale.max = max;
		        }
		    });
		    /**
			 *  Clean up.
			 *  @returns {Tone.ScaleExp} this
			 */
		    Tone.ScaleExp.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._scale.dispose();
		        this._scale = null;
		        this._exp.dispose();
		        this._exp = null;
		        return this;
		    };
		    return Tone.ScaleExp;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Comb filters are basic building blocks for physical modeling. Read more
			 *         about comb filters on [CCRMA's website](https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html).
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {Time|Object} [delayTime] The delay time of the filter. 
			 *  @param {NormalRange=} resonance The amount of feedback the filter has. 
			 */
		    Tone.FeedbackCombFilter = function () {
		        Tone.call(this);
		        var options = this.optionsObject(arguments, [
		            'delayTime',
		            'resonance'
		        ], Tone.FeedbackCombFilter.defaults);
		        /**
				 *  the delay node
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delay = this.input = this.output = this.context.createDelay(1);
		        /**
				 *  The amount of delay of the comb filter. 
				 *  @type {Time}
				 *  @signal
				 */
		        this.delayTime = new Tone.Param({
		            'param': this._delay.delayTime,
		            'value': options.delayTime,
		            'units': Tone.Type.Time
		        });
		        /**
				 *  the feedback node
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedback = this.context.createGain();
		        /**
				 *  The amount of feedback of the delayed signal. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.resonance = new Tone.Param({
		            'param': this._feedback.gain,
		            'value': options.resonance,
		            'units': Tone.Type.NormalRange
		        });
		        this._delay.chain(this._feedback, this._delay);
		        this._readOnly([
		            'resonance',
		            'delayTime'
		        ]);
		    };
		    Tone.extend(Tone.FeedbackCombFilter);
		    /**
			 *  the default parameters
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.FeedbackCombFilter.defaults = {
		        'delayTime': 0.1,
		        'resonance': 0.5
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.FeedbackCombFilter} this
			 */
		    Tone.FeedbackCombFilter.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'resonance',
		            'delayTime'
		        ]);
		        this._delay.disconnect();
		        this._delay = null;
		        this.delayTime.dispose();
		        this.delayTime = null;
		        this.resonance.dispose();
		        this.resonance = null;
		        this._feedback.disconnect();
		        this._feedback = null;
		        return this;
		    };
		    return Tone.FeedbackCombFilter;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Follower is a  crude envelope follower which will follow 
			 *          the amplitude of an incoming signal. 
			 *          Take care with small (< 0.02) attack or decay values 
			 *          as follower has some ripple which is exaggerated
			 *          at these values. Read more about envelope followers (also known 
			 *          as envelope detectors) on [Wikipedia](https://en.wikipedia.org/wiki/Envelope_detector).
			 *  
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {Time|Object} [attack] The rate at which the follower rises.
			 *  @param {Time=} release The rate at which the folower falls. 
			 *  @example
			 * var follower = new Tone.Follower(0.2, 0.4);
			 */
		    Tone.Follower = function () {
		        Tone.call(this);
		        var options = this.optionsObject(arguments, [
		            'attack',
		            'release'
		        ], Tone.Follower.defaults);
		        /**
				 *  @type {Tone.Abs}
				 *  @private
				 */
		        this._abs = new Tone.Abs();
		        /**
				 *  the lowpass filter which smooths the input
				 *  @type {BiquadFilterNode}
				 *  @private
				 */
		        this._filter = this.context.createBiquadFilter();
		        this._filter.type = 'lowpass';
		        this._filter.frequency.value = 0;
		        this._filter.Q.value = -100;
		        /**
				 *  @type {WaveShaperNode}
				 *  @private
				 */
		        this._frequencyValues = new Tone.WaveShaper();
		        /**
				 *  @type {Tone.Subtract}
				 *  @private
				 */
		        this._sub = new Tone.Subtract();
		        /**
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delay = this.context.createDelay();
		        this._delay.delayTime.value = this.blockTime;
		        /**
				 *  this keeps it far from 0, even for very small differences
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._mult = new Tone.Multiply(10000);
		        /**
				 *  @private
				 *  @type {number}
				 */
		        this._attack = options.attack;
		        /**
				 *  @private
				 *  @type {number}
				 */
		        this._release = options.release;
		        //the smoothed signal to get the values
		        this.input.chain(this._abs, this._filter, this.output);
		        //the difference path
		        this._abs.connect(this._sub, 0, 1);
		        this._filter.chain(this._delay, this._sub);
		        //threshold the difference and use the thresh to set the frequency
		        this._sub.chain(this._mult, this._frequencyValues, this._filter.frequency);
		        //set the attack and release values in the table
		        this._setAttackRelease(this._attack, this._release);
		    };
		    Tone.extend(Tone.Follower);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.Follower.defaults = {
		        'attack': 0.05,
		        'release': 0.5
		    };
		    /**
			 *  sets the attack and release times in the wave shaper
			 *  @param   {Time} attack  
			 *  @param   {Time} release 
			 *  @private
			 */
		    Tone.Follower.prototype._setAttackRelease = function (attack, release) {
		        var minTime = this.blockTime;
		        attack = this.secondsToFrequency(this.toSeconds(attack));
		        release = this.secondsToFrequency(this.toSeconds(release));
		        attack = Math.max(attack, minTime);
		        release = Math.max(release, minTime);
		        this._frequencyValues.setMap(function (val) {
		            if (val <= 0) {
		                return attack;
		            } else {
		                return release;
		            }
		        });
		    };
		    /**
			 * The attack time.
			 * @memberOf Tone.Follower#
			 * @type {Time}
			 * @name attack
			 */
		    Object.defineProperty(Tone.Follower.prototype, 'attack', {
		        get: function () {
		            return this._attack;
		        },
		        set: function (attack) {
		            this._attack = attack;
		            this._setAttackRelease(this._attack, this._release);
		        }
		    });
		    /**
			 * The release time.
			 * @memberOf Tone.Follower#
			 * @type {Time}
			 * @name release
			 */
		    Object.defineProperty(Tone.Follower.prototype, 'release', {
		        get: function () {
		            return this._release;
		        },
		        set: function (release) {
		            this._release = release;
		            this._setAttackRelease(this._attack, this._release);
		        }
		    });
		    /**
			 *  Borrows the connect method from Signal so that the output can be used
			 *  as a Tone.Signal control signal.
			 *  @function
			 */
		    Tone.Follower.prototype.connect = Tone.Signal.prototype.connect;
		    /**
			 *  dispose
			 *  @returns {Tone.Follower} this
			 */
		    Tone.Follower.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._filter.disconnect();
		        this._filter = null;
		        this._frequencyValues.disconnect();
		        this._frequencyValues = null;
		        this._delay.disconnect();
		        this._delay = null;
		        this._sub.disconnect();
		        this._sub = null;
		        this._abs.dispose();
		        this._abs = null;
		        this._mult.dispose();
		        this._mult = null;
		        this._curve = null;
		        return this;
		    };
		    return Tone.Follower;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.ScaledEnvelop is an envelope which can be scaled 
			 *         to any range. It's useful for applying an envelope 
			 *         to a frequency or any other non-NormalRange signal 
			 *         parameter. 
			 *
			 *  @extends {Tone.Envelope}
			 *  @constructor
			 *  @param {Time|Object} [attack]	the attack time in seconds
			 *  @param {Time} [decay]	the decay time in seconds
			 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
			 *  @param {Time} [release]	the release time in seconds
			 *  @example
			 *  var scaledEnv = new Tone.ScaledEnvelope({
			 *  	"attack" : 0.2,
			 *  	"min" : 200,
			 *  	"max" : 2000
			 *  });
			 *  scaledEnv.connect(oscillator.frequency);
			 */
		    Tone.ScaledEnvelope = function () {
		        //get all of the defaults
		        var options = this.optionsObject(arguments, [
		            'attack',
		            'decay',
		            'sustain',
		            'release'
		        ], Tone.Envelope.defaults);
		        Tone.Envelope.call(this, options);
		        options = this.defaultArg(options, Tone.ScaledEnvelope.defaults);
		        /** 
				 *  scale the incoming signal by an exponent
				 *  @type {Tone.Pow}
				 *  @private
				 */
		        this._exp = this.output = new Tone.Pow(options.exponent);
		        /**
				 *  scale the signal to the desired range
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._scale = this.output = new Tone.Scale(options.min, options.max);
		        this._sig.chain(this._exp, this._scale);
		    };
		    Tone.extend(Tone.ScaledEnvelope, Tone.Envelope);
		    /**
			 *  the default parameters
			 *  @static
			 */
		    Tone.ScaledEnvelope.defaults = {
		        'min': 0,
		        'max': 1,
		        'exponent': 1
		    };
		    /**
			 * The envelope's min output value. This is the value which it
			 * starts at. 
			 * @memberOf Tone.ScaledEnvelope#
			 * @type {number}
			 * @name min
			 */
		    Object.defineProperty(Tone.ScaledEnvelope.prototype, 'min', {
		        get: function () {
		            return this._scale.min;
		        },
		        set: function (min) {
		            this._scale.min = min;
		        }
		    });
		    /**
			 * The envelope's max output value. In other words, the value
			 * at the peak of the attack portion of the envelope. 
			 * @memberOf Tone.ScaledEnvelope#
			 * @type {number}
			 * @name max
			 */
		    Object.defineProperty(Tone.ScaledEnvelope.prototype, 'max', {
		        get: function () {
		            return this._scale.max;
		        },
		        set: function (max) {
		            this._scale.max = max;
		        }
		    });
		    /**
			 * The envelope's exponent value. 
			 * @memberOf Tone.ScaledEnvelope#
			 * @type {number}
			 * @name exponent
			 */
		    Object.defineProperty(Tone.ScaledEnvelope.prototype, 'exponent', {
		        get: function () {
		            return this._exp.value;
		        },
		        set: function (exp) {
		            this._exp.value = exp;
		        }
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.ScaledEnvelope} this
			 */
		    Tone.ScaledEnvelope.prototype.dispose = function () {
		        Tone.Envelope.prototype.dispose.call(this);
		        this._scale.dispose();
		        this._scale = null;
		        this._exp.dispose();
		        this._exp = null;
		        return this;
		    };
		    return Tone.ScaledEnvelope;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.FrequencyEnvelope is a Tone.ScaledEnvelope, but instead of `min` and `max`
			 *         it's got a `baseFrequency` and `octaves` parameter. 
			 *
			 *  @extends {Tone.Envelope}
			 *  @constructor
			 *  @param {Time|Object} [attack]	the attack time in seconds
			 *  @param {Time} [decay]	the decay time in seconds
			 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
			 *  @param {Time} [release]	the release time in seconds
			 *  @example
			 *  var env = new Tone.FrequencyEnvelope({
			 *  	"attack" : 0.2,
			 *  	"baseFrequency" : "C2",
			 *  	"octaves" : 4
			 *  });
			 *  scaledEnv.connect(oscillator.frequency);
			 */
		    Tone.FrequencyEnvelope = function () {
		        var options = this.optionsObject(arguments, [
		            'attack',
		            'decay',
		            'sustain',
		            'release'
		        ], Tone.Envelope.defaults);
		        Tone.ScaledEnvelope.call(this, options);
		        options = this.defaultArg(options, Tone.FrequencyEnvelope.defaults);
		        /**
				 *  Stores the octave value
				 *  @type {Positive}
				 *  @private
				 */
		        this._octaves = options.octaves;
		        //setup
		        this.baseFrequency = options.baseFrequency;
		        this.octaves = options.octaves;
		    };
		    Tone.extend(Tone.FrequencyEnvelope, Tone.Envelope);
		    /**
			 *  the default parameters
			 *  @static
			 */
		    Tone.FrequencyEnvelope.defaults = {
		        'baseFrequency': 200,
		        'octaves': 4,
		        'exponent': 2
		    };
		    /**
			 * The envelope's mininum output value. This is the value which it
			 * starts at. 
			 * @memberOf Tone.FrequencyEnvelope#
			 * @type {Frequency}
			 * @name baseFrequency
			 */
		    Object.defineProperty(Tone.FrequencyEnvelope.prototype, 'baseFrequency', {
		        get: function () {
		            return this._scale.min;
		        },
		        set: function (min) {
		            this._scale.min = this.toFrequency(min);
		        }
		    });
		    /**
			 * The number of octaves above the baseFrequency that the
			 * envelope will scale to.
			 * @memberOf Tone.FrequencyEnvelope#
			 * @type {Positive}
			 * @name octaves
			 */
		    Object.defineProperty(Tone.FrequencyEnvelope.prototype, 'octaves', {
		        get: function () {
		            return this._octaves;
		        },
		        set: function (octaves) {
		            this._octaves = octaves;
		            this._scale.max = this.baseFrequency * Math.pow(2, octaves);
		        }
		    });
		    /**
			 * The envelope's exponent value. 
			 * @memberOf Tone.FrequencyEnvelope#
			 * @type {number}
			 * @name exponent
			 */
		    Object.defineProperty(Tone.FrequencyEnvelope.prototype, 'exponent', {
		        get: function () {
		            return this._exp.value;
		        },
		        set: function (exp) {
		            this._exp.value = exp;
		        }
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.FrequencyEnvelope} this
			 */
		    Tone.FrequencyEnvelope.prototype.dispose = function () {
		        Tone.ScaledEnvelope.prototype.dispose.call(this);
		        return this;
		    };
		    return Tone.FrequencyEnvelope;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Gate only passes a signal through when the incoming 
			 *          signal exceeds a specified threshold. To do this, Gate uses 
			 *          a Tone.Follower to follow the amplitude of the incoming signal. 
			 *          A common implementation of this class is a [Noise Gate](https://en.wikipedia.org/wiki/Noise_gate).
			 *  
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {Decibels|Object} [threshold] The threshold above which the gate will open. 
			 *  @param {Time=} attack The follower's attack time
			 *  @param {Time=} release The follower's release time
			 *  @example
			 * var gate = new Tone.Gate(-30, 0.2, 0.3).toMaster();
			 * var mic = new Tone.Microphone().connect(gate);
			 * //the gate will only pass through the incoming 
			 * //signal when it's louder than -30db
			 */
		    Tone.Gate = function () {
		        Tone.call(this);
		        var options = this.optionsObject(arguments, [
		            'threshold',
		            'attack',
		            'release'
		        ], Tone.Gate.defaults);
		        /**
				 *  @type {Tone.Follower}
				 *  @private
				 */
		        this._follower = new Tone.Follower(options.attack, options.release);
		        /**
				 *  @type {Tone.GreaterThan}
				 *  @private
				 */
		        this._gt = new Tone.GreaterThan(this.dbToGain(options.threshold));
		        //the connections
		        this.input.connect(this.output);
		        //the control signal
		        this.input.chain(this._gt, this._follower, this.output.gain);
		    };
		    Tone.extend(Tone.Gate);
		    /**
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.Gate.defaults = {
		        'attack': 0.1,
		        'release': 0.1,
		        'threshold': -40
		    };
		    /**
			 * The threshold of the gate in decibels
			 * @memberOf Tone.Gate#
			 * @type {Decibels}
			 * @name threshold
			 */
		    Object.defineProperty(Tone.Gate.prototype, 'threshold', {
		        get: function () {
		            return this.gainToDb(this._gt.value);
		        },
		        set: function (thresh) {
		            this._gt.value = this.dbToGain(thresh);
		        }
		    });
		    /**
			 * The attack speed of the gate
			 * @memberOf Tone.Gate#
			 * @type {Time}
			 * @name attack
			 */
		    Object.defineProperty(Tone.Gate.prototype, 'attack', {
		        get: function () {
		            return this._follower.attack;
		        },
		        set: function (attackTime) {
		            this._follower.attack = attackTime;
		        }
		    });
		    /**
			 * The release speed of the gate
			 * @memberOf Tone.Gate#
			 * @type {Time}
			 * @name release
			 */
		    Object.defineProperty(Tone.Gate.prototype, 'release', {
		        get: function () {
		            return this._follower.release;
		        },
		        set: function (releaseTime) {
		            this._follower.release = releaseTime;
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Gate} this
			 */
		    Tone.Gate.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._follower.dispose();
		        this._gt.dispose();
		        this._follower = null;
		        this._gt = null;
		        return this;
		    };
		    return Tone.Gate;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  A Timeline State. Provides the methods: <code>setStateAtTime("state", time)</code>
			 *          and <code>getStateAtTime(time)</code>.
			 *
			 *  @extends {Tone.Timeline}
			 *  @param {String} initial The initial state of the TimelineState. 
			 *                          Defaults to <code>undefined</code>
			 */
		    Tone.TimelineState = function (initial) {
		        Tone.Timeline.call(this);
		        /**
				 *  The initial state
				 *  @private
				 *  @type {String}
				 */
		        this._initial = initial;
		    };
		    Tone.extend(Tone.TimelineState, Tone.Timeline);
		    /**
			 *  Returns the scheduled state scheduled before or at
			 *  the given time.
			 *  @param  {Time}  time  The time to query.
			 *  @return  {String}  The name of the state input in setStateAtTime.
			 */
		    Tone.TimelineState.prototype.getStateAtTime = function (time) {
		        var event = this.getEvent(time);
		        if (event !== null) {
		            return event.state;
		        } else {
		            return this._initial;
		        }
		    };
		    /**
			 *  Returns the scheduled state scheduled before or at
			 *  the given time.
			 *  @param  {String}  state The name of the state to set.
			 *  @param  {Time}  time  The time to query.
			 */
		    Tone.TimelineState.prototype.setStateAtTime = function (state, time) {
		        this.addEvent({
		            'state': state,
		            'time': this.toSeconds(time)
		        });
		    };
		    return Tone.TimelineState;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  A sample accurate clock which provides a callback at the given rate. 
			 *          While the callback is not sample-accurate (it is still susceptible to
			 *          loose JS timing), the time passed in as the argument to the callback
			 *          is precise. For most applications, it is better to use Tone.Transport
			 *          instead of the Clock by itself since you can synchronize multiple callbacks.
			 *
			 * 	@constructor
			 * 	@extends {Tone}
			 * 	@param {function} callback The callback to be invoked with the time of the audio event
			 * 	@param {Frequency} frequency The rate of the callback
			 * 	@example
			 * //the callback will be invoked approximately once a second
			 * //and will print the time exactly once a second apart.
			 * var clock = new Tone.Clock(function(time){
			 * 	console.log(time);
			 * }, 1);
			 */
		    Tone.Clock = function () {
		        var options = this.optionsObject(arguments, [
		            'callback',
		            'frequency'
		        ], Tone.Clock.defaults);
		        /**
				 *  The callback function to invoke at the scheduled tick.
				 *  @type  {Function}
				 */
		        this.callback = options.callback;
		        /**
				 *  The time which the clock will schedule events in advance
				 *  of the current time. Scheduling notes in advance improves
				 *  performance and decreases the chance for clicks caused
				 *  by scheduling events in the past. If set to "auto",
				 *  this value will be automatically computed based on the 
				 *  rate of requestAnimationFrame (0.016 seconds). Larger values
				 *  will yeild better performance, but at the cost of latency. 
				 *  Values less than 0.016 are not recommended.
				 *  @type {Number|String}
				 */
		        this._lookAhead = 'auto';
		        /**
				 *  The lookahead value which was automatically
				 *  computed using a time-based averaging.
				 *  @type {Number}
				 *  @private
				 */
		        this._computedLookAhead = 1 / 60;
		        /**
				 *  The value afterwhich events are thrown out
				 *  @type {Number}
				 *  @private
				 */
		        this._threshold = 0.5;
		        /**
				 *  The next time the callback is scheduled.
				 *  @type {Number}
				 *  @private
				 */
		        this._nextTick = -1;
		        /**
				 *  The last time the callback was invoked
				 *  @type  {Number}
				 *  @private
				 */
		        this._lastUpdate = 0;
		        /**
				 *  The id of the requestAnimationFrame
				 *  @type {Number}
				 *  @private
				 */
		        this._loopID = -1;
		        /**
				 *  The rate the callback function should be invoked. 
				 *  @type  {BPM}
				 *  @signal
				 */
		        this.frequency = new Tone.TimelineSignal(options.frequency, Tone.Type.Frequency);
		        /**
				 *  The number of times the callback was invoked. Starts counting at 0
				 *  and increments after the callback was invoked. 
				 *  @type {Ticks}
				 *  @readOnly
				 */
		        this.ticks = 0;
		        /**
				 *  The state timeline
				 *  @type {Tone.TimelineState}
				 *  @private
				 */
		        this._state = new Tone.TimelineState(Tone.State.Stopped);
		        /**
				 *  A pre-binded loop function to save a tiny bit of overhead
				 *  of rebinding the function on every frame.
				 *  @type  {Function}
				 *  @private
				 */
		        this._boundLoop = this._loop.bind(this);
		        this._readOnly('frequency');
		        //start the loop
		        this._loop();
		    };
		    Tone.extend(Tone.Clock);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.Clock.defaults = {
		        'callback': Tone.noOp,
		        'frequency': 1,
		        'lookAhead': 'auto'
		    };
		    /**
			 *  Returns the playback state of the source, either "started", "stopped" or "paused".
			 *  @type {Tone.State}
			 *  @readOnly
			 *  @memberOf Tone.Clock#
			 *  @name state
			 */
		    Object.defineProperty(Tone.Clock.prototype, 'state', {
		        get: function () {
		            return this._state.getStateAtTime(this.now());
		        }
		    });
		    /**
			 *  The time which the clock will schedule events in advance
			 *  of the current time. Scheduling notes in advance improves
			 *  performance and decreases the chance for clicks caused
			 *  by scheduling events in the past. If set to "auto",
			 *  this value will be automatically computed based on the 
			 *  rate of requestAnimationFrame (0.016 seconds). Larger values
			 *  will yeild better performance, but at the cost of latency. 
			 *  Values less than 0.016 are not recommended.
			 *  @type {Number|String}
			 *  @memberOf Tone.Clock#
			 *  @name lookAhead
			 */
		    Object.defineProperty(Tone.Clock.prototype, 'lookAhead', {
		        get: function () {
		            return this._lookAhead;
		        },
		        set: function (val) {
		            if (val === 'auto') {
		                this._lookAhead = 'auto';
		            } else {
		                this._lookAhead = this.toSeconds(val);
		            }
		        }
		    });
		    /**
			 *  Start the clock at the given time. Optionally pass in an offset
			 *  of where to start the tick counter from.
			 *  @param  {Time}  time    The time the clock should start
			 *  @param  {Ticks=}  offset  Where the tick counter starts counting from.
			 *  @return  {Tone.Clock}  this
			 */
		    Tone.Clock.prototype.start = function (time, offset) {
		        time = this.toSeconds(time);
		        if (this._state.getStateAtTime(time) !== Tone.State.Started) {
		            this._state.addEvent({
		                'state': Tone.State.Started,
		                'time': time,
		                'offset': offset
		            });
		        }
		        return this;
		    };
		    /**
			 *  Stop the clock. Stopping the clock resets the tick counter to 0.
			 *  @param {Time} [time=now] The time when the clock should stop.
			 *  @returns {Tone.Clock} this
			 *  @example
			 * clock.stop();
			 */
		    Tone.Clock.prototype.stop = function (time) {
		        time = this.toSeconds(time);
		        if (this._state.getStateAtTime(time) !== Tone.State.Stopped) {
		            this._state.setStateAtTime(Tone.State.Stopped, time);
		        }
		        return this;
		    };
		    /**
			 *  Pause the clock. Pausing does not reset the tick counter.
			 *  @param {Time} [time=now] The time when the clock should stop.
			 *  @returns {Tone.Clock} this
			 */
		    Tone.Clock.prototype.pause = function (time) {
		        time = this.toSeconds(time);
		        if (this._state.getStateAtTime(time) === Tone.State.Started) {
		            this._state.setStateAtTime(Tone.State.Paused, time);
		        }
		        return this;
		    };
		    /**
			 *  The scheduling loop.
			 *  @param  {Number}  time  The current page time starting from 0
			 *                          when the page was loaded.
			 *  @private
			 */
		    Tone.Clock.prototype._loop = function (time) {
		        this._loopID = requestAnimationFrame(this._boundLoop);
		        //compute the look ahead
		        if (this._lookAhead === 'auto') {
		            if (!this.isUndef(time)) {
		                var diff = (time - this._lastUpdate) / 1000;
		                this._lastUpdate = time;
		                //throw away large differences
		                if (diff < this._threshold) {
		                    //averaging
		                    this._computedLookAhead = (9 * this._computedLookAhead + diff) / 10;
		                }
		            }
		        } else {
		            this._computedLookAhead = this._lookAhead;
		        }
		        //get the frequency value to compute the value of the next loop
		        var now = this.now();
		        //if it's started
		        var lookAhead = this._computedLookAhead * 2;
		        var event = this._state.getEvent(now + lookAhead);
		        var state = Tone.State.Stopped;
		        if (event) {
		            state = event.state;
		            //if it was stopped and now started
		            if (this._nextTick === -1 && state === Tone.State.Started) {
		                this._nextTick = event.time;
		                if (!this.isUndef(event.offset)) {
		                    this.ticks = event.offset;
		                }
		            }
		        }
		        if (state === Tone.State.Started) {
		            while (now + lookAhead > this._nextTick) {
		                //catch up
		                if (now > this._nextTick + this._threshold) {
		                    this._nextTick = now;
		                }
		                var tickTime = this._nextTick;
		                this._nextTick += 1 / this.frequency.getValueAtTime(this._nextTick);
		                this.callback(tickTime);
		                this.ticks++;
		            }
		        } else if (state === Tone.State.Stopped) {
		            this._nextTick = -1;
		            this.ticks = 0;
		        }
		    };
		    /**
			 *  Returns the scheduled state at the given time.
			 *  @param  {Time}  time  The time to query.
			 *  @return  {String}  The name of the state input in setStateAtTime.
			 *  @example
			 * clock.start("+0.1");
			 * clock.getStateAtTime("+0.1"); //returns "started"
			 */
		    Tone.Clock.prototype.getStateAtTime = function (time) {
		        return this._state.getStateAtTime(time);
		    };
		    /**
			 *  Clean up
			 *  @returns {Tone.Clock} this
			 */
		    Tone.Clock.prototype.dispose = function () {
		        cancelAnimationFrame(this._loopID);
		        Tone.TimelineState.prototype.dispose.call(this);
		        this._writable('frequency');
		        this.frequency.dispose();
		        this.frequency = null;
		        this._boundLoop = Tone.noOp;
		        this._nextTick = Infinity;
		        this.callback = null;
		        this._state.dispose();
		        this._state = null;
		    };
		    return Tone.Clock;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Emitter gives classes which extend it
			 *         the ability to listen for and trigger events. 
			 *         Inspiration and reference from Jerome Etienne's [MicroEvent](https://github.com/jeromeetienne/microevent.js).
			 *         MIT (c) 2011 Jerome Etienne.
			 *         
			 *  @extends {Tone}
			 */
		    Tone.Emitter = function () {
		        /**
				 *  Contains all of the events.
				 *  @private
				 *  @type  {Object}
				 */
		        this._events = {};
		    };
		    Tone.extend(Tone.Emitter);
		    /**
			 *  Bind a callback to a specific event.
			 *  @param  {String}    event     The name of the event to listen for.
			 *  @param  {Function}  callback  The callback to invoke when the
			 *                                event is triggered
			 *  @return  {Tone.Emitter}    this
			 */
		    Tone.Emitter.prototype.on = function (event, callback) {
		        //split the event
		        var events = event.split(/\W+/);
		        for (var i = 0; i < events.length; i++) {
		            var eventName = events[i];
		            if (!this._events.hasOwnProperty(eventName)) {
		                this._events[eventName] = [];
		            }
		            this._events[eventName].push(callback);
		        }
		        return this;
		    };
		    /**
			 *  Remove the event listener.
			 *  @param  {String}    event     The event to stop listening to.
			 *  @param  {Function=}  callback  The callback which was bound to 
			 *                                the event with Tone.Emitter.on.
			 *                                If no callback is given, all callbacks
			 *                                events are removed.
			 *  @return  {Tone.Emitter}    this
			 */
		    Tone.Emitter.prototype.off = function (event, callback) {
		        var events = event.split(/\W+/);
		        for (var ev = 0; ev < events.length; ev++) {
		            event = events[ev];
		            if (this._events.hasOwnProperty(event)) {
		                if (Tone.prototype.isUndef(callback)) {
		                    this._events[event] = [];
		                } else {
		                    var eventList = this._events[event];
		                    for (var i = 0; i < eventList.length; i++) {
		                        if (eventList[i] === callback) {
		                            eventList.splice(i, 1);
		                        }
		                    }
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Invoke all of the callbacks bound to the event
			 *  with any arguments passed in. 
			 *  @param  {String}  event  The name of the event.
			 *  @param {*...} args The arguments to pass to the functions listening.
			 *  @return  {Tone.Emitter}  this
			 */
		    Tone.Emitter.prototype.trigger = function (event) {
		        if (this._events) {
		            var args = Array.prototype.slice.call(arguments, 1);
		            if (this._events.hasOwnProperty(event)) {
		                var eventList = this._events[event];
		                for (var i = 0, len = eventList.length; i < len; i++) {
		                    eventList[i].apply(this, args);
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Add Emitter functions (on/off/trigger) to the object
			 *  @param  {Object|Function}  object  The object or class to extend.
			 */
		    Tone.Emitter.mixin = function (object) {
		        var functions = [
		            'on',
		            'off',
		            'trigger'
		        ];
		        object._events = {};
		        for (var i = 0; i < functions.length; i++) {
		            var func = functions[i];
		            var emitterFunc = Tone.Emitter.prototype[func];
		            object[func] = emitterFunc;
		        }
		    };
		    /**
			 *  Clean up
			 *  @return  {Tone.Emitter}  this
			 */
		    Tone.Emitter.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._events = null;
		        return this;
		    };
		    return Tone.Emitter;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Similar to Tone.Timeline, but all events represent
			 *         intervals with both "time" and "duration" times. The 
			 *         events are placed in a tree structure optimized
			 *         for querying an intersection point with the timeline
			 *         events. Internally uses an [Interval Tree](https://en.wikipedia.org/wiki/Interval_tree)
			 *         to represent the data.
			 *  @extends {Tone}
			 */
		    Tone.IntervalTimeline = function () {
		        /**
				 *  The root node of the inteval tree
				 *  @type  {IntervalNode}
				 *  @private
				 */
		        this._root = null;
		        /**
				 *  Keep track of the length of the timeline.
				 *  @type  {Number}
				 *  @private
				 */
		        this._length = 0;
		    };
		    Tone.extend(Tone.IntervalTimeline);
		    /**
			 *  The event to add to the timeline. All events must 
			 *  have a time and duration value
			 *  @param  {Object}  event  The event to add to the timeline
			 *  @return  {Tone.IntervalTimeline}  this
			 */
		    Tone.IntervalTimeline.prototype.addEvent = function (event) {
		        if (this.isUndef(event.time) || this.isUndef(event.duration)) {
		            throw new Error('events must have time and duration parameters');
		        }
		        var node = new IntervalNode(event.time, event.time + event.duration, event);
		        if (this._root === null) {
		            this._root = node;
		        } else {
		            this._root.insert(node);
		        }
		        this._length++;
		        // Restructure tree to be balanced
		        while (node !== null) {
		            node.updateHeight();
		            node.updateMax();
		            this._rebalance(node);
		            node = node.parent;
		        }
		        return this;
		    };
		    /**
			 *  Remove an event from the timeline.
			 *  @param  {Object}  event  The event to remove from the timeline
			 *  @return  {Tone.IntervalTimeline}  this
			 */
		    Tone.IntervalTimeline.prototype.removeEvent = function (event) {
		        if (this._root !== null) {
		            var results = [];
		            this._root.search(event.time, results);
		            for (var i = 0; i < results.length; i++) {
		                var node = results[i];
		                if (node.event === event) {
		                    this._removeNode(node);
		                    this._length--;
		                    break;
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  The number of items in the timeline.
			 *  @type {Number}
			 *  @memberOf Tone.IntervalTimeline#
			 *  @name length
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.IntervalTimeline.prototype, 'length', {
		        get: function () {
		            return this._length;
		        }
		    });
		    /**
			 *  Remove events whose time time is after the given time
			 *  @param  {Time}  time  The time to query.
			 *  @returns {Tone.IntervalTimeline} this
			 */
		    Tone.IntervalTimeline.prototype.cancel = function (after) {
		        after = this.toSeconds(after);
		        this.forEachAfter(after, function (event) {
		            this.removeEvent(event);
		        }.bind(this));
		        return this;
		    };
		    /**
			 *  Set the root node as the given node
			 *  @param {IntervalNode} node
			 *  @private
			 */
		    Tone.IntervalTimeline.prototype._setRoot = function (node) {
		        this._root = node;
		        if (this._root !== null) {
		            this._root.parent = null;
		        }
		    };
		    /**
			 *  Replace the references to the node in the node's parent
			 *  with the replacement node.
			 *  @param  {IntervalNode}  node        
			 *  @param  {IntervalNode}  replacement 
			 *  @private
			 */
		    Tone.IntervalTimeline.prototype._replaceNodeInParent = function (node, replacement) {
		        if (node.parent !== null) {
		            if (node.isLeftChild()) {
		                node.parent.left = replacement;
		            } else {
		                node.parent.right = replacement;
		            }
		            this._rebalance(node.parent);
		        } else {
		            this._setRoot(replacement);
		        }
		    };
		    /**
			 *  Remove the node from the tree and replace it with 
			 *  a successor which follows the schema.
			 *  @param  {IntervalNode}  node
			 *  @private
			 */
		    Tone.IntervalTimeline.prototype._removeNode = function (node) {
		        if (node.left === null && node.right === null) {
		            this._replaceNodeInParent(node, null);
		        } else if (node.right === null) {
		            this._replaceNodeInParent(node, node.left);
		        } else if (node.left === null) {
		            this._replaceNodeInParent(node, node.right);
		        } else {
		            var balance = node.getBalance();
		            var replacement, temp;
		            if (balance > 0) {
		                if (node.left.right === null) {
		                    replacement = node.left;
		                    replacement.right = node.right;
		                    temp = replacement;
		                } else {
		                    replacement = node.left.right;
		                    while (replacement.right !== null) {
		                        replacement = replacement.right;
		                    }
		                    replacement.parent.right = replacement.left;
		                    temp = replacement.parent;
		                    replacement.left = node.left;
		                    replacement.right = node.right;
		                }
		            } else {
		                if (node.right.left === null) {
		                    replacement = node.right;
		                    replacement.left = node.left;
		                    temp = replacement;
		                } else {
		                    replacement = node.right.left;
		                    while (replacement.left !== null) {
		                        replacement = replacement.left;
		                    }
		                    replacement.parent = replacement.parent;
		                    replacement.parent.left = replacement.right;
		                    temp = replacement.parent;
		                    replacement.left = node.left;
		                    replacement.right = node.right;
		                }
		            }
		            if (node.parent !== null) {
		                if (node.isLeftChild()) {
		                    node.parent.left = replacement;
		                } else {
		                    node.parent.right = replacement;
		                }
		            } else {
		                this._setRoot(replacement);
		            }
		            // this._replaceNodeInParent(node, replacement);
		            this._rebalance(temp);
		        }
		        node.dispose();
		    };
		    /**
			 *  Rotate the tree to the left
			 *  @param  {IntervalNode}  node
			 *  @private
			 */
		    Tone.IntervalTimeline.prototype._rotateLeft = function (node) {
		        var parent = node.parent;
		        var isLeftChild = node.isLeftChild();
		        // Make node.right the new root of this sub tree (instead of node)
		        var pivotNode = node.right;
		        node.right = pivotNode.left;
		        pivotNode.left = node;
		        if (parent !== null) {
		            if (isLeftChild) {
		                parent.left = pivotNode;
		            } else {
		                parent.right = pivotNode;
		            }
		        } else {
		            this._setRoot(pivotNode);
		        }
		    };
		    /**
			 *  Rotate the tree to the right
			 *  @param  {IntervalNode}  node
			 *  @private
			 */
		    Tone.IntervalTimeline.prototype._rotateRight = function (node) {
		        var parent = node.parent;
		        var isLeftChild = node.isLeftChild();
		        // Make node.left the new root of this sub tree (instead of node)
		        var pivotNode = node.left;
		        node.left = pivotNode.right;
		        pivotNode.right = node;
		        if (parent !== null) {
		            if (isLeftChild) {
		                parent.left = pivotNode;
		            } else {
		                parent.right = pivotNode;
		            }
		        } else {
		            this._setRoot(pivotNode);
		        }
		    };
		    /**
			 *  Balance the BST
			 *  @param  {IntervalNode}  node
			 *  @private
			 */
		    Tone.IntervalTimeline.prototype._rebalance = function (node) {
		        var balance = node.getBalance();
		        if (balance > 1) {
		            if (node.left.getBalance() < 0) {
		                this._rotateLeft(node.left);
		            } else {
		                this._rotateRight(node);
		            }
		        } else if (balance < -1) {
		            if (node.right.getBalance() > 0) {
		                this._rotateRight(node.right);
		            } else {
		                this._rotateLeft(node);
		            }
		        }
		    };
		    /**
			 *  Get an event whose time and duration span the give time. Will
			 *  return the match whose "time" value is closest to the given time.
			 *  @param  {Object}  event  The event to add to the timeline
			 *  @return  {Object}  The event which spans the desired time
			 */
		    Tone.IntervalTimeline.prototype.getEvent = function (time) {
		        if (this._root !== null) {
		            var results = [];
		            this._root.search(time, results);
		            if (results.length > 0) {
		                var max = results[0];
		                for (var i = 1; i < results.length; i++) {
		                    if (results[i].low > max.low) {
		                        max = results[i];
		                    }
		                }
		                return max.event;
		            }
		        }
		        return null;
		    };
		    /**
			 *  Iterate over everything in the timeline.
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.IntervalTimeline} this
			 */
		    Tone.IntervalTimeline.prototype.forEach = function (callback) {
		        if (this._root !== null) {
		            var allNodes = [];
		            if (this._root !== null) {
		                this._root.traverse(function (node) {
		                    allNodes.push(node);
		                });
		            }
		            for (var i = 0; i < allNodes.length; i++) {
		                var ev = allNodes[i].event;
		                if (ev) {
		                    callback(ev);
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Iterate over everything in the array in which the given time
			 *  overlaps with the time and duration time of the event.
			 *  @param  {Time}  time The time to check if items are overlapping
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.IntervalTimeline} this
			 */
		    Tone.IntervalTimeline.prototype.forEachOverlap = function (time, callback) {
		        time = this.toSeconds(time);
		        if (this._root !== null) {
		            var results = [];
		            this._root.search(time, results);
		            for (var i = results.length - 1; i >= 0; i--) {
		                var ev = results[i].event;
		                if (ev) {
		                    callback(ev);
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Iterate over everything in the array in which the time is greater
			 *  than the given time.
			 *  @param  {Time}  time The time to check if items are before
			 *  @param  {Function}  callback The callback to invoke with every item
			 *  @returns {Tone.IntervalTimeline} this
			 */
		    Tone.IntervalTimeline.prototype.forEachAfter = function (time, callback) {
		        time = this.toSeconds(time);
		        if (this._root !== null) {
		            var results = [];
		            this._root.searchAfter(time, results);
		            for (var i = results.length - 1; i >= 0; i--) {
		                var ev = results[i].event;
		                if (ev) {
		                    callback(ev);
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Clean up
			 *  @return  {Tone.IntervalTimeline}  this
			 */
		    Tone.IntervalTimeline.prototype.dispose = function () {
		        var allNodes = [];
		        if (this._root !== null) {
		            this._root.traverse(function (node) {
		                allNodes.push(node);
		            });
		        }
		        for (var i = 0; i < allNodes.length; i++) {
		            allNodes[i].dispose();
		        }
		        allNodes = null;
		        this._root = null;
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	INTERVAL NODE HELPER
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Represents a node in the binary search tree, with the addition
			 *  of a "high" value which keeps track of the highest value of
			 *  its children. 
			 *  References: 
			 *  https://brooknovak.wordpress.com/2013/12/07/augmented-interval-tree-in-c/
			 *  http://www.mif.vu.lt/~valdas/ALGORITMAI/LITERATURA/Cormen/Cormen.pdf
			 *  @param {Number} low
			 *  @param {Number} high
			 *  @private
			 */
		    var IntervalNode = function (low, high, event) {
		        //the event container
		        this.event = event;
		        //the low value
		        this.low = low;
		        //the high value
		        this.high = high;
		        //the high value for this and all child nodes
		        this.max = this.high;
		        //the nodes to the left
		        this._left = null;
		        //the nodes to the right
		        this._right = null;
		        //the parent node
		        this.parent = null;
		        //the number of child nodes
		        this.height = 0;
		    };
		    /** 
			 *  Insert a node into the correct spot in the tree
			 *  @param  {IntervalNode}  node
			 */
		    IntervalNode.prototype.insert = function (node) {
		        if (node.low <= this.low) {
		            if (this.left === null) {
		                this.left = node;
		            } else {
		                this.left.insert(node);
		            }
		        } else {
		            if (this.right === null) {
		                this.right = node;
		            } else {
		                this.right.insert(node);
		            }
		        }
		    };
		    /**
			 *  Search the tree for nodes which overlap 
			 *  with the given point
			 *  @param  {Number}  point  The point to query
			 *  @param  {Array}  results  The array to put the results
			 */
		    IntervalNode.prototype.search = function (point, results) {
		        // If p is to the right of the rightmost point of any interval
		        // in this node and all children, there won't be any matches.
		        if (point > this.max) {
		            return;
		        }
		        // Search left children
		        if (this.left !== null) {
		            this.left.search(point, results);
		        }
		        // Check this node
		        if (this.low <= point && this.high >= point) {
		            results.push(this);
		        }
		        // If p is to the left of the time of this interval,
		        // then it can't be in any child to the right.
		        if (this.low > point) {
		            return;
		        }
		        // Search right children
		        if (this.right !== null) {
		            this.right.search(point, results);
		        }
		    };
		    /**
			 *  Search the tree for nodes which are less 
			 *  than the given point
			 *  @param  {Number}  point  The point to query
			 *  @param  {Array}  results  The array to put the results
			 */
		    IntervalNode.prototype.searchAfter = function (point, results) {
		        // Check this node
		        if (this.low >= point) {
		            results.push(this);
		            if (this.left !== null) {
		                this.left.searchAfter(point, results);
		            }
		        }
		        // search the right side
		        if (this.right !== null) {
		            this.right.searchAfter(point, results);
		        }
		    };
		    /**
			 *  Invoke the callback on this element and both it's branches
			 *  @param  {Function}  callback
			 */
		    IntervalNode.prototype.traverse = function (callback) {
		        callback(this);
		        if (this.left !== null) {
		            this.left.traverse(callback);
		        }
		        if (this.right !== null) {
		            this.right.traverse(callback);
		        }
		    };
		    /**
			 *  Update the height of the node
			 */
		    IntervalNode.prototype.updateHeight = function () {
		        if (this.left !== null && this.right !== null) {
		            this.height = Math.max(this.left.height, this.right.height) + 1;
		        } else if (this.right !== null) {
		            this.height = this.right.height + 1;
		        } else if (this.left !== null) {
		            this.height = this.left.height + 1;
		        } else {
		            this.height = 0;
		        }
		    };
		    /**
			 *  Update the height of the node
			 */
		    IntervalNode.prototype.updateMax = function () {
		        this.max = this.high;
		        if (this.left !== null) {
		            this.max = Math.max(this.max, this.left.max);
		        }
		        if (this.right !== null) {
		            this.max = Math.max(this.max, this.right.max);
		        }
		    };
		    /**
			 *  The balance is how the leafs are distributed on the node
			 *  @return  {Number}  Negative numbers are balanced to the right
			 */
		    IntervalNode.prototype.getBalance = function () {
		        var balance = 0;
		        if (this.left !== null && this.right !== null) {
		            balance = this.left.height - this.right.height;
		        } else if (this.left !== null) {
		            balance = this.left.height + 1;
		        } else if (this.right !== null) {
		            balance = -(this.right.height + 1);
		        }
		        return balance;
		    };
		    /**
			 *  @returns {Boolean} true if this node is the left child
			 *  of its parent
			 */
		    IntervalNode.prototype.isLeftChild = function () {
		        return this.parent !== null && this.parent.left === this;
		    };
		    /**
			 *  get/set the left node
			 *  @type {IntervalNode}
			 */
		    Object.defineProperty(IntervalNode.prototype, 'left', {
		        get: function () {
		            return this._left;
		        },
		        set: function (node) {
		            this._left = node;
		            if (node !== null) {
		                node.parent = this;
		            }
		            this.updateHeight();
		            this.updateMax();
		        }
		    });
		    /**
			 *  get/set the right node
			 *  @type {IntervalNode}
			 */
		    Object.defineProperty(IntervalNode.prototype, 'right', {
		        get: function () {
		            return this._right;
		        },
		        set: function (node) {
		            this._right = node;
		            if (node !== null) {
		                node.parent = this;
		            }
		            this.updateHeight();
		            this.updateMax();
		        }
		    });
		    /**
			 *  null out references.
			 */
		    IntervalNode.prototype.dispose = function () {
		        this.parent = null;
		        this._left = null;
		        this._right = null;
		        this.event = null;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	END INTERVAL NODE HELPER
		    ///////////////////////////////////////////////////////////////////////////
		    return Tone.IntervalTimeline;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Transport for timing musical events.
			 *          Supports tempo curves and time changes. Unlike browser-based timing (setInterval, requestAnimationFrame)
			 *          Tone.Transport timing events pass in the exact time of the scheduled event
			 *          in the argument of the callback function. Pass that time value to the object
			 *          you're scheduling. <br><br>
			 *          A single transport is created for you when the library is initialized. 
			 *          <br><br>
			 *          The transport emits the events: "start", "stop", "pause", and "loop" which are
			 *          called with the time of that event as the argument. 
			 *
			 *  @extends {Tone.Emitter}
			 *  @singleton
			 *  @example
			 * //repeated event every 8th note
			 * Tone.Transport.setInterval(function(time){
			 * 	//do something with the time
			 * }, "8n");
			 *  @example
			 * //one time event 1 second in the future
			 * Tone.Transport.setTimeout(function(time){
			 * 	//do something with the time
			 * }, 1);
			 *  @example
			 * //event fixed to the Transports timeline. 
			 * Tone.Transport.setTimeline(function(time){
			 * 	//do something with the time
			 * }, "16:0:0");
			 */
		    Tone.Transport = function () {
		        Tone.Emitter.call(this);
		        ///////////////////////////////////////////////////////////////////////
		        //	LOOPING
		        //////////////////////////////////////////////////////////////////////
		        /** 
				 * 	If the transport loops or not.
				 *  @type {boolean}
				 */
		        this.loop = false;
		        /** 
				 * 	The loop start position in ticks
				 *  @type {Ticks}
				 *  @private
				 */
		        this._loopStart = 0;
		        /** 
				 * 	The loop end position in ticks
				 *  @type {Ticks}
				 *  @private
				 */
		        this._loopEnd = 0;
		        ///////////////////////////////////////////////////////////////////////
		        //	CLOCK/TEMPO
		        //////////////////////////////////////////////////////////////////////
		        /**
				 *  Pulses per quarter is the number of ticks per quarter note.
				 *  @private
				 *  @type  {Number}
				 */
		        this._ppq = TransportConstructor.defaults.PPQ;
		        /**
				 *  watches the main oscillator for timing ticks
				 *  initially starts at 120bpm
				 *  @private
				 *  @type {Tone.Clock}
				 */
		        this._clock = new Tone.Clock({
		            'callback': this._processTick.bind(this),
		            'frequency': 0
		        });
		        /**
				 *  The Beats Per Minute of the Transport. 
				 *  @type {BPM}
				 *  @signal
				 *  @example
				 * Tone.Transport.bpm.value = 80;
				 * //ramp the bpm to 120 over 10 seconds
				 * Tone.Transport.bpm.rampTo(120, 10);
				 */
		        this.bpm = this._clock.frequency;
		        this.bpm._toUnits = this._toUnits.bind(this);
		        this.bpm._fromUnits = this._fromUnits.bind(this);
		        this.bpm.units = Tone.Type.BPM;
		        this.bpm.value = TransportConstructor.defaults.bpm;
		        this._readOnly('bpm');
		        /**
				 *  The time signature, or more accurately the numerator
				 *  of the time signature over a denominator of 4. 
				 *  @type {Number}
				 *  @private
				 */
		        this._timeSignature = TransportConstructor.defaults.timeSignature;
		        ///////////////////////////////////////////////////////////////////////
		        //	TIMELINE EVENTS
		        //////////////////////////////////////////////////////////////////////
		        /**
				 *  All the events in an object to keep track by ID
				 *  @type {Object}
				 *  @private
				 */
		        this._scheduledEvents = {};
		        /**
				 *  The event ID counter
				 *  @type {Number}
				 *  @private
				 */
		        this._eventID = 0;
		        /**
				 * 	The scheduled events.
				 *  @type {Tone.Timeline}
				 *  @private
				 */
		        this._timeline = new Tone.Timeline();
		        /**
				 *  Repeated events
				 *  @type {Array}
				 *  @private
				 */
		        this._repeatedEvents = new Tone.IntervalTimeline();
		        /**
				 *  Events that occur once
				 *  @type {Array}
				 *  @private
				 */
		        this._onceEvents = new Tone.Timeline();
		        /** 
				 *  All of the synced Signals
				 *  @private 
				 *  @type {Array}
				 */
		        this._syncedSignals = [];
		        ///////////////////////////////////////////////////////////////////////
		        //	SWING
		        //////////////////////////////////////////////////////////////////////
		        var swingSeconds = this.notationToSeconds(TransportConstructor.defaults.swingSubdivision, TransportConstructor.defaults.bpm, TransportConstructor.defaults.timeSignature);
		        /**
				 *  The subdivision of the swing
				 *  @type  {Ticks}
				 *  @private
				 */
		        this._swingTicks = swingSeconds / (60 / TransportConstructor.defaults.bpm) * this._ppq;
		        /**
				 *  The swing amount
				 *  @type {NormalRange}
				 *  @private
				 */
		        this._swingAmount = 0;
		    };
		    Tone.extend(Tone.Transport, Tone.Emitter);
		    /**
			 *  the defaults
			 *  @type {Object}
			 *  @const
			 *  @static
			 */
		    Tone.Transport.defaults = {
		        'bpm': 120,
		        'swing': 0,
		        'swingSubdivision': '16n',
		        'timeSignature': 4,
		        'loopStart': 0,
		        'loopEnd': '4m',
		        'PPQ': 48
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	TICKS
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  called on every tick
			 *  @param   {number} tickTime clock relative tick time
			 *  @private
			 */
		    Tone.Transport.prototype._processTick = function (tickTime) {
		        //handle swing
		        if (this._swingAmount > 0 && this._clock.ticks % this._ppq !== 0 && //not on a downbeat
		            this._clock.ticks % this._swingTicks === 0) {
		            //add some swing
		            tickTime += this.ticksToSeconds(this._swingTicks) * this._swingAmount;
		        }
		        //do the loop test
		        if (this.loop) {
		            if (this._clock.ticks === this._loopEnd) {
		                this.ticks = this._loopStart;
		                this.trigger('loop', tickTime);
		            }
		        }
		        var ticks = this._clock.ticks;
		        //fire the next tick events if their time has come
		        this._timeline.forEachAtTime(ticks, function (event) {
		            event.callback(tickTime);
		        });
		        //process the repeated events
		        this._repeatedEvents.forEachOverlap(ticks, function (event) {
		            if ((ticks - event.time) % event.interval === 0) {
		                event.callback(tickTime);
		            }
		        });
		        //process the single occurrence events
		        this._onceEvents.forEachBefore(ticks, function (event) {
		            event.callback(tickTime);
		        });
		        //and clear the single occurrence timeline
		        this._onceEvents.cancelBefore(ticks);
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	SCHEDULABLE EVENTS
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  Schedule an event along the timeline.
			 *  @param {Function} callback The callback to be invoked at the time.
			 *  @param {Time}  time The time to invoke the callback at.
			 *  @return {Number} The id of the event which can be used for canceling the event. 
			 *  @example
			 * //trigger the callback when the Transport reaches the desired time
			 * Tone.Transport.schedule(function(time){
			 * 	envelope.triggerAttack(time);
			 * }, "128i");
			 */
		    Tone.Transport.prototype.schedule = function (callback, time) {
		        var event = {
		            'time': this.toTicks(time),
		            'callback': callback
		        };
		        var id = this._eventID++;
		        this._scheduledEvents[id.toString()] = {
		            'event': event,
		            'timeline': this._timeline
		        };
		        this._timeline.addEvent(event);
		        return id;
		    };
		    /**
			 *  Schedule a repeated event along the timeline. The event will fire
			 *  at the `interval` starting at the `startTime` and for the specified
			 *  `duration`. 
			 *  @param  {Function}  callback   The callback to invoke.
			 *  @param  {Time}    interval   The duration between successive
			 *                               callbacks.
			 *  @param  {Time=}    startTime  When along the timeline the events should
			 *                               start being invoked.
			 *  @param {Time} [duration=Infinity] How long the event should repeat. 
			 *  @return  {Number}    The ID of the scheduled event. Use this to cancel
			 *                           the event. 
			 *  @example
			 * //a callback invoked every eighth note after the first measure
			 * Tone.Transport.scheduleRepeat(callback, "8n", "1m");
			 */
		    Tone.Transport.prototype.scheduleRepeat = function (callback, interval, startTime, duration) {
		        if (interval <= 0) {
		            throw new Error('repeat events must have an interval larger than 0');
		        }
		        var event = {
		            'time': this.toTicks(startTime),
		            'duration': this.toTicks(this.defaultArg(duration, Infinity)),
		            'interval': this.toTicks(interval),
		            'callback': callback
		        };
		        var id = this._eventID++;
		        this._scheduledEvents[id.toString()] = {
		            'event': event,
		            'timeline': this._repeatedEvents
		        };
		        this._repeatedEvents.addEvent(event);
		        return id;
		    };
		    /**
			 *  Schedule an event that will be removed after it is invoked. 
			 *  Note that if the given time is less than the current transport time, 
			 *  the event will be invoked immediately. 
			 *  @param {Function} callback The callback to invoke once.
			 *  @param {Time} time The time the callback should be invoked.
			 *  @returns {Number} The ID of the scheduled event. 
			 */
		    Tone.Transport.prototype.scheduleOnce = function (callback, time) {
		        var event = {
		            'time': this.toTicks(time),
		            'callback': callback
		        };
		        var id = this._eventID++;
		        this._scheduledEvents[id.toString()] = {
		            'event': event,
		            'timeline': this._onceEvents
		        };
		        this._onceEvents.addEvent(event);
		        return id;
		    };
		    /**
			 *  Clear the passed in event id from the timeline
			 *  @param {Number} eventId The id of the event.
			 *  @returns {Tone.Transport} this
			 */
		    Tone.Transport.prototype.clear = function (eventId) {
		        if (this._scheduledEvents.hasOwnProperty(eventId)) {
		            var item = this._scheduledEvents[eventId.toString()];
		            item.timeline.removeEvent(item.event);
		            delete this._scheduledEvents[eventId.toString()];
		        }
		        return this;
		    };
		    /**
			 *  Remove scheduled events from the timeline after
			 *  the given time. Repeated events will be removed
			 *  if their startTime is after the given time
			 *  @param {Time} [after=0] Clear all events after
			 *                          this time. 
			 *  @returns {Tone.Transport} this
			 */
		    Tone.Transport.prototype.cancel = function (after) {
		        after = this.defaultArg(after, 0);
		        after = this.toTicks(after);
		        this._timeline.cancel(after);
		        this._onceEvents.cancel(after);
		        this._repeatedEvents.cancel(after);
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	QUANTIZATION
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  Returns the time closest time (equal to or after the given time) that aligns 
			 *  to the subidivision. 
			 *  @param {Time} time The time value to quantize to the given subdivision
			 *  @param  {String} [subdivision="4n"] The subdivision to quantize to.
			 *  @return {Number} 	the time in seconds until the next subdivision.
			 *  @example
			 * Tone.Transport.bpm.value = 120;
			 * Tone.Transport.quantize("3 * 4n", "1m"); //return 0.5
			 * //if the clock is started, it will return a value less than 0.5
			 */
		    Tone.Transport.prototype.quantize = function (time, subdivision) {
		        subdivision = this.defaultArg(subdivision, '4n');
		        var tickTime = this.toTicks(time);
		        subdivision = this.toTicks(subdivision);
		        var remainingTicks = subdivision - tickTime % subdivision;
		        if (remainingTicks === subdivision) {
		            remainingTicks = 0;
		        }
		        var now = this.now();
		        if (this.state === Tone.State.Started) {
		            now = this._clock._nextTick;
		        }
		        return this.toSeconds(time, now) + this.ticksToSeconds(remainingTicks);
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	START/STOP/PAUSE
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  Returns the playback state of the source, either "started", "stopped", or "paused"
			 *  @type {Tone.State}
			 *  @readOnly
			 *  @memberOf Tone.Transport#
			 *  @name state
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'state', {
		        get: function () {
		            return this._clock.getStateAtTime(this.now());
		        }
		    });
		    /**
			 *  Start the transport and all sources synced to the transport.
			 *  @param  {Time} [time=now] The time when the transport should start.
			 *  @param  {Time=} offset The timeline offset to start the transport.
			 *  @returns {Tone.Transport} this
			 *  @example
			 * //start the transport in one second starting at beginning of the 5th measure. 
			 * Tone.Transport.start("+1", "4:0:0");
			 */
		    Tone.Transport.prototype.start = function (time, offset) {
		        time = this.toSeconds(time);
		        if (!this.isUndef(offset)) {
		            offset = this.toTicks(offset);
		        } else {
		            offset = this.defaultArg(offset, this._clock.ticks);
		        }
		        //start the clock
		        this._clock.start(time, offset);
		        this.trigger('start', time, this.ticksToSeconds(offset));
		        return this;
		    };
		    /**
			 *  Stop the transport and all sources synced to the transport.
			 *  @param  {Time} [time=now] The time when the transport should stop. 
			 *  @returns {Tone.Transport} this
			 *  @example
			 * Tone.Transport.stop();
			 */
		    Tone.Transport.prototype.stop = function (time) {
		        time = this.toSeconds(time);
		        this._clock.stop(time);
		        this.trigger('stop', time);
		        return this;
		    };
		    /**
			 *  Pause the transport and all sources synced to the transport.
			 *  @param  {Time} [time=now]
			 *  @returns {Tone.Transport} this
			 */
		    Tone.Transport.prototype.pause = function (time) {
		        time = this.toSeconds(time);
		        this._clock.pause(time);
		        this.trigger('pause', time);
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	SETTERS/GETTERS
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  The time signature as just the numerator over 4. 
			 *  For example 4/4 would be just 4 and 6/8 would be 3.
			 *  @memberOf Tone.Transport#
			 *  @type {Number|Array}
			 *  @name timeSignature
			 *  @example
			 * //common time
			 * Tone.Transport.timeSignature = 4;
			 * // 7/8
			 * Tone.Transport.timeSignature = [7, 8];
			 * //this will be reduced to a single number
			 * Tone.Transport.timeSignature; //returns 3.5
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'timeSignature', {
		        get: function () {
		            return this._timeSignature;
		        },
		        set: function (timeSig) {
		            if (this.isArray(timeSig)) {
		                timeSig = timeSig[0] / timeSig[1] * 4;
		            }
		            this._timeSignature = timeSig;
		        }
		    });
		    /**
			 * When the Tone.Transport.loop = true, this is the starting position of the loop.
			 * @memberOf Tone.Transport#
			 * @type {Time}
			 * @name loopStart
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'loopStart', {
		        get: function () {
		            return this.ticksToSeconds(this._loopStart);
		        },
		        set: function (startPosition) {
		            this._loopStart = this.toTicks(startPosition);
		        }
		    });
		    /**
			 * When the Tone.Transport.loop = true, this is the ending position of the loop.
			 * @memberOf Tone.Transport#
			 * @type {Time}
			 * @name loopEnd
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'loopEnd', {
		        get: function () {
		            return this.ticksToSeconds(this._loopEnd);
		        },
		        set: function (endPosition) {
		            this._loopEnd = this.toTicks(endPosition);
		        }
		    });
		    /**
			 *  Set the loop start and stop at the same time. 
			 *  @param {Time} startPosition 
			 *  @param {Time} endPosition   
			 *  @returns {Tone.Transport} this
			 *  @example
			 * //loop over the first measure
			 * Tone.Transport.setLoopPoints(0, "1m");
			 * Tone.Transport.loop = true;
			 */
		    Tone.Transport.prototype.setLoopPoints = function (startPosition, endPosition) {
		        this.loopStart = startPosition;
		        this.loopEnd = endPosition;
		        return this;
		    };
		    /**
			 *  The swing value. Between 0-1 where 1 equal to 
			 *  the note + half the subdivision.
			 *  @memberOf Tone.Transport#
			 *  @type {NormalRange}
			 *  @name swing
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'swing', {
		        get: function () {
		            return this._swingAmount * 2;
		        },
		        set: function (amount) {
		            //scale the values to a normal range
		            this._swingAmount = amount * 0.5;
		        }
		    });
		    /**
			 *  Set the subdivision which the swing will be applied to. 
			 *  The default values is a 16th note. Value must be less 
			 *  than a quarter note.
			 *  
			 *  @memberOf Tone.Transport#
			 *  @type {Time}
			 *  @name swingSubdivision
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'swingSubdivision', {
		        get: function () {
		            return this.toNotation(this._swingTicks + 'i');
		        },
		        set: function (subdivision) {
		            this._swingTicks = this.toTicks(subdivision);
		        }
		    });
		    /**
			 *  The Transport's position in MEASURES:BEATS:SIXTEENTHS.
			 *  Setting the value will jump to that position right away. 
			 *  
			 *  @memberOf Tone.Transport#
			 *  @type {TransportTime}
			 *  @name position
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'position', {
		        get: function () {
		            var quarters = this.ticks / this._ppq;
		            var measures = Math.floor(quarters / this._timeSignature);
		            var sixteenths = quarters % 1 * 4;
		            //if the sixteenths aren't a whole number, fix their length
		            if (sixteenths % 1 > 0) {
		                sixteenths = sixteenths.toFixed(3);
		            }
		            quarters = Math.floor(quarters) % this._timeSignature;
		            var progress = [
		                measures,
		                quarters,
		                sixteenths
		            ];
		            return progress.join(':');
		        },
		        set: function (progress) {
		            var ticks = this.toTicks(progress);
		            this.ticks = ticks;
		        }
		    });
		    /**
			 *  The Transport's loop position as a normalized value. Always
			 *  returns 0 if the transport if loop is not true. 
			 *  @memberOf Tone.Transport#
			 *  @name progress
			 *  @type {NormalRange}
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'progress', {
		        get: function () {
		            if (this.loop) {
		                return (this.ticks - this._loopStart) / (this._loopEnd - this._loopStart);
		            } else {
		                return 0;
		            }
		        }
		    });
		    /**
			 *  The transports current tick position.
			 *  
			 *  @memberOf Tone.Transport#
			 *  @type {Ticks}
			 *  @name ticks
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'ticks', {
		        get: function () {
		            return this._clock.ticks;
		        },
		        set: function (t) {
		            this._clock.ticks = t;
		        }
		    });
		    /**
			 *  Pulses Per Quarter note. This is the smallest resolution
			 *  the Transport timing supports. This should be set once
			 *  on initialization and not set again. Changing this value 
			 *  after other objects have been created can cause problems. 
			 *  
			 *  @memberOf Tone.Transport#
			 *  @type {Number}
			 *  @name PPQ
			 */
		    Object.defineProperty(Tone.Transport.prototype, 'PPQ', {
		        get: function () {
		            return this._ppq;
		        },
		        set: function (ppq) {
		            this._ppq = ppq;
		            this.bpm.value = this.bpm.value;
		        }
		    });
		    /**
			 *  Convert from BPM to frequency (factoring in PPQ)
			 *  @param  {BPM}  bpm The BPM value to convert to frequency
			 *  @return  {Frequency}  The BPM as a frequency with PPQ factored in.
			 *  @private
			 */
		    Tone.Transport.prototype._fromUnits = function (bpm) {
		        return 1 / (60 / bpm / this.PPQ);
		    };
		    /**
			 *  Convert from frequency (with PPQ) into BPM
			 *  @param  {Frequency}  freq The clocks frequency to convert to BPM
			 *  @return  {BPM}  The frequency value as BPM.
			 *  @private
			 */
		    Tone.Transport.prototype._toUnits = function (freq) {
		        return freq / this.PPQ * 60;
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	SYNCING
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  Attaches the signal to the tempo control signal so that 
			 *  any changes in the tempo will change the signal in the same
			 *  ratio. 
			 *  
			 *  @param  {Tone.Signal} signal 
			 *  @param {number=} ratio Optionally pass in the ratio between
			 *                         the two signals. Otherwise it will be computed
			 *                         based on their current values. 
			 *  @returns {Tone.Transport} this
			 */
		    Tone.Transport.prototype.syncSignal = function (signal, ratio) {
		        if (!ratio) {
		            //get the sync ratio
		            if (signal._param.value !== 0) {
		                ratio = signal._param.value / this.bpm._param.value;
		            } else {
		                ratio = 0;
		            }
		        }
		        var ratioSignal = new Tone.Gain(ratio);
		        this.bpm.chain(ratioSignal, signal._param);
		        this._syncedSignals.push({
		            'ratio': ratioSignal,
		            'signal': signal,
		            'initial': signal._param.value
		        });
		        signal._param.value = 0;
		        return this;
		    };
		    /**
			 *  Unsyncs a previously synced signal from the transport's control. 
			 *  See Tone.Transport.syncSignal.
			 *  @param  {Tone.Signal} signal 
			 *  @returns {Tone.Transport} this
			 */
		    Tone.Transport.prototype.unsyncSignal = function (signal) {
		        for (var i = this._syncedSignals.length - 1; i >= 0; i--) {
		            var syncedSignal = this._syncedSignals[i];
		            if (syncedSignal.signal === signal) {
		                syncedSignal.ratio.dispose();
		                syncedSignal.signal._param.value = syncedSignal.initial;
		                this._syncedSignals.splice(i, 1);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Transport} this
			 *  @private
			 */
		    Tone.Transport.prototype.dispose = function () {
		        Tone.Emitter.prototype.dispose.call(this);
		        this._clock.dispose();
		        this._clock = null;
		        this._writable('bpm');
		        this.bpm = null;
		        this._timeline.dispose();
		        this._timeline = null;
		        this._onceEvents.dispose();
		        this._onceEvents = null;
		        this._repeatedEvents.dispose();
		        this._repeatedEvents = null;
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	DEPRECATED FUNCTIONS
		    //	(will be removed in r7)
		    ///////////////////////////////////////////////////////////////////////////////
		    /**
			 *  @deprecated Use Tone.scheduleRepeat instead.
			 *  Set a callback for a recurring event.
			 *  @param {function} callback
			 *  @param {Time}   interval 
			 *  @return {number} the id of the interval
			 *  @example
			 *  //triggers a callback every 8th note with the exact time of the event
			 *  Tone.Transport.setInterval(function(time){
			 *  	envelope.triggerAttack(time);
			 *  }, "8n");
			 *  @private
			 */
		    Tone.Transport.prototype.setInterval = function (callback, interval) {
		        console.warn('This method is deprecated. Use Tone.Transport.scheduleRepeat instead.');
		        return Tone.Transport.scheduleRepeat(callback, interval);
		    };
		    /**
			 *  @deprecated Use Tone.cancel instead.
			 *  Stop and ongoing interval.
			 *  @param  {number} intervalID  The ID of interval to remove. The interval
			 *                               ID is given as the return value in Tone.Transport.setInterval.
			 *  @return {boolean}            	true if the event was removed
			 *  @private
			 */
		    Tone.Transport.prototype.clearInterval = function (id) {
		        console.warn('This method is deprecated. Use Tone.Transport.clear instead.');
		        return Tone.Transport.clear(id);
		    };
		    /**
			 *  @deprecated Use Tone.Note instead.
			 *  Set a timeout to occur after time from now. NB: the transport must be 
			 *  running for this to be triggered. All timeout events are cleared when the 
			 *  transport is stopped. 
			 *
			 *  @param {function} callback 
			 *  @param {Time}   time    The time (from now) that the callback will be invoked.
			 *  @return {number} The id of the timeout.
			 *  @example
			 *  //trigger an event to happen 1 second from now
			 *  Tone.Transport.setTimeout(function(time){
			 *  	player.start(time);
			 *  }, 1)
			 *  @private
			 */
		    Tone.Transport.prototype.setTimeout = function (callback, timeout) {
		        console.warn('This method is deprecated. Use Tone.Transport.scheduleOnce instead.');
		        return Tone.Transport.scheduleOnce(callback, timeout);
		    };
		    /**
			 *  @deprecated Use Tone.Note instead.
			 *  Clear a timeout using it's ID.
			 *  @param  {number} intervalID  The ID of timeout to remove. The timeout
			 *                               ID is given as the return value in Tone.Transport.setTimeout.
			 *  @return {boolean}           true if the timeout was removed
			 *  @private
			 */
		    Tone.Transport.prototype.clearTimeout = function (id) {
		        console.warn('This method is deprecated. Use Tone.Transport.clear instead.');
		        return Tone.Transport.clear(id);
		    };
		    /**
			 *  @deprecated Use Tone.Note instead.
			 *  Timeline events are synced to the timeline of the Tone.Transport.
			 *  Unlike Timeout, Timeline events will restart after the 
			 *  Tone.Transport has been stopped and restarted. 
			 *
			 *  @param {function} 	callback 	
			 *  @param {Time}  time  
			 *  @return {number} 				the id for clearing the transportTimeline event
			 *  @example
			 *  //trigger the start of a part on the 16th measure
			 *  Tone.Transport.setTimeline(function(time){
			 *  	part.start(time);
			 *  }, "16m");
			 *  @private
			 */
		    Tone.Transport.prototype.setTimeline = function (callback, time) {
		        console.warn('This method is deprecated. Use Tone.Transport.schedule instead.');
		        return Tone.Transport.schedule(callback, time);
		    };
		    /**
			 *  @deprecated Use Tone.Note instead.
			 *  Clear the timeline event.
			 *  @param  {number} id 
			 *  @return {boolean} true if it was removed
			 *  @private
			 */
		    Tone.Transport.prototype.clearTimeline = function (id) {
		        console.warn('This method is deprecated. Use Tone.Transport.clear instead.');
		        return Tone.Transport.clear(id);
		    };
		    ///////////////////////////////////////////////////////////////////////////////
		    //	INITIALIZATION
		    ///////////////////////////////////////////////////////////////////////////////
		    var TransportConstructor = Tone.Transport;
		    Tone._initAudioContext(function () {
		        if (typeof Tone.Transport === 'function') {
		            //a single transport object
		            Tone.Transport = new Tone.Transport();
		        } else {
		            //stop the clock
		            Tone.Transport.stop();
		            //get the previous values
		            var prevSettings = Tone.Transport.get();
		            //destory the old transport
		            Tone.Transport.dispose();
		            //make new Transport insides
		            TransportConstructor.call(Tone.Transport);
		            //set the previous config
		            Tone.Transport.set(prevSettings);
		        }
		    });
		    return Tone.Transport;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Volume is a simple volume node, useful for creating a volume fader. 
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {Decibels} [volume=0] the initial volume
			 *  @example
			 * var vol = new Tone.Volume(-12);
			 * instrument.chain(vol, Tone.Master);
			 */
		    Tone.Volume = function () {
		        var options = this.optionsObject(arguments, ['volume'], Tone.Volume.defaults);
		        /**
				 * the output node
				 * @type {GainNode}
				 * @private
				 */
		        this.output = this.input = new Tone.Gain(options.volume, Tone.Type.Decibels);
		        /**
				 *  The volume control in decibels. 
				 *  @type {Decibels}
				 *  @signal
				 */
		        this.volume = this.output.gain;
		        this._readOnly('volume');
		    };
		    Tone.extend(Tone.Volume);
		    /**
			 *  Defaults
			 *  @type  {Object}
			 *  @const
			 *  @static
			 */
		    Tone.Volume.defaults = { 'volume': 0 };
		    /**
			 *  clean up
			 *  @returns {Tone.Volume} this
			 */
		    Tone.Volume.prototype.dispose = function () {
		        this.input.dispose();
		        Tone.prototype.dispose.call(this);
		        this._writable('volume');
		        this.volume.dispose();
		        this.volume = null;
		        return this;
		    };
		    return Tone.Volume;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Base class for sources. Sources have start/stop methods
			 *          and the ability to be synced to the 
			 *          start/stop of Tone.Transport. 
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @example
			 * //Multiple state change events can be chained together,
			 * //but must be set in the correct order and with ascending times
			 * 
			 * // OK
			 * state.start().stop("+0.2");
			 * // AND
			 * state.start().stop("+0.2").start("+0.4").stop("+0.7")
			 *
			 * // BAD
			 * state.stop("+0.2").start();
			 * // OR
			 * state.start("+0.3").stop("+0.2");
			 * 
			 */
		    Tone.Source = function (options) {
		        //Sources only have an output and no input
		        Tone.call(this);
		        options = this.defaultArg(options, Tone.Source.defaults);
		        /**
				 *  The output volume node
				 *  @type  {Tone.Volume}
				 *  @private
				 */
		        this._volume = this.output = new Tone.Volume(options.volume);
		        /**
				 * The volume of the output in decibels.
				 * @type {Decibels}
				 * @signal
				 * @example
				 * source.volume.value = -6;
				 */
		        this.volume = this._volume.volume;
		        this._readOnly('volume');
		        /**
				 * 	Keep track of the scheduled state.
				 *  @type {Tone.TimelineState}
				 *  @private
				 */
		        this._state = new Tone.TimelineState(Tone.State.Stopped);
		        /**
				 *  The synced `start` callback function from the transport
				 *  @type {Function}
				 *  @private
				 */
		        this._syncStart = function (time, offset) {
		            time = this.toSeconds(time);
		            time += this.toSeconds(this._startDelay);
		            this.start(time, offset);
		        }.bind(this);
		        /**
				 *  The synced `stop` callback function from the transport
				 *  @type {Function}
				 *  @private
				 */
		        this._syncStop = this.stop.bind(this);
		        /**
				 *  The offset from the start of the Transport `start`
				 *  @type {Time}
				 *  @private
				 */
		        this._startDelay = 0;
		        //make the output explicitly stereo
		        this._volume.output.output.channelCount = 2;
		        this._volume.output.output.channelCountMode = 'explicit';
		    };
		    Tone.extend(Tone.Source);
		    /**
			 *  The default parameters
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Source.defaults = { 'volume': 0 };
		    /**
			 *  Returns the playback state of the source, either "started" or "stopped".
			 *  @type {Tone.State}
			 *  @readOnly
			 *  @memberOf Tone.Source#
			 *  @name state
			 */
		    Object.defineProperty(Tone.Source.prototype, 'state', {
		        get: function () {
		            return this._state.getStateAtTime(this.now());
		        }
		    });
		    /**
			 *  Start the source at the specified time. If no time is given, 
			 *  start the source now.
			 *  @param  {Time} [time=now] When the source should be started.
			 *  @returns {Tone.Source} this
			 *  @example
			 * source.start("+0.5"); //starts the source 0.5 seconds from now
			 */
		    Tone.Source.prototype.start = function (time) {
		        time = this.toSeconds(time);
		        if (this._state.getStateAtTime(time) !== Tone.State.Started || this.retrigger) {
		            this._state.setStateAtTime(Tone.State.Started, time);
		            if (this._start) {
		                this._start.apply(this, arguments);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Stop the source at the specified time. If no time is given, 
			 *  stop the source now.
			 *  @param  {Time} [time=now] When the source should be stopped. 
			 *  @returns {Tone.Source} this
			 *  @example
			 * source.stop(); // stops the source immediately
			 */
		    Tone.Source.prototype.stop = function (time) {
		        time = this.toSeconds(time);
		        if (this._state.getStateAtTime(time) === Tone.State.Started) {
		            this._state.setStateAtTime(Tone.State.Stopped, time);
		            if (this._stop) {
		                this._stop.apply(this, arguments);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Sync the source to the Transport so that when the transport
			 *  is started, this source is started and when the transport is stopped
			 *  or paused, so is the source. 
			 *
			 *  @param {Time} [delay=0] Delay time before starting the source after the
			 *                               Transport has started. 
			 *  @returns {Tone.Source} this
			 *  @example
			 * //sync the source to start 1 measure after the transport starts
			 * source.sync("1m");
			 * //start the transport. the source will start 1 measure later. 
			 * Tone.Transport.start();
			 */
		    Tone.Source.prototype.sync = function (delay) {
		        this._startDelay = this.defaultArg(delay, 0);
		        Tone.Transport.on('start', this._syncStart);
		        Tone.Transport.on('stop pause', this._syncStop);
		        return this;
		    };
		    /**
			 *  Unsync the source to the Transport. See Tone.Source.sync
			 *  @returns {Tone.Source} this
			 */
		    Tone.Source.prototype.unsync = function () {
		        this._startDelay = 0;
		        Tone.Transport.off('start', this._syncStart);
		        Tone.Transport.off('stop pause', this._syncStop);
		        return this;
		    };
		    /**
			 *	Clean up.
			 *  @return {Tone.Source} this
			 */
		    Tone.Source.prototype.dispose = function () {
		        this.stop();
		        Tone.prototype.dispose.call(this);
		        this.unsync();
		        this._writable('volume');
		        this._volume.dispose();
		        this._volume = null;
		        this.volume = null;
		        this._state.dispose();
		        this._state = null;
		        this._syncStart = null;
		        this._syncStart = null;
		    };
		    return Tone.Source;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Oscillator supports a number of features including
			 *         phase rotation, multiple oscillator types (see Tone.Oscillator.type), 
			 *         and Transport syncing (see Tone.Oscillator.syncFrequency).
			 *
			 *  @constructor
			 *  @extends {Tone.Source}
			 *  @param {Frequency} [frequency] Starting frequency
			 *  @param {string} [type] The oscillator type. Read more about type below.
			 *  @example
			 * //make and start a 440hz sine tone
			 * var osc = new Tone.Oscillator(440, "sine").toMaster().start();
			 */
		    Tone.Oscillator = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'type'
		        ], Tone.Oscillator.defaults);
		        Tone.Source.call(this, options);
		        /**
				 *  the main oscillator
				 *  @type {OscillatorNode}
				 *  @private
				 */
		        this._oscillator = null;
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
		        /**
				 *  The detune control signal.
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);
		        /**
				 *  the periodic wave
				 *  @type {PeriodicWave}
				 *  @private
				 */
		        this._wave = null;
		        /**
				 *  The partials of the oscillator
				 *  @type {Array}
				 *  @private
				 */
		        this._partials = this.defaultArg(options.partials, [1]);
		        /**
				 *  the phase of the oscillator
				 *  between 0 - 360
				 *  @type {number}
				 *  @private
				 */
		        this._phase = options.phase;
		        /**
				 *  the type of the oscillator
				 *  @type {string}
				 *  @private
				 */
		        this._type = null;
		        //setup
		        this.type = options.type;
		        this.phase = this._phase;
		        this._readOnly([
		            'frequency',
		            'detune'
		        ]);
		    };
		    Tone.extend(Tone.Oscillator, Tone.Source);
		    /**
			 *  the default parameters
			 *  @type {Object}
			 */
		    Tone.Oscillator.defaults = {
		        'type': 'sine',
		        'frequency': 440,
		        'detune': 0,
		        'phase': 0,
		        'partials': []
		    };
		    /**
			 *  The Oscillator types
			 *  @enum {String}
			 */
		    Tone.Oscillator.Type = {
		        Sine: 'sine',
		        Triangle: 'triangle',
		        Sawtooth: 'sawtooth',
		        Square: 'square',
		        Custom: 'custom'
		    };
		    /**
			 *  start the oscillator
			 *  @param  {Time} [time=now] 
			 *  @private
			 */
		    Tone.Oscillator.prototype._start = function (time) {
		        //new oscillator with previous values
		        this._oscillator = this.context.createOscillator();
		        this._oscillator.setPeriodicWave(this._wave);
		        //connect the control signal to the oscillator frequency & detune
		        this._oscillator.connect(this.output);
		        this.frequency.connect(this._oscillator.frequency);
		        this.detune.connect(this._oscillator.detune);
		        //start the oscillator
		        this._oscillator.start(this.toSeconds(time));
		    };
		    /**
			 *  stop the oscillator
			 *  @private
			 *  @param  {Time} [time=now] (optional) timing parameter
			 *  @returns {Tone.Oscillator} this
			 */
		    Tone.Oscillator.prototype._stop = function (time) {
		        if (this._oscillator) {
		            this._oscillator.stop(this.toSeconds(time));
		            this._oscillator = null;
		        }
		        return this;
		    };
		    /**
			 *  Sync the signal to the Transport's bpm. Any changes to the transports bpm,
			 *  will also affect the oscillators frequency. 
			 *  @returns {Tone.Oscillator} this
			 *  @example
			 * Tone.Transport.bpm.value = 120;
			 * osc.frequency.value = 440;
			 * //the ration between the bpm and the frequency will be maintained
			 * osc.syncFrequency();
			 * Tone.Transport.bpm.value = 240; 
			 * // the frequency of the oscillator is doubled to 880
			 */
		    Tone.Oscillator.prototype.syncFrequency = function () {
		        Tone.Transport.syncSignal(this.frequency);
		        return this;
		    };
		    /**
			 *  Unsync the oscillator's frequency from the Transport. 
			 *  See Tone.Oscillator.syncFrequency
			 *  @returns {Tone.Oscillator} this
			 */
		    Tone.Oscillator.prototype.unsyncFrequency = function () {
		        Tone.Transport.unsyncSignal(this.frequency);
		        return this;
		    };
		    /**
			 * The type of the oscillator: either sine, square, triangle, or sawtooth. Also capable of
			 * setting the first x number of partials of the oscillator. For example: "sine4" would
			 * set be the first 4 partials of the sine wave and "triangle8" would set the first
			 * 8 partials of the triangle wave.
			 * <br><br> 
			 * Uses PeriodicWave internally even for native types so that it can set the phase. 
			 * PeriodicWave equations are from the 
			 * [Webkit Web Audio implementation](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/modules/webaudio/PeriodicWave.cpp&sq=package:chromium).
			 *  
			 * @memberOf Tone.Oscillator#
			 * @type {string}
			 * @name type
			 * @example
			 * //set it to a square wave
			 * osc.type = "square";
			 * @example
			 * //set the first 6 partials of a sawtooth wave
			 * osc.type = "sawtooth6";
			 */
		    Object.defineProperty(Tone.Oscillator.prototype, 'type', {
		        get: function () {
		            return this._type;
		        },
		        set: function (type) {
		            var coefs = this._getRealImaginary(type, this._phase);
		            var periodicWave = this.context.createPeriodicWave(coefs[0], coefs[1]);
		            this._wave = periodicWave;
		            if (this._oscillator !== null) {
		                this._oscillator.setPeriodicWave(this._wave);
		            }
		            this._type = type;
		        }
		    });
		    /**
			 *  Returns the real and imaginary components based 
			 *  on the oscillator type.
			 *  @returns {Array} [real, imaginary]
			 *  @private
			 */
		    Tone.Oscillator.prototype._getRealImaginary = function (type, phase) {
		        var fftSize = 4096;
		        var periodicWaveSize = fftSize / 2;
		        var real = new Float32Array(periodicWaveSize);
		        var imag = new Float32Array(periodicWaveSize);
		        var partialCount = 1;
		        if (type === Tone.Oscillator.Type.Custom) {
		            partialCount = this._partials.length + 1;
		            periodicWaveSize = partialCount;
		        } else {
		            var partial = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(type);
		            if (partial) {
		                partialCount = parseInt(partial[2]) + 1;
		                type = partial[1];
		                partialCount = Math.max(partialCount, 2);
		                periodicWaveSize = partialCount;
		            }
		        }
		        for (var n = 1; n < periodicWaveSize; ++n) {
		            var piFactor = 2 / (n * Math.PI);
		            var b;
		            switch (type) {
		            case Tone.Oscillator.Type.Sine:
		                b = n <= partialCount ? 1 : 0;
		                break;
		            case Tone.Oscillator.Type.Square:
		                b = n & 1 ? 2 * piFactor : 0;
		                break;
		            case Tone.Oscillator.Type.Sawtooth:
		                b = piFactor * (n & 1 ? 1 : -1);
		                break;
		            case Tone.Oscillator.Type.Triangle:
		                if (n & 1) {
		                    b = 2 * (piFactor * piFactor) * (n - 1 >> 1 & 1 ? -1 : 1);
		                } else {
		                    b = 0;
		                }
		                break;
		            case Tone.Oscillator.Type.Custom:
		                b = this._partials[n - 1];
		                break;
		            default:
		                throw new Error('invalid oscillator type: ' + type);
		            }
		            if (b !== 0) {
		                real[n] = -b * Math.sin(phase * n);
		                imag[n] = b * Math.cos(phase * n);
		            } else {
		                real[n] = 0;
		                imag[n] = 0;
		            }
		        }
		        return [
		            real,
		            imag
		        ];
		    };
		    /**
			 *  Compute the inverse FFT for a given phase.	
			 *  @param  {Float32Array}  real
			 *  @param  {Float32Array}  imag 
			 *  @param  {NormalRange}  phase 
			 *  @return  {AudioRange}
			 *  @private
			 */
		    Tone.Oscillator.prototype._inverseFFT = function (real, imag, phase) {
		        var sum = 0;
		        var len = real.length;
		        for (var i = 0; i < len; i++) {
		            sum += real[i] * Math.cos(i * phase) + imag[i] * Math.sin(i * phase);
		        }
		        return sum;
		    };
		    /**
			 *  Returns the initial value of the oscillator.
			 *  @return  {AudioRange}
			 *  @private
			 */
		    Tone.Oscillator.prototype._getInitialValue = function () {
		        var coefs = this._getRealImaginary(this._type, 0);
		        var real = coefs[0];
		        var imag = coefs[1];
		        var maxValue = 0;
		        var twoPi = Math.PI * 2;
		        //check for peaks in 8 places
		        for (var i = 0; i < 8; i++) {
		            maxValue = Math.max(this._inverseFFT(real, imag, i / 8 * twoPi), maxValue);
		        }
		        return -this._inverseFFT(real, imag, this._phase) / maxValue;
		    };
		    /**
			 * The partials of the waveform. A partial represents 
			 * the amplitude at a harmonic. The first harmonic is the 
			 * fundamental frequency, the second is the octave and so on
			 * following the harmonic series. 
			 * Setting this value will automatically set the type to "custom". 
			 * The value is an empty array when the type is not "custom". 
			 * @memberOf Tone.Oscillator#
			 * @type {Array}
			 * @name partials
			 * @example
			 * osc.partials = [1, 0.2, 0.01];
			 */
		    Object.defineProperty(Tone.Oscillator.prototype, 'partials', {
		        get: function () {
		            if (this._type !== Tone.Oscillator.Type.Custom) {
		                return [];
		            } else {
		                return this._partials;
		            }
		        },
		        set: function (partials) {
		            this._partials = partials;
		            this.type = Tone.Oscillator.Type.Custom;
		        }
		    });
		    /**
			 * The phase of the oscillator in degrees. 
			 * @memberOf Tone.Oscillator#
			 * @type {Degrees}
			 * @name phase
			 * @example
			 * osc.phase = 180; //flips the phase of the oscillator
			 */
		    Object.defineProperty(Tone.Oscillator.prototype, 'phase', {
		        get: function () {
		            return this._phase * (180 / Math.PI);
		        },
		        set: function (phase) {
		            this._phase = phase * Math.PI / 180;
		            //reset the type
		            this.type = this._type;
		        }
		    });
		    /**
			 *  Dispose and disconnect.
			 *  @return {Tone.Oscillator} this
			 */
		    Tone.Oscillator.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        if (this._oscillator !== null) {
		            this._oscillator.disconnect();
		            this._oscillator = null;
		        }
		        this._wave = null;
		        this._writable([
		            'frequency',
		            'detune'
		        ]);
		        this.frequency.dispose();
		        this.frequency = null;
		        this.detune.dispose();
		        this.detune = null;
		        this._partials = null;
		        return this;
		    };
		    return Tone.Oscillator;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  LFO stands for low frequency oscillator. Tone.LFO produces an output signal 
			 *          which can be attached to an AudioParam or Tone.Signal 
			 *          in order to modulate that parameter with an oscillator. The LFO can 
			 *          also be synced to the transport to start/stop and change when the tempo changes.
			 *
			 *  @constructor
			 *  @extends {Tone.Oscillator}
			 *  @param {Frequency|Object} [frequency] The frequency of the oscillation. Typically, LFOs will be
			 *                               in the frequency range of 0.1 to 10 hertz. 
			 *  @param {number=} min The minimum output value of the LFO. 
			 *  @param {number=} max The maximum value of the LFO. 
			 *  @example
			 * var lfo = new Tone.LFO("4n", 400, 4000);
			 * lfo.connect(filter.frequency);
			 */
		    Tone.LFO = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'min',
		            'max'
		        ], Tone.LFO.defaults);
		        /** 
				 *  The oscillator. 
				 *  @type {Tone.Oscillator}
				 *  @private
				 */
		        this._oscillator = new Tone.Oscillator({
		            'frequency': options.frequency,
		            'type': options.type
		        });
		        /**
				 *  the lfo's frequency
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = this._oscillator.frequency;
		        /**
				 * The amplitude of the LFO, which controls the output range between
				 * the min and max output. For example if the min is -10 and the max 
				 * is 10, setting the amplitude to 0.5 would make the LFO modulate
				 * between -5 and 5. 
				 * @type {Number}
				 * @signal
				 */
		        this.amplitude = this._oscillator.volume;
		        this.amplitude.units = Tone.Type.NormalRange;
		        this.amplitude.value = options.amplitude;
		        /**
				 *  The signal which is output when the LFO is stopped
				 *  @type  {Tone.Signal}
				 *  @private
				 */
		        this._stoppedSignal = new Tone.Signal(0, Tone.Type.AudioRange);
		        /**
				 *  The value that the LFO outputs when it's stopped
				 *  @type {AudioRange}
				 *  @private
				 */
		        this._stoppedValue = 0;
		        /**
				 *  @type {Tone.AudioToGain} 
				 *  @private
				 */
		        this._a2g = new Tone.AudioToGain();
		        /**
				 *  @type {Tone.Scale} 
				 *  @private
				 */
		        this._scaler = this.output = new Tone.Scale(options.min, options.max);
		        /**
				 *  the units of the LFO (used for converting)
				 *  @type {Tone.Type} 
				 *  @private
				 */
		        this._units = Tone.Type.Default;
		        this.units = options.units;
		        //connect it up
		        this._oscillator.chain(this._a2g, this._scaler);
		        this._stoppedSignal.connect(this._a2g);
		        this._readOnly([
		            'amplitude',
		            'frequency'
		        ]);
		        this.phase = options.phase;
		    };
		    Tone.extend(Tone.LFO, Tone.Oscillator);
		    /**
			 *  the default parameters
			 *
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.LFO.defaults = {
		        'type': 'sine',
		        'min': 0,
		        'max': 1,
		        'phase': 0,
		        'frequency': '4n',
		        'amplitude': 1,
		        'units': Tone.Type.Default
		    };
		    /**
			 *  Start the LFO. 
			 *  @param  {Time} [time=now] the time the LFO will start
			 *  @returns {Tone.LFO} this
			 */
		    Tone.LFO.prototype.start = function (time) {
		        time = this.toSeconds(time);
		        this._stoppedSignal.setValueAtTime(0, time);
		        this._oscillator.start(time);
		        return this;
		    };
		    /**
			 *  Stop the LFO. 
			 *  @param  {Time} [time=now] the time the LFO will stop
			 *  @returns {Tone.LFO} this
			 */
		    Tone.LFO.prototype.stop = function (time) {
		        time = this.toSeconds(time);
		        this._stoppedSignal.setValueAtTime(this._stoppedValue, time);
		        this._oscillator.stop(time);
		        return this;
		    };
		    /**
			 *  Sync the start/stop/pause to the transport 
			 *  and the frequency to the bpm of the transport
			 *
			 *  @param {Time} [delay=0] the time to delay the start of the
			 *                                LFO from the start of the transport
			 *  @returns {Tone.LFO} this
			 *  @example
			 *  lfo.frequency.value = "8n";
			 *  lfo.sync();
			 *  //the rate of the LFO will always be an eighth note, 
			 *  //even as the tempo changes
			 */
		    Tone.LFO.prototype.sync = function (delay) {
		        this._oscillator.sync(delay);
		        this._oscillator.syncFrequency();
		        return this;
		    };
		    /**
			 *  unsync the LFO from transport control
			 *  @returns {Tone.LFO} this
			 */
		    Tone.LFO.prototype.unsync = function () {
		        this._oscillator.unsync();
		        this._oscillator.unsyncFrequency();
		        return this;
		    };
		    /**
			 * The miniumum output of the LFO.
			 * @memberOf Tone.LFO#
			 * @type {number}
			 * @name min
			 */
		    Object.defineProperty(Tone.LFO.prototype, 'min', {
		        get: function () {
		            return this._toUnits(this._scaler.min);
		        },
		        set: function (min) {
		            min = this._fromUnits(min);
		            this._scaler.min = min;
		        }
		    });
		    /**
			 * The maximum output of the LFO.
			 * @memberOf Tone.LFO#
			 * @type {number}
			 * @name max
			 */
		    Object.defineProperty(Tone.LFO.prototype, 'max', {
		        get: function () {
		            return this._toUnits(this._scaler.max);
		        },
		        set: function (max) {
		            max = this._fromUnits(max);
		            this._scaler.max = max;
		        }
		    });
		    /**
			 * The type of the oscillator: sine, square, sawtooth, triangle. 
			 * @memberOf Tone.LFO#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.LFO.prototype, 'type', {
		        get: function () {
		            return this._oscillator.type;
		        },
		        set: function (type) {
		            this._oscillator.type = type;
		            this._stoppedValue = this._oscillator._getInitialValue();
		            this._stoppedSignal.value = this._stoppedValue;
		        }
		    });
		    /**
			 * The phase of the LFO.
			 * @memberOf Tone.LFO#
			 * @type {number}
			 * @name phase
			 */
		    Object.defineProperty(Tone.LFO.prototype, 'phase', {
		        get: function () {
		            return this._oscillator.phase;
		        },
		        set: function (phase) {
		            this._oscillator.phase = phase;
		            this._stoppedValue = this._oscillator._getInitialValue();
		            this._stoppedSignal.value = this._stoppedValue;
		        }
		    });
		    /**
			 * The output units of the LFO.
			 * @memberOf Tone.LFO#
			 * @type {Tone.Type}
			 * @name units
			 */
		    Object.defineProperty(Tone.LFO.prototype, 'units', {
		        get: function () {
		            return this._units;
		        },
		        set: function (val) {
		            var currentMin = this.min;
		            var currentMax = this.max;
		            //convert the min and the max
		            this._units = val;
		            this.min = currentMin;
		            this.max = currentMax;
		        }
		    });
		    /**
			 *  Returns the playback state of the source, either "started" or "stopped".
			 *  @type {Tone.State}
			 *  @readOnly
			 *  @memberOf Tone.LFO#
			 *  @name state
			 */
		    Object.defineProperty(Tone.LFO.prototype, 'state', {
		        get: function () {
		            return this._oscillator.state;
		        }
		    });
		    /**
			 *  Connect the output of the LFO to an AudioParam, AudioNode, or Tone Node. 
			 *  Tone.LFO will automatically convert to the destination units of the 
			 *  will get the units from the connected node.
			 *  @param  {Tone | AudioParam | AudioNode} node 
			 *  @param {number} [outputNum=0] optionally which output to connect from
			 *  @param {number} [inputNum=0] optionally which input to connect to
			 *  @returns {Tone.LFO} this
			 *  @private
			 */
		    Tone.LFO.prototype.connect = function (node) {
		        if (node.constructor === Tone.Signal || node.constructor === Tone.Param || node.constructor === Tone.TimelineSignal) {
		            this.convert = node.convert;
		            this.units = node.units;
		        }
		        Tone.Signal.prototype.connect.apply(this, arguments);
		        return this;
		    };
		    /**
			 *  private method borrowed from Param converts 
			 *  units from their destination value
			 *  @function
			 *  @private
			 */
		    Tone.LFO.prototype._fromUnits = Tone.Param.prototype._fromUnits;
		    /**
			 *  private method borrowed from Param converts 
			 *  units to their destination value
			 *  @function
			 *  @private
			 */
		    Tone.LFO.prototype._toUnits = Tone.Param.prototype._toUnits;
		    /**
			 *  disconnect and dispose
			 *  @returns {Tone.LFO} this
			 */
		    Tone.LFO.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'amplitude',
		            'frequency'
		        ]);
		        this._oscillator.dispose();
		        this._oscillator = null;
		        this._stoppedSignal.dispose();
		        this._stoppedSignal = null;
		        this._scaler.dispose();
		        this._scaler = null;
		        this._a2g.dispose();
		        this._a2g = null;
		        this.frequency = null;
		        this.amplitude = null;
		        return this;
		    };
		    return Tone.LFO;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Limiter will limit the loudness of an incoming signal. 
			 *         It is composed of a Tone.Compressor with a fast attack 
			 *         and release. Limiters are commonly used to safeguard against 
			 *         signal clipping. Unlike a compressor, limiters do not provide 
			 *         smooth gain reduction and almost completely prevent 
			 *         additional gain above the threshold.
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {number} threshold The theshold above which the limiting is applied. 
			 *  @example
			 *  var limiter = new Tone.Limiter(-6);
			 */
		    Tone.Limiter = function () {
		        var options = this.optionsObject(arguments, ['threshold'], Tone.Limiter.defaults);
		        /**
				 *  the compressor
				 *  @private
				 *  @type {Tone.Compressor}
				 */
		        this._compressor = this.input = this.output = new Tone.Compressor({
		            'attack': 0.001,
		            'decay': 0.001,
		            'threshold': options.threshold
		        });
		        /**
				 * The threshold of of the limiter
				 * @type {Decibel}
				 * @signal
				 */
		        this.threshold = this._compressor.threshold;
		        this._readOnly('threshold');
		    };
		    Tone.extend(Tone.Limiter);
		    /**
			 *  The default value
			 *  @type {Object}
			 *  @const
			 *  @static
			 */
		    Tone.Limiter.defaults = { 'threshold': -12 };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Limiter} this
			 */
		    Tone.Limiter.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._compressor.dispose();
		        this._compressor = null;
		        this._writable('threshold');
		        this.threshold = null;
		        return this;
		    };
		    return Tone.Limiter;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Lowpass is a lowpass feedback comb filter. It is similar to 
			 *         Tone.FeedbackCombFilter, but includes a lowpass filter.
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {Time|Object} [delayTime] The delay time of the comb filter
			 *  @param {NormalRange=} resonance The resonance (feedback) of the comb filter
			 *  @param {Frequency=} dampening The cutoff of the lowpass filter dampens the
			 *                                signal as it is fedback. 
			 */
		    Tone.LowpassCombFilter = function () {
		        Tone.call(this);
		        var options = this.optionsObject(arguments, [
		            'delayTime',
		            'resonance',
		            'dampening'
		        ], Tone.LowpassCombFilter.defaults);
		        /**
				 *  the delay node
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delay = this.input = this.context.createDelay(1);
		        /**
				 *  The delayTime of the comb filter. 
				 *  @type {Time}
				 *  @signal
				 */
		        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
		        /**
				 *  the lowpass filter
				 *  @type  {BiquadFilterNode}
				 *  @private
				 */
		        this._lowpass = this.output = this.context.createBiquadFilter();
		        this._lowpass.Q.value = 0;
		        this._lowpass.type = 'lowpass';
		        /**
				 *  The dampening control of the feedback
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.dampening = new Tone.Param({
		            'param': this._lowpass.frequency,
		            'units': Tone.Type.Frequency,
		            'value': options.dampening
		        });
		        /**
				 *  the feedback gain
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedback = this.context.createGain();
		        /**
				 *  The amount of feedback of the delayed signal. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.resonance = new Tone.Param({
		            'param': this._feedback.gain,
		            'units': Tone.Type.NormalRange,
		            'value': options.resonance
		        });
		        //connections
		        this._delay.chain(this._lowpass, this._feedback, this._delay);
		        this.delayTime.connect(this._delay.delayTime);
		        this._readOnly([
		            'dampening',
		            'resonance',
		            'delayTime'
		        ]);
		    };
		    Tone.extend(Tone.LowpassCombFilter);
		    /**
			 *  the default parameters
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.LowpassCombFilter.defaults = {
		        'delayTime': 0.1,
		        'resonance': 0.5,
		        'dampening': 3000
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.LowpassCombFilter} this
			 */
		    Tone.LowpassCombFilter.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'dampening',
		            'resonance',
		            'delayTime'
		        ]);
		        this.dampening.dispose();
		        this.dampening = null;
		        this.resonance.dispose();
		        this.resonance = null;
		        this._delay.disconnect();
		        this._delay = null;
		        this._lowpass.disconnect();
		        this._lowpass = null;
		        this._feedback.disconnect();
		        this._feedback = null;
		        this.delayTime.dispose();
		        this.delayTime = null;
		        return this;
		    };
		    return Tone.LowpassCombFilter;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Merge brings two signals into the left and right 
			 *          channels of a single stereo channel.
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @example
			 * var merge = new Tone.Merge().toMaster();
			 * //routing a sine tone in the left channel
			 * //and noise in the right channel
			 * var osc = new Tone.Oscillator().connect(merge.left);
			 * var noise = new Tone.Noise().connect(merge.right);
			 * //starting our oscillators
			 * noise.start();
			 * osc.start();
			 */
		    Tone.Merge = function () {
		        Tone.call(this, 2, 0);
		        /**
				 *  The left input channel.
				 *  Alias for <code>input[0]</code>
				 *  @type {GainNode}
				 */
		        this.left = this.input[0] = this.context.createGain();
		        /**
				 *  The right input channel.
				 *  Alias for <code>input[1]</code>.
				 *  @type {GainNode}
				 */
		        this.right = this.input[1] = this.context.createGain();
		        /**
				 *  the merger node for the two channels
				 *  @type {ChannelMergerNode}
				 *  @private
				 */
		        this._merger = this.output = this.context.createChannelMerger(2);
		        //connections
		        this.left.connect(this._merger, 0, 0);
		        this.right.connect(this._merger, 0, 1);
		        this.left.channelCount = 1;
		        this.right.channelCount = 1;
		        this.left.channelCountMode = 'explicit';
		        this.right.channelCountMode = 'explicit';
		    };
		    Tone.extend(Tone.Merge);
		    /**
			 *  Clean up.
			 *  @returns {Tone.Merge} this
			 */
		    Tone.Merge.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this.left.disconnect();
		        this.left = null;
		        this.right.disconnect();
		        this.right = null;
		        this._merger.disconnect();
		        this._merger = null;
		        return this;
		    };
		    return Tone.Merge;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Meter gets the [RMS](https://en.wikipedia.org/wiki/Root_mean_square)
			 *          of an input signal with some averaging applied. 
			 *          It can also get the raw value of the signal or the value in dB. For signal 
			 *          processing, it's better to use Tone.Follower which will produce an audio-rate 
			 *          envelope follower instead of needing to poll the Meter to get the output.
			 *          <br><br>
			 *          Meter was inspired by [Chris Wilsons Volume Meter](https://github.com/cwilso/volume-meter/blob/master/volume-meter.js).
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {number} [channels=1] number of channels being metered
			 *  @param {number} [smoothing=0.8] amount of smoothing applied to the volume
			 *  @param {number} [clipMemory=0.5] number in seconds that a "clip" should be remembered
			 *  @example
			 * var meter = new Tone.Meter();
			 * var mic = new Tone.Microphone().start();
			 * //connect mic to the meter
			 * mic.connect(meter);
			 * //use getLevel or getDb 
			 * //to access meter level
			 * meter.getLevel();
			 */
		    Tone.Meter = function () {
		        var options = this.optionsObject(arguments, [
		            'channels',
		            'smoothing'
		        ], Tone.Meter.defaults);
		        //extends Unit
		        Tone.call(this);
		        /** 
				 *  The channel count
				 *  @type  {number}
				 *  @private
				 */
		        this._channels = options.channels;
		        /**
				 * The amount which the decays of the meter are smoothed. Small values
				 * will follow the contours of the incoming envelope more closely than large values.
				 * @type {NormalRange}
				 */
		        this.smoothing = options.smoothing;
		        /** 
				 *  The amount of time a clip is remember for. 
				 *  @type  {Time}
				 */
		        this.clipMemory = options.clipMemory;
		        /** 
				 *  The value above which the signal is considered clipped.
				 *  @type  {Number}
				 */
		        this.clipLevel = options.clipLevel;
		        /** 
				 *  the rms for each of the channels
				 *  @private
				 *  @type {Array}
				 */
		        this._volume = new Array(this._channels);
		        /** 
				 *  the raw values for each of the channels
				 *  @private
				 *  @type {Array}
				 */
		        this._values = new Array(this._channels);
		        //zero out the volume array
		        for (var i = 0; i < this._channels; i++) {
		            this._volume[i] = 0;
		            this._values[i] = 0;
		        }
		        /** 
				 *  last time the values clipped
				 *  @private
				 *  @type {Array}
				 */
		        this._lastClip = new Array(this._channels);
		        //zero out the clip array
		        for (var j = 0; j < this._lastClip.length; j++) {
		            this._lastClip[j] = 0;
		        }
		        /** 
				 *  @private
				 *  @type {ScriptProcessorNode}
				 */
		        this._jsNode = this.context.createScriptProcessor(options.bufferSize, this._channels, 1);
		        this._jsNode.onaudioprocess = this._onprocess.bind(this);
		        //so it doesn't get garbage collected
		        this._jsNode.noGC();
		        //signal just passes
		        this.input.connect(this.output);
		        this.input.connect(this._jsNode);
		    };
		    Tone.extend(Tone.Meter);
		    /**
			 *  The defaults
			 *  @type {Object}
			 *  @static
			 *  @const
			 */
		    Tone.Meter.defaults = {
		        'smoothing': 0.8,
		        'bufferSize': 1024,
		        'clipMemory': 0.5,
		        'clipLevel': 0.9,
		        'channels': 1
		    };
		    /**
			 *  called on each processing frame
			 *  @private
			 *  @param  {AudioProcessingEvent} event 
			 */
		    Tone.Meter.prototype._onprocess = function (event) {
		        var bufferSize = this._jsNode.bufferSize;
		        var smoothing = this.smoothing;
		        for (var channel = 0; channel < this._channels; channel++) {
		            var input = event.inputBuffer.getChannelData(channel);
		            var sum = 0;
		            var total = 0;
		            var x;
		            for (var i = 0; i < bufferSize; i++) {
		                x = input[i];
		                total += x;
		                sum += x * x;
		            }
		            var average = total / bufferSize;
		            var rms = Math.sqrt(sum / bufferSize);
		            if (rms > 0.9) {
		                this._lastClip[channel] = Date.now();
		            }
		            this._volume[channel] = Math.max(rms, this._volume[channel] * smoothing);
		            this._values[channel] = average;
		        }
		    };
		    /**
			 *  Get the rms of the signal.
			 *  @param  {number} [channel=0] which channel
			 *  @return {number}         the value
			 */
		    Tone.Meter.prototype.getLevel = function (channel) {
		        channel = this.defaultArg(channel, 0);
		        var vol = this._volume[channel];
		        if (vol < 0.00001) {
		            return 0;
		        } else {
		            return vol;
		        }
		    };
		    /**
			 *  Get the raw value of the signal. 
			 *  @param  {number=} channel 
			 *  @return {number}         
			 */
		    Tone.Meter.prototype.getValue = function (channel) {
		        channel = this.defaultArg(channel, 0);
		        return this._values[channel];
		    };
		    /**
			 *  Get the volume of the signal in dB
			 *  @param  {number=} channel 
			 *  @return {Decibels}         
			 */
		    Tone.Meter.prototype.getDb = function (channel) {
		        return this.gainToDb(this.getLevel(channel));
		    };
		    /**
			 * @returns {boolean} if the audio has clipped. The value resets
			 *                       based on the clipMemory defined. 
			 */
		    Tone.Meter.prototype.isClipped = function (channel) {
		        channel = this.defaultArg(channel, 0);
		        return Date.now() - this._lastClip[channel] < this._clipMemory * 1000;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Meter} this
			 */
		    Tone.Meter.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._jsNode.disconnect();
		        this._jsNode.onaudioprocess = null;
		        this._jsNode = null;
		        this._volume = null;
		        this._values = null;
		        this._lastClip = null;
		        return this;
		    };
		    return Tone.Meter;
		});
		Module(function (Tone) {
		    
		    /**
			 *	@class  Tone.Split splits an incoming signal into left and right channels.
			 *	
			 *  @constructor
			 *  @extends {Tone}
			 *  @example
			 * var split = new Tone.Split();
			 * stereoSignal.connect(split);
			 */
		    Tone.Split = function () {
		        Tone.call(this, 0, 2);
		        /** 
				 *  @type {ChannelSplitterNode}
				 *  @private
				 */
		        this._splitter = this.input = this.context.createChannelSplitter(2);
		        /** 
				 *  Left channel output. 
				 *  Alias for <code>output[0]</code>
				 *  @type {GainNode}
				 */
		        this.left = this.output[0] = this.context.createGain();
		        /**
				 *  Right channel output.
				 *  Alias for <code>output[1]</code>
				 *  @type {GainNode}
				 */
		        this.right = this.output[1] = this.context.createGain();
		        //connections
		        this._splitter.connect(this.left, 0, 0);
		        this._splitter.connect(this.right, 1, 0);
		    };
		    Tone.extend(Tone.Split);
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Split} this
			 */
		    Tone.Split.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._splitter.disconnect();
		        this.left.disconnect();
		        this.right.disconnect();
		        this.left = null;
		        this.right = null;
		        this._splitter = null;
		        return this;
		    };
		    return Tone.Split;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Mid/Side processing separates the the 'mid' signal 
			 *         (which comes out of both the left and the right channel) 
			 *         and the 'side' (which only comes out of the the side channels). <br><br>
			 *         <code>
			 *         Mid = (Left+Right)/sqrt(2);   // obtain mid-signal from left and right<br>
			 *         Side = (Left-Right)/sqrt(2);   // obtain side-signal from left and righ<br>
			 *         </code>
			 *
			 *  @extends {Tone}
			 *  @constructor
			 */
		    Tone.MidSideSplit = function () {
		        Tone.call(this, 0, 2);
		        /**
				 *  split the incoming signal into left and right channels
				 *  @type  {Tone.Split}
				 *  @private
				 */
		        this._split = this.input = new Tone.Split();
		        /**
				 *  The mid send. Connect to mid processing. Alias for
				 *  <code>output[0]</code>
				 *  @type {Tone.Expr}
				 */
		        this.mid = this.output[0] = new Tone.Expr('($0 + $1) * $2');
		        /**
				 *  The side output. Connect to side processing. Alias for
				 *  <code>output[1]</code>
				 *  @type {Tone.Expr}
				 */
		        this.side = this.output[1] = new Tone.Expr('($0 - $1) * $2');
		        this._split.connect(this.mid, 0, 0);
		        this._split.connect(this.mid, 1, 1);
		        this._split.connect(this.side, 0, 0);
		        this._split.connect(this.side, 1, 1);
		        sqrtTwo.connect(this.mid, 0, 2);
		        sqrtTwo.connect(this.side, 0, 2);
		    };
		    Tone.extend(Tone.MidSideSplit);
		    /**
			 *  a constant signal equal to 1 / sqrt(2)
			 *  @type {Number}
			 *  @signal
			 *  @private
			 *  @static
			 */
		    var sqrtTwo = null;
		    Tone._initAudioContext(function () {
		        sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.MidSideSplit} this
			 */
		    Tone.MidSideSplit.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this.mid.dispose();
		        this.mid = null;
		        this.side.dispose();
		        this.side = null;
		        this._split.dispose();
		        this._split = null;
		        return this;
		    };
		    return Tone.MidSideSplit;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Mid/Side processing separates the the 'mid' signal 
			 *         (which comes out of both the left and the right channel) 
			 *         and the 'side' (which only comes out of the the side channels). 
			 *         MidSideMerge merges the mid and side signal after they've been seperated
			 *         by Tone.MidSideSplit.<br><br>
			 *         <code>
			 *         Left = (Mid+Side)/sqrt(2);   // obtain left signal from mid and side<br>
			 *         Right = (Mid-Side)/sqrt(2);   // obtain right signal from mid and side<br>
			 *         </code>
			 *
			 *  @extends {Tone.StereoEffect}
			 *  @constructor
			 */
		    Tone.MidSideMerge = function () {
		        Tone.call(this, 2, 0);
		        /**
				 *  The mid signal input. Alias for
				 *  <code>input[0]</code>
				 *  @type  {GainNode}
				 */
		        this.mid = this.input[0] = this.context.createGain();
		        /**
				 *  recombine the mid/side into Left
				 *  @type {Tone.Expr}
				 *  @private
				 */
		        this._left = new Tone.Expr('($0 + $1) * $2');
		        /**
				 *  The side signal input. Alias for
				 *  <code>input[1]</code>
				 *  @type  {GainNode}
				 */
		        this.side = this.input[1] = this.context.createGain();
		        /**
				 *  recombine the mid/side into Right
				 *  @type {Tone.Expr}
				 *  @private
				 */
		        this._right = new Tone.Expr('($0 - $1) * $2');
		        /**
				 *  Merge the left/right signal back into a stereo signal.
				 *  @type {Tone.Merge}
				 *  @private
				 */
		        this._merge = this.output = new Tone.Merge();
		        this.mid.connect(this._left, 0, 0);
		        this.side.connect(this._left, 0, 1);
		        this.mid.connect(this._right, 0, 0);
		        this.side.connect(this._right, 0, 1);
		        this._left.connect(this._merge, 0, 0);
		        this._right.connect(this._merge, 0, 1);
		        sqrtTwo.connect(this._left, 0, 2);
		        sqrtTwo.connect(this._right, 0, 2);
		    };
		    Tone.extend(Tone.MidSideMerge);
		    /**
			 *  A constant signal equal to 1 / sqrt(2).
			 *  @type {Number}
			 *  @signal
			 *  @private
			 *  @static
			 */
		    var sqrtTwo = null;
		    Tone._initAudioContext(function () {
		        sqrtTwo = new Tone.Signal(1 / Math.sqrt(2));
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.MidSideMerge} this
			 */
		    Tone.MidSideMerge.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this.mid.disconnect();
		        this.mid = null;
		        this.side.disconnect();
		        this.side = null;
		        this._left.dispose();
		        this._left = null;
		        this._right.dispose();
		        this._right = null;
		        this._merge.dispose();
		        this._merge = null;
		        return this;
		    };
		    return Tone.MidSideMerge;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.MidSideCompressor applies two different compressors to the mid
			 *         and side signal components. See Tone.MidSideSplit. 
			 *
			 *  @extends {Tone}
			 *  @param {Object} options The options that are passed to the mid and side
			 *                          compressors. 
			 *  @constructor
			 */
		    Tone.MidSideCompressor = function (options) {
		        options = this.defaultArg(options, Tone.MidSideCompressor.defaults);
		        /**
				 *  the mid/side split
				 *  @type  {Tone.MidSideSplit}
				 *  @private
				 */
		        this._midSideSplit = this.input = new Tone.MidSideSplit();
		        /**
				 *  the mid/side recombination
				 *  @type  {Tone.MidSideMerge}
				 *  @private
				 */
		        this._midSideMerge = this.output = new Tone.MidSideMerge();
		        /**
				 *  The compressor applied to the mid signal
				 *  @type  {Tone.Compressor}
				 */
		        this.mid = new Tone.Compressor(options.mid);
		        /**
				 *  The compressor applied to the side signal
				 *  @type  {Tone.Compressor}
				 */
		        this.side = new Tone.Compressor(options.side);
		        this._midSideSplit.mid.chain(this.mid, this._midSideMerge.mid);
		        this._midSideSplit.side.chain(this.side, this._midSideMerge.side);
		        this._readOnly([
		            'mid',
		            'side'
		        ]);
		    };
		    Tone.extend(Tone.MidSideCompressor);
		    /**
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.MidSideCompressor.defaults = {
		        'mid': {
		            'ratio': 3,
		            'threshold': -24,
		            'release': 0.03,
		            'attack': 0.02,
		            'knee': 16
		        },
		        'side': {
		            'ratio': 6,
		            'threshold': -30,
		            'release': 0.25,
		            'attack': 0.03,
		            'knee': 10
		        }
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.MidSideCompressor} this
			 */
		    Tone.MidSideCompressor.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'mid',
		            'side'
		        ]);
		        this.mid.dispose();
		        this.mid = null;
		        this.side.dispose();
		        this.side = null;
		        this._midSideSplit.dispose();
		        this._midSideSplit = null;
		        this._midSideMerge.dispose();
		        this._midSideMerge = null;
		        return this;
		    };
		    return Tone.MidSideCompressor;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Mono coerces the incoming mono or stereo signal into a mono signal
			 *         where both left and right channels have the same value. This can be useful 
			 *         for [stereo imaging](https://en.wikipedia.org/wiki/Stereo_imaging).
			 *
			 *  @extends {Tone}
			 *  @constructor
			 */
		    Tone.Mono = function () {
		        Tone.call(this, 1, 0);
		        /**
				 *  merge the signal
				 *  @type {Tone.Merge}
				 *  @private
				 */
		        this._merge = this.output = new Tone.Merge();
		        this.input.connect(this._merge, 0, 0);
		        this.input.connect(this._merge, 0, 1);
		        this.input.gain.value = this.dbToGain(-10);
		    };
		    Tone.extend(Tone.Mono);
		    /**
			 *  clean up
			 *  @returns {Tone.Mono} this
			 */
		    Tone.Mono.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._merge.dispose();
		        this._merge = null;
		        return this;
		    };
		    return Tone.Mono;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A compressor with seperate controls over low/mid/high dynamics
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {Object} options The low/mid/high compressor settings.
			 *  @example
			 *  var multiband = new Tone.MultibandCompressor({
			 *  	"lowFrequency" : 200,
			 *  	"highFrequency" : 1300
			 *  	"low" : {
			 *  		"threshold" : -12
			 *  	}
			 *  })
			 */
		    Tone.MultibandCompressor = function (options) {
		        options = this.defaultArg(arguments, Tone.MultibandCompressor.defaults);
		        /**
				 *  split the incoming signal into high/mid/low
				 *  @type {Tone.MultibandSplit}
				 *  @private
				 */
		        this._splitter = this.input = new Tone.MultibandSplit({
		            'lowFrequency': options.lowFrequency,
		            'highFrequency': options.highFrequency
		        });
		        /**
				 *  low/mid crossover frequency.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.lowFrequency = this._splitter.lowFrequency;
		        /**
				 *  mid/high crossover frequency.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.highFrequency = this._splitter.highFrequency;
		        /**
				 *  the output
				 *  @type {GainNode}
				 *  @private
				 */
		        this.output = this.context.createGain();
		        /**
				 *  The compressor applied to the low frequencies.
				 *  @type {Tone.Compressor}
				 */
		        this.low = new Tone.Compressor(options.low);
		        /**
				 *  The compressor applied to the mid frequencies.
				 *  @type {Tone.Compressor}
				 */
		        this.mid = new Tone.Compressor(options.mid);
		        /**
				 *  The compressor applied to the high frequencies.
				 *  @type {Tone.Compressor}
				 */
		        this.high = new Tone.Compressor(options.high);
		        //connect the compressor
		        this._splitter.low.chain(this.low, this.output);
		        this._splitter.mid.chain(this.mid, this.output);
		        this._splitter.high.chain(this.high, this.output);
		        this._readOnly([
		            'high',
		            'mid',
		            'low',
		            'highFrequency',
		            'lowFrequency'
		        ]);
		    };
		    Tone.extend(Tone.MultibandCompressor);
		    /**
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.MultibandCompressor.defaults = {
		        'low': Tone.Compressor.defaults,
		        'mid': Tone.Compressor.defaults,
		        'high': Tone.Compressor.defaults,
		        'lowFrequency': 250,
		        'highFrequency': 2000
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.MultibandCompressor} this
			 */
		    Tone.MultibandCompressor.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._splitter.dispose();
		        this._writable([
		            'high',
		            'mid',
		            'low',
		            'highFrequency',
		            'lowFrequency'
		        ]);
		        this.low.dispose();
		        this.mid.dispose();
		        this.high.dispose();
		        this._splitter = null;
		        this.low = null;
		        this.mid = null;
		        this.high = null;
		        this.lowFrequency = null;
		        this.highFrequency = null;
		        return this;
		    };
		    return Tone.MultibandCompressor;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Maps a NormalRange [0, 1] to an AudioRange [-1, 1]. 
			 *         See also Tone.AudioToGain. 
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @example
			 * var g2a = new Tone.GainToAudio();
			 */
		    Tone.GainToAudio = function () {
		        /**
				 *  @type {WaveShaperNode}
				 *  @private
				 */
		        this._norm = this.input = this.output = new Tone.WaveShaper(function (x) {
		            return Math.abs(x) * 2 - 1;
		        });
		    };
		    Tone.extend(Tone.GainToAudio, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.GainToAudio} this
			 */
		    Tone.GainToAudio.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._norm.dispose();
		        this._norm = null;
		        return this;
		    };
		    return Tone.GainToAudio;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Panner is an equal power Left/Right Panner and does not
			 *  support 3D. Panner uses the StereoPannerNode when available. 
			 *  
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {NormalRange} [initialPan=0.5] The initail panner value (defaults to 0.5 = center)
			 *  @example
			 *  //pan the input signal hard right. 
			 *  var panner = new Tone.Panner(1);
			 */
		    Tone.Panner = function (initialPan) {
		        Tone.call(this);
		        /**
				 *  indicates if the panner is using the new StereoPannerNode internally
				 *  @type  {boolean}
				 *  @private
				 */
		        this._hasStereoPanner = this.isFunction(this.context.createStereoPanner);
		        if (this._hasStereoPanner) {
		            /**
					 *  the panner node
					 *  @type {StereoPannerNode}
					 *  @private
					 */
		            this._panner = this.input = this.output = this.context.createStereoPanner();
		            /**
					 *  The pan control. 0 = hard left, 1 = hard right. 
					 *  @type {NormalRange}
					 *  @signal
					 */
		            this.pan = new Tone.Signal(0, Tone.Type.NormalRange);
		            /**
					 *  scale the pan signal to between -1 and 1
					 *  @type {Tone.WaveShaper}
					 *  @private
					 */
		            this._scalePan = new Tone.GainToAudio();
		            //connections
		            this.pan.chain(this._scalePan, this._panner.pan);
		        } else {
		            /**
					 *  the dry/wet knob
					 *  @type {Tone.CrossFade}
					 *  @private
					 */
		            this._crossFade = new Tone.CrossFade();
		            /**
					 *  @type {Tone.Merge}
					 *  @private
					 */
		            this._merger = this.output = new Tone.Merge();
		            /**
					 *  @type {Tone.Split}
					 *  @private
					 */
		            this._splitter = this.input = new Tone.Split();
		            /**
					 *  The pan control. 0 = hard left, 1 = hard right. 
					 *  @type {NormalRange}
					 *  @signal
					 */
		            this.pan = this._crossFade.fade;
		            //CONNECTIONS:
		            //left channel is a, right channel is b
		            this._splitter.connect(this._crossFade, 0, 0);
		            this._splitter.connect(this._crossFade, 1, 1);
		            //merge it back together
		            this._crossFade.a.connect(this._merger, 0, 0);
		            this._crossFade.b.connect(this._merger, 0, 1);
		        }
		        //initial value
		        this.pan.value = this.defaultArg(initialPan, 0.5);
		        this._readOnly('pan');
		    };
		    Tone.extend(Tone.Panner);
		    /**
			 *  Clean up.
			 *  @returns {Tone.Panner} this
			 */
		    Tone.Panner.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable('pan');
		        if (this._hasStereoPanner) {
		            this._panner.disconnect();
		            this._panner = null;
		            this.pan.dispose();
		            this.pan = null;
		            this._scalePan.dispose();
		            this._scalePan = null;
		        } else {
		            this._crossFade.dispose();
		            this._crossFade = null;
		            this._splitter.dispose();
		            this._splitter = null;
		            this._merger.dispose();
		            this._merger = null;
		            this.pan = null;
		        }
		        return this;
		    };
		    return Tone.Panner;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.PanVol is a Tone.Panner and Tone.Volume in one.
			 *
			 *  @extends {Tone}
			 *  @constructor
			 *  @param {NormalRange} pan the initial pan
			 *  @param {number} volume The output volume. 
			 *  @example
			 * //pan the incoming signal left and drop the volume
			 * var panVol = new Tone.PanVol(0.25, -12);
			 */
		    Tone.PanVol = function () {
		        var options = this.optionsObject(arguments, [
		            'pan',
		            'volume'
		        ], Tone.PanVol.defaults);
		        /**
				 *  The panning node
				 *  @type {Tone.Panner}
				 *  @private
				 */
		        this._panner = this.input = new Tone.Panner(options.pan);
		        /**
				 *  The L/R panning control.
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.pan = this._panner.pan;
		        /**
				 *  The volume node
				 *  @type {Tone.Volume}
				 */
		        this._volume = this.output = new Tone.Volume(options.volume);
		        /**
				 *  The volume control in decibels. 
				 *  @type {Decibels}
				 *  @signal
				 */
		        this.volume = this._volume.volume;
		        //connections
		        this._panner.connect(this._volume);
		        this._readOnly([
		            'pan',
		            'volume'
		        ]);
		    };
		    Tone.extend(Tone.PanVol);
		    /**
			 *  The defaults
			 *  @type  {Object}
			 *  @const
			 *  @static
			 */
		    Tone.PanVol.defaults = {
		        'pan': 0.5,
		        'volume': 0
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.PanVol} this
			 */
		    Tone.PanVol.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable([
		            'pan',
		            'volume'
		        ]);
		        this._panner.dispose();
		        this._panner = null;
		        this.pan = null;
		        this._volume.dispose();
		        this._volume = null;
		        this.volume = null;
		        return this;
		    };
		    return Tone.PanVol;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.CtrlInterpolate will interpolate between given values based
			 *         on the "index" property. Passing in an array or object literal
			 *         will interpolate each of the parameters. Note (i.e. "C3")
			 *         and Time (i.e. "4n + 2") can be interpolated. All other values are
			 *         assumed to be numbers. 
			 *  @example
			 * var interp = new Tone.CtrlInterpolate([0, 2, 9, 4]);
			 * interp.index = 0.75;
			 * interp.value; //returns 1.5
			 *
			 *  @example
			 * var interp = new Tone.CtrlInterpolate([
			 * 	["C3", "G4", "E5"],
			 * 	["D4", "F#4", "E5"],
			 * ]);
			 * @param {Array} values The array of values to interpolate over
			 * @param {Positive} index The initial interpolation index.
			 * @extends {Tone}
			 */
		    Tone.CtrlInterpolate = function () {
		        var options = this.optionsObject(arguments, [
		            'values',
		            'index'
		        ], Tone.CtrlInterpolate.defaults);
		        /**
				 *  The values to interpolate between
				 *  @type  {Array}
				 */
		        this.values = options.values;
		        /**
				 *  The interpolated index between values. For example: a value of 1.5
				 *  would interpolate equally between the value at index 1
				 *  and the value at index 2. 
				 *  @example
				 * interp.index = 0; 
				 * interp.value; //returns the value at 0
				 * interp.index = 0.5;
				 * interp.value; //returns the value between indices 0 and 1. 
				 *  @type  {Positive}
				 */
		        this.index = options.index;
		    };
		    Tone.extend(Tone.CtrlInterpolate);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.CtrlInterpolate.defaults = {
		        'index': 0,
		        'values': []
		    };
		    /**
			 *  The current interpolated value based on the index
			 *  @readOnly
			 *  @memberOf Tone.CtrlInterpolate#
			 *  @type {*}
			 *  @name value
			 */
		    Object.defineProperty(Tone.CtrlInterpolate.prototype, 'value', {
		        get: function () {
		            var index = this.index;
		            index = Math.min(index, this.values.length - 1);
		            var lowerPosition = Math.floor(index);
		            var lower = this.values[lowerPosition];
		            var upper = this.values[Math.ceil(index)];
		            return this._interpolate(index - lowerPosition, lower, upper);
		        }
		    });
		    /**
			 *  Internal interpolation routine
			 *  @param  {NormalRange}  index  The index between the lower and upper
			 *  @param  {*}  lower 
			 *  @param  {*}  upper 
			 *  @return  {*}  The interpolated value
			 *  @private
			 */
		    Tone.CtrlInterpolate.prototype._interpolate = function (index, lower, upper) {
		        if (this.isArray(lower)) {
		            var retArray = [];
		            for (var i = 0; i < lower.length; i++) {
		                retArray[i] = this._interpolate(index, lower[i], upper[i]);
		            }
		            return retArray;
		        } else if (this.isObject(lower)) {
		            var retObj = {};
		            for (var attr in lower) {
		                retObj[attr] = this._interpolate(index, lower[attr], upper[attr]);
		            }
		            return retObj;
		        } else {
		            lower = this._toNumber(lower);
		            upper = this._toNumber(upper);
		            return (1 - index) * lower + index * upper;
		        }
		    };
		    /**
			 *  Convert from the given type into a number
			 *  @param  {Number|String}  value
			 *  @return  {Number}
			 *  @private
			 */
		    Tone.CtrlInterpolate.prototype._toNumber = function (val) {
		        if (this.isNumber(val)) {
		            return val;
		        } else if (this.isNote(val)) {
		            return this.toFrequency(val);
		        } else {
		            //otherwise assume that it's Time...
		            return this.toSeconds(val);
		        }
		    };
		    /**
			 *  Clean up
			 *  @return  {Tone.CtrlInterpolate}  this
			 */
		    Tone.CtrlInterpolate.prototype.dispose = function () {
		        this.values = null;
		    };
		    return Tone.CtrlInterpolate;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.CtrlMarkov represents a Markov Chain where each call
			 *         to Tone.CtrlMarkov.next will move to the next state. If the next
			 *         state choice is an array, the next state is chosen randomly with
			 *         even probability for all of the choices. For a weighted probability
			 *         of the next choices, pass in an object with "state" and "probability" attributes. 
			 *         The probabilities will be normalized and then chosen. If no next options
			 *         are given for the current state, the state will stay there. 
			 *  @extends {Tone}
			 *  @example
			 * var chain = new Tone.CtrlMarkov({
			 * 	"beginning" : ["end", "middle"],
			 * 	"middle" : "end"
			 * });
			 * chain.value = "beginning";
			 * chain.next(); //returns "end" or "middle" with 50% probability
			 *
			 *  @example
			 * var chain = new Tone.CtrlMarkov({
			 * 	"beginning" : [{"value" : "end", "probability" : 0.8}, 
			 * 					{"value" : "middle", "probability" : 0.2}],
			 * 	"middle" : "end"
			 * });
			 * chain.value = "beginning";
			 * chain.next(); //returns "end" with 80% probability or "middle" with 20%.
			 *  @param {Object} values An object with the state names as the keys
			 *                         and the next state(s) as the values. 
			 */
		    Tone.CtrlMarkov = function (values, initial) {
		        /**
				 *  The Markov values with states as the keys
				 *  and next state(s) as the values. 
				 *  @type {Object}
				 */
		        this.values = this.defaultArg(values, {});
		        /**
				 *  The current state of the Markov values. The next
				 *  state will be evaluated and returned when Tone.CtrlMarkov.next
				 *  is invoked.
				 *  @type {String}
				 */
		        this.value = this.defaultArg(initial, Object.keys(this.values)[0]);
		    };
		    Tone.extend(Tone.CtrlMarkov);
		    /**
			 *  Returns the next state of the Markov values. 
			 *  @return  {String}
			 */
		    Tone.CtrlMarkov.prototype.next = function () {
		        if (this.values.hasOwnProperty(this.value)) {
		            var next = this.values[this.value];
		            if (this.isArray(next)) {
		                var distribution = this._getProbDistribution(next);
		                var rand = Math.random();
		                var total = 0;
		                for (var i = 0; i < distribution.length; i++) {
		                    var dist = distribution[i];
		                    if (rand > total && rand < total + dist) {
		                        var chosen = next[i];
		                        if (this.isObject(chosen)) {
		                            this.value = chosen.value;
		                        } else {
		                            this.value = chosen;
		                        }
		                    }
		                    total += dist;
		                }
		            } else {
		                this.value = next;
		            }
		        }
		        return this.value;
		    };
		    /**
			 *  Choose randomly from an array weighted options in the form 
			 *  {"state" : string, "probability" : number} or an array of values
			 *  @param  {Array}  options 
			 *  @return  {Array}  The randomly selected choice
			 *  @private
			 */
		    Tone.CtrlMarkov.prototype._getProbDistribution = function (options) {
		        var distribution = [];
		        var total = 0;
		        var needsNormalizing = false;
		        for (var i = 0; i < options.length; i++) {
		            var option = options[i];
		            if (this.isObject(option)) {
		                needsNormalizing = true;
		                distribution[i] = option.probability;
		            } else {
		                distribution[i] = 1 / options.length;
		            }
		            total += distribution[i];
		        }
		        if (needsNormalizing) {
		            //normalize the values
		            for (var j = 0; j < distribution.length; j++) {
		                distribution[j] = distribution[j] / total;
		            }
		        }
		        return distribution;
		    };
		    /**
			 *  Clean up
			 *  @return  {Tone.CtrlMarkov}  this
			 */
		    Tone.CtrlMarkov.prototype.dispose = function () {
		        this.values = null;
		    };
		    return Tone.CtrlMarkov;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Generate patterns from an array of values.
			 *         Has a number of arpeggiation and randomized
			 *         selection patterns. 
			 *           <ul>
			 *  	        <li>"up" - cycles upward</li>
			 *  			<li>"down" - cycles downward</li>
			 *  			<li>"upDown" - up then and down</li>
			 *  			<li>"downUp" - cycles down then and up</li>
			 *  			<li>"alternateUp" - jump up two and down one</li>
			 *  			<li>"alternateDown" - jump down two and up one</li>
			 *  			<li>"random" - randomly select an index</li>
			 *  			<li>"randomWalk" - randomly moves one index away from the current position</li>
			 *  			<li>"randomOnce" - randomly select an index without repeating until all values have been chosen.</li>
			 *     		</ul>
			 *  @param  {Array}  values   An array of options to choose from.
			 *  @param  {Tone.CtrlPattern.Type=}  type  The name of the pattern.
			 *  @extends {Tone}
			 */
		    Tone.CtrlPattern = function () {
		        var options = this.optionsObject(arguments, [
		            'values',
		            'type'
		        ], Tone.CtrlPattern.defaults);
		        /**
				 *  The array of values to arpeggiate over
				 *  @type {Array}
				 */
		        this.values = options.values;
		        /**
				 *  The current position in the values array
				 *  @type  {Number}
				 */
		        this.index = 0;
		        /**
				 *  The type placeholder
				 *  @type {Tone.CtrlPattern.Type}
				 *  @private
				 */
		        this._type = null;
		        /**
				 *  Shuffled values for the RandomOnce type
				 *  @type {Array}
				 *  @private
				 */
		        this._shuffled = null;
		        /**
				 *  The direction of the movement
				 *  @type {String}
				 *  @private
				 */
		        this._direction = null;
		        this.type = options.type;
		    };
		    Tone.extend(Tone.CtrlPattern);
		    /**
			 *  The Control Patterns
			 *  @type  {Object}
			 *  @static
			 */
		    Tone.CtrlPattern.Type = {
		        Up: 'up',
		        Down: 'down',
		        UpDown: 'upDown',
		        DownUp: 'downUp',
		        AlternateUp: 'alternateUp',
		        AlternateDown: 'alternateDown',
		        Random: 'random',
		        RandomWalk: 'randomWalk',
		        RandomOnce: 'randomOnce'
		    };
		    /**
			 *  The default values. 
			 *  @type  {Object}
			 */
		    Tone.CtrlPattern.defaults = {
		        'type': Tone.CtrlPattern.Type.Up,
		        'values': []
		    };
		    /**
			 *  The value at the current index of the pattern.
			 *  @readOnly
			 *  @memberOf Tone.CtrlPattern#
			 *  @type {*}
			 *  @name value
			 */
		    Object.defineProperty(Tone.CtrlPattern.prototype, 'value', {
		        get: function () {
		            //some safeguards
		            if (this.values.length === 0) {
		                return;
		            } else if (this.values.length === 1) {
		                return this.values[0];
		            }
		            this.index = Math.min(this.index, this.values.length - 1);
		            var val = this.values[this.index];
		            if (this.type === Tone.CtrlPattern.Type.RandomOnce) {
		                if (this.values.length !== this._shuffled.length) {
		                    this._shuffleValues();
		                }
		                val = this.values[this._shuffled[this.index]];
		            }
		            return val;
		        }
		    });
		    /**
			 *  The pattern used to select the next
			 *  item from the values array
			 *  @memberOf Tone.CtrlPattern#
			 *  @type {Tone.CtrlPattern.Type}
			 *  @name type
			 */
		    Object.defineProperty(Tone.CtrlPattern.prototype, 'type', {
		        get: function () {
		            return this._type;
		        },
		        set: function (type) {
		            this._type = type;
		            this._shuffled = null;
		            //the first index
		            if (this._type === Tone.CtrlPattern.Type.Up || this._type === Tone.CtrlPattern.Type.UpDown || this._type === Tone.CtrlPattern.Type.RandomOnce || this._type === Tone.CtrlPattern.Type.AlternateUp) {
		                this.index = 0;
		            } else if (this._type === Tone.CtrlPattern.Type.Down || this._type === Tone.CtrlPattern.Type.DownUp || this._type === Tone.CtrlPattern.Type.AlternateDown) {
		                this.index = this.values.length - 1;
		            }
		            //the direction
		            if (this._type === Tone.CtrlPattern.Type.UpDown || this._type === Tone.CtrlPattern.Type.AlternateUp) {
		                this._direction = Tone.CtrlPattern.Type.Up;
		            } else if (this._type === Tone.CtrlPattern.Type.DownUp || this._type === Tone.CtrlPattern.Type.AlternateDown) {
		                this._direction = Tone.CtrlPattern.Type.Down;
		            }
		            //randoms
		            if (this._type === Tone.CtrlPattern.Type.RandomOnce) {
		                this._shuffleValues();
		            } else if (this._type === Tone.CtrlPattern.Random) {
		                this.index = Math.floor(Math.random() * this.values.length);
		            }
		        }
		    });
		    /**
			 *  Return the next value given the current position
			 *  and pattern.
			 *  @return {*} The next value
			 */
		    Tone.CtrlPattern.prototype.next = function () {
		        var type = this.type;
		        //choose the next index
		        if (type === Tone.CtrlPattern.Type.Up) {
		            this.index++;
		            if (this.index >= this.values.length) {
		                this.index = 0;
		            }
		        } else if (type === Tone.CtrlPattern.Type.Down) {
		            this.index--;
		            if (this.index < 0) {
		                this.index = this.values.length - 1;
		            }
		        } else if (type === Tone.CtrlPattern.Type.UpDown || type === Tone.CtrlPattern.Type.DownUp) {
		            if (this._direction === Tone.CtrlPattern.Type.Up) {
		                this.index++;
		            } else {
		                this.index--;
		            }
		            if (this.index < 0) {
		                this.index = 1;
		                this._direction = Tone.CtrlPattern.Type.Up;
		            } else if (this.index >= this.values.length) {
		                this.index = this.values.length - 2;
		                this._direction = Tone.CtrlPattern.Type.Down;
		            }
		        } else if (type === Tone.CtrlPattern.Type.Random) {
		            this.index = Math.floor(Math.random() * this.values.length);
		        } else if (type === Tone.CtrlPattern.Type.RandomWalk) {
		            if (Math.random() < 0.5) {
		                this.index--;
		                this.index = Math.max(this.index, 0);
		            } else {
		                this.index++;
		                this.index = Math.min(this.index, this.values.length - 1);
		            }
		        } else if (type === Tone.CtrlPattern.Type.RandomOnce) {
		            this.index++;
		            if (this.index >= this.values.length) {
		                this.index = 0;
		                //reshuffle the values for next time
		                this._shuffleValues();
		            }
		        } else if (type === Tone.CtrlPattern.Type.AlternateUp) {
		            if (this._direction === Tone.CtrlPattern.Type.Up) {
		                this.index += 2;
		                this._direction = Tone.CtrlPattern.Type.Down;
		            } else {
		                this.index -= 1;
		                this._direction = Tone.CtrlPattern.Type.Up;
		            }
		            if (this.index >= this.values.length) {
		                this.index = 0;
		                this._direction = Tone.CtrlPattern.Type.Up;
		            }
		        } else if (type === Tone.CtrlPattern.Type.AlternateDown) {
		            if (this._direction === Tone.CtrlPattern.Type.Up) {
		                this.index += 1;
		                this._direction = Tone.CtrlPattern.Type.Down;
		            } else {
		                this.index -= 2;
		                this._direction = Tone.CtrlPattern.Type.Up;
		            }
		            if (this.index < 0) {
		                this.index = this.values.length - 1;
		                this._direction = Tone.CtrlPattern.Type.Down;
		            }
		        }
		        return this.value;
		    };
		    /**
			 *  Shuffles the values and places the results into the _shuffled
			 *  @private
			 */
		    Tone.CtrlPattern.prototype._shuffleValues = function () {
		        var copy = [];
		        this._shuffled = [];
		        for (var i = 0; i < this.values.length; i++) {
		            copy[i] = i;
		        }
		        while (copy.length > 0) {
		            var randVal = copy.splice(Math.floor(copy.length * Math.random()), 1);
		            this._shuffled.push(randVal[0]);
		        }
		    };
		    /**
			 *  Clean up
			 *  @returns {Tone.CtrlPattern} this
			 */
		    Tone.CtrlPattern.prototype.dispose = function () {
		        this._shuffled = null;
		        this.values = null;
		    };
		    return Tone.CtrlPattern;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Choose a random value.
			 *  @extends {Tone}
			 *  @example
			 * var randomWalk = new Tone.CtrlRandom({
			 * 	"min" : 0,
			 * 	"max" : 10,
			 * 	"integer" : true
			 * });
			 * randomWalk.eval();
			 *
			 *  @param {Number|Time=} min The minimum return value.
			 *  @param {Number|Time=} max The maximum return value.
			 */
		    Tone.CtrlRandom = function () {
		        var options = this.optionsObject(arguments, [
		            'min',
		            'max'
		        ], Tone.CtrlRandom.defaults);
		        /**
				 *  The minimum return value
				 *  @type  {Number|Time}
				 */
		        this.min = options.min;
		        /**
				 *  The maximum return value
				 *  @type  {Number|Time}
				 */
		        this.max = options.max;
		        /**
				 *  If the return value should be an integer
				 *  @type  {Boolean}
				 */
		        this.integer = options.integer;
		    };
		    Tone.extend(Tone.CtrlRandom);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.CtrlRandom.defaults = {
		        'min': 0,
		        'max': 1,
		        'integer': false
		    };
		    /**
			 *  Return a random value between min and max. 
			 *  @readOnly
			 *  @memberOf Tone.CtrlRandom#
			 *  @type {*}
			 *  @name value
			 */
		    Object.defineProperty(Tone.CtrlRandom.prototype, 'value', {
		        get: function () {
		            var min = this.toSeconds(this.min);
		            var max = this.toSeconds(this.max);
		            var rand = Math.random();
		            var val = rand * min + (1 - rand) * max;
		            if (this.integer) {
		                val = Math.floor(val);
		            }
		            return val;
		        }
		    });
		    return Tone.CtrlRandom;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Buffer loading and storage. Tone.Buffer is used internally by all 
			 *          classes that make requests for audio files such as Tone.Player,
			 *          Tone.Sampler and Tone.Convolver.
			 *          <br><br>
			 *          Aside from load callbacks from individual buffers, Tone.Buffer 
			 *  		provides static methods which keep track of the loading progress 
			 *  		of all of the buffers. These methods are Tone.Buffer.onload, Tone.Buffer.onprogress,
			 *  		and Tone.Buffer.onerror. 
			 *
			 *  @constructor 
			 *  @extends {Tone}
			 *  @param {AudioBuffer|string} url The url to load, or the audio buffer to set. 
			 *  @param {function=} onload A callback which is invoked after the buffer is loaded. 
			 *                            It's recommended to use Tone.Buffer.onload instead 
			 *                            since it will give you a callback when ALL buffers are loaded.
			 *  @example
			 * var buffer = new Tone.Buffer("path/to/sound.mp3", function(){
			 * 	//the buffer is now available.
			 * 	var buff = buffer.get();
			 * });
			 */
		    Tone.Buffer = function () {
		        var options = this.optionsObject(arguments, [
		            'url',
		            'onload'
		        ], Tone.Buffer.defaults);
		        /**
				 *  stores the loaded AudioBuffer
				 *  @type {AudioBuffer}
				 *  @private
				 */
		        this._buffer = null;
		        /**
				 *  indicates if the buffer should be reversed or not
				 *  @type {boolean}
				 *  @private
				 */
		        this._reversed = options.reverse;
		        /**
				 *  The url of the buffer. <code>undefined</code> if it was 
				 *  constructed with a buffer
				 *  @type {string}
				 *  @readOnly
				 */
		        this.url = undefined;
		        /**
				 *  Indicates if the buffer is loaded or not. 
				 *  @type {boolean}
				 *  @readOnly
				 */
		        this.loaded = false;
		        /**
				 *  The callback to invoke when everything is loaded. 
				 *  @type {function}
				 */
		        this.onload = options.onload.bind(this, this);
		        if (options.url instanceof AudioBuffer || options.url instanceof Tone.Buffer) {
		            this.set(options.url);
		            this.onload(this);
		        } else if (this.isString(options.url)) {
		            this.url = options.url;
		            Tone.Buffer._addToQueue(options.url, this);
		        }
		    };
		    Tone.extend(Tone.Buffer);
		    /**
			 *  the default parameters
			 *  @type {Object}
			 */
		    Tone.Buffer.defaults = {
		        'url': undefined,
		        'onload': Tone.noOp,
		        'reverse': false
		    };
		    /**
			 *  Pass in an AudioBuffer or Tone.Buffer to set the value
			 *  of this buffer.
			 *  @param {AudioBuffer|Tone.Buffer} buffer the buffer
			 *  @returns {Tone.Buffer} this
			 */
		    Tone.Buffer.prototype.set = function (buffer) {
		        if (buffer instanceof Tone.Buffer) {
		            this._buffer = buffer.get();
		        } else {
		            this._buffer = buffer;
		        }
		        this.loaded = true;
		        return this;
		    };
		    /**
			 *  @return {AudioBuffer} The audio buffer stored in the object.
			 */
		    Tone.Buffer.prototype.get = function () {
		        return this._buffer;
		    };
		    /**
			 *  Load url into the buffer. 
			 *  @param {String} url The url to load
			 *  @param {Function=} callback The callback to invoke on load. 
			 *                              don't need to set if `onload` is
			 *                              already set.
			 *  @returns {Tone.Buffer} this
			 */
		    Tone.Buffer.prototype.load = function (url, callback) {
		        this.url = url;
		        this.onload = this.defaultArg(callback, this.onload);
		        Tone.Buffer._addToQueue(url, this);
		        return this;
		    };
		    /**
			 *  dispose and disconnect
			 *  @returns {Tone.Buffer} this
			 */
		    Tone.Buffer.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        Tone.Buffer._removeFromQueue(this);
		        this._buffer = null;
		        this.onload = Tone.Buffer.defaults.onload;
		        return this;
		    };
		    /**
			 * The duration of the buffer. 
			 * @memberOf Tone.Buffer#
			 * @type {number}
			 * @name duration
			 * @readOnly
			 */
		    Object.defineProperty(Tone.Buffer.prototype, 'duration', {
		        get: function () {
		            if (this._buffer) {
		                return this._buffer.duration;
		            } else {
		                return 0;
		            }
		        }
		    });
		    /**
			 *  Reverse the buffer.
			 *  @private
			 *  @return {Tone.Buffer} this
			 */
		    Tone.Buffer.prototype._reverse = function () {
		        if (this.loaded) {
		            for (var i = 0; i < this._buffer.numberOfChannels; i++) {
		                Array.prototype.reverse.call(this._buffer.getChannelData(i));
		            }
		        }
		        return this;
		    };
		    /**
			 * Reverse the buffer.
			 * @memberOf Tone.Buffer#
			 * @type {boolean}
			 * @name reverse
			 */
		    Object.defineProperty(Tone.Buffer.prototype, 'reverse', {
		        get: function () {
		            return this._reversed;
		        },
		        set: function (rev) {
		            if (this._reversed !== rev) {
		                this._reversed = rev;
		                this._reverse();
		            }
		        }
		    });
		    ///////////////////////////////////////////////////////////////////////////
		    // STATIC METHODS
		    ///////////////////////////////////////////////////////////////////////////
		    //statically inherits Emitter methods
		    Tone.Emitter.mixin(Tone.Buffer);
		    /**
			 *  the static queue for all of the xhr requests
			 *  @type {Array}
			 *  @private
			 */
		    Tone.Buffer._queue = [];
		    /**
			 *  the array of current downloads
			 *  @type {Array}
			 *  @private
			 */
		    Tone.Buffer._currentDownloads = [];
		    /**
			 *  the total number of downloads
			 *  @type {number}
			 *  @private
			 */
		    Tone.Buffer._totalDownloads = 0;
		    /**
			 *  the maximum number of simultaneous downloads
			 *  @static
			 *  @type {number}
			 */
		    Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS = 6;
		    /**
			 *  Adds a file to be loaded to the loading queue
			 *  @param   {string}   url      the url to load
			 *  @param   {function} callback the callback to invoke once it's loaded
			 *  @private
			 */
		    Tone.Buffer._addToQueue = function (url, buffer) {
		        Tone.Buffer._queue.push({
		            url: url,
		            Buffer: buffer,
		            progress: 0,
		            xhr: null
		        });
		        this._totalDownloads++;
		        Tone.Buffer._next();
		    };
		    /**
			 *  Remove an object from the queue's (if it's still there)
			 *  Abort the XHR if it's in progress
			 *  @param {Tone.Buffer} buffer the buffer to remove
			 *  @private
			 */
		    Tone.Buffer._removeFromQueue = function (buffer) {
		        var i;
		        for (i = 0; i < Tone.Buffer._queue.length; i++) {
		            var q = Tone.Buffer._queue[i];
		            if (q.Buffer === buffer) {
		                Tone.Buffer._queue.splice(i, 1);
		            }
		        }
		        for (i = 0; i < Tone.Buffer._currentDownloads.length; i++) {
		            var dl = Tone.Buffer._currentDownloads[i];
		            if (dl.Buffer === buffer) {
		                Tone.Buffer._currentDownloads.splice(i, 1);
		                dl.xhr.abort();
		                dl.xhr.onprogress = null;
		                dl.xhr.onload = null;
		                dl.xhr.onerror = null;
		            }
		        }
		    };
		    /**
			 *  load the next buffer in the queue
			 *  @private
			 */
		    Tone.Buffer._next = function () {
		        if (Tone.Buffer._queue.length > 0) {
		            if (Tone.Buffer._currentDownloads.length < Tone.Buffer.MAX_SIMULTANEOUS_DOWNLOADS) {
		                var next = Tone.Buffer._queue.shift();
		                Tone.Buffer._currentDownloads.push(next);
		                next.xhr = Tone.Buffer.load(next.url, function (buffer) {
		                    //remove this one from the queue
		                    var index = Tone.Buffer._currentDownloads.indexOf(next);
		                    Tone.Buffer._currentDownloads.splice(index, 1);
		                    next.Buffer.set(buffer);
		                    if (next.Buffer._reversed) {
		                        next.Buffer._reverse();
		                    }
		                    next.Buffer.onload(next.Buffer);
		                    Tone.Buffer._onprogress();
		                    Tone.Buffer._next();
		                });
		                next.xhr.onprogress = function (event) {
		                    next.progress = event.loaded / event.total;
		                    Tone.Buffer._onprogress();
		                };
		                next.xhr.onerror = function (e) {
		                    Tone.Buffer.trigger('error', e);
		                };
		            }
		        } else if (Tone.Buffer._currentDownloads.length === 0) {
		            Tone.Buffer.trigger('load');
		            //reset the downloads
		            Tone.Buffer._totalDownloads = 0;
		        }
		    };
		    /**
			 *  internal progress event handler
			 *  @private
			 */
		    Tone.Buffer._onprogress = function () {
		        var curretDownloadsProgress = 0;
		        var currentDLLen = Tone.Buffer._currentDownloads.length;
		        var inprogress = 0;
		        if (currentDLLen > 0) {
		            for (var i = 0; i < currentDLLen; i++) {
		                var dl = Tone.Buffer._currentDownloads[i];
		                curretDownloadsProgress += dl.progress;
		            }
		            inprogress = curretDownloadsProgress;
		        }
		        var currentDownloadProgress = currentDLLen - inprogress;
		        var completed = Tone.Buffer._totalDownloads - Tone.Buffer._queue.length - currentDownloadProgress;
		        Tone.Buffer.trigger('progress', completed / Tone.Buffer._totalDownloads);
		    };
		    /**
			 *  Makes an xhr reqest for the selected url then decodes
			 *  the file as an audio buffer. Invokes
			 *  the callback once the audio buffer loads.
			 *  @param {string} url The url of the buffer to load.
			 *                      filetype support depends on the
			 *                      browser.
			 *  @param {function} callback The function to invoke when the url is loaded. 
			 *  @returns {XMLHttpRequest} returns the XHR
			 */
		    Tone.Buffer.load = function (url, callback) {
		        var request = new XMLHttpRequest();
		        request.open('GET', url, true);
		        request.responseType = 'arraybuffer';
		        // decode asynchronously
		        request.onload = function () {
		            Tone.context.decodeAudioData(request.response, function (buff) {
		                if (!buff) {
		                    throw new Error('could not decode audio data:' + url);
		                }
		                callback(buff);
		            });
		        };
		        //send the request
		        request.send();
		        return request;
		    };
		    /**
			 *  @deprecated us on([event]) instead
			 */
		    Object.defineProperty(Tone.Buffer, 'onload', {
		        set: function (cb) {
		            console.warn('Tone.Buffer.onload is deprecated, use Tone.Buffer.on(\'load\', callback)');
		            Tone.Buffer.on('load', cb);
		        }
		    });
		    Object.defineProperty(Tone.Buffer, 'onprogress', {
		        set: function (cb) {
		            console.warn('Tone.Buffer.onprogress is deprecated, use Tone.Buffer.on(\'progress\', callback)');
		            Tone.Buffer.on('progress', cb);
		        }
		    });
		    Object.defineProperty(Tone.Buffer, 'onerror', {
		        set: function (cb) {
		            console.warn('Tone.Buffer.onerror is deprecated, use Tone.Buffer.on(\'error\', callback)');
		            Tone.Buffer.on('error', cb);
		        }
		    });
		    return Tone.Buffer;
		});
		Module(function (Tone) {
		    
		    /**
			 *  buses are another way of routing audio
			 *
			 *  augments Tone.prototype to include send and recieve
			 */
		    /**
			  *  All of the routes
			  *  
			  *  @type {Object}
			  *  @static
			  *  @private
			  */
		    var Buses = {};
		    /**
			 *  Send this signal to the channel name. 
			 *  @param  {string} channelName A named channel to send the signal to.
			 *  @param  {Decibels} amount The amount of the source to send to the bus. 
			 *  @return {GainNode} The gain node which connects this node to the desired channel. 
			 *                     Can be used to adjust the levels of the send.
			 *  @example
			 * source.send("reverb", -12);
			 */
		    Tone.prototype.send = function (channelName, amount) {
		        if (!Buses.hasOwnProperty(channelName)) {
		            Buses[channelName] = this.context.createGain();
		        }
		        var sendKnob = this.context.createGain();
		        sendKnob.gain.value = this.dbToGain(this.defaultArg(amount, 1));
		        this.output.chain(sendKnob, Buses[channelName]);
		        return sendKnob;
		    };
		    /**
			 *  Recieve the input from the desired channelName to the input
			 *
			 *  @param  {string} channelName A named channel to send the signal to.
			 *  @param {AudioNode} [input] If no input is selected, the
			 *                                         input of the current node is
			 *                                         chosen. 
			 *  @returns {Tone} this
			 *  @example
			 * reverbEffect.receive("reverb");
			 */
		    Tone.prototype.receive = function (channelName, input) {
		        if (!Buses.hasOwnProperty(channelName)) {
		            Buses[channelName] = this.context.createGain();
		        }
		        if (this.isUndef(input)) {
		            input = this.input;
		        }
		        Buses[channelName].connect(input);
		        return this;
		    };
		    return Tone;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Wrapper around Web Audio's native [DelayNode](http://webaudio.github.io/web-audio-api/#the-delaynode-interface). 
			 *  @extends {Tone}
			 *  @param {Time=} delayTime The delay applied to the incoming signal.
			 *  @param {Time=} maxDelay The maximum delay time. 
			 */
		    Tone.Delay = function () {
		        var options = this.optionsObject(arguments, [
		            'delayTime',
		            'maxDelay'
		        ], Tone.Delay.defaults);
		        /**
				 *  The native delay node
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delayNode = this.input = this.output = this.context.createDelay(this.toSeconds(options.maxDelay));
		        /**
				 *  The amount of time the incoming signal is
				 *  delayed. 
				 *  @type {Tone.Param}
				 *  @signal
				 */
		        this.delayTime = new Tone.Param({
		            'param': this._delayNode.delayTime,
		            'units': Tone.Type.Time,
		            'value': options.delayTime
		        });
		        this._readOnly('delayTime');
		    };
		    Tone.extend(Tone.Delay);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.Delay.defaults = {
		        'maxDelay': 1,
		        'delayTime': 0
		    };
		    /**
			 *  Clean up.
			 *  @return  {Tone.Delay}  this
			 */
		    Tone.Delay.prototype.dispose = function () {
		        Tone.Param.prototype.dispose.call(this);
		        this._delayNode.disconnect();
		        this._delayNode = null;
		        this._writable('delayTime');
		        this.delayTime = null;
		        return this;
		    };
		    return Tone.Delay;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  A single master output which is connected to the
			 *          AudioDestinationNode (aka your speakers). 
			 *          It provides useful conveniences such as the ability 
			 *          to set the volume and mute the entire application. 
			 *          It also gives you the ability to apply master effects to your application. 
			 *          <br><br>
			 *          Like Tone.Transport, A single Tone.Master is created
			 *          on initialization and you do not need to explicitly construct one.
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @singleton
			 *  @example
			 * //the audio will go from the oscillator to the speakers
			 * oscillator.connect(Tone.Master);
			 * //a convenience for connecting to the master output is also provided:
			 * oscillator.toMaster();
			 * //the above two examples are equivalent.
			 */
		    Tone.Master = function () {
		        Tone.call(this);
		        /**
				 * the unmuted volume
				 * @type {number}
				 * @private
				 */
		        this._unmutedVolume = 1;
		        /**
				 *  if the master is muted
				 *  @type {boolean}
				 *  @private
				 */
		        this._muted = false;
		        /**
				 *  The private volume node
				 *  @type  {Tone.Volume}
				 *  @private
				 */
		        this._volume = this.output = new Tone.Volume();
		        /**
				 * The volume of the master output.
				 * @type {Decibels}
				 * @signal
				 */
		        this.volume = this._volume.volume;
		        this._readOnly('volume');
		        //connections
		        this.input.chain(this.output, this.context.destination);
		    };
		    Tone.extend(Tone.Master);
		    /**
			 *  @type {Object}
			 *  @const
			 */
		    Tone.Master.defaults = {
		        'volume': 0,
		        'mute': false
		    };
		    /**
			 * Mute the output. 
			 * @memberOf Tone.Master#
			 * @type {boolean}
			 * @name mute
			 * @example
			 * //mute the output
			 * Tone.Master.mute = true;
			 */
		    Object.defineProperty(Tone.Master.prototype, 'mute', {
		        get: function () {
		            return this._muted;
		        },
		        set: function (mute) {
		            if (!this._muted && mute) {
		                this._unmutedVolume = this.volume.value;
		                //maybe it should ramp here?
		                this.volume.value = -Infinity;
		            } else if (this._muted && !mute) {
		                this.volume.value = this._unmutedVolume;
		            }
		            this._muted = mute;
		        }
		    });
		    /**
			 *  Add a master effects chain. NOTE: this will disconnect any nodes which were previously 
			 *  chained in the master effects chain. 
			 *  @param {AudioNode|Tone...} args All arguments will be connected in a row
			 *                                  and the Master will be routed through it.
			 *  @return  {Tone.Master}  this
			 *  @example
			 * //some overall compression to keep the levels in check
			 * var masterCompressor = new Tone.Compressor({
			 * 	"threshold" : -6,
			 * 	"ratio" : 3,
			 * 	"attack" : 0.5,
			 * 	"release" : 0.1
			 * });
			 * //give a little boost to the lows
			 * var lowBump = new Tone.Filter(200, "lowshelf");
			 * //route everything through the filter 
			 * //and compressor before going to the speakers
			 * Tone.Master.chain(lowBump, masterCompressor);
			 */
		    Tone.Master.prototype.chain = function () {
		        this.input.disconnect();
		        this.input.chain.apply(this.input, arguments);
		        arguments[arguments.length - 1].connect(this.output);
		    };
		    /**
			 *  Clean up
			 *  @return  {Tone.Master}  this
			 */
		    Tone.Master.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable('volume');
		        this._volume.dispose();
		        this._volume = null;
		        this.volume = null;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    //	AUGMENT TONE's PROTOTYPE
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *  Connect 'this' to the master output. Shorthand for this.connect(Tone.Master)
			 *  @returns {Tone} this
			 *  @example
			 * //connect an oscillator to the master output
			 * var osc = new Tone.Oscillator().toMaster();
			 */
		    Tone.prototype.toMaster = function () {
		        this.connect(Tone.Master);
		        return this;
		    };
		    /**
			 *  Also augment AudioNode's prototype to include toMaster
			 *  as a convenience
			 *  @returns {AudioNode} this
			 */
		    AudioNode.prototype.toMaster = function () {
		        this.connect(Tone.Master);
		        return this;
		    };
		    var MasterConstructor = Tone.Master;
		    /**
			 *  initialize the module and listen for new audio contexts
			 */
		    Tone._initAudioContext(function () {
		        //a single master output
		        if (!Tone.prototype.isUndef(Tone.Master)) {
		            Tone.Master = new MasterConstructor();
		        } else {
		            MasterConstructor.prototype.dispose.call(Tone.Master);
		            MasterConstructor.call(Tone.Master);
		        }
		    });
		    return Tone.Master;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  A timed note. Creating a note will register a callback 
			 *          which will be invoked on the channel at the time with
			 *          whatever value was specified. 
			 *
			 *  @constructor
			 *  @param {number|string} channel the channel name of the note
			 *  @param {Time} time the time when the note will occur
			 *  @param {string|number|Object|Array} value the value of the note
			 */
		    Tone.Note = function (channel, time, value) {
		        /**
				 *  the value of the note. This value is returned
				 *  when the channel callback is invoked.
				 *  
				 *  @type {string|number|Object}
				 */
		        this.value = value;
		        /**
				 *  the channel name or number
				 *  
				 *  @type {string|number}
				 *  @private
				 */
		        this._channel = channel;
		        /**
				 *  an internal reference to the id of the timeline
				 *  callback which is set. 
				 *  
				 *  @type {number}
				 *  @private
				 */
		        this._timelineID = Tone.Transport.setTimeline(this._trigger.bind(this), time);
		    };
		    /**
			 *  invoked by the timeline
			 *  @private
			 *  @param {number} time the time at which the note should play
			 */
		    Tone.Note.prototype._trigger = function (time) {
		        //invoke the callback
		        channelCallbacks(this._channel, time, this.value);
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.Note} this
			 */
		    Tone.Note.prototype.dispose = function () {
		        Tone.Transport.clearTimeline(this._timelineID);
		        this.value = null;
		        return this;
		    };
		    /**
			 *  @private
			 *  @static
			 *  @type {Object}
			 */
		    var NoteChannels = {};
		    /**
			 *  invoke all of the callbacks on a specific channel
			 *  @private
			 */
		    function channelCallbacks(channel, time, value) {
		        if (NoteChannels.hasOwnProperty(channel)) {
		            var callbacks = NoteChannels[channel];
		            for (var i = 0, len = callbacks.length; i < len; i++) {
		                var callback = callbacks[i];
		                if (Array.isArray(value)) {
		                    callback.apply(window, [time].concat(value));
		                } else {
		                    callback(time, value);
		                }
		            }
		        }
		    }
		    /**
			 *  listen to a specific channel, get all of the note callbacks
			 *  @static
			 *  @param {string|number} channel the channel to route note events from
			 *  @param {function(*)} callback callback to be invoked when a note will occur
			 *                                        on the specified channel
			 */
		    Tone.Note.route = function (channel, callback) {
		        if (NoteChannels.hasOwnProperty(channel)) {
		            NoteChannels[channel].push(callback);
		        } else {
		            NoteChannels[channel] = [callback];
		        }
		    };
		    /**
			 *  Remove a previously routed callback from a channel. 
			 *  @static
			 *  @param {string|number} channel The channel to unroute note events from
			 *  @param {function(*)} callback Callback which was registered to the channel.
			 */
		    Tone.Note.unroute = function (channel, callback) {
		        if (NoteChannels.hasOwnProperty(channel)) {
		            var channelCallback = NoteChannels[channel];
		            var index = channelCallback.indexOf(callback);
		            if (index !== -1) {
		                NoteChannels[channel].splice(index, 1);
		            }
		        }
		    };
		    /**
			 *  Parses a score and registers all of the notes along the timeline. 
			 *  <br><br>
			 *  Scores are a JSON object with instruments at the top level
			 *  and an array of time and values. The value of a note can be 0 or more 
			 *  parameters. 
			 *  <br><br>
			 *  The only requirement for the score format is that the time is the first (or only)
			 *  value in the array. All other values are optional and will be passed into the callback
			 *  function registered using `Note.route(channelName, callback)`.
			 *  <br><br>
			 *  To convert MIDI files to score notation, take a look at utils/MidiToScore.js
			 *
			 *  @example
			 * //an example JSON score which sets up events on channels
			 * var score = { 
			 * 	"synth"  : [["0", "C3"], ["0:1", "D3"], ["0:2", "E3"], ... ],
			 * 	"bass"  : [["0", "C2"], ["1:0", "A2"], ["2:0", "C2"], ["3:0", "A2"], ... ],
			 * 	"kick"  : ["0", "0:2", "1:0", "1:2", "2:0", ... ],
			 * 	//...
			 * };
			 * //parse the score into Notes
			 * Tone.Note.parseScore(score);
			 * //route all notes on the "synth" channel
			 * Tone.Note.route("synth", function(time, note){
			 * 	//trigger synth
			 * });
			 *  @static
			 *  @param {Object} score
			 *  @return {Array} an array of all of the notes that were created
			 */
		    Tone.Note.parseScore = function (score) {
		        var notes = [];
		        for (var inst in score) {
		            var part = score[inst];
		            if (inst === 'tempo') {
		                Tone.Transport.bpm.value = part;
		            } else if (inst === 'timeSignature') {
		                Tone.Transport.timeSignature = part[0] / (part[1] / 4);
		            } else if (Array.isArray(part)) {
		                for (var i = 0; i < part.length; i++) {
		                    var noteDescription = part[i];
		                    var note;
		                    if (Array.isArray(noteDescription)) {
		                        var time = noteDescription[0];
		                        var value = noteDescription.slice(1);
		                        note = new Tone.Note(inst, time, value);
		                    } else if (typeof noteDescription === 'object') {
		                        note = new Tone.Note(inst, noteDescription.time, noteDescription);
		                    } else {
		                        note = new Tone.Note(inst, noteDescription);
		                    }
		                    notes.push(note);
		                }
		            } else {
		                throw new TypeError('score parts must be Arrays');
		            }
		        }
		        return notes;
		    };
		    return Tone.Note;
		});
		Module(function (Tone) {
		    
		    /**
			 * 	@class  Tone.Effect is the base class for effects. Connect the effect between
			 * 	        the effectSend and effectReturn GainNodes, then control the amount of
			 * 	        effect which goes to the output using the wet control.
			 *
			 *  @constructor
			 *  @extends {Tone}
			 *  @param {NormalRange|Object} [wet] The starting wet value. 
			 */
		    Tone.Effect = function () {
		        Tone.call(this);
		        //get all of the defaults
		        var options = this.optionsObject(arguments, ['wet'], Tone.Effect.defaults);
		        /**
				 *  the drywet knob to control the amount of effect
				 *  @type {Tone.CrossFade}
				 *  @private
				 */
		        this._dryWet = new Tone.CrossFade(options.wet);
		        /**
				 *  The wet control is how much of the effected
				 *  will pass through to the output. 1 = 100% effected
				 *  signal, 0 = 100% dry signal. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.wet = this._dryWet.fade;
		        /**
				 *  connect the effectSend to the input of hte effect
				 *  @type {GainNode}
				 *  @private
				 */
		        this.effectSend = this.context.createGain();
		        /**
				 *  connect the output of the effect to the effectReturn
				 *  @type {GainNode}
				 *  @private
				 */
		        this.effectReturn = this.context.createGain();
		        //connections
		        this.input.connect(this._dryWet.a);
		        this.input.connect(this.effectSend);
		        this.effectReturn.connect(this._dryWet.b);
		        this._dryWet.connect(this.output);
		        this._readOnly(['wet']);
		    };
		    Tone.extend(Tone.Effect);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.Effect.defaults = { 'wet': 1 };
		    /**
			 *  chains the effect in between the effectSend and effectReturn
			 *  @param  {Tone} effect
			 *  @private
			 *  @returns {Tone.Effect} this
			 */
		    Tone.Effect.prototype.connectEffect = function (effect) {
		        this.effectSend.chain(effect, this.effectReturn);
		        return this;
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Effect} this
			 */
		    Tone.Effect.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._dryWet.dispose();
		        this._dryWet = null;
		        this.effectSend.disconnect();
		        this.effectSend = null;
		        this.effectReturn.disconnect();
		        this.effectReturn = null;
		        this._writable(['wet']);
		        this.wet = null;
		        return this;
		    };
		    return Tone.Effect;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.AutoFilter is a Tone.Filter with a Tone.LFO connected to the filter cutoff frequency.
			 *         Setting the LFO rate and depth allows for control over the filter modulation rate 
			 *         and depth.
			 *
			 *  @constructor
			 *  @extends {Tone.Effect}
			 *  @param {Time|Object} [frequency] The rate of the LFO.
			 *  @param {Frequency=} baseFrequency The lower value of the LFOs oscillation
		 	 *  @param {Frequency=} octaves The number of octaves above the baseFrequency
			 *  @example
			 * //create an autofilter and start it's LFO
			 * var autoFilter = new Tone.AutoFilter("4n").toMaster().start();
			 * //route an oscillator through the filter and start it
			 * var oscillator = new Tone.Oscillator().connect(autoFilter).start();
			 */
		    Tone.AutoFilter = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'baseFrequency',
		            'octaves'
		        ], Tone.AutoFilter.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  the lfo which drives the filter cutoff
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfo = new Tone.LFO({
		            'frequency': options.frequency,
		            'amplitude': options.depth
		        });
		        /**
				 * The range of the filter modulating between the min and max frequency. 
				 * 0 = no modulation. 1 = full modulation.
				 * @type {NormalRange}
				 * @signal
				 */
		        this.depth = this._lfo.amplitude;
		        /**
				 * How fast the filter modulates between min and max. 
				 * @type {Frequency}
				 * @signal
				 */
		        this.frequency = this._lfo.frequency;
		        /**
				 *  The filter node
				 *  @type {Tone.Filter}
				 */
		        this.filter = new Tone.Filter(options.filter);
		        /**
				 *  The octaves placeholder
				 *  @type {Positive}
				 *  @private
				 */
		        this._octaves = 0;
		        //connections
		        this.connectEffect(this.filter);
		        this._lfo.connect(this.filter.frequency);
		        this.type = options.type;
		        this._readOnly([
		            'frequency',
		            'depth'
		        ]);
		        this.octaves = options.octaves;
		        this.baseFrequency = options.baseFrequency;
		    };
		    //extend Effect
		    Tone.extend(Tone.AutoFilter, Tone.Effect);
		    /**
			 *  defaults
			 *  @static
			 *  @type {Object}
			 */
		    Tone.AutoFilter.defaults = {
		        'frequency': 1,
		        'type': 'sine',
		        'depth': 1,
		        'baseFrequency': 200,
		        'octaves': 2.6,
		        'filter': {
		            'type': 'lowpass',
		            'rolloff': -12,
		            'Q': 1
		        }
		    };
		    /**
			 * Start the effect.
			 * @param {Time} [time=now] When the LFO will start. 
			 * @returns {Tone.AutoFilter} this
			 */
		    Tone.AutoFilter.prototype.start = function (time) {
		        this._lfo.start(time);
		        return this;
		    };
		    /**
			 * Stop the effect.
			 * @param {Time} [time=now] When the LFO will stop. 
			 * @returns {Tone.AutoFilter} this
			 */
		    Tone.AutoFilter.prototype.stop = function (time) {
		        this._lfo.stop(time);
		        return this;
		    };
		    /**
			 * Sync the filter to the transport.
			 * @param {Time} [delay=0] Delay time before starting the effect after the
			 *                               Transport has started. 
			 * @returns {Tone.AutoFilter} this
			 */
		    Tone.AutoFilter.prototype.sync = function (delay) {
		        this._lfo.sync(delay);
		        return this;
		    };
		    /**
			 * Unsync the filter from the transport.
			 * @returns {Tone.AutoFilter} this
			 */
		    Tone.AutoFilter.prototype.unsync = function () {
		        this._lfo.unsync();
		        return this;
		    };
		    /**
			 * Type of oscillator attached to the AutoFilter. 
			 * Possible values: "sine", "square", "triangle", "sawtooth".
			 * @memberOf Tone.AutoFilter#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.AutoFilter.prototype, 'type', {
		        get: function () {
		            return this._lfo.type;
		        },
		        set: function (type) {
		            this._lfo.type = type;
		        }
		    });
		    /**
			 * The minimum value of the filter's cutoff frequency.
			 * @memberOf Tone.AutoFilter#
			 * @type {Frequency}
			 * @name min
			 */
		    Object.defineProperty(Tone.AutoFilter.prototype, 'baseFrequency', {
		        get: function () {
		            return this._lfo.min;
		        },
		        set: function (freq) {
		            this._lfo.min = this.toFrequency(freq);
		        }
		    });
		    /**
			 * The maximum value of the filter's cutoff frequency. 
			 * @memberOf Tone.AutoFilter#
			 * @type {Positive}
			 * @name octaves
			 */
		    Object.defineProperty(Tone.AutoFilter.prototype, 'octaves', {
		        get: function () {
		            return this._octaves;
		        },
		        set: function (oct) {
		            this._octaves = oct;
		            this._lfo.max = this.baseFrequency * Math.pow(2, oct);
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @returns {Tone.AutoFilter} this
			 */
		    Tone.AutoFilter.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._lfo.dispose();
		        this._lfo = null;
		        this.filter.dispose();
		        this.filter = null;
		        this._writable([
		            'frequency',
		            'depth'
		        ]);
		        this.frequency = null;
		        this.depth = null;
		        return this;
		    };
		    return Tone.AutoFilter;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.AutoPanner is a Tone.Panner with an LFO connected to the pan amount. 
			 *         More on using autopanners [here](https://www.ableton.com/en/blog/autopan-chopper-effect-and-more-liveschool/).
			 *
			 *  @constructor
			 *  @extends {Tone.Effect}
			 *  @param {Frequency|Object} [frequency] Rate of left-right oscillation. 
			 *  @example
			 * //create an autopanner and start it's LFO
			 * var autoPanner = new Tone.AutoPanner("4n").toMaster().start();
			 * //route an oscillator through the panner and start it
			 * var oscillator = new Tone.Oscillator().connect(autoPanner).start();
			 */
		    Tone.AutoPanner = function () {
		        var options = this.optionsObject(arguments, ['frequency'], Tone.AutoPanner.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  the lfo which drives the panning
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfo = new Tone.LFO({
		            'frequency': options.frequency,
		            'amplitude': options.depth,
		            'min': 0,
		            'max': 1
		        });
		        /**
				 * The amount of panning between left and right. 
				 * 0 = always center. 1 = full range between left and right. 
				 * @type {NormalRange}
				 * @signal
				 */
		        this.depth = this._lfo.amplitude;
		        /**
				 *  the panner node which does the panning
				 *  @type {Tone.Panner}
				 *  @private
				 */
		        this._panner = new Tone.Panner();
		        /**
				 * How fast the panner modulates between left and right. 
				 * @type {Frequency}
				 * @signal
				 */
		        this.frequency = this._lfo.frequency;
		        //connections
		        this.connectEffect(this._panner);
		        this._lfo.connect(this._panner.pan);
		        this.type = options.type;
		        this._readOnly([
		            'depth',
		            'frequency'
		        ]);
		    };
		    //extend Effect
		    Tone.extend(Tone.AutoPanner, Tone.Effect);
		    /**
			 *  defaults
			 *  @static
			 *  @type {Object}
			 */
		    Tone.AutoPanner.defaults = {
		        'frequency': 1,
		        'type': 'sine',
		        'depth': 1
		    };
		    /**
			 * Start the effect.
			 * @param {Time} [time=now] When the LFO will start. 
			 * @returns {Tone.AutoPanner} this
			 */
		    Tone.AutoPanner.prototype.start = function (time) {
		        this._lfo.start(time);
		        return this;
		    };
		    /**
			 * Stop the effect.
			 * @param {Time} [time=now] When the LFO will stop. 
			 * @returns {Tone.AutoPanner} this
			 */
		    Tone.AutoPanner.prototype.stop = function (time) {
		        this._lfo.stop(time);
		        return this;
		    };
		    /**
			 * Sync the panner to the transport.
			 * @param {Time} [delay=0] Delay time before starting the effect after the
			 *                               Transport has started. 
			 * @returns {Tone.AutoPanner} this
			 */
		    Tone.AutoPanner.prototype.sync = function (delay) {
		        this._lfo.sync(delay);
		        return this;
		    };
		    /**
			 * Unsync the panner from the transport
			 * @returns {Tone.AutoPanner} this
			 */
		    Tone.AutoPanner.prototype.unsync = function () {
		        this._lfo.unsync();
		        return this;
		    };
		    /**
			 * Type of oscillator attached to the AutoFilter. 
			 * Possible values: "sine", "square", "triangle", "sawtooth".
			 * @memberOf Tone.AutoFilter#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.AutoPanner.prototype, 'type', {
		        get: function () {
		            return this._lfo.type;
		        },
		        set: function (type) {
		            this._lfo.type = type;
		        }
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.AutoPanner} this
			 */
		    Tone.AutoPanner.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._lfo.dispose();
		        this._lfo = null;
		        this._panner.dispose();
		        this._panner = null;
		        this._writable([
		            'depth',
		            'frequency'
		        ]);
		        this.frequency = null;
		        this.depth = null;
		        return this;
		    };
		    return Tone.AutoPanner;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.AutoWah connects a Tone.Follower to a bandpass filter (Tone.Filter).
			 *          The frequency of the filter is adjusted proportionally to the 
			 *          incoming signal's amplitude. Inspiration from [Tuna.js](https://github.com/Dinahmoe/tuna).
			 *
			 *  @constructor
			 *  @extends {Tone.Effect}
			 *  @param {Frequency|Object} [baseFrequency] The frequency the filter is set 
			 *                                            to at the low point of the wah
			 *  @param {Positive} [octaves] The number of octaves above the baseFrequency
			 *                                the filter will sweep to when fully open
			 *  @param {Decibels} [sensitivity] The decibel threshold sensitivity for 
			 *                                   the incoming signal. Normal range of -40 to 0. 
			 *  @example
			 * var autoWah = new Tone.AutoWah(50, 6, -30).toMaster();
			 * //initialize the synth and connect to autowah
			 * var synth = new SimpleSynth.connect(autoWah);
			 * //Q value influences the effect of the wah - default is 2
			 * autoWah.Q.value = 6;
			 * //more audible on higher notes
			 * synth.triggerAttackRelease("C4", "8n")
			 */
		    Tone.AutoWah = function () {
		        var options = this.optionsObject(arguments, [
		            'baseFrequency',
		            'octaves',
		            'sensitivity'
		        ], Tone.AutoWah.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  The envelope follower. Set the attack/release
				 *  timing to adjust how the envelope is followed. 
				 *  @type {Tone.Follower}
				 *  @private
				 */
		        this.follower = new Tone.Follower(options.follower);
		        /**
				 *  scales the follower value to the frequency domain
				 *  @type {Tone}
				 *  @private
				 */
		        this._sweepRange = new Tone.ScaleExp(0, 1, 0.5);
		        /**
				 *  @type {number}
				 *  @private
				 */
		        this._baseFrequency = options.baseFrequency;
		        /**
				 *  @type {number}
				 *  @private
				 */
		        this._octaves = options.octaves;
		        /**
				 *  the input gain to adjust the sensitivity
				 *  @type {GainNode}
				 *  @private
				 */
		        this._inputBoost = this.context.createGain();
		        /**
				 *  @type {BiquadFilterNode}
				 *  @private
				 */
		        this._bandpass = new Tone.Filter({
		            'rolloff': -48,
		            'frequency': 0,
		            'Q': options.Q
		        });
		        /**
				 *  @type {Tone.Filter}
				 *  @private
				 */
		        this._peaking = new Tone.Filter(0, 'peaking');
		        this._peaking.gain.value = options.gain;
		        /**
				 * The gain of the filter.
				 * @type {Number}
				 * @signal
				 */
		        this.gain = this._peaking.gain;
		        /**
				 * The quality of the filter.
				 * @type {Positive}
				 * @signal
				 */
		        this.Q = this._bandpass.Q;
		        //the control signal path
		        this.effectSend.chain(this._inputBoost, this.follower, this._sweepRange);
		        this._sweepRange.connect(this._bandpass.frequency);
		        this._sweepRange.connect(this._peaking.frequency);
		        //the filtered path
		        this.effectSend.chain(this._bandpass, this._peaking, this.effectReturn);
		        //set the initial value
		        this._setSweepRange();
		        this.sensitivity = options.sensitivity;
		        this._readOnly([
		            'gain',
		            'Q'
		        ]);
		    };
		    Tone.extend(Tone.AutoWah, Tone.Effect);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.AutoWah.defaults = {
		        'baseFrequency': 100,
		        'octaves': 6,
		        'sensitivity': 0,
		        'Q': 2,
		        'gain': 2,
		        'follower': {
		            'attack': 0.3,
		            'release': 0.5
		        }
		    };
		    /**
			 * The number of octaves that the filter will sweep above the 
			 * baseFrequency. 
			 * @memberOf Tone.AutoWah#
			 * @type {Number}
			 * @name octaves
			 */
		    Object.defineProperty(Tone.AutoWah.prototype, 'octaves', {
		        get: function () {
		            return this._octaves;
		        },
		        set: function (octaves) {
		            this._octaves = octaves;
		            this._setSweepRange();
		        }
		    });
		    /**
			 * The base frequency from which the sweep will start from.
			 * @memberOf Tone.AutoWah#
			 * @type {Frequency}
			 * @name baseFrequency
			 */
		    Object.defineProperty(Tone.AutoWah.prototype, 'baseFrequency', {
		        get: function () {
		            return this._baseFrequency;
		        },
		        set: function (baseFreq) {
		            this._baseFrequency = baseFreq;
		            this._setSweepRange();
		        }
		    });
		    /**
			 * The sensitivity to control how responsive to the input signal the filter is. 
			 * @memberOf Tone.AutoWah#
			 * @type {Decibels}
			 * @name sensitivity
			 */
		    Object.defineProperty(Tone.AutoWah.prototype, 'sensitivity', {
		        get: function () {
		            return this.gainToDb(1 / this._inputBoost.gain.value);
		        },
		        set: function (sensitivy) {
		            this._inputBoost.gain.value = 1 / this.dbToGain(sensitivy);
		        }
		    });
		    /**
			 *  sets the sweep range of the scaler
			 *  @private
			 */
		    Tone.AutoWah.prototype._setSweepRange = function () {
		        this._sweepRange.min = this._baseFrequency;
		        this._sweepRange.max = Math.min(this._baseFrequency * Math.pow(2, this._octaves), this.context.sampleRate / 2);
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.AutoWah} this
			 */
		    Tone.AutoWah.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this.follower.dispose();
		        this.follower = null;
		        this._sweepRange.dispose();
		        this._sweepRange = null;
		        this._bandpass.dispose();
		        this._bandpass = null;
		        this._peaking.dispose();
		        this._peaking = null;
		        this._inputBoost.disconnect();
		        this._inputBoost = null;
		        this._writable([
		            'gain',
		            'Q'
		        ]);
		        this.gain = null;
		        this.Q = null;
		        return this;
		    };
		    return Tone.AutoWah;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Bitcrusher downsamples the incoming signal to a different bitdepth. 
			 *         Lowering the bitdepth of the signal creates distortion. Read more about Bitcrushing
			 *         on [Wikipedia](https://en.wikipedia.org/wiki/Bitcrusher).
			 *
			 *  @constructor
			 *  @extends {Tone.Effect}
			 *  @param {Number} bits The number of bits to downsample the signal. Nominal range
			 *                       of 1 to 8. 
			 *  @example
			 * //initialize crusher and route a synth through it
			 * var crusher = new Tone.BitCrusher(4).toMaster();
			 * var synth = new Tone.MonoSynth().connect(crusher);
			 */
		    Tone.BitCrusher = function () {
		        var options = this.optionsObject(arguments, ['bits'], Tone.BitCrusher.defaults);
		        Tone.Effect.call(this, options);
		        var invStepSize = 1 / Math.pow(2, options.bits - 1);
		        /**
				 *  Subtract the input signal and the modulus of the input signal
				 *  @type {Tone.Subtract}
				 *  @private
				 */
		        this._subtract = new Tone.Subtract();
		        /**
				 *  The mod function
				 *  @type  {Tone.Modulo}
				 *  @private
				 */
		        this._modulo = new Tone.Modulo(invStepSize);
		        /**
				 *  keeps track of the bits
				 *  @type {number}
				 *  @private
				 */
		        this._bits = options.bits;
		        //connect it up
		        this.effectSend.fan(this._subtract, this._modulo);
		        this._modulo.connect(this._subtract, 0, 1);
		        this._subtract.connect(this.effectReturn);
		    };
		    Tone.extend(Tone.BitCrusher, Tone.Effect);
		    /**
			 *  the default values
			 *  @static
			 *  @type {Object}
			 */
		    Tone.BitCrusher.defaults = { 'bits': 4 };
		    /**
			 * The bit depth of the effect. Nominal range of 1-8. 
			 * @memberOf Tone.BitCrusher#
			 * @type {number}
			 * @name bits
			 */
		    Object.defineProperty(Tone.BitCrusher.prototype, 'bits', {
		        get: function () {
		            return this._bits;
		        },
		        set: function (bits) {
		            this._bits = bits;
		            var invStepSize = 1 / Math.pow(2, bits - 1);
		            this._modulo.value = invStepSize;
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @returns {Tone.BitCrusher} this
			 */
		    Tone.BitCrusher.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._subtract.dispose();
		        this._subtract = null;
		        this._modulo.dispose();
		        this._modulo = null;
		        return this;
		    };
		    return Tone.BitCrusher;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.ChebyShev is a Chebyshev waveshaper, an effect which is good 
			 *         for making different types of distortion sounds.
			 *         Note that odd orders sound very different from even ones, 
			 *         and order = 1 is no change. 
			 *         Read more at [music.columbia.edu](http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php).
			 *
			 *  @extends {Tone.Effect}
			 *  @constructor
			 *  @param {Positive|Object} [order] The order of the chebyshev polynomial. Normal range between 1-100. 
			 *  @example
			 * //create a new cheby
			 * var cheby = new Tone.Chebyshev(50);
			 * //create a monosynth connected to our cheby
			 * synth = new Tone.MonoSynth().connect(cheby);
			 */
		    Tone.Chebyshev = function () {
		        var options = this.optionsObject(arguments, ['order'], Tone.Chebyshev.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  @type {WaveShaperNode}
				 *  @private
				 */
		        this._shaper = new Tone.WaveShaper(4096);
		        /**
				 * holds onto the order of the filter
				 * @type {number}
				 * @private
				 */
		        this._order = options.order;
		        this.connectEffect(this._shaper);
		        this.order = options.order;
		        this.oversample = options.oversample;
		    };
		    Tone.extend(Tone.Chebyshev, Tone.Effect);
		    /**
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Chebyshev.defaults = {
		        'order': 1,
		        'oversample': 'none'
		    };
		    /**
			 *  get the coefficient for that degree
			 *  @param {number} x the x value
			 *  @param   {number} degree 
			 *  @param {Object} memo memoize the computed value. 
			 *                       this speeds up computation greatly. 
			 *  @return  {number}       the coefficient 
			 *  @private
			 */
		    Tone.Chebyshev.prototype._getCoefficient = function (x, degree, memo) {
		        if (memo.hasOwnProperty(degree)) {
		            return memo[degree];
		        } else if (degree === 0) {
		            memo[degree] = 0;
		        } else if (degree === 1) {
		            memo[degree] = x;
		        } else {
		            memo[degree] = 2 * x * this._getCoefficient(x, degree - 1, memo) - this._getCoefficient(x, degree - 2, memo);
		        }
		        return memo[degree];
		    };
		    /**
			 * The order of the Chebyshev polynomial which creates
			 * the equation which is applied to the incoming 
			 * signal through a Tone.WaveShaper. The equations
			 * are in the form:<br>
			 * order 2: 2x^2 + 1<br>
			 * order 3: 4x^3 + 3x <br>
			 * @memberOf Tone.Chebyshev#
			 * @type {Positive}
			 * @name order
			 */
		    Object.defineProperty(Tone.Chebyshev.prototype, 'order', {
		        get: function () {
		            return this._order;
		        },
		        set: function (order) {
		            this._order = order;
		            var curve = new Array(4096);
		            var len = curve.length;
		            for (var i = 0; i < len; ++i) {
		                var x = i * 2 / len - 1;
		                if (x === 0) {
		                    //should output 0 when input is 0
		                    curve[i] = 0;
		                } else {
		                    curve[i] = this._getCoefficient(x, order, {});
		                }
		            }
		            this._shaper.curve = curve;
		        }
		    });
		    /**
			 * The oversampling of the effect. Can either be "none", "2x" or "4x".
			 * @memberOf Tone.Chebyshev#
			 * @type {string}
			 * @name oversample
			 */
		    Object.defineProperty(Tone.Chebyshev.prototype, 'oversample', {
		        get: function () {
		            return this._shaper.oversample;
		        },
		        set: function (oversampling) {
		            this._shaper.oversample = oversampling;
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Chebyshev} this
			 */
		    Tone.Chebyshev.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._shaper.dispose();
		        this._shaper = null;
		        return this;
		    };
		    return Tone.Chebyshev;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Base class for Stereo effects. Provides effectSendL/R and effectReturnL/R. 
			 *
			 *	@constructor
			 *	@extends {Tone.Effect}
			 */
		    Tone.StereoEffect = function () {
		        Tone.call(this);
		        //get the defaults
		        var options = this.optionsObject(arguments, ['wet'], Tone.Effect.defaults);
		        /**
				 *  the drywet knob to control the amount of effect
				 *  @type {Tone.CrossFade}
				 *  @private
				 */
		        this._dryWet = new Tone.CrossFade(options.wet);
		        /**
				 *  The wet control, i.e. how much of the effected
				 *  will pass through to the output. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.wet = this._dryWet.fade;
		        /**
				 *  then split it
				 *  @type {Tone.Split}
				 *  @private
				 */
		        this._split = new Tone.Split();
		        /**
				 *  the effects send LEFT
				 *  @type {GainNode}
				 *  @private
				 */
		        this.effectSendL = this._split.left;
		        /**
				 *  the effects send RIGHT
				 *  @type {GainNode}
				 *  @private
				 */
		        this.effectSendR = this._split.right;
		        /**
				 *  the stereo effect merger
				 *  @type {Tone.Merge}
				 *  @private
				 */
		        this._merge = new Tone.Merge();
		        /**
				 *  the effect return LEFT
				 *  @type {GainNode}
				 *  @private
				 */
		        this.effectReturnL = this._merge.left;
		        /**
				 *  the effect return RIGHT
				 *  @type {GainNode}
				 *  @private
				 */
		        this.effectReturnR = this._merge.right;
		        //connections
		        this.input.connect(this._split);
		        //dry wet connections
		        this.input.connect(this._dryWet, 0, 0);
		        this._merge.connect(this._dryWet, 0, 1);
		        this._dryWet.connect(this.output);
		        this._readOnly(['wet']);
		    };
		    Tone.extend(Tone.StereoEffect, Tone.Effect);
		    /**
			 *  Clean up. 
			 *  @returns {Tone.StereoEffect} this
			 */
		    Tone.StereoEffect.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._dryWet.dispose();
		        this._dryWet = null;
		        this._split.dispose();
		        this._split = null;
		        this._merge.dispose();
		        this._merge = null;
		        this.effectSendL = null;
		        this.effectSendR = null;
		        this.effectReturnL = null;
		        this.effectReturnR = null;
		        this._writable(['wet']);
		        this.wet = null;
		        return this;
		    };
		    return Tone.StereoEffect;
		});
		Module(function (Tone) {
		    
		    /**
			 * 	@class  Tone.FeedbackEffect provides a loop between an 
			 * 	        audio source and its own output. This is a base-class
			 * 	        for feedback effects. 
			 *
			 *  @constructor
			 *  @extends {Tone.Effect}
			 *  @param {NormalRange|Object} [feedback] The initial feedback value.
			 */
		    Tone.FeedbackEffect = function () {
		        var options = this.optionsObject(arguments, ['feedback']);
		        options = this.defaultArg(options, Tone.FeedbackEffect.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  The amount of signal which is fed back into the effect input. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.feedback = new Tone.Signal(options.feedback, Tone.Type.NormalRange);
		        /**
				 *  the gain which controls the feedback
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedbackGain = this.context.createGain();
		        //the feedback loop
		        this.effectReturn.chain(this._feedbackGain, this.effectSend);
		        this.feedback.connect(this._feedbackGain.gain);
		        this._readOnly(['feedback']);
		    };
		    Tone.extend(Tone.FeedbackEffect, Tone.Effect);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.FeedbackEffect.defaults = { 'feedback': 0.125 };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.FeedbackEffect} this
			 */
		    Tone.FeedbackEffect.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._writable(['feedback']);
		        this.feedback.dispose();
		        this.feedback = null;
		        this._feedbackGain.disconnect();
		        this._feedbackGain = null;
		        return this;
		    };
		    return Tone.FeedbackEffect;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Just like a stereo feedback effect, but the feedback is routed from left to right
			 *         and right to left instead of on the same channel.
			 *
			 *	@constructor
			 *	@extends {Tone.FeedbackEffect}
			 */
		    Tone.StereoXFeedbackEffect = function () {
		        var options = this.optionsObject(arguments, ['feedback'], Tone.FeedbackEffect.defaults);
		        Tone.StereoEffect.call(this, options);
		        /**
				 *  The amount of feedback from the output
				 *  back into the input of the effect (routed
				 *  across left and right channels).
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.feedback = new Tone.Signal(options.feedback, Tone.Type.NormalRange);
		        /**
				 *  the left side feeback
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedbackLR = this.context.createGain();
		        /**
				 *  the right side feeback
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedbackRL = this.context.createGain();
		        //connect it up
		        this.effectReturnL.chain(this._feedbackLR, this.effectSendR);
		        this.effectReturnR.chain(this._feedbackRL, this.effectSendL);
		        this.feedback.fan(this._feedbackLR.gain, this._feedbackRL.gain);
		        this._readOnly(['feedback']);
		    };
		    Tone.extend(Tone.StereoXFeedbackEffect, Tone.FeedbackEffect);
		    /**
			 *  clean up
			 *  @returns {Tone.StereoXFeedbackEffect} this
			 */
		    Tone.StereoXFeedbackEffect.prototype.dispose = function () {
		        Tone.StereoEffect.prototype.dispose.call(this);
		        this._writable(['feedback']);
		        this.feedback.dispose();
		        this.feedback = null;
		        this._feedbackLR.disconnect();
		        this._feedbackLR = null;
		        this._feedbackRL.disconnect();
		        this._feedbackRL = null;
		        return this;
		    };
		    return Tone.StereoXFeedbackEffect;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Chorus is a stereo chorus effect with feedback composed of 
			 *         a left and right delay with a Tone.LFO applied to the delayTime of each channel. 
			 *         Inspiration from [Tuna.js](https://github.com/Dinahmoe/tuna/blob/master/tuna.js).
			 *         Read more on the chorus effect on [SoundOnSound](http://www.soundonsound.com/sos/jun04/articles/synthsecrets.htm).
			 *
			 *	@constructor
			 *	@extends {Tone.StereoXFeedbackEffect}
			 *	@param {Frequency|Object} [frequency] The frequency of the LFO.
			 *	@param {Milliseconds} [delayTime] The delay of the chorus effect in ms. 
			 *	@param {NormalRange} [depth] The depth of the chorus.
			 *	@example
			 * var chorus = new Tone.Chorus(4, 2.5, 0.5);
			 * var synth = new Tone.PolySynth(4, Tone.MonoSynth).connect(chorus);
			 * synth.triggerAttackRelease(["C3","E3","G3"], "8n");
			 */
		    Tone.Chorus = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'delayTime',
		            'depth'
		        ], Tone.Chorus.defaults);
		        Tone.StereoXFeedbackEffect.call(this, options);
		        /**
				 *  the depth of the chorus
				 *  @type {number}
				 *  @private
				 */
		        this._depth = options.depth;
		        /**
				 *  the delayTime
				 *  @type {number}
				 *  @private
				 */
		        this._delayTime = options.delayTime / 1000;
		        /**
				 *  the lfo which controls the delayTime
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfoL = new Tone.LFO({
		            'frequency': options.frequency,
		            'min': 0,
		            'max': 1
		        });
		        /**
				 *  another LFO for the right side with a 180 degree phase diff
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfoR = new Tone.LFO({
		            'frequency': options.frequency,
		            'min': 0,
		            'max': 1,
		            'phase': 180
		        });
		        /**
				 *  delay for left
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delayNodeL = this.context.createDelay();
		        /**
				 *  delay for right
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delayNodeR = this.context.createDelay();
		        /**
				 * The frequency of the LFO which modulates the delayTime. 
				 * @type {Frequency}
				 * @signal
				 */
		        this.frequency = this._lfoL.frequency;
		        //connections
		        this.effectSendL.chain(this._delayNodeL, this.effectReturnL);
		        this.effectSendR.chain(this._delayNodeR, this.effectReturnR);
		        //and pass through to make the detune apparent
		        this.effectSendL.connect(this.effectReturnL);
		        this.effectSendR.connect(this.effectReturnR);
		        //lfo setup
		        this._lfoL.connect(this._delayNodeL.delayTime);
		        this._lfoR.connect(this._delayNodeR.delayTime);
		        //start the lfo
		        this._lfoL.start();
		        this._lfoR.start();
		        //have one LFO frequency control the other
		        this._lfoL.frequency.connect(this._lfoR.frequency);
		        //set the initial values
		        this.depth = this._depth;
		        this.frequency.value = options.frequency;
		        this.type = options.type;
		        this._readOnly(['frequency']);
		        this.spread = options.spread;
		    };
		    Tone.extend(Tone.Chorus, Tone.StereoXFeedbackEffect);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.Chorus.defaults = {
		        'frequency': 1.5,
		        'delayTime': 3.5,
		        'depth': 0.7,
		        'feedback': 0.1,
		        'type': 'sine',
		        'spread': 180
		    };
		    /**
			 * The depth of the effect. A depth of 1 makes the delayTime
			 * modulate between 0 and 2*delayTime (centered around the delayTime). 
			 * @memberOf Tone.Chorus#
			 * @type {NormalRange}
			 * @name depth
			 */
		    Object.defineProperty(Tone.Chorus.prototype, 'depth', {
		        get: function () {
		            return this._depth;
		        },
		        set: function (depth) {
		            this._depth = depth;
		            var deviation = this._delayTime * depth;
		            this._lfoL.min = Math.max(this._delayTime - deviation, 0);
		            this._lfoL.max = this._delayTime + deviation;
		            this._lfoR.min = Math.max(this._delayTime - deviation, 0);
		            this._lfoR.max = this._delayTime + deviation;
		        }
		    });
		    /**
			 * The delayTime in milliseconds of the chorus. A larger delayTime
			 * will give a more pronounced effect. Nominal range a delayTime
			 * is between 2 and 20ms. 
			 * @memberOf Tone.Chorus#
			 * @type {Milliseconds}
			 * @name delayTime
			 */
		    Object.defineProperty(Tone.Chorus.prototype, 'delayTime', {
		        get: function () {
		            return this._delayTime * 1000;
		        },
		        set: function (delayTime) {
		            this._delayTime = delayTime / 1000;
		            this.depth = this._depth;
		        }
		    });
		    /**
			 * The oscillator type of the LFO. 
			 * @memberOf Tone.Chorus#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.Chorus.prototype, 'type', {
		        get: function () {
		            return this._lfoL.type;
		        },
		        set: function (type) {
		            this._lfoL.type = type;
		            this._lfoR.type = type;
		        }
		    });
		    /** 
			 * Amount of stereo spread. When set to 0, both LFO's will be panned centrally.
			 * When set to 180, LFO's will be panned hard left and right respectively.
			 * @memberOf Tone.Chorus#
			 * @type {Degrees}
			 * @name spread
			 */
		    Object.defineProperty(Tone.Chorus.prototype, 'spread', {
		        get: function () {
		            return this._lfoR.phase - this._lfoL.phase;    //180
		        },
		        set: function (spread) {
		            this._lfoL.phase = 90 - spread / 2;
		            this._lfoR.phase = spread / 2 + 90;
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Chorus} this
			 */
		    Tone.Chorus.prototype.dispose = function () {
		        Tone.StereoXFeedbackEffect.prototype.dispose.call(this);
		        this._lfoL.dispose();
		        this._lfoL = null;
		        this._lfoR.dispose();
		        this._lfoR = null;
		        this._delayNodeL.disconnect();
		        this._delayNodeL = null;
		        this._delayNodeR.disconnect();
		        this._delayNodeR = null;
		        this._writable('frequency');
		        this.frequency = null;
		        return this;
		    };
		    return Tone.Chorus;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Convolver is a wrapper around the Native Web Audio 
			 *          [ConvolverNode](http://webaudio.github.io/web-audio-api/#the-convolvernode-interface).
			 *          Convolution is useful for reverb and filter emulation. Read more about convolution reverb on
			 *          [Wikipedia](https://en.wikipedia.org/wiki/Convolution_reverb).
			 *  
			 *  @constructor
			 *  @extends {Tone.Effect}
			 *  @param {string|Tone.Buffer|Object} [url] The URL of the impulse response or the Tone.Buffer
			 *                                           contianing the impulse response. 
			 *  @example
			 * //initializing the convolver with an impulse response
			 * var convolver = new Tone.Convolver("./path/to/ir.wav");
			 * convolver.toMaster();
			 * //after the buffer has loaded
			 * Tone.Buffer.onload = function(){
			 * 	//testing out convolution with a noise burst
			 * 	var burst = new Tone.NoiseSynth().connect(convolver);
			 * 	burst.triggerAttackRelease("16n");
			 * };
			 */
		    Tone.Convolver = function () {
		        var options = this.optionsObject(arguments, ['url'], Tone.Convolver.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  convolver node
				 *  @type {ConvolverNode}
				 *  @private
				 */
		        this._convolver = this.context.createConvolver();
		        /**
				 *  the convolution buffer
				 *  @type {Tone.Buffer}
				 *  @private
				 */
		        this._buffer = new Tone.Buffer(options.url, function (buffer) {
		            this.buffer = buffer;
		            options.onload();
		        }.bind(this));
		        this.connectEffect(this._convolver);
		    };
		    Tone.extend(Tone.Convolver, Tone.Effect);
		    /**
			 *  @static
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.Convolver.defaults = {
		        'url': '',
		        'onload': Tone.noOp
		    };
		    /**
			 *  The convolver's buffer
			 *  @memberOf Tone.Convolver#
			 *  @type {AudioBuffer}
			 *  @name buffer
			 */
		    Object.defineProperty(Tone.Convolver.prototype, 'buffer', {
		        get: function () {
		            return this._buffer.get();
		        },
		        set: function (buffer) {
		            this._buffer.set(buffer);
		            this._convolver.buffer = this._buffer.get();
		        }
		    });
		    /**
			 *  Load an impulse response url as an audio buffer.
			 *  Decodes the audio asynchronously and invokes
			 *  the callback once the audio buffer loads.
			 *  @param {string} url The url of the buffer to load.
			 *                      filetype support depends on the
			 *                      browser.
			 *  @param  {function=} callback
			 *  @returns {Tone.Convolver} this
			 */
		    Tone.Convolver.prototype.load = function (url, callback) {
		        this._buffer.load(url, function (buff) {
		            this.buffer = buff;
		            if (callback) {
		                callback();
		            }
		        }.bind(this));
		        return this;
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Convolver} this
			 */
		    Tone.Convolver.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._convolver.disconnect();
		        this._convolver = null;
		        this._buffer.dispose();
		        this._buffer = null;
		        return this;
		    };
		    return Tone.Convolver;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Distortion is a simple distortion effect using Tone.WaveShaper.
			 *         Algorithm from [a stackoverflow answer](http://stackoverflow.com/a/22313408).
			 *
			 *  @extends {Tone.Effect}
			 *  @constructor
			 *  @param {Number|Object} [distortion] The amount of distortion (nominal range of 0-1)
			 *  @example
			 * var dist = new Tone.Distortion(0.8).toMaster();
			 * var fm = new Tone.SimpleFM().connect(dist);
			 * //this sounds good on bass notes
			 * fm.triggerAttackRelease("A1", "8n");
			 */
		    Tone.Distortion = function () {
		        var options = this.optionsObject(arguments, ['distortion'], Tone.Distortion.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  @type {Tone.WaveShaper}
				 *  @private
				 */
		        this._shaper = new Tone.WaveShaper(4096);
		        /**
				 * holds the distortion amount
				 * @type {number}
				 * @private
				 */
		        this._distortion = options.distortion;
		        this.connectEffect(this._shaper);
		        this.distortion = options.distortion;
		        this.oversample = options.oversample;
		    };
		    Tone.extend(Tone.Distortion, Tone.Effect);
		    /**
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Distortion.defaults = {
		        'distortion': 0.4,
		        'oversample': 'none'
		    };
		    /**
			 * The amount of distortion.
			 * @memberOf Tone.Distortion#
			 * @type {NormalRange}
			 * @name distortion
			 */
		    Object.defineProperty(Tone.Distortion.prototype, 'distortion', {
		        get: function () {
		            return this._distortion;
		        },
		        set: function (amount) {
		            this._distortion = amount;
		            var k = amount * 100;
		            var deg = Math.PI / 180;
		            this._shaper.setMap(function (x) {
		                if (Math.abs(x) < 0.001) {
		                    //should output 0 when input is 0
		                    return 0;
		                } else {
		                    return (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
		                }
		            });
		        }
		    });
		    /**
			 * The oversampling of the effect. Can either be "none", "2x" or "4x".
			 * @memberOf Tone.Distortion#
			 * @type {string}
			 * @name oversample
			 */
		    Object.defineProperty(Tone.Distortion.prototype, 'oversample', {
		        get: function () {
		            return this._shaper.oversample;
		        },
		        set: function (oversampling) {
		            this._shaper.oversample = oversampling;
		        }
		    });
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Distortion} this
			 */
		    Tone.Distortion.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._shaper.dispose();
		        this._shaper = null;
		        return this;
		    };
		    return Tone.Distortion;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.FeedbackDelay is a DelayNode in which part of output
			 *          signal is fed back into the delay. 
			 *
			 *  @constructor
			 *  @extends {Tone.FeedbackEffect}
			 *  @param {Time|Object} [delayTime] The delay applied to the incoming signal. 
			 *  @param {NormalRange=} feedback The amount of the effected signal which 
			 *                            is fed back through the delay.
			 *  @example
			 * var feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();
			 * var tom = new Tone.DrumSynth({
			 * 	"octaves" : 4,
			 * 	"pitchDecay" : 0.1
			 * }).connect(feedbackDelay);
			 * tom.triggerAttackRelease("A2","32n");
			 */
		    Tone.FeedbackDelay = function () {
		        var options = this.optionsObject(arguments, [
		            'delayTime',
		            'feedback'
		        ], Tone.FeedbackDelay.defaults);
		        Tone.FeedbackEffect.call(this, options);
		        /**
				 *  The delayTime of the DelayNode. 
				 *  @type {Time}
				 *  @signal
				 */
		        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
		        /**
				 *  the delay node
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._delayNode = this.context.createDelay(4);
		        // connect it up
		        this.connectEffect(this._delayNode);
		        this.delayTime.connect(this._delayNode.delayTime);
		        this._readOnly(['delayTime']);
		    };
		    Tone.extend(Tone.FeedbackDelay, Tone.FeedbackEffect);
		    /**
			 *  The default values. 
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.FeedbackDelay.defaults = { 'delayTime': 0.25 };
		    /**
			 *  clean up
			 *  @returns {Tone.FeedbackDelay} this
			 */
		    Tone.FeedbackDelay.prototype.dispose = function () {
		        Tone.FeedbackEffect.prototype.dispose.call(this);
		        this.delayTime.dispose();
		        this._delayNode.disconnect();
		        this._delayNode = null;
		        this._writable(['delayTime']);
		        this.delayTime = null;
		        return this;
		    };
		    return Tone.FeedbackDelay;
		});
		Module(function (Tone) {
		    
		    /**
			 *  an array of comb filter delay values from Freeverb implementation
			 *  @static
			 *  @private
			 *  @type {Array}
			 */
		    var combFilterTunings = [
		        1557 / 44100,
		        1617 / 44100,
		        1491 / 44100,
		        1422 / 44100,
		        1277 / 44100,
		        1356 / 44100,
		        1188 / 44100,
		        1116 / 44100
		    ];
		    /**
			 *  an array of allpass filter frequency values from Freeverb implementation
			 *  @private
			 *  @static
			 *  @type {Array}
			 */
		    var allpassFilterFrequencies = [
		        225,
		        556,
		        441,
		        341
		    ];
		    /**
			 *  @class Tone.Freeverb is a reverb based on [Freeverb](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html).
			 *         Read more on reverb on [SoundOnSound](http://www.soundonsound.com/sos/may00/articles/reverb.htm).
			 *
			 *  @extends {Tone.Effect}
			 *  @constructor
			 *  @param {NormalRange|Object} [roomSize] Correlated to the decay time. 
			 *  @param {Frequency} [dampening] The cutoff frequency of a lowpass filter as part 
			 *                                 of the reverb. 
			 *  @example
			 * var freeverb = new Tone.Freeverb().toMaster();
			 * freeverb.dampening.value = 1000;
			 * //routing synth through the reverb
			 * var synth = new Tone.AMSynth().connect(freeverb);
			 */
		    Tone.Freeverb = function () {
		        var options = this.optionsObject(arguments, [
		            'roomSize',
		            'dampening'
		        ], Tone.Freeverb.defaults);
		        Tone.StereoEffect.call(this, options);
		        /**
				 *  The roomSize value between. A larger roomSize
				 *  will result in a longer decay. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.roomSize = new Tone.Signal(options.roomSize, Tone.Type.NormalRange);
		        /**
				 *  The amount of dampening of the reverberant signal. 
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.dampening = new Tone.Signal(options.dampening, Tone.Type.Frequency);
		        /**
				 *  the comb filters
				 *  @type {Array}
				 *  @private
				 */
		        this._combFilters = [];
		        /**
				 *  the allpass filters on the left
				 *  @type {Array}
				 *  @private
				 */
		        this._allpassFiltersL = [];
		        /**
				 *  the allpass filters on the right
				 *  @type {Array}
				 *  @private
				 */
		        this._allpassFiltersR = [];
		        //make the allpass filters on teh right
		        for (var l = 0; l < allpassFilterFrequencies.length; l++) {
		            var allpassL = this.context.createBiquadFilter();
		            allpassL.type = 'allpass';
		            allpassL.frequency.value = allpassFilterFrequencies[l];
		            this._allpassFiltersL.push(allpassL);
		        }
		        //make the allpass filters on the left
		        for (var r = 0; r < allpassFilterFrequencies.length; r++) {
		            var allpassR = this.context.createBiquadFilter();
		            allpassR.type = 'allpass';
		            allpassR.frequency.value = allpassFilterFrequencies[r];
		            this._allpassFiltersR.push(allpassR);
		        }
		        //make the comb filters
		        for (var c = 0; c < combFilterTunings.length; c++) {
		            var lfpf = new Tone.LowpassCombFilter(combFilterTunings[c]);
		            if (c < combFilterTunings.length / 2) {
		                this.effectSendL.chain(lfpf, this._allpassFiltersL[0]);
		            } else {
		                this.effectSendR.chain(lfpf, this._allpassFiltersR[0]);
		            }
		            this.roomSize.connect(lfpf.resonance);
		            this.dampening.connect(lfpf.dampening);
		            this._combFilters.push(lfpf);
		        }
		        //chain the allpass filters togetehr
		        this.connectSeries.apply(this, this._allpassFiltersL);
		        this.connectSeries.apply(this, this._allpassFiltersR);
		        this._allpassFiltersL[this._allpassFiltersL.length - 1].connect(this.effectReturnL);
		        this._allpassFiltersR[this._allpassFiltersR.length - 1].connect(this.effectReturnR);
		        this._readOnly([
		            'roomSize',
		            'dampening'
		        ]);
		    };
		    Tone.extend(Tone.Freeverb, Tone.StereoEffect);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.Freeverb.defaults = {
		        'roomSize': 0.7,
		        'dampening': 3000
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.Freeverb} this
			 */
		    Tone.Freeverb.prototype.dispose = function () {
		        Tone.StereoEffect.prototype.dispose.call(this);
		        for (var al = 0; al < this._allpassFiltersL.length; al++) {
		            this._allpassFiltersL[al].disconnect();
		            this._allpassFiltersL[al] = null;
		        }
		        this._allpassFiltersL = null;
		        for (var ar = 0; ar < this._allpassFiltersR.length; ar++) {
		            this._allpassFiltersR[ar].disconnect();
		            this._allpassFiltersR[ar] = null;
		        }
		        this._allpassFiltersR = null;
		        for (var cf = 0; cf < this._combFilters.length; cf++) {
		            this._combFilters[cf].dispose();
		            this._combFilters[cf] = null;
		        }
		        this._combFilters = null;
		        this._writable([
		            'roomSize',
		            'dampening'
		        ]);
		        this.roomSize.dispose();
		        this.roomSize = null;
		        this.dampening.dispose();
		        this.dampening = null;
		        return this;
		    };
		    return Tone.Freeverb;
		});
		Module(function (Tone) {
		    
		    /**
			 *  an array of the comb filter delay time values
			 *  @private
			 *  @static
			 *  @type {Array}
			 */
		    var combFilterDelayTimes = [
		        1687 / 25000,
		        1601 / 25000,
		        2053 / 25000,
		        2251 / 25000
		    ];
		    /**
			 *  the resonances of each of the comb filters
			 *  @private
			 *  @static
			 *  @type {Array}
			 */
		    var combFilterResonances = [
		        0.773,
		        0.802,
		        0.753,
		        0.733
		    ];
		    /**
			 *  the allpass filter frequencies
			 *  @private
			 *  @static
			 *  @type {Array}
			 */
		    var allpassFilterFreqs = [
		        347,
		        113,
		        37
		    ];
		    /**
			 *  @class Tone.JCReverb is a simple [Schroeder Reverberator](https://ccrma.stanford.edu/~jos/pasp/Schroeder_Reverberators.html)
			 *         tuned by John Chowning in 1970.
			 *         It is made up of three allpass filters and four Tone.FeedbackCombFilter. 
			 *         
			 *
			 *  @extends {Tone.Effect}
			 *  @constructor
			 *  @param {NormalRange|Object} [roomSize] Coorelates to the decay time.
			 *  @example
			 * var reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
			 * var delay = new Tone.FeedbackDelay(0.5); 
			 * //connecting the synth to reverb through delay
			 * var synth = new Tone.DuoSynth().chain(delay, reverb);
			 * synth.triggerAttackRelease("A4","8n");
			 */
		    Tone.JCReverb = function () {
		        var options = this.optionsObject(arguments, ['roomSize'], Tone.JCReverb.defaults);
		        Tone.StereoEffect.call(this, options);
		        /**
				 *  room size control values between [0,1]
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.roomSize = new Tone.Signal(options.roomSize, Tone.Type.NormalRange);
		        /**
				 *  scale the room size
				 *  @type {Tone.Scale}
				 *  @private
				 */
		        this._scaleRoomSize = new Tone.Scale(-0.733, 0.197);
		        /**
				 *  a series of allpass filters
				 *  @type {Array}
				 *  @private
				 */
		        this._allpassFilters = [];
		        /**
				 *  parallel feedback comb filters
				 *  @type {Array}
				 *  @private
				 */
		        this._feedbackCombFilters = [];
		        //make the allpass filters
		        for (var af = 0; af < allpassFilterFreqs.length; af++) {
		            var allpass = this.context.createBiquadFilter();
		            allpass.type = 'allpass';
		            allpass.frequency.value = allpassFilterFreqs[af];
		            this._allpassFilters.push(allpass);
		        }
		        //and the comb filters
		        for (var cf = 0; cf < combFilterDelayTimes.length; cf++) {
		            var fbcf = new Tone.FeedbackCombFilter(combFilterDelayTimes[cf], 0.1);
		            this._scaleRoomSize.connect(fbcf.resonance);
		            fbcf.resonance.value = combFilterResonances[cf];
		            this._allpassFilters[this._allpassFilters.length - 1].connect(fbcf);
		            if (cf < combFilterDelayTimes.length / 2) {
		                fbcf.connect(this.effectReturnL);
		            } else {
		                fbcf.connect(this.effectReturnR);
		            }
		            this._feedbackCombFilters.push(fbcf);
		        }
		        //chain the allpass filters together
		        this.roomSize.connect(this._scaleRoomSize);
		        this.connectSeries.apply(this, this._allpassFilters);
		        this.effectSendL.connect(this._allpassFilters[0]);
		        this.effectSendR.connect(this._allpassFilters[0]);
		        this._readOnly(['roomSize']);
		    };
		    Tone.extend(Tone.JCReverb, Tone.StereoEffect);
		    /**
			 *  the default values
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.JCReverb.defaults = { 'roomSize': 0.5 };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.JCReverb} this
			 */
		    Tone.JCReverb.prototype.dispose = function () {
		        Tone.StereoEffect.prototype.dispose.call(this);
		        for (var apf = 0; apf < this._allpassFilters.length; apf++) {
		            this._allpassFilters[apf].disconnect();
		            this._allpassFilters[apf] = null;
		        }
		        this._allpassFilters = null;
		        for (var fbcf = 0; fbcf < this._feedbackCombFilters.length; fbcf++) {
		            this._feedbackCombFilters[fbcf].dispose();
		            this._feedbackCombFilters[fbcf] = null;
		        }
		        this._feedbackCombFilters = null;
		        this._writable(['roomSize']);
		        this.roomSize.dispose();
		        this.roomSize = null;
		        this._scaleRoomSize.dispose();
		        this._scaleRoomSize = null;
		        return this;
		    };
		    return Tone.JCReverb;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Mid/Side processing separates the the 'mid' signal 
			 *         (which comes out of both the left and the right channel) 
			 *         and the 'side' (which only comes out of the the side channels) 
			 *         and effects them separately before being recombined.
			 *         Applies a Mid/Side seperation and recombination.
			 *         Algorithm found in [kvraudio forums](http://www.kvraudio.com/forum/viewtopic.php?t=212587).
			 *         <br><br>
			 *         This is a base-class for Mid/Side Effects. 
			 *
			 *  @extends {Tone.Effect}
			 *  @constructor
			 */
		    Tone.MidSideEffect = function () {
		        Tone.Effect.apply(this, arguments);
		        /**
				 *  The mid/side split
				 *  @type  {Tone.MidSideSplit}
				 *  @private
				 */
		        this._midSideSplit = new Tone.MidSideSplit();
		        /**
				 *  The mid/side merge
				 *  @type  {Tone.MidSideMerge}
				 *  @private
				 */
		        this._midSideMerge = new Tone.MidSideMerge();
		        /**
				 *  The mid send. Connect to mid processing
				 *  @type {Tone.Expr}
				 *  @private
				 */
		        this.midSend = this._midSideSplit.mid;
		        /**
				 *  The side send. Connect to side processing
				 *  @type {Tone.Expr}
				 *  @private
				 */
		        this.sideSend = this._midSideSplit.side;
		        /**
				 *  The mid return connection
				 *  @type {GainNode}
				 *  @private
				 */
		        this.midReturn = this._midSideMerge.mid;
		        /**
				 *  The side return connection
				 *  @type {GainNode}
				 *  @private
				 */
		        this.sideReturn = this._midSideMerge.side;
		        //the connections
		        this.effectSend.connect(this._midSideSplit);
		        this._midSideMerge.connect(this.effectReturn);
		    };
		    Tone.extend(Tone.MidSideEffect, Tone.Effect);
		    /**
			 *  Clean up. 
			 *  @returns {Tone.MidSideEffect} this
			 */
		    Tone.MidSideEffect.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._midSideSplit.dispose();
		        this._midSideSplit = null;
		        this._midSideMerge.dispose();
		        this._midSideMerge = null;
		        this.midSend = null;
		        this.sideSend = null;
		        this.midReturn = null;
		        this.sideReturn = null;
		        return this;
		    };
		    return Tone.MidSideEffect;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Phaser is a phaser effect. Phasers work by changing the phase
			 *         of different frequency components of an incoming signal. Read more on 
			 *         [Wikipedia](https://en.wikipedia.org/wiki/Phaser_(effect)). 
			 *         Inspiration for this phaser comes from [Tuna.js](https://github.com/Dinahmoe/tuna/).
			 *
			 *	@extends {Tone.StereoEffect}
			 *	@constructor
			 *	@param {Frequency|Object} [frequency] The speed of the phasing. 
			 *	@param {number} [octaves] The octaves of the effect. 
			 *	@param {Frequency} [baseFrequency] The base frequency of the filters. 
			 *	@example
			 * var phaser = new Tone.Phaser({
			 * 	"frequency" : 15, 
			 * 	"octaves" : 5, 
			 * 	"baseFrequency" : 1000
			 * }).toMaster();
			 * var synth = new Tone.FMSynth().connect(phaser);
			 * synth.triggerAttackRelease("E3", "2n");
			 */
		    Tone.Phaser = function () {
		        //set the defaults
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'octaves',
		            'baseFrequency'
		        ], Tone.Phaser.defaults);
		        Tone.StereoEffect.call(this, options);
		        /**
				 *  the lfo which controls the frequency on the left side
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfoL = new Tone.LFO(options.frequency, 0, 1);
		        /**
				 *  the lfo which controls the frequency on the right side
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfoR = new Tone.LFO(options.frequency, 0, 1);
		        this._lfoR.phase = 180;
		        /**
				 *  the base modulation frequency
				 *  @type {number}
				 *  @private
				 */
		        this._baseFrequency = options.baseFrequency;
		        /**
				 *  the octaves of the phasing
				 *  @type {number}
				 *  @private
				 */
		        this._octaves = options.octaves;
		        /**
				 *  The quality factor of the filters
				 *  @type {Positive}
				 *  @signal
				 */
		        this.Q = new Tone.Signal(options.Q, Tone.Type.Positive);
		        /**
				 *  the array of filters for the left side
				 *  @type {Array}
				 *  @private
				 */
		        this._filtersL = this._makeFilters(options.stages, this._lfoL, this.Q);
		        /**
				 *  the array of filters for the left side
				 *  @type {Array}
				 *  @private
				 */
		        this._filtersR = this._makeFilters(options.stages, this._lfoR, this.Q);
		        /**
				 * the frequency of the effect
				 * @type {Tone.Signal}
				 */
		        this.frequency = this._lfoL.frequency;
		        this.frequency.value = options.frequency;
		        //connect them up
		        this.effectSendL.connect(this._filtersL[0]);
		        this.effectSendR.connect(this._filtersR[0]);
		        this._filtersL[options.stages - 1].connect(this.effectReturnL);
		        this._filtersR[options.stages - 1].connect(this.effectReturnR);
		        //control the frequency with one LFO
		        this._lfoL.frequency.connect(this._lfoR.frequency);
		        //set the options
		        this.baseFrequency = options.baseFrequency;
		        this.octaves = options.octaves;
		        //start the lfo
		        this._lfoL.start();
		        this._lfoR.start();
		        this._readOnly([
		            'frequency',
		            'Q'
		        ]);
		    };
		    Tone.extend(Tone.Phaser, Tone.StereoEffect);
		    /**
			 *  defaults
			 *  @static
			 *  @type {object}
			 */
		    Tone.Phaser.defaults = {
		        'frequency': 0.5,
		        'octaves': 3,
		        'stages': 10,
		        'Q': 10,
		        'baseFrequency': 350
		    };
		    /**
			 *  @param {number} stages
			 *  @returns {Array} the number of filters all connected together
			 *  @private
			 */
		    Tone.Phaser.prototype._makeFilters = function (stages, connectToFreq, Q) {
		        var filters = new Array(stages);
		        //make all the filters
		        for (var i = 0; i < stages; i++) {
		            var filter = this.context.createBiquadFilter();
		            filter.type = 'allpass';
		            Q.connect(filter.Q);
		            connectToFreq.connect(filter.frequency);
		            filters[i] = filter;
		        }
		        this.connectSeries.apply(this, filters);
		        return filters;
		    };
		    /**
			 * The number of octaves the phase goes above
			 * the baseFrequency
			 * @memberOf Tone.Phaser#
			 * @type {Positive}
			 * @name octaves
			 */
		    Object.defineProperty(Tone.Phaser.prototype, 'octaves', {
		        get: function () {
		            return this._octaves;
		        },
		        set: function (octaves) {
		            this._octaves = octaves;
		            var max = this._baseFrequency * Math.pow(2, octaves);
		            this._lfoL.max = max;
		            this._lfoR.max = max;
		        }
		    });
		    /**
			 * The the base frequency of the filters. 
			 * @memberOf Tone.Phaser#
			 * @type {number}
			 * @name baseFrequency
			 */
		    Object.defineProperty(Tone.Phaser.prototype, 'baseFrequency', {
		        get: function () {
		            return this._baseFrequency;
		        },
		        set: function (freq) {
		            this._baseFrequency = freq;
		            this._lfoL.min = freq;
		            this._lfoR.min = freq;
		            this.octaves = this._octaves;
		        }
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.Phaser} this
			 */
		    Tone.Phaser.prototype.dispose = function () {
		        Tone.StereoEffect.prototype.dispose.call(this);
		        this._writable([
		            'frequency',
		            'Q'
		        ]);
		        this.Q.dispose();
		        this.Q = null;
		        this._lfoL.dispose();
		        this._lfoL = null;
		        this._lfoR.dispose();
		        this._lfoR = null;
		        for (var i = 0; i < this._filtersL.length; i++) {
		            this._filtersL[i].disconnect();
		            this._filtersL[i] = null;
		        }
		        this._filtersL = null;
		        for (var j = 0; j < this._filtersR.length; j++) {
		            this._filtersR[j].disconnect();
		            this._filtersR[j] = null;
		        }
		        this._filtersR = null;
		        this.frequency = null;
		        return this;
		    };
		    return Tone.Phaser;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.PingPongDelay is a feedback delay effect where the echo is heard
			 *          first in one channel and next in the opposite channel. In a stereo
			 *          system these are the right and left channels.
			 *          PingPongDelay in more simplified terms is two Tone.FeedbackDelays 
			 *          with independent delay values. Each delay is routed to one channel
			 *          (left or right), and the channel triggered second will always 
			 *          trigger at the same interval after the first.
			 *
			 * 	@constructor
			 * 	@extends {Tone.StereoXFeedbackEffect}
			 *  @param {Time|Object} [delayTime] The delayTime between consecutive echos.
			 *  @param {NormalRange=} feedback The amount of the effected signal which 
			 *                                 is fed back through the delay.
			 *  @example
			 * var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
			 * var drum = new Tone.DrumSynth().connect(pingPong);
			 * drum.triggerAttackRelease("C4", "32n");
			 */
		    Tone.PingPongDelay = function () {
		        var options = this.optionsObject(arguments, [
		            'delayTime',
		            'feedback'
		        ], Tone.PingPongDelay.defaults);
		        Tone.StereoXFeedbackEffect.call(this, options);
		        /**
				 *  the delay node on the left side
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._leftDelay = this.context.createDelay(options.maxDelayTime);
		        /**
				 *  the delay node on the right side
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._rightDelay = this.context.createDelay(options.maxDelayTime);
		        /**
				 *  the predelay on the right side
				 *  @type {DelayNode}
				 *  @private
				 */
		        this._rightPreDelay = this.context.createDelay(options.maxDelayTime);
		        /**
				 *  the delay time signal
				 *  @type {Time}
				 *  @signal
				 */
		        this.delayTime = new Tone.Signal(options.delayTime, Tone.Type.Time);
		        //connect it up
		        this.effectSendL.chain(this._leftDelay, this.effectReturnL);
		        this.effectSendR.chain(this._rightPreDelay, this._rightDelay, this.effectReturnR);
		        this.delayTime.fan(this._leftDelay.delayTime, this._rightDelay.delayTime, this._rightPreDelay.delayTime);
		        //rearranged the feedback to be after the rightPreDelay
		        this._feedbackLR.disconnect();
		        this._feedbackLR.connect(this._rightDelay);
		        this._readOnly(['delayTime']);
		    };
		    Tone.extend(Tone.PingPongDelay, Tone.StereoXFeedbackEffect);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.PingPongDelay.defaults = {
		        'delayTime': 0.25,
		        'maxDelayTime': 1
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.PingPongDelay} this
			 */
		    Tone.PingPongDelay.prototype.dispose = function () {
		        Tone.StereoXFeedbackEffect.prototype.dispose.call(this);
		        this._leftDelay.disconnect();
		        this._leftDelay = null;
		        this._rightDelay.disconnect();
		        this._rightDelay = null;
		        this._rightPreDelay.disconnect();
		        this._rightPreDelay = null;
		        this._writable(['delayTime']);
		        this.delayTime.dispose();
		        this.delayTime = null;
		        return this;
		    };
		    return Tone.PingPongDelay;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.PitchShift does near-realtime pitch shifting to the incoming signal. 
			 *         The effect is achieved by speeding up or slowing down the delayTime
			 *         of a DelayNode using a sawtooth wave. 
			 *         Algorithm found in [this pdf](http://dsp-book.narod.ru/soundproc.pdf).
			 *         Additional reference by [Miller Pucket](http://msp.ucsd.edu/techniques/v0.11/book-html/node115.html).
			 *         
			 *  @extends {Tone.FeedbackEffect}
			 *  @param {Interval=} pitch The interval to transpose the incoming signal by. 
			 */
		    Tone.PitchShift = function () {
		        var options = this.optionsObject(arguments, ['pitch'], Tone.PitchShift.defaults);
		        Tone.FeedbackEffect.call(this, options);
		        /**
				 *  The pitch signal
				 *  @type  {Tone.Signal}
				 *  @private
				 */
		        this._frequency = new Tone.Signal(0);
		        /**
				 *  Uses two DelayNodes to cover up the jump in
				 *  the sawtooth wave. 
				 *  @type  {DelayNode}
				 *  @private
				 */
		        this._delayA = new Tone.Delay(0, 1);
		        /**
				 *  The first LFO.
				 *  @type  {Tone.LFO}
				 *  @private
				 */
		        this._lfoA = new Tone.LFO({
		            'min': 0,
		            'max': 0.1,
		            'type': 'sawtooth'
		        }).connect(this._delayA.delayTime);
		        /**
				 *  The second DelayNode
				 *  @type  {DelayNode}
				 *  @private
				 */
		        this._delayB = new Tone.Delay(0, 1);
		        /**
				 *  The first LFO.
				 *  @type  {Tone.LFO}
				 *  @private
				 */
		        this._lfoB = new Tone.LFO({
		            'min': 0,
		            'max': 0.1,
		            'type': 'sawtooth',
		            'phase': 180
		        }).connect(this._delayB.delayTime);
		        /**
				 *  Crossfade quickly between the two delay lines
				 *  to cover up the jump in the sawtooth wave
				 *  @type  {Tone.CrossFade}
				 *  @private
				 */
		        this._crossFade = new Tone.CrossFade();
		        /**
				 *  LFO which alternates between the two
				 *  delay lines to cover up the disparity in the
				 *  sawtooth wave. 
				 *  @type  {Tone.LFO}
				 *  @private
				 */
		        this._crossFadeLFO = new Tone.LFO({
		            'min': 0,
		            'max': 1,
		            'type': 'triangle',
		            'phase': 90
		        }).connect(this._crossFade.fade);
		        /**
				 *  The delay node
				 *  @type {Tone.Delay}
				 *  @private
				 */
		        this._feedbackDelay = new Tone.Delay(options.delayTime);
		        /**
				 *  The amount of delay on the input signal
				 *  @type {Time}
				 *  @signal
				 */
		        this.delayTime = this._feedbackDelay.delayTime;
		        this._readOnly('delayTime');
		        /**
				 *  Hold the current pitch
				 *  @type {Number}
				 *  @private
				 */
		        this._pitch = options.pitch;
		        /**
				 *  Hold the current windowSize
				 *  @type {Number}
				 *  @private
				 */
		        this._windowSize = options.windowSize;
		        //connect the two delay lines up
		        this._delayA.connect(this._crossFade.a);
		        this._delayB.connect(this._crossFade.b);
		        //connect the frequency
		        this._frequency.fan(this._lfoA.frequency, this._lfoB.frequency, this._crossFadeLFO.frequency);
		        //route the input
		        this.effectSend.fan(this._delayA, this._delayB);
		        this._crossFade.chain(this._feedbackDelay, this.effectReturn);
		        //start the LFOs at the same time
		        var now = this.now();
		        this._lfoA.start(now);
		        this._lfoB.start(now);
		        this._crossFadeLFO.start(now);
		        //set the initial value
		        this.windowSize = this._windowSize;
		    };
		    Tone.extend(Tone.PitchShift, Tone.FeedbackEffect);
		    /**
			 *  default values
			 *  @static
			 *  @type {Object}
			 *  @const
			 */
		    Tone.PitchShift.defaults = {
		        'pitch': 0,
		        'windowSize': 0.1,
		        'delayTime': 0,
		        'feedback': 0
		    };
		    /**
			 * Repitch the incoming signal by some interval (measured
			 * in semi-tones). 
			 * @memberOf Tone.PitchShift#
			 * @type {Interval}
			 * @name pitch
			 * @example
			 * pitchShift.pitch = -12; //down one octave
			 * pitchShift.pitch = 7; //up a fifth
			 */
		    Object.defineProperty(Tone.PitchShift.prototype, 'pitch', {
		        get: function () {
		            return this._pitch;
		        },
		        set: function (interval) {
		            this._pitch = interval;
		            var factor = 0;
		            if (interval < 0) {
		                this._lfoA.min = 0;
		                this._lfoA.max = this._windowSize;
		                this._lfoB.min = 0;
		                this._lfoB.max = this._windowSize;
		                factor = this.intervalToFrequencyRatio(interval - 1) + 1;
		            } else {
		                this._lfoA.min = this._windowSize;
		                this._lfoA.max = 0;
		                this._lfoB.min = this._windowSize;
		                this._lfoB.max = 0;
		                factor = this.intervalToFrequencyRatio(interval) - 1;
		            }
		            this._frequency.value = factor * (1.2 / this._windowSize);
		        }
		    });
		    /**
			 * The window size corresponds roughly to the sample length in a looping sampler. 
			 * Smaller values are desirable for a less noticeable delay time of the pitch shifted
			 * signal, but larger values will result in smoother pitch shifting for larger intervals. 
			 * A nominal range of 0.03 to 0.1 is recommended. 
			 * @memberOf Tone.PitchShift#
			 * @type {Time}
			 * @name windowSize
			 * @example
			 * pitchShift.windowSize = 0.1;
			 */
		    Object.defineProperty(Tone.PitchShift.prototype, 'windowSize', {
		        get: function () {
		            return this._windowSize;
		        },
		        set: function (size) {
		            this._windowSize = this.toSeconds(size);
		            this.pitch = this._pitch;
		        }
		    });
		    /**
			 *  Clean up.
			 *  @return  {Tone.PitchShift}  this
			 */
		    Tone.PitchShift.prototype.dispose = function () {
		        Tone.FeedbackEffect.prototype.dispose.call(this);
		        this._frequency.dispose();
		        this._frequency = null;
		        this._delayA.disconnect();
		        this._delayA = null;
		        this._delayB.disconnect();
		        this._delayB = null;
		        this._lfoA.dispose();
		        this._lfoA = null;
		        this._lfoB.dispose();
		        this._lfoB = null;
		        this._crossFade.dispose();
		        this._crossFade = null;
		        this._crossFadeLFO.dispose();
		        this._crossFadeLFO = null;
		        this._writable('delayTime');
		        this._feedbackDelay.dispose();
		        this._feedbackDelay = null;
		        this.delayTime = null;
		        return this;
		    };
		    return Tone.PitchShift;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Base class for stereo feedback effects where the effectReturn
			 *         is fed back into the same channel. 
			 *
			 *	@constructor
			 *	@extends {Tone.FeedbackEffect}
			 */
		    Tone.StereoFeedbackEffect = function () {
		        var options = this.optionsObject(arguments, ['feedback'], Tone.FeedbackEffect.defaults);
		        Tone.StereoEffect.call(this, options);
		        /**
				 *  controls the amount of feedback
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.feedback = new Tone.Signal(options.feedback, Tone.Type.NormalRange);
		        /**
				 *  the left side feeback
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedbackL = this.context.createGain();
		        /**
				 *  the right side feeback
				 *  @type {GainNode}
				 *  @private
				 */
		        this._feedbackR = this.context.createGain();
		        //connect it up
		        this.effectReturnL.chain(this._feedbackL, this.effectSendL);
		        this.effectReturnR.chain(this._feedbackR, this.effectSendR);
		        this.feedback.fan(this._feedbackL.gain, this._feedbackR.gain);
		        this._readOnly(['feedback']);
		    };
		    Tone.extend(Tone.StereoFeedbackEffect, Tone.FeedbackEffect);
		    /**
			 *  clean up
			 *  @returns {Tone.StereoFeedbackEffect} this
			 */
		    Tone.StereoFeedbackEffect.prototype.dispose = function () {
		        Tone.StereoEffect.prototype.dispose.call(this);
		        this._writable(['feedback']);
		        this.feedback.dispose();
		        this.feedback = null;
		        this._feedbackL.disconnect();
		        this._feedbackL = null;
		        this._feedbackR.disconnect();
		        this._feedbackR = null;
		        return this;
		    };
		    return Tone.StereoFeedbackEffect;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Applies a width factor to the mid/side seperation. 
			 *         0 is all mid and 1 is all side.
			 *         Algorithm found in [kvraudio forums](http://www.kvraudio.com/forum/viewtopic.php?t=212587).
			 *         <br><br>
			 *         <code>
			 *         Mid *= 2*(1-width)<br>
			 *         Side *= 2*width
			 *         </code>
			 *
			 *  @extends {Tone.MidSideEffect}
			 *  @constructor
			 *  @param {NormalRange|Object} [width] The stereo width. A width of 0 is mono and 1 is stereo. 0.5 is no change.
			 */
		    Tone.StereoWidener = function () {
		        var options = this.optionsObject(arguments, ['width'], Tone.StereoWidener.defaults);
		        Tone.MidSideEffect.call(this, options);
		        /**
				 *  The width control. 0 = 100% mid. 1 = 100% side. 0.5 = no change. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.width = new Tone.Signal(options.width, Tone.Type.NormalRange);
		        /**
				 *  Mid multiplier
				 *  @type {Tone.Expr}
				 *  @private
				 */
		        this._midMult = new Tone.Expr('$0 * ($1 * (1 - $2))');
		        /**
				 *  Side multiplier
				 *  @type {Tone.Expr}
				 *  @private
				 */
		        this._sideMult = new Tone.Expr('$0 * ($1 * $2)');
		        /**
				 *  constant output of 2
				 *  @type {Tone}
				 *  @private
				 */
		        this._two = new Tone.Signal(2);
		        //the mid chain
		        this._two.connect(this._midMult, 0, 1);
		        this.width.connect(this._midMult, 0, 2);
		        //the side chain
		        this._two.connect(this._sideMult, 0, 1);
		        this.width.connect(this._sideMult, 0, 2);
		        //connect it to the effect send/return
		        this.midSend.chain(this._midMult, this.midReturn);
		        this.sideSend.chain(this._sideMult, this.sideReturn);
		        this._readOnly(['width']);
		    };
		    Tone.extend(Tone.StereoWidener, Tone.MidSideEffect);
		    /**
			 *  the default values
			 *  @static
			 *  @type {Object}
			 */
		    Tone.StereoWidener.defaults = { 'width': 0.5 };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.StereoWidener} this
			 */
		    Tone.StereoWidener.prototype.dispose = function () {
		        Tone.MidSideEffect.prototype.dispose.call(this);
		        this._writable(['width']);
		        this.width.dispose();
		        this.width = null;
		        this._midMult.dispose();
		        this._midMult = null;
		        this._sideMult.dispose();
		        this._sideMult = null;
		        this._two.dispose();
		        this._two = null;
		        return this;
		    };
		    return Tone.StereoWidener;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Tremolo modulates the amplitude of an incoming signal using a Tone.LFO.
			 *         The type, frequency, and depth of the LFO is controllable.
			 *
			 *  @extends {Tone.StereoEffect}
			 *  @constructor
			 *  @param {Frequency} [frequency] The rate of the effect.
			 *  @param {NormalRange} [depth] The depth of the effect.
			 *  @example
			 * //create a tremolo and start it's LFO
			 * var tremolo = new Tone.Tremolo(9, 0.75).toMaster().start();
			 * //route an oscillator through the tremolo and start it
			 * var oscillator = new Tone.Oscillator().connect(tremolo).start();
			 */
		    Tone.Tremolo = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'depth'
		        ], Tone.Tremolo.defaults);
		        Tone.StereoEffect.call(this, options);
		        /**
				 *  The tremelo LFO in the left channel
				 *  @type  {Tone.LFO}
				 *  @private
				 */
		        this._lfoL = new Tone.LFO({
		            'phase': options.spread,
		            'min': 1,
		            'max': 0
		        });
		        /**
				 *  The tremelo LFO in the left channel
				 *  @type  {Tone.LFO}
				 *  @private
				 */
		        this._lfoR = new Tone.LFO({
		            'phase': options.spread,
		            'min': 1,
		            'max': 0
		        });
		        /**
				 *  Where the gain is multiplied
				 *  @type  {Tone.Gain}
				 *  @private
				 */
		        this._amplitudeL = new Tone.Gain();
		        /**
				 *  Where the gain is multiplied
				 *  @type  {Tone.Gain}
				 *  @private
				 */
		        this._amplitudeR = new Tone.Gain();
		        /**
				 *  The frequency of the tremolo.
				 *  @type  {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
		        /**
				 *  The depth of the effect. A depth of 0, has no effect
				 *  on the amplitude, and a depth of 1 makes the amplitude
				 *  modulate fully between 0 and 1.
				 *  @type  {NormalRange}
				 *  @signal
				 */
		        this.depth = new Tone.Signal(options.depth, Tone.Type.NormalRange);
		        this._readOnly([
		            'frequency',
		            'depth'
		        ]);
		        this.effectSendL.chain(this._amplitudeL, this.effectReturnL);
		        this.effectSendR.chain(this._amplitudeR, this.effectReturnR);
		        this._lfoL.connect(this._amplitudeL.gain);
		        this._lfoR.connect(this._amplitudeR.gain);
		        this.frequency.fan(this._lfoL.frequency, this._lfoR.frequency);
		        this.depth.fan(this._lfoR.amplitude, this._lfoL.amplitude);
		        this.type = options.type;
		        this.spread = options.spread;
		    };
		    Tone.extend(Tone.Tremolo, Tone.StereoEffect);
		    /**
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Tremolo.defaults = {
		        'frequency': 10,
		        'type': 'sine',
		        'depth': 0.5,
		        'spread': 180
		    };
		    /**
			 * Start the tremolo.
			 * @param {Time} [time=now] When the tremolo begins.
			 * @returns {Tone.Tremolo} this
			 */
		    Tone.Tremolo.prototype.start = function (time) {
		        this._lfoL.start(time);
		        this._lfoR.start(time);
		        return this;
		    };
		    /**
			 * Stop the tremolo.
			 * @param {Time} [time=now] When the tremolo stops.
			 * @returns {Tone.Tremolo} this
			 */
		    Tone.Tremolo.prototype.stop = function (time) {
		        this._lfoL.stop(time);
		        this._lfoR.stop(time);
		        return this;
		    };
		    /**
			 * Sync the effect to the transport.
			 * @param {Time} [delay=0] Delay time before starting the effect after the
			 *                              Transport has started.
			 * @returns {Tone.AutoFilter} this
			 */
		    Tone.Tremolo.prototype.sync = function (delay) {
		        this._lfoL.sync(delay);
		        this._lfoR.sync(delay);
		        return this;
		    };
		    /**
			 * Unsync the filter from the transport
			 * @returns {Tone.Tremolo} this
			 */
		    Tone.Tremolo.prototype.unsync = function () {
		        this._lfoL.unsync();
		        this._lfoR.unsync();
		        return this;
		    };
		    /**
			 * The Tremolo's oscillator type.
			 * @memberOf Tone.Tremolo#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.Tremolo.prototype, 'type', {
		        get: function () {
		            return this._lfoL.type;
		        },
		        set: function (type) {
		            this._lfoL.type = type;
		            this._lfoR.type = type;
		        }
		    });
		    /** 
			 * Amount of stereo spread. When set to 0, both LFO's will be panned centrally.
			 * When set to 180, LFO's will be panned hard left and right respectively.
			 * @memberOf Tone.Tremolo#
			 * @type {Degrees}
			 * @name spread
			 */
		    Object.defineProperty(Tone.Tremolo.prototype, 'spread', {
		        get: function () {
		            return this._lfoR.phase - this._lfoL.phase;    //180
		        },
		        set: function (spread) {
		            this._lfoL.phase = 90 - spread / 2;
		            this._lfoR.phase = spread / 2 + 90;
		        }
		    });
		    /**
			 *  clean up
			 *  @returns {Tone.Tremolo} this
			 */
		    Tone.Tremolo.prototype.dispose = function () {
		        Tone.StereoEffect.prototype.dispose.call(this);
		        this._writable([
		            'frequency',
		            'depth'
		        ]);
		        this._lfoL.dispose();
		        this._lfoL = null;
		        this._lfoR.dispose();
		        this._lfoR = null;
		        this._amplitudeL.dispose();
		        this._amplitudeL = null;
		        this._amplitudeR.dispose();
		        this._amplitudeR = null;
		        this.frequency = null;
		        this.depth = null;
		        return this;
		    };
		    return Tone.Tremolo;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A Vibrato effect composed of a Tone.Delay and a Tone.LFO. The LFO
			 *         modulates the delayTime of the delay, causing the pitch to rise
			 *         and fall. 
			 *  @extends {Tone.Effect}
			 *  @param {Frequency} frequency The frequency of the vibrato.
			 *  @param {NormalRange} depth The amount the pitch is modulated.
			 */
		    Tone.Vibrato = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'depth'
		        ], Tone.Vibrato.defaults);
		        Tone.Effect.call(this, options);
		        /**
				 *  The delay node used for the vibrato effect
				 *  @type {Tone.Delay}
				 *  @private
				 */
		        this._delayNode = new Tone.Delay(0, options.maxDelay);
		        /**
				 *  The LFO used to control the vibrato
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._lfo = new Tone.LFO({
		            'type': options.type,
		            'min': 0,
		            'max': options.maxDelay,
		            'frequency': options.frequency,
		            'phase': -90    //offse the phase so the resting position is in the center
		        }).start().connect(this._delayNode.delayTime);
		        /**
				 *  The frequency of the vibrato
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = this._lfo.frequency;
		        /**
				 *  The depth of the vibrato. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.depth = this._lfo.amplitude;
		        this.depth.value = options.depth;
		        this._readOnly([
		            'frequency',
		            'depth'
		        ]);
		        this.effectSend.chain(this._delayNode, this.effectReturn);
		    };
		    Tone.extend(Tone.Vibrato, Tone.Effect);
		    /**
			 *  The defaults
			 *  @type  {Object}
			 *  @const
			 */
		    Tone.Vibrato.defaults = {
		        'maxDelay': 0.005,
		        'frequency': 5,
		        'depth': 0.1,
		        'type': 'sine'
		    };
		    /**
			 * Type of oscillator attached to the Vibrato.
			 * @memberOf Tone.Vibrato#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.Vibrato.prototype, 'type', {
		        get: function () {
		            return this._lfo.type;
		        },
		        set: function (type) {
		            this._lfo.type = type;
		        }
		    });
		    /**
			 *  Clean up.
			 *  @returns {Tone.Vibrato} this
			 */
		    Tone.Vibrato.prototype.dispose = function () {
		        Tone.Effect.prototype.dispose.call(this);
		        this._delayNode.dispose();
		        this._delayNode = null;
		        this._lfo.dispose();
		        this._lfo = null;
		        this._writable([
		            'frequency',
		            'depth'
		        ]);
		        this.frequency = null;
		        this.depth = null;
		    };
		    return Tone.Vibrato;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Event abstracts away Tone.Transport.schedule and provides a schedulable
			 *          callback for a single or repeatable events along the timeline. 
			 *
			 *  @extends {Tone}
			 *  @param {function} callback The callback to invoke at the time. 
			 *  @param {*} value The value or values which should be passed to
			 *                      the callback function on invocation.  
			 *  @example
			 * var chord = new Tone.Event(function(time, chord){
			 * 	//the chord as well as the exact time of the event
			 * 	//are passed in as arguments to the callback function
			 * }, ["D4", "E4", "F4"]);
			 * //start the chord at the beginning of the transport timeline
			 * chord.start();
			 * //loop it every measure for 8 measures
			 * chord.loop = 8;
			 * chord.loopEnd = "1m";
			 */
		    Tone.Event = function () {
		        var options = this.optionsObject(arguments, [
		            'callback',
		            'value'
		        ], Tone.Event.defaults);
		        /**
				 *  Loop value
				 *  @type  {Boolean|Positive}
				 *  @private
				 */
		        this._loop = options.loop;
		        /**
				 *  The callback to invoke. 
				 *  @type  {Function}
				 */
		        this.callback = options.callback;
		        /**
				 *  The value which is passed to the
				 *  callback function.
				 *  @type  {*}
				 *  @private
				 */
		        this.value = options.value;
		        /**
				 *  When the note is scheduled to start.
				 *  @type  {Number}
				 *  @private
				 */
		        this._loopStart = this.toTicks(options.loopStart);
		        /**
				 *  When the note is scheduled to start.
				 *  @type  {Number}
				 *  @private
				 */
		        this._loopEnd = this.toTicks(options.loopEnd);
		        /**
				 *  Tracks the scheduled events
				 *  @type {Tone.TimelineState}
				 *  @private
				 */
		        this._state = new Tone.TimelineState(Tone.State.Stopped);
		        /**
				 *  The playback speed of the note. A speed of 1
				 *  is no change. 
				 *  @private
				 *  @type {Positive}
				 */
		        this._playbackRate = 1;
		        /**
				 *  A delay time from when the event is scheduled to start
				 *  @type {Ticks}
				 *  @private
				 */
		        this._startOffset = 0;
		        /**
				 *  The probability that the callback will be invoked
				 *  at the scheduled time. 
				 *  @type {NormalRange}
				 *  @example
				 * //the callback will be invoked 50% of the time
				 * event.probability = 0.5;
				 */
		        this.probability = options.probability;
		        /**
				 *  If set to true, will apply small (+/-0.02 seconds) random variation
				 *  to the callback time. If the value is given as a time, it will randomize
				 *  by that amount.
				 *  @example
				 * event.humanize = true;
				 *  @type {Boolean|Time}
				 */
		        this.humanize = options.humanize;
		        /**
				 *  If mute is true, the callback won't be
				 *  invoked.
				 *  @type {Boolean}
				 */
		        this.mute = options.mute;
		        //set the initial values
		        this.playbackRate = options.playbackRate;
		    };
		    Tone.extend(Tone.Event);
		    /**
			 *  The default values
			 *  @type  {Object}
			 *  @const
			 */
		    Tone.Event.defaults = {
		        'callback': Tone.noOp,
		        'loop': false,
		        'loopEnd': '1m',
		        'loopStart': 0,
		        'playbackRate': 1,
		        'value': null,
		        'probability': 1,
		        'mute': false,
		        'humanize': false
		    };
		    /**
			 *  Reschedule all of the events along the timeline
			 *  with the updated values.
			 *  @param {Time} after Only reschedules events after the given time.
			 *  @return  {Tone.Event}  this
			 *  @private
			 */
		    Tone.Event.prototype._rescheduleEvents = function (after) {
		        //if no argument is given, schedules all of the events
		        after = this.defaultArg(after, -1);
		        this._state.forEachFrom(after, function (event) {
		            var duration;
		            if (event.state === Tone.State.Started) {
		                if (!this.isUndef(event.id)) {
		                    Tone.Transport.clear(event.id);
		                }
		                var startTick = event.time + Math.round(this.startOffset / this._playbackRate);
		                if (this._loop) {
		                    duration = Infinity;
		                    if (this.isNumber(this._loop)) {
		                        duration = (this._loop - 1) * this._getLoopDuration();
		                    }
		                    var nextEvent = this._state.getEventAfter(startTick);
		                    if (nextEvent !== null) {
		                        duration = Math.min(duration, nextEvent.time - startTick);
		                    }
		                    if (duration !== Infinity) {
		                        //schedule a stop since it's finite duration
		                        this._state.setStateAtTime(Tone.State.Stopped, startTick + duration + 1);
		                        duration += 'i';
		                    }
		                    event.id = Tone.Transport.scheduleRepeat(this._tick.bind(this), this._getLoopDuration().toString() + 'i', startTick + 'i', duration);
		                } else {
		                    event.id = Tone.Transport.schedule(this._tick.bind(this), startTick + 'i');
		                }
		            }
		        }.bind(this));
		        return this;
		    };
		    /**
			 *  Returns the playback state of the note, either "started" or "stopped".
			 *  @type {String}
			 *  @readOnly
			 *  @memberOf Tone.Event#
			 *  @name state
			 */
		    Object.defineProperty(Tone.Event.prototype, 'state', {
		        get: function () {
		            return this._state.getStateAtTime(Tone.Transport.ticks);
		        }
		    });
		    /**
			 *  The start from the scheduled start time
			 *  @type {Ticks}
			 *  @memberOf Tone.Event#
			 *  @name startOffset
			 *  @private
			 */
		    Object.defineProperty(Tone.Event.prototype, 'startOffset', {
		        get: function () {
		            return this._startOffset;
		        },
		        set: function (offset) {
		            this._startOffset = offset;
		        }
		    });
		    /**
			 *  Start the note at the given time. 
			 *  @param  {Time}  time  When the note should start.
			 *  @return  {Tone.Event}  this
			 */
		    Tone.Event.prototype.start = function (time) {
		        time = this.toTicks(time);
		        if (this._state.getStateAtTime(time) === Tone.State.Stopped) {
		            this._state.addEvent({
		                'state': Tone.State.Started,
		                'time': time,
		                'id': undefined
		            });
		            this._rescheduleEvents(time);
		        }
		        return this;
		    };
		    /**
			 *  Stop the Event at the given time.
			 *  @param  {Time}  time  When the note should stop.
			 *  @return  {Tone.Event}  this
			 */
		    Tone.Event.prototype.stop = function (time) {
		        this.cancel(time);
		        time = this.toTicks(time);
		        if (this._state.getStateAtTime(time) === Tone.State.Started) {
		            this._state.setStateAtTime(Tone.State.Stopped, time);
		            var previousEvent = this._state.getEventBefore(time);
		            var reschedulTime = time;
		            if (previousEvent !== null) {
		                reschedulTime = previousEvent.time;
		            }
		            this._rescheduleEvents(reschedulTime);
		        }
		        return this;
		    };
		    /**
			 *  Cancel all scheduled events greater than or equal to the given time
			 *  @param  {Time}  [time=0]  The time after which events will be cancel.
			 *  @return  {Tone.Event}  this
			 */
		    Tone.Event.prototype.cancel = function (time) {
		        time = this.defaultArg(time, -Infinity);
		        time = this.toTicks(time);
		        this._state.forEachFrom(time, function (event) {
		            Tone.Transport.clear(event.id);
		        });
		        this._state.cancel(time);
		        return this;
		    };
		    /**
			 *  The callback function invoker. Also 
			 *  checks if the Event is done playing
			 *  @param  {Number}  time  The time of the event in seconds
			 *  @private
			 */
		    Tone.Event.prototype._tick = function (time) {
		        if (!this.mute && this._state.getStateAtTime(Tone.Transport.ticks) === Tone.State.Started) {
		            if (this.probability < 1 && Math.random() > this.probability) {
		                return;
		            }
		            if (this.humanize) {
		                var variation = 0.02;
		                if (!this.isBoolean(this.humanize)) {
		                    variation = this.toSeconds(this.humanize);
		                }
		                time += (Math.random() * 2 - 1) * variation;
		            }
		            this.callback(time, this.value);
		        }
		    };
		    /**
			 *  Get the duration of the loop.
			 *  @return  {Ticks}
			 *  @private
			 */
		    Tone.Event.prototype._getLoopDuration = function () {
		        return Math.round((this._loopEnd - this._loopStart) / this._playbackRate);
		    };
		    /**
			 *  If the note should loop or not
			 *  between Tone.Event.loopStart and 
			 *  Tone.Event.loopEnd. An integer
			 *  value corresponds to the number of
			 *  loops the Event does after it starts.
			 *  @memberOf Tone.Event#
			 *  @type {Boolean|Positive}
			 *  @name loop
			 */
		    Object.defineProperty(Tone.Event.prototype, 'loop', {
		        get: function () {
		            return this._loop;
		        },
		        set: function (loop) {
		            this._loop = loop;
		            this._rescheduleEvents();
		        }
		    });
		    /**
			 * 	The playback rate of the note. Defaults to 1.
			 *  @memberOf Tone.Event#
			 *  @type {Positive}
			 *  @name playbackRate
			 *  @example
			 * note.loop = true;
			 * //repeat the note twice as fast
			 * note.playbackRate = 2;
			 */
		    Object.defineProperty(Tone.Event.prototype, 'playbackRate', {
		        get: function () {
		            return this._playbackRate;
		        },
		        set: function (rate) {
		            this._playbackRate = rate;
		            this._rescheduleEvents();
		        }
		    });
		    /**
			 *  The loopEnd point is the time the event will loop. 
			 *  Note: only loops if Tone.Event.loop is true.
			 *  @memberOf Tone.Event#
			 *  @type {Boolean|Positive}
			 *  @name loopEnd
			 */
		    Object.defineProperty(Tone.Event.prototype, 'loopEnd', {
		        get: function () {
		            return this.toNotation(this._loopEnd + 'i');
		        },
		        set: function (loopEnd) {
		            this._loopEnd = this.toTicks(loopEnd);
		            if (this._loop) {
		                this._rescheduleEvents();
		            }
		        }
		    });
		    /**
			 *  The time when the loop should start. 
			 *  @memberOf Tone.Event#
			 *  @type {Boolean|Positive}
			 *  @name loopStart
			 */
		    Object.defineProperty(Tone.Event.prototype, 'loopStart', {
		        get: function () {
		            return this.toNotation(this._loopStart + 'i');
		        },
		        set: function (loopStart) {
		            this._loopStart = this.toTicks(loopStart);
		            if (this._loop) {
		                this._rescheduleEvents();
		            }
		        }
		    });
		    /**
			 *  The current progress of the loop interval.
			 *  Returns 0 if the event is not started yet or
			 *  it is not set to loop.
			 *  @memberOf Tone.Event#
			 *  @type {NormalRange}
			 *  @name progress
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Event.prototype, 'progress', {
		        get: function () {
		            if (this._loop) {
		                var ticks = Tone.Transport.ticks;
		                var lastEvent = this._state.getEvent(ticks);
		                if (lastEvent !== null && lastEvent.state === Tone.State.Started) {
		                    var loopDuration = this._getLoopDuration();
		                    var progress = (ticks - lastEvent.time) % loopDuration;
		                    return progress / loopDuration;
		                } else {
		                    return 0;
		                }
		            } else {
		                return 0;
		            }
		        }
		    });
		    /**
			 *  Clean up
			 *  @return  {Tone.Event}  this
			 */
		    Tone.Event.prototype.dispose = function () {
		        this.cancel();
		        this._state.dispose();
		        this._state = null;
		        this.callback = null;
		        this.value = null;
		    };
		    return Tone.Event;
		});
		Module(function (Tone) {
		    /**
			 *  @class Tone.Loop creates a looped callback at the 
			 *         specified interval. The callback can be 
			 *         started, stopped and scheduled along
			 *         the Transport's timeline. 
			 *  @example
			 * var loop = new Tone.Loop(function(time){
			 * 	//triggered every eighth note. 
			 * 	console.log(time);
			 * }, "8n").start(0);
			 * Tone.Transport.start();
			 *  @extends {Tone}
			 *  @param {Function} callback The callback to invoke with the
			 *                             event.
			 *  @param {Array} events The events to arpeggiate over.
			 */
		    Tone.Loop = function () {
		        var options = this.optionsObject(arguments, [
		            'callback',
		            'interval'
		        ], Tone.Loop.defaults);
		        /**
				 *  The event which produces the callbacks
				 */
		        this._event = new Tone.Event({
		            'callback': this._tick.bind(this),
		            'loop': true,
		            'loopEnd': options.interval,
		            'playbackRate': options.playbackRate,
		            'probability': options.probability
		        });
		        /**
				 *  The callback to invoke with the next event in the pattern
				 *  @type {Function}
				 */
		        this.callback = options.callback;
		        //set the iterations
		        this.iterations = options.iterations;
		    };
		    Tone.extend(Tone.Loop);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.Loop.defaults = {
		        'interval': '4n',
		        'callback': Tone.noOp,
		        'playbackRate': 1,
		        'iterations': Infinity,
		        'probability': true,
		        'mute': false
		    };
		    /**
			 *  Start the loop at the specified time along the Transport's
			 *  timeline.
			 *  @param  {Time=}  time  When to start the Loop.
			 *  @return  {Tone.Loop}  this
			 */
		    Tone.Loop.prototype.start = function (time) {
		        this._event.start(time);
		        return this;
		    };
		    /**
			 *  Stop the loop at the given time.
			 *  @param  {Time=}  time  When to stop the Arpeggio
			 *  @return  {Tone.Loop}  this
			 */
		    Tone.Loop.prototype.stop = function (time) {
		        this._event.stop(time);
		        return this;
		    };
		    /**
			 *  Cancel all scheduled events greater than or equal to the given time
			 *  @param  {Time}  [time=0]  The time after which events will be cancel.
			 *  @return  {Tone.Loop}  this
			 */
		    Tone.Loop.prototype.cancel = function (time) {
		        this._event.cancel(time);
		        return this;
		    };
		    /**
			 *  Internal function called when the notes should be called
			 *  @param  {Number}  time  The time the event occurs
			 *  @private
			 */
		    Tone.Loop.prototype._tick = function (time) {
		        this.callback(time);
		    };
		    /**
			 *  The state of the Loop, either started or stopped.
			 *  @memberOf Tone.Loop#
			 *  @type {String}
			 *  @name state
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'state', {
		        get: function () {
		            return this._event.state;
		        }
		    });
		    /**
			 *  The progress of the loop as a value between 0-1. 0, when
			 *  the loop is stopped or done iterating. 
			 *  @memberOf Tone.Loop#
			 *  @type {NormalRange}
			 *  @name progress
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'progress', {
		        get: function () {
		            return this._event.progress;
		        }
		    });
		    /**
			 *  The time between successive callbacks. 
			 *  @example
			 * loop.interval = "8n"; //loop every 8n
			 *  @memberOf Tone.Loop#
			 *  @type {Time}
			 *  @name interval
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'interval', {
		        get: function () {
		            return this._event.loopEnd;
		        },
		        set: function (interval) {
		            this._event.loopEnd = interval;
		        }
		    });
		    /**
			 *  The playback rate of the loop. The normal playback rate is 1 (no change). 
			 *  A `playbackRate` of 2 would be twice as fast. 
			 *  @memberOf Tone.Loop#
			 *  @type {Time}
			 *  @name playbackRate
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'playbackRate', {
		        get: function () {
		            return this._event.playbackRate;
		        },
		        set: function (rate) {
		            this._event.playbackRate = rate;
		        }
		    });
		    /**
			 *  Random variation +/-0.01s to the scheduled time. 
			 *  Or give it a time value which it will randomize by.
			 *  @type {Boolean|Time}
			 *  @memberOf Tone.Loop#
			 *  @name humanize
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'humanize', {
		        get: function () {
		            return this._event.humanize;
		        },
		        set: function (variation) {
		            this._event.humanize = variation;
		        }
		    });
		    /**
			 *  The probably of the callback being invoked.
			 *  @memberOf Tone.Loop#
			 *  @type {NormalRange}
			 *  @name probability
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'probability', {
		        get: function () {
		            return this._event.probability;
		        },
		        set: function (prob) {
		            this._event.probability = prob;
		        }
		    });
		    /**
			 *  Muting the Loop means that no callbacks are invoked.
			 *  @memberOf Tone.Loop#
			 *  @type {Boolean}
			 *  @name mute
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'mute', {
		        get: function () {
		            return this._event.mute;
		        },
		        set: function (mute) {
		            this._event.mute = mute;
		        }
		    });
		    /**
			 *  The number of iterations of the loop. The default
			 *  value is Infinity (loop forever).
			 *  @memberOf Tone.Loop#
			 *  @type {Positive}
			 *  @name iterations
			 */
		    Object.defineProperty(Tone.Loop.prototype, 'iterations', {
		        get: function () {
		            if (this._event.loop === true) {
		                return Infinity;
		            } else {
		                return this._event.loop;
		            }
		            return this._pattern.index;
		        },
		        set: function (iters) {
		            if (iters === Infinity) {
		                this._event.loop = true;
		            } else {
		                this._event.loop = iters;
		            }
		        }
		    });
		    /**
			 *  Clean up
			 *  @return  {Tone.Loop}  this
			 */
		    Tone.Loop.prototype.dispose = function () {
		        this._event.dispose();
		        this._event = null;
		        this.callback = null;
		    };
		    return Tone.Loop;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.Part is a collection Tone.Events which can be
			 *         started/stoped and looped as a single unit.
			 *
			 *  @extends {Tone.Event}
			 *  @param {Function} callback The callback to invoke on each event
			 *  @param {Array} events the array of events
			 *  @example
			 * var part = new Tone.Part(function(time, note){
			 * 	//the notes given as the second element in the array
			 * 	//will be passed in as the second argument
			 * 	synth.triggerAttackRelease(note, "8n", time);
			 * }, [[0, "C2"], ["0:2", "C3"], ["0:3:2", "G2"]]);
			 *  @example
			 * //use an array of objects as long as the object has a "time" attribute
			 * var part = new Tone.Part(function(time, value){
			 * 	//the value is an object which contains both the note and the velocity
			 * 	synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
			 * }, [{"time" : 0, "note" : "C3", "velocity": 0.9}, 
			 * 	   {"time" : "0:2", "note" : "C4", "velocity": 0.5}
			 * ]).start(0);
			 */
		    Tone.Part = function () {
		        var options = this.optionsObject(arguments, [
		            'callback',
		            'events'
		        ], Tone.Part.defaults);
		        /**
				 *  If the part is looping or not
				 *  @type  {Boolean|Positive}
				 *  @private
				 */
		        this._loop = options.loop;
		        /**
				 *  When the note is scheduled to start.
				 *  @type  {Ticks}
				 *  @private
				 */
		        this._loopStart = this.toTicks(options.loopStart);
		        /**
				 *  When the note is scheduled to start.
				 *  @type  {Ticks}
				 *  @private
				 */
		        this._loopEnd = this.toTicks(options.loopEnd);
		        /**
				 *  The playback rate of the part
				 *  @type  {Positive}
				 *  @private
				 */
		        this._playbackRate = options.playbackRate;
		        /**
				 *  private holder of probability value
				 *  @type {NormalRange}
				 *  @private
				 */
		        this._probability = options.probability;
		        /**
				 *  the amount of variation from the
				 *  given time. 
				 *  @type {Boolean|Time}
				 *  @private
				 */
		        this._humanize = options.humanize;
		        /**
				 *  The start offset
				 *  @type {Ticks}
				 *  @private
				 */
		        this._startOffset = 0;
		        /**
				 *  Keeps track of the current state
				 *  @type {Tone.TimelineState}
				 *  @private
				 */
		        this._state = new Tone.TimelineState(Tone.State.Stopped);
		        /**
				 *  An array of Objects. 
				 *  @type  {Array}
				 *  @private
				 */
		        this._events = [];
		        /**
				 *  The callback to invoke at all the scheduled events.
				 *  @type {Function}
				 */
		        this.callback = options.callback;
		        /**
				 *  If mute is true, the callback won't be
				 *  invoked.
				 *  @type {Boolean}
				 */
		        this.mute = options.mute;
		        //add the events
		        var events = this.defaultArg(options.events, []);
		        if (!this.isUndef(options.events)) {
		            for (var i = 0; i < events.length; i++) {
		                if (Array.isArray(events[i])) {
		                    this.add(events[i][0], events[i][1]);
		                } else {
		                    this.add(events[i]);
		                }
		            }
		        }
		    };
		    Tone.extend(Tone.Part, Tone.Event);
		    /**
			 *  The default values
			 *  @type  {Object}
			 *  @const
			 */
		    Tone.Part.defaults = {
		        'callback': Tone.noOp,
		        'loop': false,
		        'loopEnd': '1m',
		        'loopStart': 0,
		        'playbackRate': 1,
		        'probability': 1,
		        'humanize': false,
		        'mute': false
		    };
		    /**
			 *  Start the part at the given time. 
			 *  @param  {Time}  time    When to start the part.
			 *  @param  {Time=}  offset  The offset from the start of the part
			 *                           to begin playing at.
			 *  @return  {Tone.Part}  this
			 */
		    Tone.Part.prototype.start = function (time, offset) {
		        var ticks = this.toTicks(time);
		        if (this._state.getStateAtTime(ticks) !== Tone.State.Started) {
		            offset = this.defaultArg(offset, 0);
		            offset = this.toTicks(offset);
		            this._state.addEvent({
		                'state': Tone.State.Started,
		                'time': ticks,
		                'offset': offset
		            });
		            this._forEach(function (event) {
		                this._startNote(event, ticks, offset);
		            });
		        }
		        return this;
		    };
		    /**
			 *  Start the event in the given event at the correct time given
			 *  the ticks and offset and looping.
			 *  @param  {Tone.Event}  event 
			 *  @param  {Ticks}  ticks
			 *  @param  {Ticks}  offset
			 *  @private
			 */
		    Tone.Part.prototype._startNote = function (event, ticks, offset) {
		        ticks -= offset;
		        if (this._loop) {
		            if (event.startOffset >= this._loopStart && event.startOffset < this._loopEnd) {
		                if (event.startOffset < offset) {
		                    //start it on the next loop
		                    ticks += this._getLoopDuration();
		                }
		                event.start(ticks + 'i');
		            }
		        } else {
		            if (event.startOffset >= offset) {
		                event.start(ticks + 'i');
		            }
		        }
		    };
		    /**
			 *  The start from the scheduled start time
			 *  @type {Ticks}
			 *  @memberOf Tone.Part#
			 *  @name startOffset
			 *  @private
			 */
		    Object.defineProperty(Tone.Part.prototype, 'startOffset', {
		        get: function () {
		            return this._startOffset;
		        },
		        set: function (offset) {
		            this._startOffset = offset;
		            this._forEach(function (event) {
		                event.startOffset += this._startOffset;
		            });
		        }
		    });
		    /**
			 *  Stop the part at the given time.
			 *  @param  {Time}  time  When to stop the part.
			 *  @return  {Tone.Part}  this
			 */
		    Tone.Part.prototype.stop = function (time) {
		        var ticks = this.toTicks(time);
		        if (this._state.getStateAtTime(ticks) === Tone.State.Started) {
		            this._state.setStateAtTime(Tone.State.Stopped, ticks);
		            this._forEach(function (event) {
		                event.stop(time);
		            });
		        }
		        return this;
		    };
		    /**
			 *  Get/Set an Event's value at the given time. 
			 *  If a value is passed in and no event exists at
			 *  the given time, one will be created with that value. 
			 *  If two events are at the same time, the first one will
			 *  be returned.
			 *  @example
			 * part.at("1m"); //returns the part at the first measure
			 *
			 * part.at("2m", "C2"); //set the value at "2m" to C2. 
			 * //if an event didn't exist at that time, it will be created.
			 *  @param {Time} time the time of the event to get or set
			 *  @param {*=} value If a value is passed in, the value of the
			 *                    event at the given time will be set to it.
			 *  @return {Tone.Event} the event at the time
			 */
		    Tone.Part.prototype.at = function (time, value) {
		        time = this.toTicks(time);
		        var tickTime = this.ticksToSeconds(1);
		        for (var i = 0; i < this._events.length; i++) {
		            var event = this._events[i];
		            if (Math.abs(time - event.startOffset) < tickTime) {
		                if (!this.isUndef(value)) {
		                    event.value = value;
		                }
		                return event;
		            }
		        }
		        //if there was no event at that time, create one
		        if (!this.isUndef(value)) {
		            this.add(time + 'i', value);
		            //return the new event
		            return this._events[this._events.length - 1];
		        } else {
		            return null;
		        }
		    };
		    /**
			 *  Add a an event to the part. 
			 *  @param {Time} time The time the note should start.
			 *                            If an object is passed in, it should
			 *                            have a 'time' attribute and the rest
			 *                            of the object will be used as the 'value'.
			 *  @param  {Tone.Event|*}  value 
			 *  @returns {Tone.Part} this
			 *  @example
			 * part.add("1m", "C#+11");
			 */
		    Tone.Part.prototype.add = function (time, value) {
		        //extract the parameters
		        if (this.isObject(time) && time.hasOwnProperty('time')) {
		            value = time;
		            time = value.time;
		            delete value.time;
		        }
		        time = this.toTicks(time);
		        var event;
		        if (value instanceof Tone.Event) {
		            event = value;
		            event.callback = this._tick.bind(this);
		        } else {
		            event = new Tone.Event({
		                'callback': this._tick.bind(this),
		                'value': value
		            });
		        }
		        //the start offset
		        event.startOffset = time;
		        //initialize the values
		        event.set({
		            'loopEnd': this.loopEnd,
		            'loopStart': this.loopStart,
		            'loop': this.loop,
		            'humanize': this.humanize,
		            'playbackRate': this.playbackRate,
		            'probability': this.probability
		        });
		        this._events.push(event);
		        //start the note if it should be played right now
		        this._restartEvent(event);
		        return this;
		    };
		    /**
			 *  Restart the given event
			 *  @param  {Tone.Event}  event 
			 *  @private
			 */
		    Tone.Part.prototype._restartEvent = function (event) {
		        var stateEvent = this._state.getEvent(this.now());
		        if (stateEvent && stateEvent.state === Tone.State.Started) {
		            this._startNote(event, stateEvent.time, stateEvent.offset);
		        }
		    };
		    /**
			 *  Remove an event from the part. Will recursively iterate
			 *  into nested parts to find the event.
			 *  @param {Time} time The time of the event
			 *  @param {*} value Optionally select only a specific event value
			 */
		    Tone.Part.prototype.remove = function (time, value) {
		        //extract the parameters
		        if (this.isObject(time) && time.hasOwnProperty('time')) {
		            value = time;
		            time = value.time;
		        }
		        time = this.toTicks(time);
		        for (var i = this._events.length - 1; i >= 0; i--) {
		            var event = this._events[i];
		            if (event instanceof Tone.Part) {
		                event.remove(time, value);
		            } else {
		                if (event.startOffset === time) {
		                    if (this.isUndef(value) || !this.isUndef(value) && event.value === value) {
		                        this._events.splice(i, 1);
		                        event.dispose();
		                    }
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Remove all of the notes from the group. 
			 *  @return  {Tone.Part}  this
			 */
		    Tone.Part.prototype.removeAll = function () {
		        this._forEach(function (event) {
		            event.dispose();
		        });
		        this._events = [];
		        return this;
		    };
		    /**
			 *  Cancel scheduled state change events: i.e. "start" and "stop".
			 *  @param {Time} after The time after which to cancel the scheduled events.
			 *  @return  {Tone.Part}  this
			 */
		    Tone.Part.prototype.cancel = function (after) {
		        this._forEach(function (event) {
		            event.cancel(after);
		        });
		        this._state.cancel(after);
		        return this;
		    };
		    /**
			 *  Iterate over all of the events
			 *  @param {Function} callback
			 *  @param {Object} ctx The context
			 *  @private
			 */
		    Tone.Part.prototype._forEach = function (callback, ctx) {
		        ctx = this.defaultArg(ctx, this);
		        for (var i = this._events.length - 1; i >= 0; i--) {
		            var e = this._events[i];
		            if (e instanceof Tone.Part) {
		                e._forEach(callback, ctx);
		            } else {
		                callback.call(ctx, e);
		            }
		        }
		        return this;
		    };
		    /**
			 *  Set the attribute of all of the events
			 *  @param  {String}  attr  the attribute to set
			 *  @param  {*}  value      The value to set it to
			 *  @private
			 */
		    Tone.Part.prototype._setAll = function (attr, value) {
		        this._forEach(function (event) {
		            event[attr] = value;
		        });
		    };
		    /**
			 *  Internal tick method
			 *  @param  {Number}  time  The time of the event in seconds
			 *  @private
			 */
		    Tone.Part.prototype._tick = function (time, value) {
		        if (!this.mute) {
		            this.callback(time, value);
		        }
		    };
		    /**
			 *  Determine if the event should be currently looping
			 *  given the loop boundries of this Part.
			 *  @param  {Tone.Event}  event  The event to test
			 *  @private
			 */
		    Tone.Part.prototype._testLoopBoundries = function (event) {
		        if (event.startOffset < this._loopStart || event.startOffset >= this._loopEnd) {
		            event.cancel();
		        } else {
		            //reschedule it if it's stopped
		            if (event.state === Tone.State.Stopped) {
		                this._restartEvent(event);
		            }
		        }
		    };
		    /**
			 *  The probability of the notes being triggered.
			 *  @memberOf Tone.Part#
			 *  @type {NormalRange}
			 *  @name probability
			 */
		    Object.defineProperty(Tone.Part.prototype, 'probability', {
		        get: function () {
		            return this._probability;
		        },
		        set: function (prob) {
		            this._probability = prob;
		            this._setAll('probability', prob);
		        }
		    });
		    /**
			 *  If set to true, will apply small random variation
			 *  to the callback time. If the value is given as a time, it will randomize
			 *  by that amount.
			 *  @example
			 * event.humanize = true;
			 *  @type {Boolean|Time}
			 *  @name humanize
			 */
		    Object.defineProperty(Tone.Part.prototype, 'humanize', {
		        get: function () {
		            return this._humanize;
		        },
		        set: function (variation) {
		            this._humanize = variation;
		            this._setAll('humanize', variation);
		        }
		    });
		    /**
			 *  If the part should loop or not
			 *  between Tone.Part.loopStart and 
			 *  Tone.Part.loopEnd. An integer
			 *  value corresponds to the number of
			 *  loops the Part does after it starts.
			 *  @memberOf Tone.Part#
			 *  @type {Boolean|Positive}
			 *  @name loop
			 *  @example
			 * //loop the part 8 times
			 * part.loop = 8;
			 */
		    Object.defineProperty(Tone.Part.prototype, 'loop', {
		        get: function () {
		            return this._loop;
		        },
		        set: function (loop) {
		            this._loop = loop;
		            this._forEach(function (event) {
		                event._loopStart = this._loopStart;
		                event._loopEnd = this._loopEnd;
		                event.loop = loop;
		                this._testLoopBoundries(event);
		            });
		        }
		    });
		    /**
			 *  The loopEnd point determines when it will 
			 *  loop if Tone.Part.loop is true.
			 *  @memberOf Tone.Part#
			 *  @type {Boolean|Positive}
			 *  @name loopEnd
			 */
		    Object.defineProperty(Tone.Part.prototype, 'loopEnd', {
		        get: function () {
		            return this.toNotation(this._loopEnd + 'i');
		        },
		        set: function (loopEnd) {
		            this._loopEnd = this.toTicks(loopEnd);
		            if (this._loop) {
		                this._forEach(function (event) {
		                    event.loopEnd = this.loopEnd;
		                    this._testLoopBoundries(event);
		                });
		            }
		        }
		    });
		    /**
			 *  The loopStart point determines when it will 
			 *  loop if Tone.Part.loop is true.
			 *  @memberOf Tone.Part#
			 *  @type {Boolean|Positive}
			 *  @name loopStart
			 */
		    Object.defineProperty(Tone.Part.prototype, 'loopStart', {
		        get: function () {
		            return this.toNotation(this._loopStart + 'i');
		        },
		        set: function (loopStart) {
		            this._loopStart = this.toTicks(loopStart);
		            if (this._loop) {
		                this._forEach(function (event) {
		                    event.loopStart = this.loopStart;
		                    this._testLoopBoundries(event);
		                });
		            }
		        }
		    });
		    /**
			 * 	The playback rate of the part
			 *  @memberOf Tone.Part#
			 *  @type {Positive}
			 *  @name playbackRate
			 */
		    Object.defineProperty(Tone.Part.prototype, 'playbackRate', {
		        get: function () {
		            return this._playbackRate;
		        },
		        set: function (rate) {
		            this._playbackRate = rate;
		            this._setAll('playbackRate', rate);
		        }
		    });
		    /**
			 * 	The number of scheduled notes in the part. 
			 *  @memberOf Tone.Part#
			 *  @type {Positive}
			 *  @name length
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Part.prototype, 'length', {
		        get: function () {
		            return this._events.length;
		        }
		    });
		    /**
			 *  Clean up
			 *  @return  {Tone.Part}  this
			 */
		    Tone.Part.prototype.dispose = function () {
		        this.removeAll();
		        this._state.dispose();
		        this._state = null;
		        this.callback = null;
		        this._events = null;
		        return this;
		    };
		    return Tone.Part;
		});
		Module(function (Tone) {
		    /**
			 *  @class Tone.Pattern arpeggiates between the given notes
			 *         in a number of patterns. See Tone.CtrlPattern for
			 *         a full list of patterns.
			 *  @example
			 * var pattern = new Tone.Pattern(function(time, note){
			 *   //the order of the notes passed in depends on the pattern
			 * }, ["C2", "D4", "E5", "A6"], "upDown");
			 *  @extends {Tone.Loop}
			 *  @param {Function} callback The callback to invoke with the
			 *                             event.
			 *  @param {Array} events The events to arpeggiate over.
			 */
		    Tone.Pattern = function () {
		        var options = this.optionsObject(arguments, [
		            'callback',
		            'events',
		            'pattern'
		        ], Tone.Pattern.defaults);
		        Tone.Loop.call(this, options);
		        /**
				 *  The pattern manager
				 *  @type {Tone.CtrlPattern}
				 *  @private
				 */
		        this._pattern = new Tone.CtrlPattern({
		            'values': options.events,
		            'type': options.pattern,
		            'index': options.index
		        });
		    };
		    Tone.extend(Tone.Pattern, Tone.Loop);
		    /**
			 *  The defaults
			 *  @const
			 *  @type  {Object}
			 */
		    Tone.Pattern.defaults = {
		        'pattern': Tone.CtrlPattern.Type.Up,
		        'events': []
		    };
		    /**
			 *  Internal function called when the notes should be called
			 *  @param  {Number}  time  The time the event occurs
			 *  @private
			 */
		    Tone.Pattern.prototype._tick = function (time) {
		        this.callback(time, this._pattern.value);
		        this._pattern.next();
		    };
		    /**
			 *  The current index in the events array.
			 *  @memberOf Tone.Pattern#
			 *  @type {Positive}
			 *  @name index
			 */
		    Object.defineProperty(Tone.Pattern.prototype, 'index', {
		        get: function () {
		            return this._pattern.index;
		        },
		        set: function (i) {
		            this._pattern.index = i;
		        }
		    });
		    /**
			 *  The array of events.
			 *  @memberOf Tone.Pattern#
			 *  @type {Array}
			 *  @name events
			 */
		    Object.defineProperty(Tone.Pattern.prototype, 'events', {
		        get: function () {
		            return this._pattern.values;
		        },
		        set: function (vals) {
		            this._pattern.values = vals;
		        }
		    });
		    /**
			 *  The current value of the pattern.
			 *  @memberOf Tone.Pattern#
			 *  @type {*}
			 *  @name value
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Pattern.prototype, 'value', {
		        get: function () {
		            return this._pattern.value;
		        }
		    });
		    /**
			 *  The pattern type. See Tone.CtrlPattern for the full list of patterns.
			 *  @memberOf Tone.Pattern#
			 *  @type {String}
			 *  @name pattern
			 */
		    Object.defineProperty(Tone.Pattern.prototype, 'pattern', {
		        get: function () {
		            return this._pattern.type;
		        },
		        set: function (pattern) {
		            this._pattern.type = pattern;
		        }
		    });
		    /**
			 *  Clean up
			 *  @return  {Tone.Pattern}  this
			 */
		    Tone.Pattern.prototype.dispose = function () {
		        Tone.Loop.prototype.dispose.call(this);
		        this._pattern.dispose();
		        this._pattern = null;
		    };
		    return Tone.Pattern;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A sequence is an alternate notation of a part. Instead
			 *         of passing in an array of [time, event] pairs, pass
			 *         in an array of events which will be spaced at the
			 *         given subdivision. Sub-arrays will subdivide that beat
			 *         by the number of items are in the array. 
			 *         Sequence notation inspiration from [Tidal](http://yaxu.org/tidal/)
			 *  @param  {Function}  callback  The callback to invoke with every note
			 *  @param  {Array}    events  The sequence
			 *  @param  {Time} subdivision  The subdivision between which events are placed. 
			 *  @extends {Tone.Part}
			 *  @example
			 * var seq = new Tone.Sequence(function(time, note){
			 * 	console.log(note);
			 * //straight quater notes
			 * }, ["C4", "E4", "G4", "A4"], "4n");
			 *  @example
			 * var seq = new Tone.Sequence(function(time, note){
			 * 	console.log(note);
			 * //subdivisions are given as subarrays
			 * }, ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]]);
			 */
		    Tone.Sequence = function () {
		        var options = this.optionsObject(arguments, [
		            'callback',
		            'events',
		            'subdivision'
		        ], Tone.Sequence.defaults);
		        //remove the events
		        var events = options.events;
		        delete options.events;
		        Tone.Part.call(this, options);
		        /**
				 *  The subdivison of each note
				 *  @type  {Ticks}
				 *  @private
				 */
		        this._subdivision = this.toTicks(options.subdivision);
		        //if no time was passed in, the loop end is the end of the cycle
		        if (this.isUndef(options.loopEnd) && !this.isUndef(events)) {
		            this._loopEnd = events.length * this._subdivision;
		        }
		        //defaults to looping
		        this._loop = true;
		        //add all of the events
		        if (!this.isUndef(events)) {
		            for (var i = 0; i < events.length; i++) {
		                this.add(i, events[i]);
		            }
		        }
		    };
		    Tone.extend(Tone.Sequence, Tone.Part);
		    /**
			 *  The default values.
			 *  @type  {Object}
			 */
		    Tone.Sequence.defaults = { 'subdivision': '4n' };
		    /**
			 *  The subdivision of the sequence. This can only be 
			 *  set in the constructor. The subdivision is the 
			 *  interval between successive steps. 
			 *  @type {Time}
			 *  @memberOf Tone.Sequence#
			 *  @name subdivision
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Sequence.prototype, 'subdivision', {
		        get: function () {
		            return this.toNotation(this._subdivision + 'i');
		        }
		    });
		    /**
			 *  Get/Set an index of the sequence. If the index contains a subarray, 
			 *  a Tone.Sequence representing that sub-array will be returned. 
			 *  @example
			 * var sequence = new Tone.Sequence(playNote, ["E4", "C4", "F#4", ["A4", "Bb3"]])
			 * sequence.at(0)// => returns "E4"
			 * //set a value
			 * sequence.at(0, "G3");
			 * //get a nested sequence
			 * sequence.at(3).at(1)// => returns "Bb3"
			 * @param {Positive} index The index to get or set
			 * @param {*} value Optionally pass in the value to set at the given index.
			 */
		    Tone.Sequence.prototype.at = function (index, value) {
		        //if the value is an array, 
		        if (this.isArray(value)) {
		            //remove the current event at that index
		            this.remove(index);
		        }
		        //call the parent's method
		        return Tone.Part.prototype.at.call(this, this._indexTime(index), value);
		    };
		    /**
			 *  Add an event at an index, if there's already something
			 *  at that index, overwrite it. If `value` is an array, 
			 *  it will be parsed as a subsequence.
			 *  @param {Number} index The index to add the event to
			 *  @param {*} value The value to add at that index
			 *  @returns {Tone.Sequence} this
			 */
		    Tone.Sequence.prototype.add = function (index, value) {
		        if (value === null) {
		            return this;
		        }
		        if (this.isArray(value)) {
		            //make a subsequence and add that to the sequence
		            var subSubdivision = Math.round(this._subdivision / value.length) + 'i';
		            value = new Tone.Sequence(this._tick.bind(this), value, subSubdivision);
		        }
		        Tone.Part.prototype.add.call(this, this._indexTime(index), value);
		        return this;
		    };
		    /**
			 *  Remove a value from the sequence by index
			 *  @param {Number} index The index of the event to remove
			 *  @returns {Tone.Sequence} this
			 */
		    Tone.Sequence.prototype.remove = function (index, value) {
		        Tone.Part.prototype.remove.call(this, this._indexTime(index), value);
		        return this;
		    };
		    /**
			 *  Get the time of the index given the Sequence's subdivision
			 *  @param  {Number}  index 
			 *  @return  {Time}  The time of that index
			 *  @private
			 */
		    Tone.Sequence.prototype._indexTime = function (index) {
		        if (this.isTicks(index)) {
		            return index;
		        } else {
		            return index * this._subdivision + this.startOffset + 'i';
		        }
		    };
		    /**
			 *  Clean up.
			 *  @return {Tone.Sequence} this
			 */
		    Tone.Sequence.prototype.dispose = function () {
		        Tone.Part.prototype.dispose.call(this);
		        return this;
		    };
		    return Tone.Sequence;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.PulseOscillator is a pulse oscillator with control over pulse width,
			 *         also known as the duty cycle. At 50% duty cycle (width = 0.5) the wave is 
			 *         a square and only odd-numbered harmonics are present. At all other widths 
			 *         even-numbered harmonics are present. Read more 
			 *         [here](https://wigglewave.wordpress.com/2014/08/16/pulse-waveforms-and-harmonics/).
			 *
			 *  @constructor
			 *  @extends {Tone.Oscillator}
			 *  @param {Frequency} [frequency] The frequency of the oscillator
			 *  @param {NormalRange} [width] The width of the pulse
			 *  @example
			 * var pulse = new Tone.PulseOscillator("E5", 0.4).toMaster().start();
			 */
		    Tone.PulseOscillator = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'width'
		        ], Tone.Oscillator.defaults);
		        Tone.Source.call(this, options);
		        /**
				 *  The width of the pulse. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.width = new Tone.Signal(options.width, Tone.Type.NormalRange);
		        /**
				 *  gate the width amount
				 *  @type {GainNode}
				 *  @private
				 */
		        this._widthGate = this.context.createGain();
		        /**
				 *  the sawtooth oscillator
				 *  @type {Tone.Oscillator}
				 *  @private
				 */
		        this._sawtooth = new Tone.Oscillator({
		            frequency: options.frequency,
		            detune: options.detune,
		            type: 'sawtooth',
		            phase: options.phase
		        });
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = this._sawtooth.frequency;
		        /**
				 *  The detune in cents. 
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = this._sawtooth.detune;
		        /**
				 *  Threshold the signal to turn it into a square
				 *  @type {Tone.WaveShaper}
				 *  @private
				 */
		        this._thresh = new Tone.WaveShaper(function (val) {
		            if (val < 0) {
		                return -1;
		            } else {
		                return 1;
		            }
		        });
		        //connections
		        this._sawtooth.chain(this._thresh, this.output);
		        this.width.chain(this._widthGate, this._thresh);
		        this._readOnly([
		            'width',
		            'frequency',
		            'detune'
		        ]);
		    };
		    Tone.extend(Tone.PulseOscillator, Tone.Oscillator);
		    /**
			 *  The default parameters.
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.PulseOscillator.defaults = {
		        'frequency': 440,
		        'detune': 0,
		        'phase': 0,
		        'width': 0.2
		    };
		    /**
			 *  start the oscillator
			 *  @param  {Time} time 
			 *  @private
			 */
		    Tone.PulseOscillator.prototype._start = function (time) {
		        time = this.toSeconds(time);
		        this._sawtooth.start(time);
		        this._widthGate.gain.setValueAtTime(1, time);
		    };
		    /**
			 *  stop the oscillator
			 *  @param  {Time} time 
			 *  @private
			 */
		    Tone.PulseOscillator.prototype._stop = function (time) {
		        time = this.toSeconds(time);
		        this._sawtooth.stop(time);
		        //the width is still connected to the output. 
		        //that needs to be stopped also
		        this._widthGate.gain.setValueAtTime(0, time);
		    };
		    /**
			 * The phase of the oscillator in degrees.
			 * @memberOf Tone.PulseOscillator#
			 * @type {Degrees}
			 * @name phase
			 */
		    Object.defineProperty(Tone.PulseOscillator.prototype, 'phase', {
		        get: function () {
		            return this._sawtooth.phase;
		        },
		        set: function (phase) {
		            this._sawtooth.phase = phase;
		        }
		    });
		    /**
			 * The type of the oscillator. Always returns "pulse".
			 * @readOnly
			 * @memberOf Tone.PulseOscillator#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.PulseOscillator.prototype, 'type', {
		        get: function () {
		            return 'pulse';
		        }
		    });
		    /**
			 * The partials of the waveform. Cannot set partials for this waveform type
			 * @memberOf Tone.PulseOscillator#
			 * @type {Array}
			 * @name partials
			 * @private
			 */
		    Object.defineProperty(Tone.PulseOscillator.prototype, 'partials', {
		        get: function () {
		            return [];
		        }
		    });
		    /**
			 *  Clean up method.
			 *  @return {Tone.PulseOscillator} this
			 */
		    Tone.PulseOscillator.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        this._sawtooth.dispose();
		        this._sawtooth = null;
		        this._writable([
		            'width',
		            'frequency',
		            'detune'
		        ]);
		        this.width.dispose();
		        this.width = null;
		        this._widthGate.disconnect();
		        this._widthGate = null;
		        this._widthGate = null;
		        this._thresh.disconnect();
		        this._thresh = null;
		        this.frequency = null;
		        this.detune = null;
		        return this;
		    };
		    return Tone.PulseOscillator;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.PWMOscillator modulates the width of a Tone.PulseOscillator 
			 *         at the modulationFrequency. This has the effect of continuously
			 *         changing the timbre of the oscillator by altering the harmonics 
			 *         generated.
			 *
			 *  @extends {Tone.Oscillator}
			 *  @constructor
			 *  @param {Frequency} frequency The starting frequency of the oscillator. 
			 *  @param {Frequency} modulationFrequency The modulation frequency of the width of the pulse. 
			 *  @example
			 *  var pwm = new Tone.PWMOscillator("Ab3", 0.3).toMaster().start();
			 */
		    Tone.PWMOscillator = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'modulationFrequency'
		        ], Tone.PWMOscillator.defaults);
		        Tone.Source.call(this, options);
		        /**
				 *  the pulse oscillator
				 *  @type {Tone.PulseOscillator}
				 *  @private
				 */
		        this._pulse = new Tone.PulseOscillator(options.modulationFrequency);
		        //change the pulse oscillator type
		        this._pulse._sawtooth.type = 'sine';
		        /**
				 *  the modulator
				 *  @type {Tone.Oscillator}
				 *  @private
				 */
		        this._modulator = new Tone.Oscillator({
		            'frequency': options.frequency,
		            'detune': options.detune,
		            'phase': options.phase
		        });
		        /**
				 *  Scale the oscillator so it doesn't go silent 
				 *  at the extreme values.
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._scale = new Tone.Multiply(1.01);
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = this._modulator.frequency;
		        /**
				 *  The detune of the oscillator.
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = this._modulator.detune;
		        /**
				 *  The modulation rate of the oscillator. 
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.modulationFrequency = this._pulse.frequency;
		        //connections
		        this._modulator.chain(this._scale, this._pulse.width);
		        this._pulse.connect(this.output);
		        this._readOnly([
		            'modulationFrequency',
		            'frequency',
		            'detune'
		        ]);
		    };
		    Tone.extend(Tone.PWMOscillator, Tone.Oscillator);
		    /**
			 *  default values
			 *  @static
			 *  @type {Object}
			 *  @const
			 */
		    Tone.PWMOscillator.defaults = {
		        'frequency': 440,
		        'detune': 0,
		        'phase': 0,
		        'modulationFrequency': 0.4
		    };
		    /**
			 *  start the oscillator
			 *  @param  {Time} [time=now]
			 *  @private
			 */
		    Tone.PWMOscillator.prototype._start = function (time) {
		        time = this.toSeconds(time);
		        this._modulator.start(time);
		        this._pulse.start(time);
		    };
		    /**
			 *  stop the oscillator
			 *  @param  {Time} time (optional) timing parameter
			 *  @private
			 */
		    Tone.PWMOscillator.prototype._stop = function (time) {
		        time = this.toSeconds(time);
		        this._modulator.stop(time);
		        this._pulse.stop(time);
		    };
		    /**
			 * The type of the oscillator. Always returns "pwm".
			 * @readOnly
			 * @memberOf Tone.PWMOscillator#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.PWMOscillator.prototype, 'type', {
		        get: function () {
		            return 'pwm';
		        }
		    });
		    /**
			 * The partials of the waveform. Cannot set partials for this waveform type
			 * @memberOf Tone.PWMOscillator#
			 * @type {Array}
			 * @name partials
			 * @private
			 */
		    Object.defineProperty(Tone.PWMOscillator.prototype, 'partials', {
		        get: function () {
		            return [];
		        }
		    });
		    /**
			 * The phase of the oscillator in degrees.
			 * @memberOf Tone.PWMOscillator#
			 * @type {number}
			 * @name phase
			 */
		    Object.defineProperty(Tone.PWMOscillator.prototype, 'phase', {
		        get: function () {
		            return this._modulator.phase;
		        },
		        set: function (phase) {
		            this._modulator.phase = phase;
		        }
		    });
		    /**
			 *  Clean up.
			 *  @return {Tone.PWMOscillator} this
			 */
		    Tone.PWMOscillator.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        this._pulse.dispose();
		        this._pulse = null;
		        this._scale.dispose();
		        this._scale = null;
		        this._modulator.dispose();
		        this._modulator = null;
		        this._writable([
		            'modulationFrequency',
		            'frequency',
		            'detune'
		        ]);
		        this.frequency = null;
		        this.detune = null;
		        this.modulationFrequency = null;
		        return this;
		    };
		    return Tone.PWMOscillator;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Tone.OmniOscillator aggregates Tone.Oscillator, Tone.PulseOscillator,
			 *         and Tone.PWMOscillator into one class, allowing it to have the 
			 *         types: sine, square, triangle, sawtooth, pulse or pwm. Additionally,
			 *         OmniOscillator is capable of setting the first x number of partials 
			 *         of the oscillator. For example: "sine4" would set be the first 4 
			 *         partials of the sine wave and "triangle8" would set the first 
			 *         8 partials of the triangle wave. 
			 *
			 *  @extends {Tone.Oscillator}
			 *  @constructor
			 *  @param {Frequency} frequency The initial frequency of the oscillator.
			 *  @param {string} type The type of the oscillator.
			 *  @example
			 *  var omniOsc = new Tone.OmniOscillator("C#4", "pwm");
			 */
		    Tone.OmniOscillator = function () {
		        var options = this.optionsObject(arguments, [
		            'frequency',
		            'type'
		        ], Tone.OmniOscillator.defaults);
		        Tone.Source.call(this, options);
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);
		        /**
				 *  The detune control
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);
		        /**
				 *  the type of the oscillator source
				 *  @type {string}
				 *  @private
				 */
		        this._sourceType = undefined;
		        /**
				 *  the oscillator
				 *  @type {Tone.Oscillator|Tone.PWMOscillator|Tone.PulseOscillator}
				 *  @private
				 */
		        this._oscillator = null;
		        //set the oscillator
		        this.type = options.type;
		        this.phase = options.phase;
		        this._readOnly([
		            'frequency',
		            'detune'
		        ]);
		        if (this.isArray(options.partials)) {
		            this.partials = options.partials;
		        }
		    };
		    Tone.extend(Tone.OmniOscillator, Tone.Oscillator);
		    /**
			 *  default values
			 *  @static
			 *  @type {Object}
			 *  @const
			 */
		    Tone.OmniOscillator.defaults = {
		        'frequency': 440,
		        'detune': 0,
		        'type': 'sine',
		        'phase': 0,
		        'width': 0.4,
		        //only applies if the oscillator is set to "pulse",
		        'modulationFrequency': 0.4
		    };
		    /**
			 *  @enum {string}
			 *  @private
			 */
		    var OmniOscType = {
		        PulseOscillator: 'PulseOscillator',
		        PWMOscillator: 'PWMOscillator',
		        Oscillator: 'Oscillator'
		    };
		    /**
			 *  start the oscillator
			 *  @param {Time} [time=now] the time to start the oscillator
			 *  @private
			 */
		    Tone.OmniOscillator.prototype._start = function (time) {
		        this._oscillator.start(time);
		    };
		    /**
			 *  start the oscillator
			 *  @param {Time} [time=now] the time to start the oscillator
			 *  @private
			 */
		    Tone.OmniOscillator.prototype._stop = function (time) {
		        this._oscillator.stop(time);
		    };
		    /**
			 * The type of the oscillator. sine, square, triangle, sawtooth, pwm, or pulse. 
			 * @memberOf Tone.OmniOscillator#
			 * @type {string}
			 * @name type
			 */
		    Object.defineProperty(Tone.OmniOscillator.prototype, 'type', {
		        get: function () {
		            return this._oscillator.type;
		        },
		        set: function (type) {
		            if (type.indexOf('sine') === 0 || type.indexOf('square') === 0 || type.indexOf('triangle') === 0 || type.indexOf('sawtooth') === 0 || type === Tone.Oscillator.Type.Custom) {
		                if (this._sourceType !== OmniOscType.Oscillator) {
		                    this._sourceType = OmniOscType.Oscillator;
		                    this._createNewOscillator(Tone.Oscillator);
		                }
		                this._oscillator.type = type;
		            } else if (type === 'pwm') {
		                if (this._sourceType !== OmniOscType.PWMOscillator) {
		                    this._sourceType = OmniOscType.PWMOscillator;
		                    this._createNewOscillator(Tone.PWMOscillator);
		                }
		            } else if (type === 'pulse') {
		                if (this._sourceType !== OmniOscType.PulseOscillator) {
		                    this._sourceType = OmniOscType.PulseOscillator;
		                    this._createNewOscillator(Tone.PulseOscillator);
		                }
		            } else {
		                throw new Error('Tone.OmniOscillator does not support type ' + type);
		            }
		        }
		    });
		    /**
			 * The partials of the waveform. A partial represents 
			 * the amplitude at a harmonic. The first harmonic is the 
			 * fundamental frequency, the second is the octave and so on
			 * following the harmonic series. 
			 * Setting this value will automatically set the type to "custom". 
			 * The value is an empty array when the type is not "custom". 
			 * @memberOf Tone.OmniOscillator#
			 * @type {Array}
			 * @name partials
			 * @example
			 * osc.partials = [1, 0.2, 0.01];
			 */
		    Object.defineProperty(Tone.OmniOscillator.prototype, 'partials', {
		        get: function () {
		            return this._oscillator.partials;
		        },
		        set: function (partials) {
		            if (this._sourceType !== OmniOscType.Oscillator) {
		                this.type = Tone.Oscillator.Type.Custom;
		            }
		            this._oscillator.partials = partials;
		        }
		    });
		    /**
			 *  connect the oscillator to the frequency and detune signals
			 *  @private
			 */
		    Tone.OmniOscillator.prototype._createNewOscillator = function (OscillatorConstructor) {
		        //short delay to avoid clicks on the change
		        var now = this.now() + this.blockTime;
		        if (this._oscillator !== null) {
		            var oldOsc = this._oscillator;
		            oldOsc.stop(now);
		            //dispose the old one
		            setTimeout(function () {
		                oldOsc.dispose();
		                oldOsc = null;
		            }, this.blockTime * 1000);
		        }
		        this._oscillator = new OscillatorConstructor();
		        this.frequency.connect(this._oscillator.frequency);
		        this.detune.connect(this._oscillator.detune);
		        this._oscillator.connect(this.output);
		        if (this.state === Tone.State.Started) {
		            this._oscillator.start(now);
		        }
		    };
		    /**
			 * The phase of the oscillator in degrees. 
			 * @memberOf Tone.OmniOscillator#
			 * @type {Degrees}
			 * @name phase
			 */
		    Object.defineProperty(Tone.OmniOscillator.prototype, 'phase', {
		        get: function () {
		            return this._oscillator.phase;
		        },
		        set: function (phase) {
		            this._oscillator.phase = phase;
		        }
		    });
		    /**
			 * The width of the oscillator (only if the oscillator is set to pulse)
			 * @memberOf Tone.OmniOscillator#
			 * @type {NormalRange}
			 * @signal
			 * @name width
			 * @example
			 * var omniOsc = new Tone.OmniOscillator(440, "pulse");
			 * //can access the width attribute only if type === "pulse"
			 * omniOsc.width.value = 0.2; 
			 */
		    Object.defineProperty(Tone.OmniOscillator.prototype, 'width', {
		        get: function () {
		            if (this._sourceType === OmniOscType.PulseOscillator) {
		                return this._oscillator.width;
		            }
		        }
		    });
		    /**
			 * The modulationFrequency Signal of the oscillator 
			 * (only if the oscillator type is set to pwm).
			 * @memberOf Tone.OmniOscillator#
			 * @type {Frequency}
			 * @signal
			 * @name modulationFrequency
			 * @example
			 * var omniOsc = new Tone.OmniOscillator(440, "pwm");
			 * //can access the modulationFrequency attribute only if type === "pwm"
			 * omniOsc.modulationFrequency.value = 0.2; 
			 */
		    Object.defineProperty(Tone.OmniOscillator.prototype, 'modulationFrequency', {
		        get: function () {
		            if (this._sourceType === OmniOscType.PWMOscillator) {
		                return this._oscillator.modulationFrequency;
		            }
		        }
		    });
		    /**
			 *  Clean up.
			 *  @return {Tone.OmniOscillator} this
			 */
		    Tone.OmniOscillator.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        this._writable([
		            'frequency',
		            'detune'
		        ]);
		        this.detune.dispose();
		        this.detune = null;
		        this.frequency.dispose();
		        this.frequency = null;
		        this._oscillator.dispose();
		        this._oscillator = null;
		        this._sourceType = null;
		        return this;
		    };
		    return Tone.OmniOscillator;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Base-class for all instruments
			 *  
			 *  @constructor
			 *  @extends {Tone}
			 */
		    Tone.Instrument = function (options) {
		        //get the defaults
		        options = this.defaultArg(options, Tone.Instrument.defaults);
		        /**
				 *  The output and volume triming node
				 *  @type  {Tone.Volume}
				 *  @private
				 */
		        this._volume = this.output = new Tone.Volume(options.volume);
		        /**
				 * The volume of the output in decibels.
				 * @type {Decibels}
				 * @signal
				 * @example
				 * source.volume.value = -6;
				 */
		        this.volume = this._volume.volume;
		        this._readOnly('volume');
		    };
		    Tone.extend(Tone.Instrument);
		    /**
			 *  the default attributes
			 *  @type {object}
			 */
		    Tone.Instrument.defaults = {
		        /** the volume of the output in decibels */
		        'volume': 0
		    };
		    /**
			 *  @abstract
			 *  @param {string|number} note the note to trigger
			 *  @param {Time} [time=now] the time to trigger the ntoe
			 *  @param {number} [velocity=1] the velocity to trigger the note
			 */
		    Tone.Instrument.prototype.triggerAttack = Tone.noOp;
		    /**
			 *  @abstract
			 *  @param {Time} [time=now] when to trigger the release
			 */
		    Tone.Instrument.prototype.triggerRelease = Tone.noOp;
		    /**
			 *  Trigger the attack and then the release after the duration. 
			 *  @param  {Frequency} note     The note to trigger.
			 *  @param  {Time} duration How long the note should be held for before
			 *                          triggering the release.
			 *  @param {Time} [time=now]  When the note should be triggered.
			 *  @param  {NormalRange} [velocity=1] The velocity the note should be triggered at.
			 *  @returns {Tone.Instrument} this
			 *  @example
			 * //trigger "C4" for the duration of an 8th note
			 * synth.triggerAttackRelease("C4", "8n");
			 */
		    Tone.Instrument.prototype.triggerAttackRelease = function (note, duration, time, velocity) {
		        time = this.toSeconds(time);
		        duration = this.toSeconds(duration);
		        this.triggerAttack(note, time, velocity);
		        this.triggerRelease(time + duration);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.Instrument} this
			 */
		    Tone.Instrument.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._volume.dispose();
		        this._volume = null;
		        this._writable(['volume']);
		        this.volume = null;
		        return this;
		    };
		    return Tone.Instrument;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  This is an abstract base class for other monophonic instruments to 
			 *          extend. IMPORTANT: It does not make any sound on its own and
			 *          shouldn't be directly instantiated.
			 *
			 *  @constructor
			 *  @abstract
			 *  @extends {Tone.Instrument}
			 */
		    Tone.Monophonic = function (options) {
		        //get the defaults
		        options = this.defaultArg(options, Tone.Monophonic.defaults);
		        Tone.Instrument.call(this, options);
		        /**
				 *  The glide time between notes. 
				 *  @type {Time}
				 */
		        this.portamento = options.portamento;
		    };
		    Tone.extend(Tone.Monophonic, Tone.Instrument);
		    /**
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Monophonic.defaults = { 'portamento': 0 };
		    /**
			 *  Trigger the attack of the note optionally with a given velocity. 
			 *  
			 *  
			 *  @param  {Frequency} note     The note to trigger.
			 *  @param  {Time} [time=now]     When the note should start.
			 *  @param  {number} [velocity=1] velocity The velocity scaler 
			 *                                determines how "loud" the note 
			 *                                will be triggered.
			 *  @returns {Tone.Monophonic} this
			 *  @example
			 * synth.triggerAttack("C4");
			 *  @example
			 * //trigger the note a half second from now at half velocity
			 * synth.triggerAttack("C4", "+0.5", 0.5);
			 */
		    Tone.Monophonic.prototype.triggerAttack = function (note, time, velocity) {
		        time = this.toSeconds(time);
		        this._triggerEnvelopeAttack(time, velocity);
		        this.setNote(note, time);
		        return this;
		    };
		    /**
			 *  Trigger the release portion of the envelope
			 *  @param  {Time} [time=now] If no time is given, the release happens immediatly
			 *  @returns {Tone.Monophonic} this
			 *  @example
			 * synth.triggerRelease();
			 */
		    Tone.Monophonic.prototype.triggerRelease = function (time) {
		        this._triggerEnvelopeRelease(time);
		        return this;
		    };
		    /**
			 *  override this method with the actual method
			 *  @abstract
			 *  @private
			 */
		    Tone.Monophonic.prototype._triggerEnvelopeAttack = function () {
		    };
		    /**
			 *  override this method with the actual method
			 *  @abstract
			 *  @private
			 */
		    Tone.Monophonic.prototype._triggerEnvelopeRelease = function () {
		    };
		    /**
			 *  Set the note at the given time. If no time is given, the note
			 *  will set immediately. 
			 *  @param {Frequency} note The note to change to.
			 *  @param  {Time} [time=now] The time when the note should be set. 
			 *  @returns {Tone.Monophonic} this
			 * @example
			 * //change to F#6 in one quarter note from now.
			 * synth.setNote("F#6", "+4n");
			 * @example
			 * //change to Bb4 right now
			 * synth.setNote("Bb4");
			 */
		    Tone.Monophonic.prototype.setNote = function (note, time) {
		        time = this.toSeconds(time);
		        if (this.portamento > 0) {
		            var currentNote = this.frequency.value;
		            this.frequency.setValueAtTime(currentNote, time);
		            var portTime = this.toSeconds(this.portamento);
		            this.frequency.exponentialRampToValueAtTime(note, time + portTime);
		        } else {
		            this.frequency.setValueAtTime(note, time);
		        }
		        return this;
		    };
		    return Tone.Monophonic;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.MonoSynth is composed of one oscillator, one filter, and two envelopes.
			 *          The amplitude of the Tone.Oscillator and the cutoff frequency of the 
			 *          Tone.Filter are controlled by Tone.Envelopes. 
			 *          <img src="https://docs.google.com/drawings/d/1gaY1DF9_Hzkodqf8JI1Cg2VZfwSElpFQfI94IQwad38/pub?w=924&h=240">
			 *          
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var synth = new Tone.MonoSynth({
			 * 	"oscillator" : {
			 * 		"type" : "square"
			 *  },
			 *  "envelope" : {
			 *  	"attack" : 0.1
			 *  }
			 * }).toMaster();
			 * synth.triggerAttackRelease("C4", "8n");
			 */
		    Tone.MonoSynth = function (options) {
		        //get the defaults
		        options = this.defaultArg(options, Tone.MonoSynth.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  The oscillator.
				 *  @type {Tone.OmniOscillator}
				 */
		        this.oscillator = new Tone.OmniOscillator(options.oscillator);
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = this.oscillator.frequency;
		        /**
				 *  The detune control.
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = this.oscillator.detune;
		        /**
				 *  The filter.
				 *  @type {Tone.Filter}
				 */
		        this.filter = new Tone.Filter(options.filter);
		        /**
				 *  The filter envelope.
				 *  @type {Tone.FrequencyEnvelope}
				 */
		        this.filterEnvelope = new Tone.FrequencyEnvelope(options.filterEnvelope);
		        /**
				 *  The amplitude envelope.
				 *  @type {Tone.AmplitudeEnvelope}
				 */
		        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
		        //connect the oscillators to the output
		        this.oscillator.chain(this.filter, this.envelope, this.output);
		        //start the oscillators
		        this.oscillator.start();
		        //connect the filter envelope
		        this.filterEnvelope.connect(this.filter.frequency);
		        this._readOnly([
		            'oscillator',
		            'frequency',
		            'detune',
		            'filter',
		            'filterEnvelope',
		            'envelope'
		        ]);
		    };
		    Tone.extend(Tone.MonoSynth, Tone.Monophonic);
		    /**
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.MonoSynth.defaults = {
		        'frequency': 'C4',
		        'detune': 0,
		        'oscillator': { 'type': 'square' },
		        'filter': {
		            'Q': 6,
		            'type': 'lowpass',
		            'rolloff': -24
		        },
		        'envelope': {
		            'attack': 0.005,
		            'decay': 0.1,
		            'sustain': 0.9,
		            'release': 1
		        },
		        'filterEnvelope': {
		            'attack': 0.06,
		            'decay': 0.2,
		            'sustain': 0.5,
		            'release': 2,
		            'baseFrequency': 200,
		            'octaves': 7,
		            'exponent': 2
		        }
		    };
		    /**
			 *  start the attack portion of the envelope
			 *  @param {Time} [time=now] the time the attack should start
			 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
			 *  @returns {Tone.MonoSynth} this
			 *  @private
			 */
		    Tone.MonoSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        //the envelopes
		        this.envelope.triggerAttack(time, velocity);
		        this.filterEnvelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  start the release portion of the envelope
			 *  @param {Time} [time=now] the time the release should start
			 *  @returns {Tone.MonoSynth} this
			 *  @private
			 */
		    Tone.MonoSynth.prototype._triggerEnvelopeRelease = function (time) {
		        this.envelope.triggerRelease(time);
		        this.filterEnvelope.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.MonoSynth} this
			 */
		    Tone.MonoSynth.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'oscillator',
		            'frequency',
		            'detune',
		            'filter',
		            'filterEnvelope',
		            'envelope'
		        ]);
		        this.oscillator.dispose();
		        this.oscillator = null;
		        this.envelope.dispose();
		        this.envelope = null;
		        this.filterEnvelope.dispose();
		        this.filterEnvelope = null;
		        this.filter.dispose();
		        this.filter = null;
		        this.frequency = null;
		        this.detune = null;
		        return this;
		    };
		    return Tone.MonoSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  AMSynth uses the output of one Tone.MonoSynth to modulate the
			 *          amplitude of another Tone.MonoSynth. The harmonicity (the ratio between
			 *          the two signals) affects the timbre of the output signal the most.
			 *          Read more about Amplitude Modulation Synthesis on 
			 *          [SoundOnSound](http://www.soundonsound.com/sos/mar00/articles/synthsecrets.htm).
			 *          <img src="https://docs.google.com/drawings/d/1TQu8Ed4iFr1YTLKpB3U1_hur-UwBrh5gdBXc8BxfGKw/pub?w=1009&h=457">
			 *
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                            see defaults below
			 *  @example
			 * var synth = new Tone.AMSynth().toMaster();
			 * synth.triggerAttackRelease("C4", "4n");
			 */
		    Tone.AMSynth = function (options) {
		        options = this.defaultArg(options, Tone.AMSynth.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  The carrier voice. 
				 *  @type {Tone.MonoSynth}
				 */
		        this.carrier = new Tone.MonoSynth(options.carrier);
		        this.carrier.volume.value = -10;
		        /**
				 *  The modulator voice. 
				 *  @type {Tone.MonoSynth}
				 */
		        this.modulator = new Tone.MonoSynth(options.modulator);
		        this.modulator.volume.value = -10;
		        /**
				 *  The frequency.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
		        /**
				 *  Harmonicity is the ratio between the two voices. A harmonicity of
				 *  1 is no change. Harmonicity = 2 means a change of an octave. 
				 *  @type {Positive}
				 *  @signal
				 *  @example
				 * //pitch voice1 an octave below voice0
				 * synth.harmonicity.value = 0.5;
				 */
		        this.harmonicity = new Tone.Multiply(options.harmonicity);
		        this.harmonicity.units = Tone.Type.Positive;
		        /**
				 *  convert the -1,1 output to 0,1
				 *  @type {Tone.AudioToGain}
				 *  @private
				 */
		        this._modulationScale = new Tone.AudioToGain();
		        /**
				 *  the node where the modulation happens
				 *  @type {GainNode}
				 *  @private
				 */
		        this._modulationNode = this.context.createGain();
		        //control the two voices frequency
		        this.frequency.connect(this.carrier.frequency);
		        this.frequency.chain(this.harmonicity, this.modulator.frequency);
		        this.modulator.chain(this._modulationScale, this._modulationNode.gain);
		        this.carrier.chain(this._modulationNode, this.output);
		        this._readOnly([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity'
		        ]);
		    };
		    Tone.extend(Tone.AMSynth, Tone.Monophonic);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.AMSynth.defaults = {
		        'harmonicity': 3,
		        'carrier': {
		            'volume': -10,
		            'oscillator': { 'type': 'sine' },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0.01,
		                'sustain': 1,
		                'release': 0.5
		            },
		            'filterEnvelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5,
		                'baseFrequency': 20000,
		                'octaves': 0
		            },
		            'filter': {
		                'Q': 6,
		                'type': 'lowpass',
		                'rolloff': -24
		            }
		        },
		        'modulator': {
		            'volume': -10,
		            'oscillator': { 'type': 'square' },
		            'envelope': {
		                'attack': 2,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            },
		            'filterEnvelope': {
		                'attack': 4,
		                'decay': 0.2,
		                'sustain': 0.5,
		                'release': 0.5,
		                'baseFrequency': 20,
		                'octaves': 6
		            },
		            'filter': {
		                'Q': 6,
		                'type': 'lowpass',
		                'rolloff': -24
		            }
		        }
		    };
		    /**
			 *  trigger the attack portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will occur
			 *  @param {NormalRange} [velocity=1] the velocity of the note
			 *  @private
			 *  @returns {Tone.AMSynth} this
			 */
		    Tone.AMSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        //the port glide
		        time = this.toSeconds(time);
		        //the envelopes
		        this.carrier.envelope.triggerAttack(time, velocity);
		        this.modulator.envelope.triggerAttack(time);
		        this.carrier.filterEnvelope.triggerAttack(time);
		        this.modulator.filterEnvelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  trigger the release portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will release
			 *  @private
			 *  @returns {Tone.AMSynth} this
			 */
		    Tone.AMSynth.prototype._triggerEnvelopeRelease = function (time) {
		        this.carrier.triggerRelease(time);
		        this.modulator.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.AMSynth} this
			 */
		    Tone.AMSynth.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity'
		        ]);
		        this.carrier.dispose();
		        this.carrier = null;
		        this.modulator.dispose();
		        this.modulator = null;
		        this.frequency.dispose();
		        this.frequency = null;
		        this.harmonicity.dispose();
		        this.harmonicity = null;
		        this._modulationScale.dispose();
		        this._modulationScale = null;
		        this._modulationNode.disconnect();
		        this._modulationNode = null;
		        return this;
		    };
		    return Tone.AMSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.DrumSynth makes kick and tom sounds using a single oscillator
			 *          with an amplitude envelope and frequency ramp. A Tone.Oscillator
			 *          is routed through a Tone.AmplitudeEnvelope to the output. The drum
			 *          quality of the sound comes from the frequency envelope applied
			 *          during during Tone.DrumSynth.triggerAttack(note). The frequency
			 *          envelope starts at <code>note * .octaves</code> and ramps to 
			 *          <code>note</code> over the duration of <code>.pitchDecay</code>. 
			 *
			 *  @constructor
			 *  @extends {Tone.Instrument}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var synth = new Tone.DrumSynth().toMaster();
			 * synth.triggerAttackRelease("C2", "8n");
			 */
		    Tone.DrumSynth = function (options) {
		        options = this.defaultArg(options, Tone.DrumSynth.defaults);
		        Tone.Instrument.call(this, options);
		        /**
				 *  The oscillator.
				 *  @type {Tone.Oscillator}
				 */
		        this.oscillator = new Tone.Oscillator(options.oscillator).start();
		        /**
				 *  The amplitude envelope.
				 *  @type {Tone.AmplitudeEnvelope}
				 */
		        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
		        /**
				 *  The number of octaves the pitch envelope ramps.
				 *  @type {Positive}
				 */
		        this.octaves = options.octaves;
		        /**
				 *  The amount of time the frequency envelope takes. 
				 *  @type {Time}
				 */
		        this.pitchDecay = options.pitchDecay;
		        this.oscillator.chain(this.envelope, this.output);
		        this._readOnly([
		            'oscillator',
		            'envelope'
		        ]);
		    };
		    Tone.extend(Tone.DrumSynth, Tone.Instrument);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.DrumSynth.defaults = {
		        'pitchDecay': 0.05,
		        'octaves': 10,
		        'oscillator': { 'type': 'sine' },
		        'envelope': {
		            'attack': 0.001,
		            'decay': 0.4,
		            'sustain': 0.01,
		            'release': 1.4,
		            'attackCurve': 'exponential'
		        }
		    };
		    /**
			 *  Trigger the note at the given time with the given velocity. 
			 *  
			 *  @param  {Frequency} note     the note
			 *  @param  {Time} [time=now]     the time, if not given is now
			 *  @param  {number} [velocity=1] velocity defaults to 1
			 *  @returns {Tone.DrumSynth} this
			 *  @example
			 *  kick.triggerAttack(60);
			 */
		    Tone.DrumSynth.prototype.triggerAttack = function (note, time, velocity) {
		        time = this.toSeconds(time);
		        note = this.toFrequency(note);
		        var maxNote = note * this.octaves;
		        this.oscillator.frequency.setValueAtTime(maxNote, time);
		        this.oscillator.frequency.exponentialRampToValueAtTime(note, time + this.toSeconds(this.pitchDecay));
		        this.envelope.triggerAttack(time, velocity);
		        return this;
		    };
		    /**
			 *  Trigger the release portion of the note.
			 *  
			 *  @param  {Time} [time=now] the time the note will release
			 *  @returns {Tone.DrumSynth} this
			 */
		    Tone.DrumSynth.prototype.triggerRelease = function (time) {
		        this.envelope.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.DrumSynth} this
			 */
		    Tone.DrumSynth.prototype.dispose = function () {
		        Tone.Instrument.prototype.dispose.call(this);
		        this._writable([
		            'oscillator',
		            'envelope'
		        ]);
		        this.oscillator.dispose();
		        this.oscillator = null;
		        this.envelope.dispose();
		        this.envelope = null;
		        return this;
		    };
		    return Tone.DrumSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.DuoSynth is a monophonic synth composed of two 
			 *          MonoSynths run in parallel with control over the 
			 *          frequency ratio between the two voices and vibrato effect.
			 *          <img src="https://docs.google.com/drawings/d/1bL4GXvfRMMlqS7XyBm9CjL9KJPSUKbcdBNpqOlkFLxk/pub?w=1012&h=448">
			 *
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var duoSynth = new Tone.DuoSynth().toMaster();
			 * duoSynth.triggerAttackRelease("C4", "2n");
			 */
		    Tone.DuoSynth = function (options) {
		        options = this.defaultArg(options, Tone.DuoSynth.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  the first voice
				 *  @type {Tone.MonoSynth}
				 */
		        this.voice0 = new Tone.MonoSynth(options.voice0);
		        this.voice0.volume.value = -10;
		        /**
				 *  the second voice
				 *  @type {Tone.MonoSynth}
				 */
		        this.voice1 = new Tone.MonoSynth(options.voice1);
		        this.voice1.volume.value = -10;
		        /**
				 *  The vibrato LFO. 
				 *  @type {Tone.LFO}
				 *  @private
				 */
		        this._vibrato = new Tone.LFO(options.vibratoRate, -50, 50);
		        this._vibrato.start();
		        /**
				 * the vibrato frequency
				 * @type {Frequency}
				 * @signal
				 */
		        this.vibratoRate = this._vibrato.frequency;
		        /**
				 *  the vibrato gain
				 *  @type {GainNode}
				 *  @private
				 */
		        this._vibratoGain = this.context.createGain();
		        /**
				 * The amount of vibrato
				 * @type {Positive}
				 * @signal
				 */
		        this.vibratoAmount = new Tone.Param({
		            'param': this._vibratoGain.gain,
		            'units': Tone.Type.Positive,
		            'value': options.vibratoAmount
		        });
		        /**
				 *  the delay before the vibrato starts
				 *  @type {number}
				 *  @private
				 */
		        this._vibratoDelay = this.toSeconds(options.vibratoDelay);
		        /**
				 *  the frequency control
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
		        /**
				 *  Harmonicity is the ratio between the two voices. A harmonicity of
				 *  1 is no change. Harmonicity = 2 means a change of an octave. 
				 *  @type {Positive}
				 *  @signal
				 *  @example
				 * //pitch voice1 an octave below voice0
				 * duoSynth.harmonicity.value = 0.5;
				 */
		        this.harmonicity = new Tone.Multiply(options.harmonicity);
		        this.harmonicity.units = Tone.Type.Positive;
		        //control the two voices frequency
		        this.frequency.connect(this.voice0.frequency);
		        this.frequency.chain(this.harmonicity, this.voice1.frequency);
		        this._vibrato.connect(this._vibratoGain);
		        this._vibratoGain.fan(this.voice0.detune, this.voice1.detune);
		        this.voice0.connect(this.output);
		        this.voice1.connect(this.output);
		        this._readOnly([
		            'voice0',
		            'voice1',
		            'frequency',
		            'vibratoAmount',
		            'vibratoRate'
		        ]);
		    };
		    Tone.extend(Tone.DuoSynth, Tone.Monophonic);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.DuoSynth.defaults = {
		        'vibratoAmount': 0.5,
		        'vibratoRate': 5,
		        'vibratoDelay': 1,
		        'harmonicity': 1.5,
		        'voice0': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'sine' },
		            'filterEnvelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            }
		        },
		        'voice1': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'sine' },
		            'filterEnvelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            }
		        }
		    };
		    /**
			 *  start the attack portion of the envelopes
			 *  
			 *  @param {Time} [time=now] the time the attack should start
			 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
			 *  @returns {Tone.DuoSynth} this
			 *  @private
			 */
		    Tone.DuoSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        time = this.toSeconds(time);
		        this.voice0.envelope.triggerAttack(time, velocity);
		        this.voice1.envelope.triggerAttack(time, velocity);
		        this.voice0.filterEnvelope.triggerAttack(time);
		        this.voice1.filterEnvelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  start the release portion of the envelopes
			 *  
			 *  @param {Time} [time=now] the time the release should start
			 *  @returns {Tone.DuoSynth} this
			 *  @private
			 */
		    Tone.DuoSynth.prototype._triggerEnvelopeRelease = function (time) {
		        this.voice0.triggerRelease(time);
		        this.voice1.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.DuoSynth} this
			 */
		    Tone.DuoSynth.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'voice0',
		            'voice1',
		            'frequency',
		            'vibratoAmount',
		            'vibratoRate'
		        ]);
		        this.voice0.dispose();
		        this.voice0 = null;
		        this.voice1.dispose();
		        this.voice1 = null;
		        this.frequency.dispose();
		        this.frequency = null;
		        this._vibrato.dispose();
		        this._vibrato = null;
		        this._vibratoGain.disconnect();
		        this._vibratoGain = null;
		        this.harmonicity.dispose();
		        this.harmonicity = null;
		        this.vibratoAmount.dispose();
		        this.vibratoAmount = null;
		        this.vibratoRate = null;
		        return this;
		    };
		    return Tone.DuoSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  FMSynth is composed of two Tone.MonoSynths where one Tone.MonoSynth modulates
			 *          the frequency of a second Tone.MonoSynth. A lot of spectral content 
			 *          can be explored using the modulationIndex parameter. Read more about
			 *          frequency modulation synthesis on [SoundOnSound](http://www.soundonsound.com/sos/apr00/articles/synthsecrets.htm).
			 *          <img src="https://docs.google.com/drawings/d/1h0PUDZXPgi4Ikx6bVT6oncrYPLluFKy7lj53puxj-DM/pub?w=902&h=462">
			 *
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var fmSynth = new Tone.FMSynth().toMaster();
			 * fmSynth.triggerAttackRelease("C5", "4n");
			 */
		    Tone.FMSynth = function (options) {
		        options = this.defaultArg(options, Tone.FMSynth.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  The carrier voice.
				 *  @type {Tone.MonoSynth}
				 */
		        this.carrier = new Tone.MonoSynth(options.carrier);
		        this.carrier.volume.value = -10;
		        /**
				 *  The modulator voice.
				 *  @type {Tone.MonoSynth}
				 */
		        this.modulator = new Tone.MonoSynth(options.modulator);
		        this.modulator.volume.value = -10;
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
		        /**
				 *  Harmonicity is the ratio between the two voices. A harmonicity of
				 *  1 is no change. Harmonicity = 2 means a change of an octave. 
				 *  @type {Positive}
				 *  @signal
				 *  @example
				 * //pitch voice1 an octave below voice0
				 * synth.harmonicity.value = 0.5;
				 */
		        this.harmonicity = new Tone.Multiply(options.harmonicity);
		        this.harmonicity.units = Tone.Type.Positive;
		        /**
				 *  The modulation index which essentially the depth or amount of the modulation. It is the 
				 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the 
				 *  modulating signal (ma) -- as in ma/mf. 
				 *	@type {Positive}
				 *	@signal
				 */
		        this.modulationIndex = new Tone.Multiply(options.modulationIndex);
		        this.modulationIndex.units = Tone.Type.Positive;
		        /**
				 *  the node where the modulation happens
				 *  @type {GainNode}
				 *  @private
				 */
		        this._modulationNode = this.context.createGain();
		        //control the two voices frequency
		        this.frequency.connect(this.carrier.frequency);
		        this.frequency.chain(this.harmonicity, this.modulator.frequency);
		        this.frequency.chain(this.modulationIndex, this._modulationNode);
		        this.modulator.connect(this._modulationNode.gain);
		        this._modulationNode.gain.value = 0;
		        this._modulationNode.connect(this.carrier.frequency);
		        this.carrier.connect(this.output);
		        this._readOnly([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity',
		            'modulationIndex'
		        ]);
		    };
		    Tone.extend(Tone.FMSynth, Tone.Monophonic);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.FMSynth.defaults = {
		        'harmonicity': 3,
		        'modulationIndex': 10,
		        'carrier': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'sine' },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            },
		            'filterEnvelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5,
		                'baseFrequency': 200,
		                'octaves': 8
		            }
		        },
		        'modulator': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'triangle' },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            },
		            'filterEnvelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5,
		                'baseFrequency': 600,
		                'octaves': 5
		            }
		        }
		    };
		    /**
			 * 	trigger the attack portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will occur
			 *  @param {number} [velocity=1] the velocity of the note
			 *  @returns {Tone.FMSynth} this
			 *  @private
			 */
		    Tone.FMSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        //the port glide
		        time = this.toSeconds(time);
		        //the envelopes
		        this.carrier.envelope.triggerAttack(time, velocity);
		        this.modulator.envelope.triggerAttack(time);
		        this.carrier.filterEnvelope.triggerAttack(time);
		        this.modulator.filterEnvelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  trigger the release portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will release
			 *  @returns {Tone.FMSynth} this
			 *  @private
			 */
		    Tone.FMSynth.prototype._triggerEnvelopeRelease = function (time) {
		        this.carrier.triggerRelease(time);
		        this.modulator.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.FMSynth} this
			 */
		    Tone.FMSynth.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity',
		            'modulationIndex'
		        ]);
		        this.carrier.dispose();
		        this.carrier = null;
		        this.modulator.dispose();
		        this.modulator = null;
		        this.frequency.dispose();
		        this.frequency = null;
		        this.modulationIndex.dispose();
		        this.modulationIndex = null;
		        this.harmonicity.dispose();
		        this.harmonicity = null;
		        this._modulationNode.disconnect();
		        this._modulationNode = null;
		        return this;
		    };
		    return Tone.FMSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Noise is a noise generator. It uses looped noise buffers to save on performance.
			 *          Tone.Noise supports the noise types: "pink", "white", and "brown". Read more about
			 *          colors of noise on [Wikipedia](https://en.wikipedia.org/wiki/Colors_of_noise).
			 *
			 *  @constructor
			 *  @extends {Tone.Source}
			 *  @param {string} type the noise type (white|pink|brown)
			 *  @example
			 * //initialize the noise and start
			 * var noise = new Tone.Noise("pink").start();
			 * 
			 * //make an autofilter to shape the noise
			 * var autoFilter = new Tone.AutoFilter({
			 * 	"frequency" : "8m", 
			 * 	"min" : 800, 
			 * 	"max" : 15000
			 * }).connect(Tone.Master);
			 * 
			 * //connect the noise
			 * noise.connect(autoFilter);
			 * //start the autofilter LFO
			 * autoFilter.start()
			 */
		    Tone.Noise = function () {
		        var options = this.optionsObject(arguments, ['type'], Tone.Noise.defaults);
		        Tone.Source.call(this, options);
		        /**
				 *  @private
				 *  @type {AudioBufferSourceNode}
				 */
		        this._source = null;
		        /**
				 *  the buffer
				 *  @private
				 *  @type {AudioBuffer}
				 */
		        this._buffer = null;
		        /**
				 *  The playback rate of the noise. Affects
				 *  the "frequency" of the noise.
				 *  @type {Positive}
				 *  @signal
				 */
		        this._playbackRate = options.playbackRate;
		        this.type = options.type;
		    };
		    Tone.extend(Tone.Noise, Tone.Source);
		    /**
			 *  the default parameters
			 *
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Noise.defaults = {
		        'type': 'white',
		        'playbackRate': 1
		    };
		    /**
			 * The type of the noise. Can be "white", "brown", or "pink". 
			 * @memberOf Tone.Noise#
			 * @type {string}
			 * @name type
			 * @example
			 * noise.type = "white";
			 */
		    Object.defineProperty(Tone.Noise.prototype, 'type', {
		        get: function () {
		            if (this._buffer === _whiteNoise) {
		                return 'white';
		            } else if (this._buffer === _brownNoise) {
		                return 'brown';
		            } else if (this._buffer === _pinkNoise) {
		                return 'pink';
		            }
		        },
		        set: function (type) {
		            if (this.type !== type) {
		                switch (type) {
		                case 'white':
		                    this._buffer = _whiteNoise;
		                    break;
		                case 'pink':
		                    this._buffer = _pinkNoise;
		                    break;
		                case 'brown':
		                    this._buffer = _brownNoise;
		                    break;
		                default:
		                    throw new Error('invalid noise type: ' + type);
		                }
		                //if it's playing, stop and restart it
		                if (this.state === Tone.State.Started) {
		                    var now = this.now() + this.blockTime;
		                    //remove the listener
		                    this._stop(now);
		                    this._start(now);
		                }
		            }
		        }
		    });
		    /**
			 *  The playback rate of the noise. Affects
			 *  the "frequency" of the noise.
			 *  @type {Positive}
			 *  @signal
			 */
		    Object.defineProperty(Tone.Noise.prototype, 'playbackRate', {
		        get: function () {
		            return this._playbackRate;
		        },
		        set: function (rate) {
		            this._playbackRate = rate;
		            if (this._source) {
		                this._source.playbackRate.value = rate;
		            }
		        }
		    });
		    /**
			 *  internal start method
			 *
			 *  @param {Time} time
			 *  @private
			 */
		    Tone.Noise.prototype._start = function (time) {
		        this._source = this.context.createBufferSource();
		        this._source.buffer = this._buffer;
		        this._source.loop = true;
		        this._source.playbackRate.value = this._playbackRate;
		        this._source.connect(this.output);
		        this._source.start(this.toSeconds(time));
		    };
		    /**
			 *  internal stop method
			 *
			 *  @param {Time} time
			 *  @private
			 */
		    Tone.Noise.prototype._stop = function (time) {
		        if (this._source) {
		            this._source.stop(this.toSeconds(time));
		        }
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Noise} this
			 */
		    Tone.Noise.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        if (this._source !== null) {
		            this._source.disconnect();
		            this._source = null;
		        }
		        this._buffer = null;
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    // THE BUFFERS
		    // borrowed heavily from http://noisehack.com/generate-noise-web-audio-api/
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 *	static noise buffers
			 *
			 *  @static
			 *  @private
			 *  @type {AudioBuffer}
			 */
		    var _pinkNoise = null, _brownNoise = null, _whiteNoise = null;
		    Tone._initAudioContext(function (audioContext) {
		        var sampleRate = audioContext.sampleRate;
		        //four seconds per buffer
		        var bufferLength = sampleRate * 4;
		        //fill the buffers
		        _pinkNoise = function () {
		            var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
		            for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++) {
		                var channel = buffer.getChannelData(channelNum);
		                var b0, b1, b2, b3, b4, b5, b6;
		                b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0;
		                for (var i = 0; i < bufferLength; i++) {
		                    var white = Math.random() * 2 - 1;
		                    b0 = 0.99886 * b0 + white * 0.0555179;
		                    b1 = 0.99332 * b1 + white * 0.0750759;
		                    b2 = 0.969 * b2 + white * 0.153852;
		                    b3 = 0.8665 * b3 + white * 0.3104856;
		                    b4 = 0.55 * b4 + white * 0.5329522;
		                    b5 = -0.7616 * b5 - white * 0.016898;
		                    channel[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
		                    channel[i] *= 0.11;
		                    // (roughly) compensate for gain
		                    b6 = white * 0.115926;
		                }
		            }
		            return buffer;
		        }();
		        _brownNoise = function () {
		            var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
		            for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++) {
		                var channel = buffer.getChannelData(channelNum);
		                var lastOut = 0;
		                for (var i = 0; i < bufferLength; i++) {
		                    var white = Math.random() * 2 - 1;
		                    channel[i] = (lastOut + 0.02 * white) / 1.02;
		                    lastOut = channel[i];
		                    channel[i] *= 3.5;    // (roughly) compensate for gain
		                }
		            }
		            return buffer;
		        }();
		        _whiteNoise = function () {
		            var buffer = audioContext.createBuffer(2, bufferLength, sampleRate);
		            for (var channelNum = 0; channelNum < buffer.numberOfChannels; channelNum++) {
		                var channel = buffer.getChannelData(channelNum);
		                for (var i = 0; i < bufferLength; i++) {
		                    channel[i] = Math.random() * 2 - 1;
		                }
		            }
		            return buffer;
		        }();
		    });
		    return Tone.Noise;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.NoiseSynth is composed of a noise generator (Tone.Noise), one filter (Tone.Filter), 
			 *          and two envelopes (Tone.Envelop). One envelope controls the amplitude
			 *          of the noise and the other is controls the cutoff frequency of the filter. 
			 *          <img src="https://docs.google.com/drawings/d/1rqzuX9rBlhT50MRvD2TKml9bnZhcZmzXF1rf_o7vdnE/pub?w=918&h=242">
			 *
			 *  @constructor
			 *  @extends {Tone.Instrument}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 * @example
			 * var noiseSynth = new Tone.NoiseSynth().toMaster();
			 * noiseSynth.triggerAttackRelease("8n");
			 */
		    Tone.NoiseSynth = function (options) {
		        //get the defaults
		        options = this.defaultArg(options, Tone.NoiseSynth.defaults);
		        Tone.Instrument.call(this, options);
		        /**
				 *  The noise source.
				 *  @type {Tone.Noise}
				 *  @example
				 * noiseSynth.set("noise.type", "brown");
				 */
		        this.noise = new Tone.Noise();
		        /**
				 *  The filter. 
				 *  @type {Tone.Filter}
				 */
		        this.filter = new Tone.Filter(options.filter);
		        /**
				 *  The filter envelope. 
				 *  @type {Tone.FrequencyEnvelope}
				 */
		        this.filterEnvelope = new Tone.FrequencyEnvelope(options.filterEnvelope);
		        /**
				 *  The amplitude envelope. 
				 *  @type {Tone.AmplitudeEnvelope}
				 */
		        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
		        //connect the noise to the output
		        this.noise.chain(this.filter, this.envelope, this.output);
		        //start the noise
		        this.noise.start();
		        //connect the filter envelope
		        this.filterEnvelope.connect(this.filter.frequency);
		        this._readOnly([
		            'noise',
		            'filter',
		            'filterEnvelope',
		            'envelope'
		        ]);
		    };
		    Tone.extend(Tone.NoiseSynth, Tone.Instrument);
		    /**
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.NoiseSynth.defaults = {
		        'noise': { 'type': 'white' },
		        'filter': {
		            'Q': 6,
		            'type': 'highpass',
		            'rolloff': -24
		        },
		        'envelope': {
		            'attack': 0.005,
		            'decay': 0.1,
		            'sustain': 0
		        },
		        'filterEnvelope': {
		            'attack': 0.06,
		            'decay': 0.2,
		            'sustain': 0,
		            'release': 2,
		            'baseFrequency': 20,
		            'octaves': 5
		        }
		    };
		    /**
			 *  Start the attack portion of the envelopes. Unlike other 
			 *  instruments, Tone.NoiseSynth doesn't have a note. 
			 *  @param {Time} [time=now] the time the attack should start
			 *  @param {number} [velocity=1] the velocity of the note (0-1)
			 *  @returns {Tone.NoiseSynth} this
			 *  @example
			 * noiseSynth.triggerAttack();
			 */
		    Tone.NoiseSynth.prototype.triggerAttack = function (time, velocity) {
		        //the envelopes
		        this.envelope.triggerAttack(time, velocity);
		        this.filterEnvelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  Start the release portion of the envelopes.
			 *  @param {Time} [time=now] the time the release should start
			 *  @returns {Tone.NoiseSynth} this
			 */
		    Tone.NoiseSynth.prototype.triggerRelease = function (time) {
		        this.envelope.triggerRelease(time);
		        this.filterEnvelope.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  Trigger the attack and then the release. 
			 *  @param  {Time} duration the duration of the note
			 *  @param  {Time} [time=now]     the time of the attack
			 *  @param  {number} [velocity=1] the velocity
			 *  @returns {Tone.NoiseSynth} this
			 */
		    Tone.NoiseSynth.prototype.triggerAttackRelease = function (duration, time, velocity) {
		        time = this.toSeconds(time);
		        duration = this.toSeconds(duration);
		        this.triggerAttack(time, velocity);
		        this.triggerRelease(time + duration);
		        return this;
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.NoiseSynth} this
			 */
		    Tone.NoiseSynth.prototype.dispose = function () {
		        Tone.Instrument.prototype.dispose.call(this);
		        this._writable([
		            'noise',
		            'filter',
		            'filterEnvelope',
		            'envelope'
		        ]);
		        this.noise.dispose();
		        this.noise = null;
		        this.envelope.dispose();
		        this.envelope = null;
		        this.filterEnvelope.dispose();
		        this.filterEnvelope = null;
		        this.filter.dispose();
		        this.filter = null;
		        return this;
		    };
		    return Tone.NoiseSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Karplus-String string synthesis. Often out of tune. 
			 *         Will change when the AudioWorkerNode is available across
			 *         browsers. 
			 *  
			 *  @constructor
			 *  @extends {Tone.Instrument}
			 *  @param {Object} [options] see the defaults
			 *  @example
			 * var plucky = new Tone.PluckSynth().toMaster();
			 * plucky.triggerAttack("C4");
			 */
		    Tone.PluckSynth = function (options) {
		        options = this.defaultArg(options, Tone.PluckSynth.defaults);
		        Tone.Instrument.call(this, options);
		        /**
				 *  @type {Tone.Noise}
				 *  @private
				 */
		        this._noise = new Tone.Noise('pink');
		        /**
				 *  The amount of noise at the attack. 
				 *  Nominal range of [0.1, 20]
				 *  @type {number}
				 */
		        this.attackNoise = 1;
		        /**
				 *  the LFCF
				 *  @type {Tone.LowpassCombFilter}
				 *  @private
				 */
		        this._lfcf = new Tone.LowpassCombFilter({
		            'resonance': options.resonance,
		            'dampening': options.dampening
		        });
		        /**
				 *  The resonance control. 
				 *  @type {NormalRange}
				 *  @signal
				 */
		        this.resonance = this._lfcf.resonance;
		        /**
				 *  The dampening control. i.e. the lowpass filter frequency of the comb filter
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.dampening = this._lfcf.dampening;
		        //connections
		        this._noise.connect(this._lfcf);
		        this._lfcf.connect(this.output);
		        this._readOnly([
		            'resonance',
		            'dampening'
		        ]);
		    };
		    Tone.extend(Tone.PluckSynth, Tone.Instrument);
		    /**
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.PluckSynth.defaults = {
		        'attackNoise': 1,
		        'dampening': 4000,
		        'resonance': 0.9
		    };
		    /**
			 *  Trigger the note. 
			 *  @param {Frequency} note The note to trigger.
			 *  @param {Time} [time=now] When the note should be triggered.
			 *  @returns {Tone.PluckSynth} this
			 */
		    Tone.PluckSynth.prototype.triggerAttack = function (note, time) {
		        note = this.toFrequency(note);
		        time = this.toSeconds(time);
		        var delayAmount = 1 / note;
		        this._lfcf.delayTime.setValueAtTime(delayAmount, time);
		        this._noise.start(time);
		        this._noise.stop(time + delayAmount * this.attackNoise);
		        return this;
		    };
		    /**
			 *  Clean up. 
			 *  @returns {Tone.PluckSynth} this
			 */
		    Tone.PluckSynth.prototype.dispose = function () {
		        Tone.Instrument.prototype.dispose.call(this);
		        this._noise.dispose();
		        this._lfcf.dispose();
		        this._noise = null;
		        this._lfcf = null;
		        this._writable([
		            'resonance',
		            'dampening'
		        ]);
		        this.dampening = null;
		        this.resonance = null;
		        return this;
		    };
		    return Tone.PluckSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.PolySynth handles voice creation and allocation for any
			 *          instruments passed in as the second paramter. PolySynth is 
			 *          not a synthesizer by itself, it merely manages voices of 
			 *          one of the other types of synths, allowing any of the 
			 *          monophonic synthesizers to be polyphonic. 
			 *
			 *  @constructor
			 *  @extends {Tone.Instrument}
			 *  @param {number|Object} [polyphony=4] The number of voices to create
			 *  @param {function} [voice=Tone.MonoSynth] The constructor of the voices
			 *                                            uses Tone.MonoSynth by default. 
			 *  @example
			 * //a polysynth composed of 6 Voices of MonoSynth
			 * var synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster();
			 * //set the attributes using the set interface
			 * synth.set("detune", -1200);
			 * //play a chord
			 * synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
			 */
		    Tone.PolySynth = function () {
		        Tone.Instrument.call(this);
		        var options = this.optionsObject(arguments, [
		            'polyphony',
		            'voice'
		        ], Tone.PolySynth.defaults);
		        /**
				 *  the array of voices
				 *  @type {Array}
				 */
		        this.voices = new Array(options.polyphony);
		        /**
				 *  If there are no more voices available,
				 *  should an active voice be stolen to play the new note?
				 *  @type {Boolean}
				 */
		        this.stealVoices = true;
		        /**
				 *  the queue of free voices
				 *  @private
				 *  @type {Array}
				 */
		        this._freeVoices = [];
		        /**
				 *  keeps track of which notes are down
				 *  @private
				 *  @type {Object}
				 */
		        this._activeVoices = {};
		        //create the voices
		        for (var i = 0; i < options.polyphony; i++) {
		            var v = new options.voice(arguments[2], arguments[3]);
		            this.voices[i] = v;
		            v.connect(this.output);
		        }
		        //make a copy of the voices
		        this._freeVoices = this.voices.slice(0);    //get the prototypes and properties
		    };
		    Tone.extend(Tone.PolySynth, Tone.Instrument);
		    /**
			 *  the defaults
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.PolySynth.defaults = {
		        'polyphony': 4,
		        'voice': Tone.MonoSynth
		    };
		    /**
			 *  Trigger the attack portion of the note
			 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
			 *                                  Frequency or an array of frequencies.
			 *  @param  {Time} [time=now]  The start time of the note.
			 *  @param {number} [velocity=1] The velocity of the note.
			 *  @returns {Tone.PolySynth} this
			 *  @example
			 * //trigger a chord immediately with a velocity of 0.2
			 * poly.triggerAttack(["Ab3", "C4", "F5"], undefined, 0.2);
			 */
		    Tone.PolySynth.prototype.triggerAttack = function (notes, time, velocity) {
		        if (!Array.isArray(notes)) {
		            notes = [notes];
		        }
		        for (var i = 0; i < notes.length; i++) {
		            var val = notes[i];
		            var stringified = JSON.stringify(val);
		            //retrigger the same note if possible
		            if (this._activeVoices.hasOwnProperty(stringified)) {
		                this._activeVoices[stringified].triggerAttack(val, time, velocity);
		            } else if (this._freeVoices.length > 0) {
		                var voice = this._freeVoices.shift();
		                voice.triggerAttack(val, time, velocity);
		                this._activeVoices[stringified] = voice;
		            } else if (this.stealVoices) {
		                //steal a voice				
		                //take the first voice
		                for (var voiceName in this._activeVoices) {
		                    this._activeVoices[voiceName].triggerAttack(val, time, velocity);
		                    break;
		                }
		            }
		        }
		        return this;
		    };
		    /**
			 *  Trigger the attack and release after the specified duration
			 *  
			 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
			 *                                  Frequency or an array of frequencies.
			 *  @param  {Time} duration the duration of the note
			 *  @param  {Time} [time=now]     if no time is given, defaults to now
			 *  @param  {number} [velocity=1] the velocity of the attack (0-1)
			 *  @returns {Tone.PolySynth} this
			 *  @example
			 * //trigger a chord for a duration of a half note 
			 * poly.triggerAttackRelease(["Eb3", "G4", "C5"], "2n");
			 */
		    Tone.PolySynth.prototype.triggerAttackRelease = function (notes, duration, time, velocity) {
		        time = this.toSeconds(time);
		        this.triggerAttack(notes, time, velocity);
		        this.triggerRelease(notes, time + this.toSeconds(duration));
		        return this;
		    };
		    /**
			 *  Trigger the release of the note. Unlike monophonic instruments, 
			 *  a note (or array of notes) needs to be passed in as the first argument.
			 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
			 *                                  Frequency or an array of frequencies.
			 *  @param  {Time} [time=now]  When the release will be triggered. 
			 *  @returns {Tone.PolySynth} this
			 *  @example
			 * poly.triggerRelease(["Ab3", "C4", "F5"], "+2n");
			 */
		    Tone.PolySynth.prototype.triggerRelease = function (notes, time) {
		        if (!Array.isArray(notes)) {
		            notes = [notes];
		        }
		        for (var i = 0; i < notes.length; i++) {
		            //get the voice
		            var stringified = JSON.stringify(notes[i]);
		            var voice = this._activeVoices[stringified];
		            if (voice) {
		                voice.triggerRelease(time);
		                this._freeVoices.push(voice);
		                delete this._activeVoices[stringified];
		                voice = null;
		            }
		        }
		        return this;
		    };
		    /**
			 *  Set a member/attribute of the voices. 
			 *  @param {Object|string} params
			 *  @param {number=} value
			 *  @param {Time=} rampTime
			 *  @returns {Tone.PolySynth} this
			 *  @example
			 * poly.set({
			 * 	"filter" : {
			 * 		"type" : "highpass"
			 * 	},
			 * 	"envelope" : {
			 * 		"attack" : 0.25
			 * 	}
			 * });
			 */
		    Tone.PolySynth.prototype.set = function (params, value, rampTime) {
		        for (var i = 0; i < this.voices.length; i++) {
		            this.voices[i].set(params, value, rampTime);
		        }
		        return this;
		    };
		    /**
			 *  Get the synth's attributes. Given no arguments get
			 *  will return all available object properties and their corresponding
			 *  values. Pass in a single attribute to retrieve or an array
			 *  of attributes. The attribute strings can also include a "."
			 *  to access deeper properties.
			 *  @param {Array=} params the parameters to get, otherwise will return 
			 *  					   all available.
			 */
		    Tone.PolySynth.prototype.get = function (params) {
		        return this.voices[0].get(params);
		    };
		    /**
			 *  Trigger the release portion of all the currently active voices.
			 *  @param {Time} [time=now] When the notes should be released.
			 *  @return {Tone.PolySynth} this
			 */
		    Tone.PolySynth.prototype.releaseAll = function (time) {
		        for (var i = 0; i < this.voices.length; i++) {
		            this.voices[i].triggerRelease(time);
		        }
		        return this;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.PolySynth} this
			 */
		    Tone.PolySynth.prototype.dispose = function () {
		        Tone.Instrument.prototype.dispose.call(this);
		        for (var i = 0; i < this.voices.length; i++) {
		            this.voices[i].dispose();
		            this.voices[i] = null;
		        }
		        this.voices = null;
		        this._activeVoices = null;
		        this._freeVoices = null;
		        return this;
		    };
		    return Tone.PolySynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.Player is an audio file player with start, loop, and stop functions.
			 *  
			 *  @constructor
			 *  @extends {Tone.Source} 
			 *  @param {string|AudioBuffer} url Either the AudioBuffer or the url from
			 *                                  which to load the AudioBuffer
			 *  @param {function=} onload The function to invoke when the buffer is loaded. 
			 *                            Recommended to use Tone.Buffer.onload instead.
			 *  @example
			 * var player = new Tone.Player("./path/to/sample.mp3").toMaster();
			 * Tone.Buffer.onload = function(){
			 * 	player.start();
			 * }
			 */
		    Tone.Player = function (url) {
		        var options;
		        if (url instanceof Tone.Buffer) {
		            url = url.get();
		            options = Tone.Player.defaults;
		        } else {
		            options = this.optionsObject(arguments, [
		                'url',
		                'onload'
		            ], Tone.Player.defaults);
		        }
		        Tone.Source.call(this, options);
		        /**
				 *  @private
				 *  @type {AudioBufferSourceNode}
				 */
		        this._source = null;
		        /**
				 *  If the file should play as soon
				 *  as the buffer is loaded. 
				 *  @type {boolean}
				 *  @example
				 * //will play as soon as it's loaded
				 * var player = new Tone.Player({
				 * 	"url" : "./path/to/sample.mp3",
				 * 	"autostart" : true,
				 * }).toMaster();
				 */
		        this.autostart = options.autostart;
		        /**
				 *  the buffer
				 *  @private
				 *  @type {Tone.Buffer}
				 */
		        this._buffer = new Tone.Buffer({
		            'url': options.url,
		            'onload': this._onload.bind(this, options.onload),
		            'reverse': options.reverse
		        });
		        if (url instanceof AudioBuffer) {
		            this._buffer.set(url);
		        }
		        /**
				 *  if the buffer should loop once it's over
				 *  @type {boolean}
				 *  @private
				 */
		        this._loop = options.loop;
		        /**
				 *  if 'loop' is true, the loop will start at this position
				 *  @type {Time}
				 *  @private
				 */
		        this._loopStart = options.loopStart;
		        /**
				 *  if 'loop' is true, the loop will end at this position
				 *  @type {Time}
				 *  @private
				 */
		        this._loopEnd = options.loopEnd;
		        /**
				 *  the playback rate
				 *  @private
				 *  @type {number}
				 */
		        this._playbackRate = options.playbackRate;
		        /**
				 *  Enabling retrigger will allow a player to be restarted
				 *  before the the previous 'start' is done playing. Otherwise, 
				 *  successive calls to Tone.Player.start will only start
				 *  the sample if it had played all the way through. 
				 *  @type {boolean}
				 */
		        this.retrigger = options.retrigger;
		    };
		    Tone.extend(Tone.Player, Tone.Source);
		    /**
			 *  the default parameters
			 *  @static
			 *  @const
			 *  @type {Object}
			 */
		    Tone.Player.defaults = {
		        'onload': Tone.noOp,
		        'playbackRate': 1,
		        'loop': false,
		        'autostart': false,
		        'loopStart': 0,
		        'loopEnd': 0,
		        'retrigger': false,
		        'reverse': false
		    };
		    /**
			 *  Load the audio file as an audio buffer.
			 *  Decodes the audio asynchronously and invokes
			 *  the callback once the audio buffer loads. 
			 *  Note: this does not need to be called if a url
			 *  was passed in to the constructor. Only use this
			 *  if you want to manually load a new url. 
			 * @param {string} url The url of the buffer to load.
			 *                     Filetype support depends on the
			 *                     browser.
			 *  @param  {function=} callback The function to invoke once
			 *                               the sample is loaded.
			 *  @returns {Tone.Player} this
			 */
		    Tone.Player.prototype.load = function (url, callback) {
		        this._buffer.load(url, this._onload.bind(this, callback));
		        return this;
		    };
		    /**
			 * Internal callback when the buffer is loaded.
			 * @private
			 */
		    Tone.Player.prototype._onload = function (callback) {
		        callback(this);
		        if (this.autostart) {
		            this.start();
		        }
		    };
		    /**
			 *  play the buffer between the desired positions
			 *  
			 *  @private
			 *  @param  {Time} [startTime=now] when the player should start.
			 *  @param  {Time} [offset=0] the offset from the beginning of the sample
			 *                                 to start at. 
			 *  @param  {Time=} duration how long the sample should play. If no duration
			 *                                is given, it will default to the full length 
			 *                                of the sample (minus any offset)
			 *  @returns {Tone.Player} this
			 */
		    Tone.Player.prototype._start = function (startTime, offset, duration) {
		        if (this._buffer.loaded) {
		            //if it's a loop the default offset is the loopstart point
		            if (this._loop) {
		                offset = this.defaultArg(offset, this._loopStart);
		            } else {
		                //otherwise the default offset is 0
		                offset = this.defaultArg(offset, 0);
		            }
		            offset = this.toSeconds(offset);
		            duration = this.defaultArg(duration, this._buffer.duration - offset);
		            //the values in seconds
		            startTime = this.toSeconds(startTime);
		            duration = this.toSeconds(duration);
		            //make the source
		            this._source = this.context.createBufferSource();
		            this._source.buffer = this._buffer.get();
		            //set the looping properties
		            if (this._loop) {
		                this._source.loop = this._loop;
		                this._source.loopStart = this.toSeconds(this._loopStart);
		                this._source.loopEnd = this.toSeconds(this._loopEnd);
		            } else {
		                //if it's not looping, set the state change at the end of the sample
		                this._state.setStateAtTime(Tone.State.Stopped, startTime + duration);
		            }
		            //and other properties
		            this._source.playbackRate.value = this._playbackRate;
		            this._source.connect(this.output);
		            //start it
		            if (this._loop) {
		                this._source.start(startTime, offset);
		            } else {
		                this._source.start(startTime, offset, duration);
		            }
		        } else {
		            throw Error('tried to start Player before the buffer was loaded');
		        }
		        return this;
		    };
		    /**
			 *  Stop playback.
			 *  @private
			 *  @param  {Time} [time=now]
			 *  @returns {Tone.Player} this
			 */
		    Tone.Player.prototype._stop = function (time) {
		        if (this._source) {
		            this._source.stop(this.toSeconds(time));
		            this._source = null;
		        }
		        return this;
		    };
		    /**
			 *  Set the loop start and end. Will only loop if loop is 
			 *  set to true. 
			 *  @param {Time} loopStart The loop end time
			 *  @param {Time} loopEnd The loop end time
			 *  @returns {Tone.Player} this
			 *  @example
			 * //loop 0.1 seconds of the file. 
			 * player.setLoopPoints(0.2, 0.3);
			 * player.loop = true;
			 */
		    Tone.Player.prototype.setLoopPoints = function (loopStart, loopEnd) {
		        this.loopStart = loopStart;
		        this.loopEnd = loopEnd;
		        return this;
		    };
		    /**
			 * If loop is true, the loop will start at this position. 
			 * @memberOf Tone.Player#
			 * @type {Time}
			 * @name loopStart
			 */
		    Object.defineProperty(Tone.Player.prototype, 'loopStart', {
		        get: function () {
		            return this._loopStart;
		        },
		        set: function (loopStart) {
		            this._loopStart = loopStart;
		            if (this._source) {
		                this._source.loopStart = this.toSeconds(loopStart);
		            }
		        }
		    });
		    /**
			 * If loop is true, the loop will end at this position.
			 * @memberOf Tone.Player#
			 * @type {Time}
			 * @name loopEnd
			 */
		    Object.defineProperty(Tone.Player.prototype, 'loopEnd', {
		        get: function () {
		            return this._loopEnd;
		        },
		        set: function (loopEnd) {
		            this._loopEnd = loopEnd;
		            if (this._source) {
		                this._source.loopEnd = this.toSeconds(loopEnd);
		            }
		        }
		    });
		    /**
			 * The audio buffer belonging to the player. 
			 * @memberOf Tone.Player#
			 * @type {Tone.Buffer}
			 * @name buffer
			 */
		    Object.defineProperty(Tone.Player.prototype, 'buffer', {
		        get: function () {
		            return this._buffer;
		        },
		        set: function (buffer) {
		            this._buffer.set(buffer);
		        }
		    });
		    /**
			 * If the buffer should loop once it's over. 
			 * @memberOf Tone.Player#
			 * @type {boolean}
			 * @name loop
			 */
		    Object.defineProperty(Tone.Player.prototype, 'loop', {
		        get: function () {
		            return this._loop;
		        },
		        set: function (loop) {
		            this._loop = loop;
		            if (this._source) {
		                this._source.loop = loop;
		            }
		        }
		    });
		    /**
			 * The playback speed. 1 is normal speed. This is not a signal because
			 * Safari and iOS currently don't support playbackRate as a signal.
			 * @memberOf Tone.Player#
			 * @type {number}
			 * @name playbackRate
			 */
		    Object.defineProperty(Tone.Player.prototype, 'playbackRate', {
		        get: function () {
		            return this._playbackRate;
		        },
		        set: function (rate) {
		            this._playbackRate = rate;
		            if (this._source) {
		                this._source.playbackRate.value = rate;
		            }
		        }
		    });
		    /**
			 * The direction the buffer should play in
			 * @memberOf Tone.Player#
			 * @type {boolean}
			 * @name reverse
			 */
		    Object.defineProperty(Tone.Player.prototype, 'reverse', {
		        get: function () {
		            return this._buffer.reverse;
		        },
		        set: function (rev) {
		            this._buffer.reverse = rev;
		        }
		    });
		    /**
			 *  Dispose and disconnect.
			 *  @return {Tone.Player} this
			 */
		    Tone.Player.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        if (this._source !== null) {
		            this._source.disconnect();
		            this._source = null;
		        }
		        this._buffer.dispose();
		        this._buffer = null;
		        return this;
		    };
		    return Tone.Player;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class A sampler instrument which plays an audio buffer 
			 *         through an amplitude envelope and a filter envelope. The sampler takes
			 *         an Object in the constructor which maps a sample name to the URL 
			 *         of the sample. Nested Objects will be flattened and can be accessed using
			 *         a dot notation (see the example).
			 *         <img src="https://docs.google.com/drawings/d/1UK-gi_hxzKDz9Dh4ByyOptuagMOQxv52WxN12HwvtW8/pub?w=931&h=241">
			 *
			 *  @constructor
			 *  @extends {Tone.Instrument}
			 *  @param {Object|string} urls the urls of the audio file
			 *  @param {Object} [options] the options object for the synth
			 *  @example
			 * var sampler = new Sampler({
			 * 	A : {
			 * 		1 : "./audio/casio/A1.mp3",
			 * 		2 : "./audio/casio/A2.mp3",
			 * 	},
			 * 	"B.1" : "./audio/casio/B1.mp3",
			 * }).toMaster();
			 * 
			 * //listen for when all the samples have loaded
			 * Tone.Buffer.onload = function(){
			 * 	sampler.triggerAttack("A.1", time, velocity);
			 * };
			 */
		    Tone.Sampler = function (urls, options) {
		        options = this.defaultArg(options, Tone.Sampler.defaults);
		        Tone.Instrument.call(this, options);
		        /**
				 *  The sample player.
				 *  @type {Tone.Player}
				 */
		        this.player = new Tone.Player(options.player);
		        this.player.retrigger = true;
		        /**
				 *  the buffers
				 *  @type {Object}
				 *  @private
				 */
		        this._buffers = {};
		        /**
				 *  The amplitude envelope. 
				 *  @type {Tone.AmplitudeEnvelope}
				 */
		        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
		        /**
				 *  The filter envelope. 
				 *  @type {Tone.FrequencyEnvelope}
				 */
		        this.filterEnvelope = new Tone.FrequencyEnvelope(options.filterEnvelope);
		        /**
				 *  The name of the current sample. 
				 *  @type {string}
				 *  @private
				 */
		        this._sample = options.sample;
		        /**
				 * the private reference to the pitch
				 * @type {number}
				 * @private
				 */
		        this._pitch = options.pitch;
		        /**
				 *  The filter.
				 *  @type {Tone.Filter}
				 */
		        this.filter = new Tone.Filter(options.filter);
		        //connections / setup
		        this._loadBuffers(urls);
		        this.pitch = options.pitch;
		        this.player.chain(this.filter, this.envelope, this.output);
		        this.filterEnvelope.connect(this.filter.frequency);
		        this._readOnly([
		            'player',
		            'filterEnvelope',
		            'envelope',
		            'filter'
		        ]);
		    };
		    Tone.extend(Tone.Sampler, Tone.Instrument);
		    /**
			 *  the default parameters
			 *  @static
			 */
		    Tone.Sampler.defaults = {
		        'sample': 0,
		        'pitch': 0,
		        'player': { 'loop': false },
		        'envelope': {
		            'attack': 0.001,
		            'decay': 0,
		            'sustain': 1,
		            'release': 0.1
		        },
		        'filterEnvelope': {
		            'attack': 0.001,
		            'decay': 0.001,
		            'sustain': 1,
		            'release': 0.5,
		            'baseFrequency': 20,
		            'octaves': 10
		        },
		        'filter': { 'type': 'lowpass' }
		    };
		    /**
			 *  load the buffers
			 *  @param   {Object} urls   the urls
			 *  @private
			 */
		    Tone.Sampler.prototype._loadBuffers = function (urls) {
		        if (this.isString(urls)) {
		            this._buffers['0'] = new Tone.Buffer(urls, function () {
		                this.sample = '0';
		            }.bind(this));
		        } else {
		            urls = this._flattenUrls(urls);
		            for (var buffName in urls) {
		                this._sample = buffName;
		                var urlString = urls[buffName];
		                this._buffers[buffName] = new Tone.Buffer(urlString);
		            }
		        }
		    };
		    /**
			 *  Flatten an object into a single depth object. 
			 *  thanks to https://gist.github.com/penguinboy/762197
			 *  @param   {Object} ob 	
			 *  @return  {Object}    
			 *  @private
			 */
		    Tone.Sampler.prototype._flattenUrls = function (ob) {
		        var toReturn = {};
		        for (var i in ob) {
		            if (!ob.hasOwnProperty(i))
		                continue;
		            if (this.isObject(ob[i])) {
		                var flatObject = this._flattenUrls(ob[i]);
		                for (var x in flatObject) {
		                    if (!flatObject.hasOwnProperty(x))
		                        continue;
		                    toReturn[i + '.' + x] = flatObject[x];
		                }
		            } else {
		                toReturn[i] = ob[i];
		            }
		        }
		        return toReturn;
		    };
		    /**
			 *  Start the sample and simultaneously trigger the envelopes. 
			 *  @param {string=} sample The name of the sample to trigger, defaults to
			 *                          the last sample used. 
			 *  @param {Time} [time=now] The time when the sample should start
			 *  @param {number} [velocity=1] The velocity of the note
			 *  @returns {Tone.Sampler} this
			 *  @example
			 * sampler.triggerAttack("B.1");
			 */
		    Tone.Sampler.prototype.triggerAttack = function (name, time, velocity) {
		        time = this.toSeconds(time);
		        if (name) {
		            this.sample = name;
		        }
		        this.player.start(time);
		        this.envelope.triggerAttack(time, velocity);
		        this.filterEnvelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  Start the release portion of the sample. Will stop the sample once the 
			 *  envelope has fully released. 
			 *  
			 *  @param {Time} [time=now] The time when the note should release
			 *  @returns {Tone.Sampler} this
			 *  @example
			 * sampler.triggerRelease();
			 */
		    Tone.Sampler.prototype.triggerRelease = function (time) {
		        time = this.toSeconds(time);
		        this.filterEnvelope.triggerRelease(time);
		        this.envelope.triggerRelease(time);
		        this.player.stop(this.toSeconds(this.envelope.release) + time);
		        return this;
		    };
		    /**
			 * The name of the sample to trigger.
			 * @memberOf Tone.Sampler#
			 * @type {number|string}
			 * @name sample
			 * @example
			 * //set the sample to "A.2" for next time the sample is triggered
			 * sampler.sample = "A.2";
			 */
		    Object.defineProperty(Tone.Sampler.prototype, 'sample', {
		        get: function () {
		            return this._sample;
		        },
		        set: function (name) {
		            if (this._buffers.hasOwnProperty(name)) {
		                this._sample = name;
		                this.player.buffer = this._buffers[name];
		            } else {
		                throw new Error('Sampler does not have a sample named ' + name);
		            }
		        }
		    });
		    /**
			 * The direction the buffer should play in
			 * @memberOf Tone.Sampler#
			 * @type {boolean}
			 * @name reverse
			 */
		    Object.defineProperty(Tone.Sampler.prototype, 'reverse', {
		        get: function () {
		            for (var i in this._buffers) {
		                return this._buffers[i].reverse;
		            }
		        },
		        set: function (rev) {
		            for (var i in this._buffers) {
		                this._buffers[i].reverse = rev;
		            }
		        }
		    });
		    /**
			 * Repitch the sampled note by some interval (measured
			 * in semi-tones). 
			 * @memberOf Tone.Sampler#
			 * @type {Interval}
			 * @name pitch
			 * @example
			 * sampler.pitch = -12; //down one octave
			 * sampler.pitch = 7; //up a fifth
			 */
		    Object.defineProperty(Tone.Sampler.prototype, 'pitch', {
		        get: function () {
		            return this._pitch;
		        },
		        set: function (interval) {
		            this._pitch = interval;
		            this.player.playbackRate = this.intervalToFrequencyRatio(interval);
		        }
		    });
		    /**
			 *  Clean up.
			 *  @returns {Tone.Sampler} this
			 */
		    Tone.Sampler.prototype.dispose = function () {
		        Tone.Instrument.prototype.dispose.call(this);
		        this._writable([
		            'player',
		            'filterEnvelope',
		            'envelope',
		            'filter'
		        ]);
		        this.player.dispose();
		        this.filterEnvelope.dispose();
		        this.envelope.dispose();
		        this.filter.dispose();
		        this.player = null;
		        this.filterEnvelope = null;
		        this.envelope = null;
		        this.filter = null;
		        for (var sample in this._buffers) {
		            this._buffers[sample].dispose();
		            this._buffers[sample] = null;
		        }
		        this._buffers = null;
		        return this;
		    };
		    return Tone.Sampler;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Tone.SimpleSynth is composed simply of a Tone.OmniOscillator
			 *          routed through a Tone.AmplitudeEnvelope. 
			 *          <img src="https://docs.google.com/drawings/d/1-1_0YW2Z1J2EPI36P8fNCMcZG7N1w1GZluPs4og4evo/pub?w=1163&h=231">
			 *
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var synth = new Tone.SimpleSynth().toMaster();
			 * synth.triggerAttackRelease("C4", "8n");
			 */
		    Tone.SimpleSynth = function (options) {
		        //get the defaults
		        options = this.defaultArg(options, Tone.SimpleSynth.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  The oscillator.
				 *  @type {Tone.OmniOscillator}
				 */
		        this.oscillator = new Tone.OmniOscillator(options.oscillator);
		        /**
				 *  The frequency control.
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = this.oscillator.frequency;
		        /**
				 *  The detune control.
				 *  @type {Cents}
				 *  @signal
				 */
		        this.detune = this.oscillator.detune;
		        /**
				 *  The amplitude envelope.
				 *  @type {Tone.AmplitudeEnvelope}
				 */
		        this.envelope = new Tone.AmplitudeEnvelope(options.envelope);
		        //connect the oscillators to the output
		        this.oscillator.chain(this.envelope, this.output);
		        //start the oscillators
		        this.oscillator.start();
		        this._readOnly([
		            'oscillator',
		            'frequency',
		            'detune',
		            'envelope'
		        ]);
		    };
		    Tone.extend(Tone.SimpleSynth, Tone.Monophonic);
		    /**
			 *  @const
			 *  @static
			 *  @type {Object}
			 */
		    Tone.SimpleSynth.defaults = {
		        'oscillator': { 'type': 'triangle' },
		        'envelope': {
		            'attack': 0.005,
		            'decay': 0.1,
		            'sustain': 0.3,
		            'release': 1
		        }
		    };
		    /**
			 *  start the attack portion of the envelope
			 *  @param {Time} [time=now] the time the attack should start
			 *  @param {number} [velocity=1] the velocity of the note (0-1)
			 *  @returns {Tone.SimpleSynth} this
			 *  @private
			 */
		    Tone.SimpleSynth.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        //the envelopes
		        this.envelope.triggerAttack(time, velocity);
		        return this;
		    };
		    /**
			 *  start the release portion of the envelope
			 *  @param {Time} [time=now] the time the release should start
			 *  @returns {Tone.SimpleSynth} this
			 *  @private
			 */
		    Tone.SimpleSynth.prototype._triggerEnvelopeRelease = function (time) {
		        this.envelope.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.SimpleSynth} this
			 */
		    Tone.SimpleSynth.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'oscillator',
		            'frequency',
		            'detune',
		            'envelope'
		        ]);
		        this.oscillator.dispose();
		        this.oscillator = null;
		        this.envelope.dispose();
		        this.envelope = null;
		        this.frequency = null;
		        this.detune = null;
		        return this;
		    };
		    return Tone.SimpleSynth;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class   AMSynth uses the output of one Tone.SimpleSynth to modulate the
			 *          amplitude of another Tone.SimpleSynth. The harmonicity (the ratio between
			 *          the two signals) affects the timbre of the output signal the most.
			 *          Read more about Amplitude Modulation Synthesis on [SoundOnSound](http://www.soundonsound.com/sos/mar00/articles/synthsecrets.htm).
			 *          <img src="https://docs.google.com/drawings/d/1p_os_As-N1bpnK8u55gXlgVw3U7BfquLX0Wj57kSZXY/pub?w=1009&h=457">
			 *
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var synth = new Tone.SimpleAM().toMaster();
			 * synth.triggerAttackRelease("C4", "8n");
			 */
		    Tone.SimpleAM = function (options) {
		        options = this.defaultArg(options, Tone.SimpleAM.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  The carrier voice. 
				 *  @type {Tone.SimpleSynth}
				 */
		        this.carrier = new Tone.SimpleSynth(options.carrier);
		        /**
				 *  The modulator voice. 
				 *  @type {Tone.SimpleSynth}
				 */
		        this.modulator = new Tone.SimpleSynth(options.modulator);
		        /**
				 *  the frequency control
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
		        /**
				 *  The ratio between the carrier and the modulator frequencies. A value of 1
				 *  makes both voices in unison, a value of 0.5 puts the modulator an octave below
				 *  the carrier.
				 *  @type {Positive}
				 *  @signal
				 *  @example
				 * //set the modulator an octave above the carrier frequency
				 * simpleAM.harmonicity.value = 2;
				 */
		        this.harmonicity = new Tone.Multiply(options.harmonicity);
		        this.harmonicity.units = Tone.Type.Positive;
		        /**
				 *  convert the -1,1 output to 0,1
				 *  @type {Tone.AudioToGain}
				 *  @private
				 */
		        this._modulationScale = new Tone.AudioToGain();
		        /**
				 *  the node where the modulation happens
				 *  @type {GainNode}
				 *  @private
				 */
		        this._modulationNode = this.context.createGain();
		        //control the two voices frequency
		        this.frequency.connect(this.carrier.frequency);
		        this.frequency.chain(this.harmonicity, this.modulator.frequency);
		        this.modulator.chain(this._modulationScale, this._modulationNode.gain);
		        this.carrier.chain(this._modulationNode, this.output);
		        this._readOnly([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity'
		        ]);
		    };
		    Tone.extend(Tone.SimpleAM, Tone.Monophonic);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.SimpleAM.defaults = {
		        'harmonicity': 3,
		        'carrier': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'sine' },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0.01,
		                'sustain': 1,
		                'release': 0.5
		            }
		        },
		        'modulator': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'sine' },
		            'envelope': {
		                'attack': 0.5,
		                'decay': 0.1,
		                'sustain': 1,
		                'release': 0.5
		            }
		        }
		    };
		    /**
			 *  trigger the attack portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will occur
			 *  @param {number} [velocity=1] the velocity of the note
			 *  @returns {Tone.SimpleAM} this
			 *  @private
			 */
		    Tone.SimpleAM.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        //the port glide
		        time = this.toSeconds(time);
		        //the envelopes
		        this.carrier.envelope.triggerAttack(time, velocity);
		        this.modulator.envelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  trigger the release portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will release
			 *  @returns {Tone.SimpleAM} this
			 *  @private
			 */
		    Tone.SimpleAM.prototype._triggerEnvelopeRelease = function (time) {
		        this.carrier.triggerRelease(time);
		        this.modulator.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.SimpleAM} this
			 */
		    Tone.SimpleAM.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity'
		        ]);
		        this.carrier.dispose();
		        this.carrier = null;
		        this.modulator.dispose();
		        this.modulator = null;
		        this.frequency.dispose();
		        this.frequency = null;
		        this.harmonicity.dispose();
		        this.harmonicity = null;
		        this._modulationScale.dispose();
		        this._modulationScale = null;
		        this._modulationNode.disconnect();
		        this._modulationNode = null;
		        return this;
		    };
		    return Tone.SimpleAM;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  SimpleFM is composed of two Tone.SimpleSynths where one Tone.SimpleSynth modulates
			 *          the frequency of a second Tone.SimpleSynth. A lot of spectral content 
			 *          can be explored using the Tone.FMSynth.modulationIndex parameter. Read more about
			 *          frequency modulation synthesis on [SoundOnSound](http://www.soundonsound.com/sos/apr00/articles/synthsecrets.htm).
			 *          <img src="https://docs.google.com/drawings/d/1hSU25lLjDk_WJ59DSitQm6iCRpcMWVEAYqBjwmqtRVw/pub?w=902&h=462">
			 *
			 *  @constructor
			 *  @extends {Tone.Monophonic}
			 *  @param {Object} [options] the options available for the synth 
			 *                          see defaults below
			 *  @example
			 * var fmSynth = new Tone.SimpleFM().toMaster();
			 * fmSynth.triggerAttackRelease("C4", "8n");
			 */
		    Tone.SimpleFM = function (options) {
		        options = this.defaultArg(options, Tone.SimpleFM.defaults);
		        Tone.Monophonic.call(this, options);
		        /**
				 *  The carrier voice. 
				 *  @type {Tone.SimpleSynth}
				 */
		        this.carrier = new Tone.SimpleSynth(options.carrier);
		        this.carrier.volume.value = -10;
		        /**
				 *  The modulator voice. 
				 *  @type {Tone.SimpleSynth}
				 */
		        this.modulator = new Tone.SimpleSynth(options.modulator);
		        this.modulator.volume.value = -10;
		        /**
				 *  the frequency control
				 *  @type {Frequency}
				 *  @signal
				 */
		        this.frequency = new Tone.Signal(440, Tone.Type.Frequency);
		        /**
				 *  Harmonicity is the ratio between the two voices. A harmonicity of
				 *  1 is no change. Harmonicity = 2 means a change of an octave. 
				 *  @type {Positive}
				 *  @signal
				 *  @example
				 * //pitch voice1 an octave below voice0
				 * synth.harmonicity.value = 0.5;
				 */
		        this.harmonicity = new Tone.Multiply(options.harmonicity);
		        this.harmonicity.units = Tone.Type.Positive;
		        /**
				 *  The modulation index which is in essence the depth or amount of the modulation. In other terms it is the 
				 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the 
				 *  modulating signal (ma) -- as in ma/mf. 
				 *	@type {Positive}
				 *	@signal
				 */
		        this.modulationIndex = new Tone.Multiply(options.modulationIndex);
		        this.modulationIndex.units = Tone.Type.Positive;
		        /**
				 *  the node where the modulation happens
				 *  @type {GainNode}
				 *  @private
				 */
		        this._modulationNode = this.context.createGain();
		        //control the two voices frequency
		        this.frequency.connect(this.carrier.frequency);
		        this.frequency.chain(this.harmonicity, this.modulator.frequency);
		        this.frequency.chain(this.modulationIndex, this._modulationNode);
		        this.modulator.connect(this._modulationNode.gain);
		        this._modulationNode.gain.value = 0;
		        this._modulationNode.connect(this.carrier.frequency);
		        this.carrier.connect(this.output);
		        this._readOnly([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity',
		            'modulationIndex'
		        ]);
		        ;
		    };
		    Tone.extend(Tone.SimpleFM, Tone.Monophonic);
		    /**
			 *  @static
			 *  @type {Object}
			 */
		    Tone.SimpleFM.defaults = {
		        'harmonicity': 3,
		        'modulationIndex': 10,
		        'carrier': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'sine' },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            }
		        },
		        'modulator': {
		            'volume': -10,
		            'portamento': 0,
		            'oscillator': { 'type': 'triangle' },
		            'envelope': {
		                'attack': 0.01,
		                'decay': 0,
		                'sustain': 1,
		                'release': 0.5
		            }
		        }
		    };
		    /**
			 *  trigger the attack portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will occur
			 *  @param {number} [velocity=1] the velocity of the note
			 *  @returns {Tone.SimpleFM} this
			 *  @private
			 */
		    Tone.SimpleFM.prototype._triggerEnvelopeAttack = function (time, velocity) {
		        //the port glide
		        time = this.toSeconds(time);
		        //the envelopes
		        this.carrier.envelope.triggerAttack(time, velocity);
		        this.modulator.envelope.triggerAttack(time);
		        return this;
		    };
		    /**
			 *  trigger the release portion of the note
			 *  
			 *  @param  {Time} [time=now] the time the note will release
			 *  @returns {Tone.SimpleFM} this
			 *  @private
			 */
		    Tone.SimpleFM.prototype._triggerEnvelopeRelease = function (time) {
		        this.carrier.triggerRelease(time);
		        this.modulator.triggerRelease(time);
		        return this;
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.SimpleFM} this
			 */
		    Tone.SimpleFM.prototype.dispose = function () {
		        Tone.Monophonic.prototype.dispose.call(this);
		        this._writable([
		            'carrier',
		            'modulator',
		            'frequency',
		            'harmonicity',
		            'modulationIndex'
		        ]);
		        this.carrier.dispose();
		        this.carrier = null;
		        this.modulator.dispose();
		        this.modulator = null;
		        this.frequency.dispose();
		        this.frequency = null;
		        this.modulationIndex.dispose();
		        this.modulationIndex = null;
		        this.harmonicity.dispose();
		        this.harmonicity = null;
		        this._modulationNode.disconnect();
		        this._modulationNode = null;
		        return this;
		    };
		    return Tone.SimpleFM;
		});
		Module(function (Tone) {
		    
		    //polyfill for getUserMedia
		    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		    /**
			 *  @class  Tone.ExternalInput is a WebRTC Audio Input. Check 
			 *          [Media Stream API Support](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_API)
			 *          to see which browsers are supported. As of
			 *          writing this, Chrome, Firefox, and Opera 
			 *          support Media Stream. Chrome allows enumeration 
			 *          of the sources, and access to device name over a 
			 *          secure (HTTPS) connection. See [https://simpl.info](https://simpl.info/getusermedia/sources/index.html) 
			 *          vs [http://simple.info](https://simpl.info/getusermedia/sources/index.html) 
			 *          on a Chrome browser for the difference.
			 *         
			 *  @constructor
			 *  @extends {Tone.Source}
			 *  @param {number} [inputNum=0] If multiple inputs are present, select the input number. Chrome only.
			 *  @example
			 * //select the third input
			 * var motu = new Tone.ExternalInput(3);
			 * 
			 * //opening the input asks the user to activate their mic
			 * motu.open(function(){
			 * 	//opening is activates the microphone
			 * 	//starting lets audio through
			 * 	motu.start(10);
			 * });
			 */
		    Tone.ExternalInput = function () {
		        var options = this.optionsObject(arguments, ['inputNum'], Tone.ExternalInput.defaults);
		        Tone.Source.call(this, options);
		        /**
				 *  The MediaStreamNode 
				 *  @type {MediaStreamAudioSourceNode}
				 *  @private
				 */
		        this._mediaStream = null;
		        /**
				 *  The media stream created by getUserMedia.
				 *  @type {LocalMediaStream}
				 *  @private
				 */
		        this._stream = null;
		        /**
				 *  The constraints argument for getUserMedia
				 *  @type {Object}
				 *  @private
				 */
		        this._constraints = { 'audio': true };
		        /**
				 *  The input source position in Tone.ExternalInput.sources. 
				 *  Set before ExternalInput.open().
				 *  @type {Number}
				 *  @private
				 */
		        this._inputNum = options.inputNum;
		        /**
				 *  Gates the input signal for start/stop. 
				 *  Initially closed.
				 *  @type {GainNode}
				 *  @private
				 */
		        this._gate = new Tone.Gain(0).connect(this.output);
		    };
		    Tone.extend(Tone.ExternalInput, Tone.Source);
		    /**
			 * the default parameters
			 * @type {Object}
			 */
		    Tone.ExternalInput.defaults = { 'inputNum': 0 };
		    /**
			 * wrapper for getUserMedia function
			 * @param {function} callback
			 * @private
			 */
		    Tone.ExternalInput.prototype._getUserMedia = function (callback) {
		        if (!Tone.ExternalInput.supported) {
		            throw new Error('browser does not support \'getUserMedia\'');
		        }
		        if (Tone.ExternalInput.sources[this._inputNum]) {
		            this._constraints = { audio: { optional: [{ sourceId: Tone.ExternalInput.sources[this._inputNum].id }] } };
		        }
		        navigator.getUserMedia(this._constraints, function (stream) {
		            this._onStream(stream);
		            callback();
		        }.bind(this), function (err) {
		            callback(err);
		        });
		    };
		    /**
			 * called when the stream is successfully setup
			 * @param  {LocalMediaStream} stream
			 * @private
			 */
		    Tone.ExternalInput.prototype._onStream = function (stream) {
		        if (!this.isFunction(this.context.createMediaStreamSource)) {
		            throw new Error('browser does not support the \'MediaStreamSourceNode\'');
		        }
		        //can only start a new source if the previous one is closed
		        if (!this._stream) {
		            this._stream = stream;
		            //Wrap a MediaStreamSourceNode around the live input stream.
		            this._mediaStream = this.context.createMediaStreamSource(stream);
		            //Connect the MediaStreamSourceNode to a gate gain node
		            this._mediaStream.connect(this._gate);
		        }
		    };
		    /**
			 *  Open the media stream 
			 *  @param  {function=} callback The callback function to 
			 *                       execute when the stream is open
			 *  @return {Tone.ExternalInput} this
			 */
		    Tone.ExternalInput.prototype.open = function (callback) {
		        callback = this.defaultArg(callback, Tone.noOp);
		        Tone.ExternalInput.getSources(function () {
		            this._getUserMedia(callback);
		        }.bind(this));
		        return this;
		    };
		    /**
			 *  Close the media stream
			 *  @return {Tone.ExternalInput} this
			 */
		    Tone.ExternalInput.prototype.close = function () {
		        if (this._stream) {
		            var track = this._stream.getTracks()[this._inputNum];
		            if (!this.isUndef(track)) {
		                track.stop();
		            }
		            this._stream = null;
		        }
		        return this;
		    };
		    /**
			 *  Start the stream
			 *  @private
			 */
		    Tone.ExternalInput.prototype._start = function (time) {
		        time = this.toSeconds(time);
		        this._gate.gain.setValueAtTime(1, time);
		        return this;
		    };
		    /**
			 *  Stops the stream.
			 *  @private
			 */
		    Tone.ExternalInput.prototype._stop = function (time) {
		        time = this.toSeconds(time);
		        this._gate.gain.setValueAtTime(0, time);
		        return this;
		    };
		    /**
			 * Clean up.
			 * @return {Tone.ExternalInput} this
			 */
		    Tone.ExternalInput.prototype.dispose = function () {
		        Tone.Source.prototype.dispose.call(this);
		        this.close();
		        if (this._mediaStream) {
		            this._mediaStream.disconnect();
		            this._mediaStream = null;
		        }
		        this._constraints = null;
		        this._gate.dispose();
		        this._gate = null;
		        return this;
		    };
		    ///////////////////////////////////////////////////////////////////////////
		    // STATIC METHODS
		    ///////////////////////////////////////////////////////////////////////////
		    /**
			 * The array of available sources, different depending on whether connection is secure
			 * @type {Array}
			 * @static
			 */
		    Tone.ExternalInput.sources = [];
		    /**
			 * indicates whether browser supports MediaStreamTrack.getSources (i.e. Chrome vs Firefox)
			 * @type {Boolean}
			 * @private
			 */
		    Tone.ExternalInput._canGetSources = !Tone.prototype.isUndef(window.MediaStreamTrack) && Tone.prototype.isFunction(MediaStreamTrack.getSources);
		    /**
			 *  If getUserMedia is supported by the browser.
			 *  @type  {Boolean}
			 *  @memberOf Tone.ExternalInput#
			 *  @name supported
			 *  @static
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.ExternalInput, 'supported', {
		        get: function () {
		            return Tone.prototype.isFunction(navigator.getUserMedia);
		        }
		    });
		    /**
			 *  Populates the source list. Invokes the callback with an array of 
			 *  possible audio sources.
			 *  @param  {function=} callback Callback to be executed after populating list 
			 *  @return {Tone.ExternalInput} this
			 *  @static
			 *  @example
			 * var soundflower = new Tone.ExternalInput();
			 * Tone.ExternalInput.getSources(selectSoundflower);
			 *
			 * function selectSoundflower(sources){
			 * 	for(var i = 0; i < sources.length; i++){
			 * 		if(sources[i].label === "soundflower"){
			 * 			soundflower.inputNum = i;
			 * 			soundflower.open(function(){
			 * 				soundflower.start();
			 * 			});
			 * 			break;
			 * 		}
			 * 	}
			 * };
			 */
		    Tone.ExternalInput.getSources = function (callback) {
		        if (Tone.ExternalInput.sources.length === 0 && Tone.ExternalInput._canGetSources) {
		            MediaStreamTrack.getSources(function (media_sources) {
		                for (var i = 0; i < media_sources.length; i++) {
		                    if (media_sources[i].kind === 'audio') {
		                        Tone.ExternalInput.sources[i] = media_sources[i];
		                    }
		                }
		                callback(Tone.ExternalInput.sources);
		            });
		        } else {
		            callback(Tone.ExternalInput.sources);
		        }
		        return this;
		    };
		    return Tone.ExternalInput;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  Opens up the default source (typically the microphone).
			 *
			 *  @constructor
			 *  @extends {Tone.ExternalInput}
			 *  @example
			 *  //mic will feedback if played through master
			 *  var mic = new Tone.Microphone();
			 *  mic.open(function(){
			 *  	//start the mic at ten seconds
			 *  	mic.start(10);
			 *  });
			 *  //stop the mic
			 *  mic.stop(20);
			 */
		    Tone.Microphone = function () {
		        Tone.ExternalInput.call(this, 0);
		    };
		    Tone.extend(Tone.Microphone, Tone.ExternalInput);
		    /**
			 *  If getUserMedia is supported by the browser.
			 *  @type  {Boolean}
			 *  @memberOf Tone.Microphone#
			 *  @name supported
			 *  @static
			 *  @readOnly
			 */
		    Object.defineProperty(Tone.Microphone, 'supported', {
		        get: function () {
		            return Tone.ExternalInput.supported;
		        }
		    });
		    return Tone.Microphone;
		});
		Module(function (Tone) {
		    
		    /**
			 * 	@class  Clip the incoming signal so that the output is always between min and max.
			 * 	
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {number} min the minimum value of the outgoing signal
			 *  @param {number} max the maximum value of the outgoing signal
			 *  @example
			 * var clip = new Tone.Clip(0.5, 1);
			 * var osc = new Tone.Oscillator().connect(clip);
			 * //clips the output of the oscillator to between 0.5 and 1.
			 */
		    Tone.Clip = function (min, max) {
		        //make sure the args are in the right order
		        if (min > max) {
		            var tmp = min;
		            min = max;
		            max = tmp;
		        }
		        /**
				 *  The min clip value
				 *  @type {Number}
				 *  @signal
				 */
		        this.min = this.input = new Tone.Min(max);
		        this._readOnly('min');
		        /**
				 *  The max clip value
				 *  @type {Number}
				 *  @signal
				 */
		        this.max = this.output = new Tone.Max(min);
		        this._readOnly('max');
		        this.min.connect(this.max);
		    };
		    Tone.extend(Tone.Clip, Tone.SignalBase);
		    /**
			 *  clean up
			 *  @returns {Tone.Clip} this
			 */
		    Tone.Clip.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable('min');
		        this.min.dispose();
		        this.min = null;
		        this._writable('max');
		        this.max.dispose();
		        this.max = null;
		        return this;
		    };
		    return Tone.Clip;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Normalize takes an input min and max and maps it linearly to NormalRange [0,1]
			 *
			 *  @extends {Tone.SignalBase}
			 *  @constructor
			 *  @param {number} inputMin the min input value
			 *  @param {number} inputMax the max input value
			 *  @example
			 * var norm = new Tone.Normalize(2, 4);
			 * var sig = new Tone.Signal(3).connect(norm);
			 * //output of norm is 0.5. 
			 */
		    Tone.Normalize = function (inputMin, inputMax) {
		        /**
				 *  the min input value
				 *  @type {number}
				 *  @private
				 */
		        this._inputMin = this.defaultArg(inputMin, 0);
		        /**
				 *  the max input value
				 *  @type {number}
				 *  @private
				 */
		        this._inputMax = this.defaultArg(inputMax, 1);
		        /**
				 *  subtract the min from the input
				 *  @type {Tone.Add}
				 *  @private
				 */
		        this._sub = this.input = new Tone.Add(0);
		        /**
				 *  divide by the difference between the input and output
				 *  @type {Tone.Multiply}
				 *  @private
				 */
		        this._div = this.output = new Tone.Multiply(1);
		        this._sub.connect(this._div);
		        this._setRange();
		    };
		    Tone.extend(Tone.Normalize, Tone.SignalBase);
		    /**
			 * The minimum value the input signal will reach.
			 * @memberOf Tone.Normalize#
			 * @type {number}
			 * @name min
			 */
		    Object.defineProperty(Tone.Normalize.prototype, 'min', {
		        get: function () {
		            return this._inputMin;
		        },
		        set: function (min) {
		            this._inputMin = min;
		            this._setRange();
		        }
		    });
		    /**
			 * The maximum value the input signal will reach.
			 * @memberOf Tone.Normalize#
			 * @type {number}
			 * @name max
			 */
		    Object.defineProperty(Tone.Normalize.prototype, 'max', {
		        get: function () {
		            return this._inputMax;
		        },
		        set: function (max) {
		            this._inputMax = max;
		            this._setRange();
		        }
		    });
		    /**
			 *  set the values
			 *  @private
			 */
		    Tone.Normalize.prototype._setRange = function () {
		        this._sub.value = -this._inputMin;
		        this._div.value = 1 / (this._inputMax - this._inputMin);
		    };
		    /**
			 *  clean up
			 *  @returns {Tone.Normalize} this
			 */
		    Tone.Normalize.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._sub.dispose();
		        this._sub = null;
		        this._div.dispose();
		        this._div = null;
		        return this;
		    };
		    return Tone.Normalize;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class Route a single input to the specified output. 
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {number} [outputCount=2] the number of inputs the switch accepts
			 *  @example
			 * var route = new Tone.Route(4);
			 * var signal = new Tone.Signal(3).connect(route);
			 * route.select(0);
			 * //signal is routed through output 0
			 * route.select(3);
			 * //signal is now routed through output 3
			 */
		    Tone.Route = function (outputCount) {
		        outputCount = this.defaultArg(outputCount, 2);
		        Tone.call(this, 1, outputCount);
		        /**
				 *  The control signal.
				 *  @type {Number}
				 *  @signal
				 */
		        this.gate = new Tone.Signal(0);
		        this._readOnly('gate');
		        //make all the inputs and connect them
		        for (var i = 0; i < outputCount; i++) {
		            var routeGate = new RouteGate(i);
		            this.output[i] = routeGate;
		            this.gate.connect(routeGate.selecter);
		            this.input.connect(routeGate);
		        }
		    };
		    Tone.extend(Tone.Route, Tone.SignalBase);
		    /**
			 *  Routes the signal to one of the outputs and close the others.
			 *  @param {number} [which=0] Open one of the gates (closes the other).
			 *  @param {Time} [time=now] The time when the switch will open.
			 *  @returns {Tone.Route} this
			 */
		    Tone.Route.prototype.select = function (which, time) {
		        //make sure it's an integer
		        which = Math.floor(which);
		        this.gate.setValueAtTime(which, this.toSeconds(time));
		        return this;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Route} this
			 */
		    Tone.Route.prototype.dispose = function () {
		        this._writable('gate');
		        this.gate.dispose();
		        this.gate = null;
		        for (var i = 0; i < this.output.length; i++) {
		            this.output[i].dispose();
		            this.output[i] = null;
		        }
		        Tone.prototype.dispose.call(this);
		        return this;
		    };
		    ////////////START HELPER////////////
		    /**
			 *  helper class for Tone.Route representing a single gate
			 *  @constructor
			 *  @extends {Tone}
			 *  @private
			 */
		    var RouteGate = function (num) {
		        /**
				 *  the selector
				 *  @type {Tone.Equal}
				 */
		        this.selecter = new Tone.Equal(num);
		        /**
				 *  the gate
				 *  @type {GainNode}
				 */
		        this.gate = this.input = this.output = this.context.createGain();
		        //connect the selecter to the gate gain
		        this.selecter.connect(this.gate.gain);
		    };
		    Tone.extend(RouteGate);
		    /**
			 *  clean up
			 *  @private
			 */
		    RouteGate.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this.selecter.dispose();
		        this.selecter = null;
		        this.gate.disconnect();
		        this.gate = null;
		    };
		    ////////////END HELPER////////////
		    //return Tone.Route
		    return Tone.Route;
		});
		Module(function (Tone) {
		    
		    /**
			 *  @class  When the gate is set to 0, the input signal does not pass through to the output. 
			 *          If the gate is set to 1, the input signal passes through.
			 *          the gate is initially closed.
			 *
			 *  @constructor
			 *  @extends {Tone.SignalBase}
			 *  @param {Boolean} [open=false] If the gate is initially open or closed.
			 *  @example
			 * var sigSwitch = new Tone.Switch();
			 * var signal = new Tone.Signal(2).connect(sigSwitch);
			 * //initially no output from sigSwitch
			 * sigSwitch.gate.value = 1;
			 * //open the switch and allow the signal through
			 * //the output of sigSwitch is now 2. 
			 */
		    Tone.Switch = function (open) {
		        open = this.defaultArg(open, false);
		        Tone.call(this);
		        /**
				 *  The control signal for the switch.
				 *  When this value is 0, the input signal will NOT pass through,
				 *  when it is high (1), the input signal will pass through.
				 *  
				 *  @type {Number}
				 *  @signal
				 */
		        this.gate = new Tone.Signal(0);
		        this._readOnly('gate');
		        /**
				 *  thresh the control signal to either 0 or 1
				 *  @type {Tone.GreaterThan}
				 *  @private
				 */
		        this._thresh = new Tone.GreaterThan(0.5);
		        this.input.connect(this.output);
		        this.gate.chain(this._thresh, this.output.gain);
		        //initially open
		        if (open) {
		            this.open();
		        }
		    };
		    Tone.extend(Tone.Switch, Tone.SignalBase);
		    /**
			 *  Open the switch at a specific time. 
			 *
			 *  @param {Time} [time=now] The time when the switch will be open. 
			 *  @returns {Tone.Switch} this
			 *  @example
			 *  //open the switch to let the signal through
			 *  sigSwitch.open();
			 */
		    Tone.Switch.prototype.open = function (time) {
		        this.gate.setValueAtTime(1, this.toSeconds(time));
		        return this;
		    };
		    /**
			 *  Close the switch at a specific time. 
			 *
			 *  @param {Time} [time=now] The time when the switch will be closed.
			 *  @returns {Tone.Switch} this
			 *  @example
			 *  //close the switch a half second from now
			 *  sigSwitch.close("+0.5");
			 */
		    Tone.Switch.prototype.close = function (time) {
		        this.gate.setValueAtTime(0, this.toSeconds(time));
		        return this;
		    };
		    /**
			 *  Clean up.
			 *  @returns {Tone.Switch} this
			 */
		    Tone.Switch.prototype.dispose = function () {
		        Tone.prototype.dispose.call(this);
		        this._writable('gate');
		        this.gate.dispose();
		        this.gate = null;
		        this._thresh.dispose();
		        this._thresh = null;
		        return this;
		    };
		    return Tone.Switch;
		});

		//UMD
		if ( true ) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return Tone;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module === "object") {
			module.exports = Tone;
	 	} else {
			root.Tone = Tone;
		}
	} (this));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_0__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*** IMPORTS FROM imports-loader ***/
	(function() {
	var fix = module.exports=0;

	// Snap.svg 0.4.1
	//
	// Copyright (c) 2013 – 2015 Adobe Systems Incorporated. All rights reserved.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	//
	// build: 2015-11-09

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	// ┌────────────────────────────────────────────────────────────┐ \\
	// │ Eve 0.5.0 - JavaScript Events Library                      │ \\
	// ├────────────────────────────────────────────────────────────┤ \\
	// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
	// └────────────────────────────────────────────────────────────┘ \\

	(function (glob) {
	    var version = "0.5.0",
	        has = "hasOwnProperty",
	        separator = /[\.\/]/,
	        comaseparator = /\s*,\s*/,
	        wildcard = "*",
	        fun = function () {},
	        numsort = function (a, b) {
	            return a - b;
	        },
	        current_event,
	        stop,
	        events = {n: {}},
	        firstDefined = function () {
	            for (var i = 0, ii = this.length; i < ii; i++) {
	                if (typeof this[i] != "undefined") {
	                    return this[i];
	                }
	            }
	        },
	        lastDefined = function () {
	            var i = this.length;
	            while (--i) {
	                if (typeof this[i] != "undefined") {
	                    return this[i];
	                }
	            }
	        },
	        objtos = Object.prototype.toString,
	        Str = String,
	        isArray = Array.isArray || function (ar) {
	            return ar instanceof Array || objtos.call(ar) == "[object Array]";
	        };
	    /*\
	     * eve
	     [ method ]

	     * Fires event with given `name`, given scope and other parameters.

	     > Arguments

	     - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
	     - scope (object) context for the event handlers
	     - varargs (...) the rest of arguments will be sent to event handlers

	     = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
	    \*/
	        eve = function (name, scope) {
	            var e = events,
	                oldstop = stop,
	                args = Array.prototype.slice.call(arguments, 2),
	                listeners = eve.listeners(name),
	                z = 0,
	                f = false,
	                l,
	                indexed = [],
	                queue = {},
	                out = [],
	                ce = current_event,
	                errors = [];
	            out.firstDefined = firstDefined;
	            out.lastDefined = lastDefined;
	            current_event = name;
	            stop = 0;
	            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
	                indexed.push(listeners[i].zIndex);
	                if (listeners[i].zIndex < 0) {
	                    queue[listeners[i].zIndex] = listeners[i];
	                }
	            }
	            indexed.sort(numsort);
	            while (indexed[z] < 0) {
	                l = queue[indexed[z++]];
	                out.push(l.apply(scope, args));
	                if (stop) {
	                    stop = oldstop;
	                    return out;
	                }
	            }
	            for (i = 0; i < ii; i++) {
	                l = listeners[i];
	                if ("zIndex" in l) {
	                    if (l.zIndex == indexed[z]) {
	                        out.push(l.apply(scope, args));
	                        if (stop) {
	                            break;
	                        }
	                        do {
	                            z++;
	                            l = queue[indexed[z]];
	                            l && out.push(l.apply(scope, args));
	                            if (stop) {
	                                break;
	                            }
	                        } while (l)
	                    } else {
	                        queue[l.zIndex] = l;
	                    }
	                } else {
	                    out.push(l.apply(scope, args));
	                    if (stop) {
	                        break;
	                    }
	                }
	            }
	            stop = oldstop;
	            current_event = ce;
	            return out;
	        };
	        // Undocumented. Debug only.
	        eve._events = events;
	    /*\
	     * eve.listeners
	     [ method ]

	     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

	     > Arguments

	     - name (string) name of the event, dot (`.`) or slash (`/`) separated

	     = (array) array of event handlers
	    \*/
	    eve.listeners = function (name) {
	        var names = isArray(name) ? name : name.split(separator),
	            e = events,
	            item,
	            items,
	            k,
	            i,
	            ii,
	            j,
	            jj,
	            nes,
	            es = [e],
	            out = [];
	        for (i = 0, ii = names.length; i < ii; i++) {
	            nes = [];
	            for (j = 0, jj = es.length; j < jj; j++) {
	                e = es[j].n;
	                items = [e[names[i]], e[wildcard]];
	                k = 2;
	                while (k--) {
	                    item = items[k];
	                    if (item) {
	                        nes.push(item);
	                        out = out.concat(item.f || []);
	                    }
	                }
	            }
	            es = nes;
	        }
	        return out;
	    };
	    /*\
	     * eve.separator
	     [ method ]

	     * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
	     * here. Be aware that if you pass a string longer than one character it will be treated as
	     * a list of characters.

	     - separator (string) new separator. Empty string resets to default: `.` or `/`.
	    \*/
	    eve.separator = function (sep) {
	        if (sep) {
	            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
	            sep = "[" + sep + "]";
	            separator = new RegExp(sep);
	        } else {
	            separator = /[\.\/]/;
	        }
	    };
	    /*\
	     * eve.on
	     [ method ]
	     **
	     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
	     | eve.on("*.under.*", f);
	     | eve("mouse.under.floor"); // triggers f
	     * Use @eve to trigger the listener.
	     **
	     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
	     - f (function) event handler function
	     **
	     - name (array) if you don’t want to use separators, you can use array of strings
	     - f (function) event handler function
	     **
	     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment. 
	     > Example:
	     | eve.on("mouse", eatIt)(2);
	     | eve.on("mouse", scream);
	     | eve.on("mouse", catchIt)(1);
	     * This will ensure that `catchIt` function will be called before `eatIt`.
	     *
	     * If you want to put your handler before non-indexed handlers, specify a negative value.
	     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
	    \*/
	    eve.on = function (name, f) {
	        if (typeof f != "function") {
	            return function () {};
	        }
	        var names = isArray(name) ? (isArray(name[0]) ? name : [name]) : Str(name).split(comaseparator);
	        for (var i = 0, ii = names.length; i < ii; i++) {
	            (function (name) {
	                var names = isArray(name) ? name : Str(name).split(separator),
	                    e = events,
	                    exist;
	                for (var i = 0, ii = names.length; i < ii; i++) {
	                    e = e.n;
	                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {n: {}});
	                }
	                e.f = e.f || [];
	                for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
	                    exist = true;
	                    break;
	                }
	                !exist && e.f.push(f);
	            }(names[i]));
	        }
	        return function (zIndex) {
	            if (+zIndex == +zIndex) {
	                f.zIndex = +zIndex;
	            }
	        };
	    };
	    /*\
	     * eve.f
	     [ method ]
	     **
	     * Returns function that will fire given event with optional arguments.
	     * Arguments that will be passed to the result function will be also
	     * concated to the list of final arguments.
	     | el.onclick = eve.f("click", 1, 2);
	     | eve.on("click", function (a, b, c) {
	     |     console.log(a, b, c); // 1, 2, [event object]
	     | });
	     > Arguments
	     - event (string) event name
	     - varargs (…) and any other arguments
	     = (function) possible event handler function
	    \*/
	    eve.f = function (event) {
	        var attrs = [].slice.call(arguments, 1);
	        return function () {
	            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
	        };
	    };
	    /*\
	     * eve.stop
	     [ method ]
	     **
	     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
	    \*/
	    eve.stop = function () {
	        stop = 1;
	    };
	    /*\
	     * eve.nt
	     [ method ]
	     **
	     * Could be used inside event handler to figure out actual name of the event.
	     **
	     > Arguments
	     **
	     - subname (string) #optional subname of the event
	     **
	     = (string) name of the event, if `subname` is not specified
	     * or
	     = (boolean) `true`, if current event’s name contains `subname`
	    \*/
	    eve.nt = function (subname) {
	        var cur = isArray(current_event) ? current_event.join(".") : current_event;
	        if (subname) {
	            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
	        }
	        return cur;
	    };
	    /*\
	     * eve.nts
	     [ method ]
	     **
	     * Could be used inside event handler to figure out actual name of the event.
	     **
	     **
	     = (array) names of the event
	    \*/
	    eve.nts = function () {
	        return isArray(current_event) ? current_event : current_event.split(separator);
	    };
	    /*\
	     * eve.off
	     [ method ]
	     **
	     * Removes given function from the list of event listeners assigned to given name.
	     * If no arguments specified all the events will be cleared.
	     **
	     > Arguments
	     **
	     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
	     - f (function) event handler function
	    \*/
	    /*\
	     * eve.unbind
	     [ method ]
	     **
	     * See @eve.off
	    \*/
	    eve.off = eve.unbind = function (name, f) {
	        if (!name) {
	            eve._events = events = {n: {}};
	            return;
	        }
	        var names = isArray(name) ? (isArray(name[0]) ? name : [name]) : Str(name).split(comaseparator);
	        if (names.length > 1) {
	            for (var i = 0, ii = names.length; i < ii; i++) {
	                eve.off(names[i], f);
	            }
	            return;
	        }
	        names = isArray(name) ? name : Str(name).split(separator);
	        var e,
	            key,
	            splice,
	            i, ii, j, jj,
	            cur = [events],
	            inodes = [];
	        for (i = 0, ii = names.length; i < ii; i++) {
	            for (j = 0; j < cur.length; j += splice.length - 2) {
	                splice = [j, 1];
	                e = cur[j].n;
	                if (names[i] != wildcard) {
	                    if (e[names[i]]) {
	                        splice.push(e[names[i]]);
	                        inodes.unshift({
	                            n: e,
	                            name: names[i]
	                        });
	                    }
	                } else {
	                    for (key in e) if (e[has](key)) {
	                        splice.push(e[key]);
	                        inodes.unshift({
	                            n: e,
	                            name: key
	                        });
	                    }
	                }
	                cur.splice.apply(cur, splice);
	            }
	        }
	        for (i = 0, ii = cur.length; i < ii; i++) {
	            e = cur[i];
	            while (e.n) {
	                if (f) {
	                    if (e.f) {
	                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
	                            e.f.splice(j, 1);
	                            break;
	                        }
	                        !e.f.length && delete e.f;
	                    }
	                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
	                        var funcs = e.n[key].f;
	                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
	                            funcs.splice(j, 1);
	                            break;
	                        }
	                        !funcs.length && delete e.n[key].f;
	                    }
	                } else {
	                    delete e.f;
	                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
	                        delete e.n[key].f;
	                    }
	                }
	                e = e.n;
	            }
	        }
	        // prune inner nodes in path
	        prune: for (i = 0, ii = inodes.length; i < ii; i++) {
	            e = inodes[i];
	            for (key in e.n[e.name].f) {
	                // not empty (has listeners)
	                continue prune;
	            }
	            for (key in e.n[e.name].n) {
	                // not empty (has children)
	                continue prune;
	            }
	            // is empty
	            delete e.n[e.name];
	        }
	    };
	    /*\
	     * eve.once
	     [ method ]
	     **
	     * Binds given event handler with a given name to only run once then unbind itself.
	     | eve.once("login", f);
	     | eve("login"); // triggers f
	     | eve("login"); // no listeners
	     * Use @eve to trigger the listener.
	     **
	     > Arguments
	     **
	     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
	     - f (function) event handler function
	     **
	     = (function) same return function as @eve.on
	    \*/
	    eve.once = function (name, f) {
	        var f2 = function () {
	            eve.off(name, f2);
	            return f.apply(this, arguments);
	        };
	        return eve.on(name, f2);
	    };
	    /*\
	     * eve.version
	     [ property (string) ]
	     **
	     * Current version of the library.
	    \*/
	    eve.version = version;
	    eve.toString = function () {
	        return "You are running Eve " + version;
	    };
	    (typeof module != "undefined" && module.exports) ? (module.exports = eve) : ( true ? (!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_LOCAL_MODULE_0__ = (function() { return eve; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)))) : (glob.eve = eve));
	})(this);

	(function (glob, factory) {
	    // AMD support
	    if (true) {
	        // Define as an anonymous module
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__WEBPACK_LOCAL_MODULE_0__], __WEBPACK_AMD_DEFINE_RESULT__ = function (eve) {
	            return factory(glob, eve);
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports != 'undefined') {
	        // Next for Node.js or CommonJS
	        var eve = require('eve');
	        module.exports = factory(glob, eve);
	    } else {
	        // Browser globals (glob is window)
	        // Snap adds itself to window
	        factory(glob, glob.eve);
	    }
	}(window || this, function (window, eve) {

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	var mina = (function (eve) {
	    var animations = {},
	    requestAnimFrame = window.requestAnimationFrame       ||
	                       window.webkitRequestAnimationFrame ||
	                       window.mozRequestAnimationFrame    ||
	                       window.oRequestAnimationFrame      ||
	                       window.msRequestAnimationFrame     ||
	                       function (callback) {
	                           setTimeout(callback, 16);
	                       },
	    isArray = Array.isArray || function (a) {
	        return a instanceof Array ||
	            Object.prototype.toString.call(a) == "[object Array]";
	    },
	    idgen = 0,
	    idprefix = "M" + (+new Date).toString(36),
	    ID = function () {
	        return idprefix + (idgen++).toString(36);
	    },
	    diff = function (a, b, A, B) {
	        if (isArray(a)) {
	            res = [];
	            for (var i = 0, ii = a.length; i < ii; i++) {
	                res[i] = diff(a[i], b, A[i], B);
	            }
	            return res;
	        }
	        var dif = (A - a) / (B - b);
	        return function (bb) {
	            return a + dif * (bb - b);
	        };
	    },
	    timer = Date.now || function () {
	        return +new Date;
	    },
	    sta = function (val) {
	        var a = this;
	        if (val == null) {
	            return a.s;
	        }
	        var ds = a.s - val;
	        a.b += a.dur * ds;
	        a.B += a.dur * ds;
	        a.s = val;
	    },
	    speed = function (val) {
	        var a = this;
	        if (val == null) {
	            return a.spd;
	        }
	        a.spd = val;
	    },
	    duration = function (val) {
	        var a = this;
	        if (val == null) {
	            return a.dur;
	        }
	        a.s = a.s * val / a.dur;
	        a.dur = val;
	    },
	    stopit = function () {
	        var a = this;
	        delete animations[a.id];
	        a.update();
	        eve("mina.stop." + a.id, a);
	    },
	    pause = function () {
	        var a = this;
	        if (a.pdif) {
	            return;
	        }
	        delete animations[a.id];
	        a.update();
	        a.pdif = a.get() - a.b;
	    },
	    resume = function () {
	        var a = this;
	        if (!a.pdif) {
	            return;
	        }
	        a.b = a.get() - a.pdif;
	        delete a.pdif;
	        animations[a.id] = a;
	    },
	    update = function () {
	        var a = this,
	            res;
	        if (isArray(a.start)) {
	            res = [];
	            for (var j = 0, jj = a.start.length; j < jj; j++) {
	                res[j] = +a.start[j] +
	                    (a.end[j] - a.start[j]) * a.easing(a.s);
	            }
	        } else {
	            res = +a.start + (a.end - a.start) * a.easing(a.s);
	        }
	        a.set(res);
	    },
	    frame = function () {
	        var len = 0;
	        for (var i in animations) if (animations.hasOwnProperty(i)) {
	            var a = animations[i],
	                b = a.get(),
	                res;
	            len++;
	            a.s = (b - a.b) / (a.dur / a.spd);
	            if (a.s >= 1) {
	                delete animations[i];
	                a.s = 1;
	                len--;
	                (function (a) {
	                    setTimeout(function () {
	                        eve("mina.finish." + a.id, a);
	                    });
	                }(a));
	            }
	            a.update();
	        }
	        len && requestAnimFrame(frame);
	    },
	    /*\
	     * mina
	     [ method ]
	     **
	     * Generic animation of numbers
	     **
	     - a (number) start _slave_ number
	     - A (number) end _slave_ number
	     - b (number) start _master_ number (start time in general case)
	     - B (number) end _master_ number (end time in gereal case)
	     - get (function) getter of _master_ number (see @mina.time)
	     - set (function) setter of _slave_ number
	     - easing (function) #optional easing function, default is @mina.linear
	     = (object) animation descriptor
	     o {
	     o         id (string) animation id,
	     o         start (number) start _slave_ number,
	     o         end (number) end _slave_ number,
	     o         b (number) start _master_ number,
	     o         s (number) animation status (0..1),
	     o         dur (number) animation duration,
	     o         spd (number) animation speed,
	     o         get (function) getter of _master_ number (see @mina.time),
	     o         set (function) setter of _slave_ number,
	     o         easing (function) easing function, default is @mina.linear,
	     o         status (function) status getter/setter,
	     o         speed (function) speed getter/setter,
	     o         duration (function) duration getter/setter,
	     o         stop (function) animation stopper
	     o         pause (function) pauses the animation
	     o         resume (function) resumes the animation
	     o         update (function) calles setter with the right value of the animation
	     o }
	    \*/
	    mina = function (a, A, b, B, get, set, easing) {
	        var anim = {
	            id: ID(),
	            start: a,
	            end: A,
	            b: b,
	            s: 0,
	            dur: B - b,
	            spd: 1,
	            get: get,
	            set: set,
	            easing: easing || mina.linear,
	            status: sta,
	            speed: speed,
	            duration: duration,
	            stop: stopit,
	            pause: pause,
	            resume: resume,
	            update: update
	        };
	        animations[anim.id] = anim;
	        var len = 0, i;
	        for (i in animations) if (animations.hasOwnProperty(i)) {
	            len++;
	            if (len == 2) {
	                break;
	            }
	        }
	        len == 1 && requestAnimFrame(frame);
	        return anim;
	    };
	    /*\
	     * mina.time
	     [ method ]
	     **
	     * Returns the current time. Equivalent to:
	     | function () {
	     |     return (new Date).getTime();
	     | }
	    \*/
	    mina.time = timer;
	    /*\
	     * mina.getById
	     [ method ]
	     **
	     * Returns an animation by its id
	     - id (string) animation's id
	     = (object) See @mina
	    \*/
	    mina.getById = function (id) {
	        return animations[id] || null;
	    };

	    /*\
	     * mina.linear
	     [ method ]
	     **
	     * Default linear easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.linear = function (n) {
	        return n;
	    };
	    /*\
	     * mina.easeout
	     [ method ]
	     **
	     * Easeout easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.easeout = function (n) {
	        return Math.pow(n, 1.7);
	    };
	    /*\
	     * mina.easein
	     [ method ]
	     **
	     * Easein easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.easein = function (n) {
	        return Math.pow(n, .48);
	    };
	    /*\
	     * mina.easeinout
	     [ method ]
	     **
	     * Easeinout easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.easeinout = function (n) {
	        if (n == 1) {
	            return 1;
	        }
	        if (n == 0) {
	            return 0;
	        }
	        var q = .48 - n / 1.04,
	            Q = Math.sqrt(.1734 + q * q),
	            x = Q - q,
	            X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
	            y = -Q - q,
	            Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
	            t = X + Y + .5;
	        return (1 - t) * 3 * t * t + t * t * t;
	    };
	    /*\
	     * mina.backin
	     [ method ]
	     **
	     * Backin easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.backin = function (n) {
	        if (n == 1) {
	            return 1;
	        }
	        var s = 1.70158;
	        return n * n * ((s + 1) * n - s);
	    };
	    /*\
	     * mina.backout
	     [ method ]
	     **
	     * Backout easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.backout = function (n) {
	        if (n == 0) {
	            return 0;
	        }
	        n = n - 1;
	        var s = 1.70158;
	        return n * n * ((s + 1) * n + s) + 1;
	    };
	    /*\
	     * mina.elastic
	     [ method ]
	     **
	     * Elastic easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.elastic = function (n) {
	        if (n == !!n) {
	            return n;
	        }
	        return Math.pow(2, -10 * n) * Math.sin((n - .075) *
	            (2 * Math.PI) / .3) + 1;
	    };
	    /*\
	     * mina.bounce
	     [ method ]
	     **
	     * Bounce easing
	     - n (number) input 0..1
	     = (number) output 0..1
	    \*/
	    mina.bounce = function (n) {
	        var s = 7.5625,
	            p = 2.75,
	            l;
	        if (n < (1 / p)) {
	            l = s * n * n;
	        } else {
	            if (n < (2 / p)) {
	                n -= (1.5 / p);
	                l = s * n * n + .75;
	            } else {
	                if (n < (2.5 / p)) {
	                    n -= (2.25 / p);
	                    l = s * n * n + .9375;
	                } else {
	                    n -= (2.625 / p);
	                    l = s * n * n + .984375;
	                }
	            }
	        }
	        return l;
	    };
	    window.mina = mina;
	    return mina;
	})(typeof eve == "undefined" ? function () {} : eve);
	// Copyright (c) 2013 - 2015 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	var Snap = (function(root) {
	Snap.version = "0.3.0";
	/*\
	 * Snap
	 [ method ]
	 **
	 * Creates a drawing surface or wraps existing SVG element.
	 **
	 - width (number|string) width of surface
	 - height (number|string) height of surface
	 * or
	 - DOM (SVGElement) element to be wrapped into Snap structure
	 * or
	 - array (array) array of elements (will return set of elements)
	 * or
	 - query (string) CSS query selector
	 = (object) @Element
	\*/
	function Snap(w, h) {
	    if (w) {
	        if (w.nodeType) {
	            return wrap(w);
	        }
	        if (is(w, "array") && Snap.set) {
	            return Snap.set.apply(Snap, w);
	        }
	        if (w instanceof Element) {
	            return w;
	        }
	        if (h == null) {
	            w = glob.doc.querySelector(String(w));
	            return wrap(w);
	        }
	    }
	    w = w == null ? "100%" : w;
	    h = h == null ? "100%" : h;
	    return new Paper(w, h);
	}
	Snap.toString = function () {
	    return "Snap v" + this.version;
	};
	Snap._ = {};
	var glob = {
	    win: root.window,
	    doc: root.window.document
	};
	Snap._.glob = glob;
	var has = "hasOwnProperty",
	    Str = String,
	    toFloat = parseFloat,
	    toInt = parseInt,
	    math = Math,
	    mmax = math.max,
	    mmin = math.min,
	    abs = math.abs,
	    pow = math.pow,
	    PI = math.PI,
	    round = math.round,
	    E = "",
	    S = " ",
	    objectToString = Object.prototype.toString,
	    ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
	    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
	    bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
	    reURLValue = /^url\(#?([^)]+)\)$/,
	    separator = Snap._.separator = /[,\s]+/,
	    whitespace = /[\s]/g,
	    commaSpaces = /[\s]*,[\s]*/,
	    hsrg = {hs: 1, rg: 1},
	    pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
	    tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
	    pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\s]*,?[\s]*/ig,
	    idgen = 0,
	    idprefix = "S" + (+new Date).toString(36),
	    ID = function (el) {
	        return (el && el.type ? el.type : E) + idprefix + (idgen++).toString(36);
	    },
	    xlink = "http://www.w3.org/1999/xlink",
	    xmlns = "http://www.w3.org/2000/svg",
	    hub = {},
	    URL = Snap.url = function (url) {
	        return "url('#" + url + "')";
	    };

	function $(el, attr) {
	    if (attr) {
	        if (el == "#text") {
	            el = glob.doc.createTextNode(attr.text || attr["#text"] || "");
	        }
	        if (el == "#comment") {
	            el = glob.doc.createComment(attr.text || attr["#text"] || "");
	        }
	        if (typeof el == "string") {
	            el = $(el);
	        }
	        if (typeof attr == "string") {
	            if (el.nodeType == 1) {
	                if (attr.substring(0, 6) == "xlink:") {
	                    return el.getAttributeNS(xlink, attr.substring(6));
	                }
	                if (attr.substring(0, 4) == "xml:") {
	                    return el.getAttributeNS(xmlns, attr.substring(4));
	                }
	                return el.getAttribute(attr);
	            } else if (attr == "text") {
	                return el.nodeValue;
	            } else {
	                return null;
	            }
	        }
	        if (el.nodeType == 1) {
	            for (var key in attr) if (attr[has](key)) {
	                var val = Str(attr[key]);
	                if (val) {
	                    if (key.substring(0, 6) == "xlink:") {
	                        el.setAttributeNS(xlink, key.substring(6), val);
	                    } else if (key.substring(0, 4) == "xml:") {
	                        el.setAttributeNS(xmlns, key.substring(4), val);
	                    } else {
	                        el.setAttribute(key, val);
	                    }
	                } else {
	                    el.removeAttribute(key);
	                }
	            }
	        } else if ("text" in attr) {
	            el.nodeValue = attr.text;
	        }
	    } else {
	        el = glob.doc.createElementNS(xmlns, el);
	    }
	    return el;
	}
	Snap._.$ = $;
	Snap._.id = ID;
	function getAttrs(el) {
	    var attrs = el.attributes,
	        name,
	        out = {};
	    for (var i = 0; i < attrs.length; i++) {
	        if (attrs[i].namespaceURI == xlink) {
	            name = "xlink:";
	        } else {
	            name = "";
	        }
	        name += attrs[i].name;
	        out[name] = attrs[i].textContent;
	    }
	    return out;
	}
	function is(o, type) {
	    type = Str.prototype.toLowerCase.call(type);
	    if (type == "finite") {
	        return isFinite(o);
	    }
	    if (type == "array" &&
	        (o instanceof Array || Array.isArray && Array.isArray(o))) {
	        return true;
	    }
	    return  (type == "null" && o === null) ||
	            (type == typeof o && o !== null) ||
	            (type == "object" && o === Object(o)) ||
	            objectToString.call(o).slice(8, -1).toLowerCase() == type;
	}
	/*\
	 * Snap.format
	 [ method ]
	 **
	 * Replaces construction of type `{<name>}` to the corresponding argument
	 **
	 - token (string) string to format
	 - json (object) object which properties are used as a replacement
	 = (string) formatted string
	 > Usage
	 | // this draws a rectangular shape equivalent to "M10,20h40v50h-40z"
	 | paper.path(Snap.format("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
	 |     x: 10,
	 |     y: 20,
	 |     dim: {
	 |         width: 40,
	 |         height: 50,
	 |         "negative width": -40
	 |     }
	 | }));
	\*/
	Snap.format = (function () {
	    var tokenRegex = /\{([^\}]+)\}/g,
	        objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
	        replacer = function (all, key, obj) {
	            var res = obj;
	            key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
	                name = name || quotedName;
	                if (res) {
	                    if (name in res) {
	                        res = res[name];
	                    }
	                    typeof res == "function" && isFunc && (res = res());
	                }
	            });
	            res = (res == null || res == obj ? all : res) + "";
	            return res;
	        };
	    return function (str, obj) {
	        return Str(str).replace(tokenRegex, function (all, key) {
	            return replacer(all, key, obj);
	        });
	    };
	})();
	function clone(obj) {
	    if (typeof obj == "function" || Object(obj) !== obj) {
	        return obj;
	    }
	    var res = new obj.constructor;
	    for (var key in obj) if (obj[has](key)) {
	        res[key] = clone(obj[key]);
	    }
	    return res;
	}
	Snap._.clone = clone;
	function repush(array, item) {
	    for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
	        return array.push(array.splice(i, 1)[0]);
	    }
	}
	function cacher(f, scope, postprocessor) {
	    function newf() {
	        var arg = Array.prototype.slice.call(arguments, 0),
	            args = arg.join("\u2400"),
	            cache = newf.cache = newf.cache || {},
	            count = newf.count = newf.count || [];
	        if (cache[has](args)) {
	            repush(count, args);
	            return postprocessor ? postprocessor(cache[args]) : cache[args];
	        }
	        count.length >= 1e3 && delete cache[count.shift()];
	        count.push(args);
	        cache[args] = f.apply(scope, arg);
	        return postprocessor ? postprocessor(cache[args]) : cache[args];
	    }
	    return newf;
	}
	Snap._.cacher = cacher;
	function angle(x1, y1, x2, y2, x3, y3) {
	    if (x3 == null) {
	        var x = x1 - x2,
	            y = y1 - y2;
	        if (!x && !y) {
	            return 0;
	        }
	        return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
	    } else {
	        return angle(x1, y1, x3, y3) - angle(x2, y2, x3, y3);
	    }
	}
	function rad(deg) {
	    return deg % 360 * PI / 180;
	}
	function deg(rad) {
	    return rad * 180 / PI % 360;
	}
	function x_y() {
	    return this.x + S + this.y;
	}
	function x_y_w_h() {
	    return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
	}

	/*\
	 * Snap.rad
	 [ method ]
	 **
	 * Transform angle to radians
	 - deg (number) angle in degrees
	 = (number) angle in radians
	\*/
	Snap.rad = rad;
	/*\
	 * Snap.deg
	 [ method ]
	 **
	 * Transform angle to degrees
	 - rad (number) angle in radians
	 = (number) angle in degrees
	\*/
	Snap.deg = deg;
	/*\
	 * Snap.sin
	 [ method ]
	 **
	 * Equivalent to `Math.sin()` only works with degrees, not radians.
	 - angle (number) angle in degrees
	 = (number) sin
	\*/
	Snap.sin = function (angle) {
	    return math.sin(Snap.rad(angle));
	};
	/*\
	 * Snap.tan
	 [ method ]
	 **
	 * Equivalent to `Math.tan()` only works with degrees, not radians.
	 - angle (number) angle in degrees
	 = (number) tan
	\*/
	Snap.tan = function (angle) {
	    return math.tan(Snap.rad(angle));
	};
	/*\
	 * Snap.cos
	 [ method ]
	 **
	 * Equivalent to `Math.cos()` only works with degrees, not radians.
	 - angle (number) angle in degrees
	 = (number) cos
	\*/
	Snap.cos = function (angle) {
	    return math.cos(Snap.rad(angle));
	};
	/*\
	 * Snap.asin
	 [ method ]
	 **
	 * Equivalent to `Math.asin()` only works with degrees, not radians.
	 - num (number) value
	 = (number) asin in degrees
	\*/
	Snap.asin = function (num) {
	    return Snap.deg(math.asin(num));
	};
	/*\
	 * Snap.acos
	 [ method ]
	 **
	 * Equivalent to `Math.acos()` only works with degrees, not radians.
	 - num (number) value
	 = (number) acos in degrees
	\*/
	Snap.acos = function (num) {
	    return Snap.deg(math.acos(num));
	};
	/*\
	 * Snap.atan
	 [ method ]
	 **
	 * Equivalent to `Math.atan()` only works with degrees, not radians.
	 - num (number) value
	 = (number) atan in degrees
	\*/
	Snap.atan = function (num) {
	    return Snap.deg(math.atan(num));
	};
	/*\
	 * Snap.atan2
	 [ method ]
	 **
	 * Equivalent to `Math.atan2()` only works with degrees, not radians.
	 - num (number) value
	 = (number) atan2 in degrees
	\*/
	Snap.atan2 = function (num) {
	    return Snap.deg(math.atan2(num));
	};
	/*\
	 * Snap.angle
	 [ method ]
	 **
	 * Returns an angle between two or three points
	 > Parameters
	 - x1 (number) x coord of first point
	 - y1 (number) y coord of first point
	 - x2 (number) x coord of second point
	 - y2 (number) y coord of second point
	 - x3 (number) #optional x coord of third point
	 - y3 (number) #optional y coord of third point
	 = (number) angle in degrees
	\*/
	Snap.angle = angle;
	/*\
	 * Snap.len
	 [ method ]
	 **
	 * Returns distance between two points
	 > Parameters
	 - x1 (number) x coord of first point
	 - y1 (number) y coord of first point
	 - x2 (number) x coord of second point
	 - y2 (number) y coord of second point
	 = (number) distance
	\*/
	Snap.len = function (x1, y1, x2, y2) {
	    return Math.sqrt(Snap.len2(x1, y1, x2, y2));
	};
	/*\
	 * Snap.len2
	 [ method ]
	 **
	 * Returns squared distance between two points
	 > Parameters
	 - x1 (number) x coord of first point
	 - y1 (number) y coord of first point
	 - x2 (number) x coord of second point
	 - y2 (number) y coord of second point
	 = (number) distance
	\*/
	Snap.len2 = function (x1, y1, x2, y2) {
	    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	};
	/*\
	 * Snap.closestPoint
	 [ method ]
	 **
	 * Returns closest point to a given one on a given path.
	 > Parameters
	 - path (Element) path element
	 - x (number) x coord of a point
	 - y (number) y coord of a point
	 = (object) in format
	 {
	    x (number) x coord of the point on the path
	    y (number) y coord of the point on the path
	    length (number) length of the path to the point
	    distance (number) distance from the given point to the path
	 }
	\*/
	// Copied from http://bl.ocks.org/mbostock/8027637
	Snap.closestPoint = function (path, x, y) {
	    function distance2(p) {
	        var dx = p.x - x,
	            dy = p.y - y;
	        return dx * dx + dy * dy;
	    }
	    var pathNode = path.node,
	        pathLength = pathNode.getTotalLength(),
	        precision = pathLength / pathNode.pathSegList.numberOfItems * .125,
	        best,
	        bestLength,
	        bestDistance = Infinity;

	    // linear scan for coarse approximation
	    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
	        if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
	            best = scan, bestLength = scanLength, bestDistance = scanDistance;
	        }
	    }

	    // binary search for precise estimate
	    precision *= .5;
	    while (precision > .5) {
	        var before,
	            after,
	            beforeLength,
	            afterLength,
	            beforeDistance,
	            afterDistance;
	        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
	            best = before, bestLength = beforeLength, bestDistance = beforeDistance;
	        } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
	            best = after, bestLength = afterLength, bestDistance = afterDistance;
	        } else {
	            precision *= .5;
	        }
	    }

	    best = {
	        x: best.x,
	        y: best.y,
	        length: bestLength,
	        distance: Math.sqrt(bestDistance)
	    };
	    return best;
	}
	/*\
	 * Snap.is
	 [ method ]
	 **
	 * Handy replacement for the `typeof` operator
	 - o (…) any object or primitive
	 - type (string) name of the type, e.g., `string`, `function`, `number`, etc.
	 = (boolean) `true` if given value is of given type
	\*/
	Snap.is = is;
	/*\
	 * Snap.snapTo
	 [ method ]
	 **
	 * Snaps given value to given grid
	 - values (array|number) given array of values or step of the grid
	 - value (number) value to adjust
	 - tolerance (number) #optional maximum distance to the target value that would trigger the snap. Default is `10`.
	 = (number) adjusted value
	\*/
	Snap.snapTo = function (values, value, tolerance) {
	    tolerance = is(tolerance, "finite") ? tolerance : 10;
	    if (is(values, "array")) {
	        var i = values.length;
	        while (i--) if (abs(values[i] - value) <= tolerance) {
	            return values[i];
	        }
	    } else {
	        values = +values;
	        var rem = value % values;
	        if (rem < tolerance) {
	            return value - rem;
	        }
	        if (rem > values - tolerance) {
	            return value - rem + values;
	        }
	    }
	    return value;
	};
	// Colour
	/*\
	 * Snap.getRGB
	 [ method ]
	 **
	 * Parses color string as RGB object
	 - color (string) color string in one of the following formats:
	 # <ul>
	 #     <li>Color name (<code>red</code>, <code>green</code>, <code>cornflowerblue</code>, etc)</li>
	 #     <li>#••• — shortened HTML color: (<code>#000</code>, <code>#fc0</code>, etc.)</li>
	 #     <li>#•••••• — full length HTML color: (<code>#000000</code>, <code>#bd2300</code>)</li>
	 #     <li>rgb(•••, •••, •••) — red, green and blue channels values: (<code>rgb(200,&nbsp;100,&nbsp;0)</code>)</li>
	 #     <li>rgba(•••, •••, •••, •••) — also with opacity</li>
	 #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>)</li>
	 #     <li>rgba(•••%, •••%, •••%, •••%) — also with opacity</li>
	 #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>)</li>
	 #     <li>hsba(•••, •••, •••, •••) — also with opacity</li>
	 #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
	 #     <li>hsba(•••%, •••%, •••%, •••%) — also with opacity</li>
	 #     <li>hsl(•••, •••, •••) — hue, saturation and luminosity values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;0.5)</code>)</li>
	 #     <li>hsla(•••, •••, •••, •••) — also with opacity</li>
	 #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
	 #     <li>hsla(•••%, •••%, •••%, •••%) — also with opacity</li>
	 # </ul>
	 * Note that `%` can be used any time: `rgb(20%, 255, 50%)`.
	 = (object) RGB object in the following format:
	 o {
	 o     r (number) red,
	 o     g (number) green,
	 o     b (number) blue,
	 o     hex (string) color in HTML/CSS format: #••••••,
	 o     error (boolean) true if string can't be parsed
	 o }
	\*/
	Snap.getRGB = cacher(function (colour) {
	    if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
	        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
	    }
	    if (colour == "none") {
	        return {r: -1, g: -1, b: -1, hex: "none", toString: rgbtoString};
	    }
	    !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
	    if (!colour) {
	        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
	    }
	    var res,
	        red,
	        green,
	        blue,
	        opacity,
	        t,
	        values,
	        rgb = colour.match(colourRegExp);
	    if (rgb) {
	        if (rgb[2]) {
	            blue = toInt(rgb[2].substring(5), 16);
	            green = toInt(rgb[2].substring(3, 5), 16);
	            red = toInt(rgb[2].substring(1, 3), 16);
	        }
	        if (rgb[3]) {
	            blue = toInt((t = rgb[3].charAt(3)) + t, 16);
	            green = toInt((t = rgb[3].charAt(2)) + t, 16);
	            red = toInt((t = rgb[3].charAt(1)) + t, 16);
	        }
	        if (rgb[4]) {
	            values = rgb[4].split(commaSpaces);
	            red = toFloat(values[0]);
	            values[0].slice(-1) == "%" && (red *= 2.55);
	            green = toFloat(values[1]);
	            values[1].slice(-1) == "%" && (green *= 2.55);
	            blue = toFloat(values[2]);
	            values[2].slice(-1) == "%" && (blue *= 2.55);
	            rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
	            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
	        }
	        if (rgb[5]) {
	            values = rgb[5].split(commaSpaces);
	            red = toFloat(values[0]);
	            values[0].slice(-1) == "%" && (red /= 100);
	            green = toFloat(values[1]);
	            values[1].slice(-1) == "%" && (green /= 100);
	            blue = toFloat(values[2]);
	            values[2].slice(-1) == "%" && (blue /= 100);
	            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
	            rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
	            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
	            return Snap.hsb2rgb(red, green, blue, opacity);
	        }
	        if (rgb[6]) {
	            values = rgb[6].split(commaSpaces);
	            red = toFloat(values[0]);
	            values[0].slice(-1) == "%" && (red /= 100);
	            green = toFloat(values[1]);
	            values[1].slice(-1) == "%" && (green /= 100);
	            blue = toFloat(values[2]);
	            values[2].slice(-1) == "%" && (blue /= 100);
	            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
	            rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
	            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
	            return Snap.hsl2rgb(red, green, blue, opacity);
	        }
	        red = mmin(math.round(red), 255);
	        green = mmin(math.round(green), 255);
	        blue = mmin(math.round(blue), 255);
	        opacity = mmin(mmax(opacity, 0), 1);
	        rgb = {r: red, g: green, b: blue, toString: rgbtoString};
	        rgb.hex = "#" + (16777216 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
	        rgb.opacity = is(opacity, "finite") ? opacity : 1;
	        return rgb;
	    }
	    return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
	}, Snap);
	// SIERRA It seems odd that the following 3 conversion methods are not expressed as .this2that(), like the others.
	/*\
	 * Snap.hsb
	 [ method ]
	 **
	 * Converts HSB values to a hex representation of the color
	 - h (number) hue
	 - s (number) saturation
	 - b (number) value or brightness
	 = (string) hex representation of the color
	\*/
	Snap.hsb = cacher(function (h, s, b) {
	    return Snap.hsb2rgb(h, s, b).hex;
	});
	/*\
	 * Snap.hsl
	 [ method ]
	 **
	 * Converts HSL values to a hex representation of the color
	 - h (number) hue
	 - s (number) saturation
	 - l (number) luminosity
	 = (string) hex representation of the color
	\*/
	Snap.hsl = cacher(function (h, s, l) {
	    return Snap.hsl2rgb(h, s, l).hex;
	});
	/*\
	 * Snap.rgb
	 [ method ]
	 **
	 * Converts RGB values to a hex representation of the color
	 - r (number) red
	 - g (number) green
	 - b (number) blue
	 = (string) hex representation of the color
	\*/
	Snap.rgb = cacher(function (r, g, b, o) {
	    if (is(o, "finite")) {
	        var round = math.round;
	        return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
	    }
	    return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
	});
	var toHex = function (color) {
	    var i = glob.doc.getElementsByTagName("head")[0] || glob.doc.getElementsByTagName("svg")[0],
	        red = "rgb(255, 0, 0)";
	    toHex = cacher(function (color) {
	        if (color.toLowerCase() == "red") {
	            return red;
	        }
	        i.style.color = red;
	        i.style.color = color;
	        var out = glob.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
	        return out == red ? null : out;
	    });
	    return toHex(color);
	},
	hsbtoString = function () {
	    return "hsb(" + [this.h, this.s, this.b] + ")";
	},
	hsltoString = function () {
	    return "hsl(" + [this.h, this.s, this.l] + ")";
	},
	rgbtoString = function () {
	    return this.opacity == 1 || this.opacity == null ?
	            this.hex :
	            "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
	},
	prepareRGB = function (r, g, b) {
	    if (g == null && is(r, "object") && "r" in r && "g" in r && "b" in r) {
	        b = r.b;
	        g = r.g;
	        r = r.r;
	    }
	    if (g == null && is(r, string)) {
	        var clr = Snap.getRGB(r);
	        r = clr.r;
	        g = clr.g;
	        b = clr.b;
	    }
	    if (r > 1 || g > 1 || b > 1) {
	        r /= 255;
	        g /= 255;
	        b /= 255;
	    }
	    
	    return [r, g, b];
	},
	packageRGB = function (r, g, b, o) {
	    r = math.round(r * 255);
	    g = math.round(g * 255);
	    b = math.round(b * 255);
	    var rgb = {
	        r: r,
	        g: g,
	        b: b,
	        opacity: is(o, "finite") ? o : 1,
	        hex: Snap.rgb(r, g, b),
	        toString: rgbtoString
	    };
	    is(o, "finite") && (rgb.opacity = o);
	    return rgb;
	};
	/*\
	 * Snap.color
	 [ method ]
	 **
	 * Parses the color string and returns an object featuring the color's component values
	 - clr (string) color string in one of the supported formats (see @Snap.getRGB)
	 = (object) Combined RGB/HSB object in the following format:
	 o {
	 o     r (number) red,
	 o     g (number) green,
	 o     b (number) blue,
	 o     hex (string) color in HTML/CSS format: #••••••,
	 o     error (boolean) `true` if string can't be parsed,
	 o     h (number) hue,
	 o     s (number) saturation,
	 o     v (number) value (brightness),
	 o     l (number) lightness
	 o }
	\*/
	Snap.color = function (clr) {
	    var rgb;
	    if (is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
	        rgb = Snap.hsb2rgb(clr);
	        clr.r = rgb.r;
	        clr.g = rgb.g;
	        clr.b = rgb.b;
	        clr.opacity = 1;
	        clr.hex = rgb.hex;
	    } else if (is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
	        rgb = Snap.hsl2rgb(clr);
	        clr.r = rgb.r;
	        clr.g = rgb.g;
	        clr.b = rgb.b;
	        clr.opacity = 1;
	        clr.hex = rgb.hex;
	    } else {
	        if (is(clr, "string")) {
	            clr = Snap.getRGB(clr);
	        }
	        if (is(clr, "object") && "r" in clr && "g" in clr && "b" in clr && !("error" in clr)) {
	            rgb = Snap.rgb2hsl(clr);
	            clr.h = rgb.h;
	            clr.s = rgb.s;
	            clr.l = rgb.l;
	            rgb = Snap.rgb2hsb(clr);
	            clr.v = rgb.b;
	        } else {
	            clr = {hex: "none"};
	            clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
	            clr.error = 1;
	        }
	    }
	    clr.toString = rgbtoString;
	    return clr;
	};
	/*\
	 * Snap.hsb2rgb
	 [ method ]
	 **
	 * Converts HSB values to an RGB object
	 - h (number) hue
	 - s (number) saturation
	 - v (number) value or brightness
	 = (object) RGB object in the following format:
	 o {
	 o     r (number) red,
	 o     g (number) green,
	 o     b (number) blue,
	 o     hex (string) color in HTML/CSS format: #••••••
	 o }
	\*/
	Snap.hsb2rgb = function (h, s, v, o) {
	    if (is(h, "object") && "h" in h && "s" in h && "b" in h) {
	        v = h.b;
	        s = h.s;
	        o = h.o;
	        h = h.h;
	    }
	    h *= 360;
	    var R, G, B, X, C;
	    h = (h % 360) / 60;
	    C = v * s;
	    X = C * (1 - abs(h % 2 - 1));
	    R = G = B = v - C;

	    h = ~~h;
	    R += [C, X, 0, 0, X, C][h];
	    G += [X, C, C, X, 0, 0][h];
	    B += [0, 0, X, C, C, X][h];
	    return packageRGB(R, G, B, o);
	};
	/*\
	 * Snap.hsl2rgb
	 [ method ]
	 **
	 * Converts HSL values to an RGB object
	 - h (number) hue
	 - s (number) saturation
	 - l (number) luminosity
	 = (object) RGB object in the following format:
	 o {
	 o     r (number) red,
	 o     g (number) green,
	 o     b (number) blue,
	 o     hex (string) color in HTML/CSS format: #••••••
	 o }
	\*/
	Snap.hsl2rgb = function (h, s, l, o) {
	    if (is(h, "object") && "h" in h && "s" in h && "l" in h) {
	        l = h.l;
	        s = h.s;
	        h = h.h;
	    }
	    if (h > 1 || s > 1 || l > 1) {
	        h /= 360;
	        s /= 100;
	        l /= 100;
	    }
	    h *= 360;
	    var R, G, B, X, C;
	    h = (h % 360) / 60;
	    C = 2 * s * (l < .5 ? l : 1 - l);
	    X = C * (1 - abs(h % 2 - 1));
	    R = G = B = l - C / 2;

	    h = ~~h;
	    R += [C, X, 0, 0, X, C][h];
	    G += [X, C, C, X, 0, 0][h];
	    B += [0, 0, X, C, C, X][h];
	    return packageRGB(R, G, B, o);
	};
	/*\
	 * Snap.rgb2hsb
	 [ method ]
	 **
	 * Converts RGB values to an HSB object
	 - r (number) red
	 - g (number) green
	 - b (number) blue
	 = (object) HSB object in the following format:
	 o {
	 o     h (number) hue,
	 o     s (number) saturation,
	 o     b (number) brightness
	 o }
	\*/
	Snap.rgb2hsb = function (r, g, b) {
	    b = prepareRGB(r, g, b);
	    r = b[0];
	    g = b[1];
	    b = b[2];

	    var H, S, V, C;
	    V = mmax(r, g, b);
	    C = V - mmin(r, g, b);
	    H = (C == 0 ? null :
	         V == r ? (g - b) / C :
	         V == g ? (b - r) / C + 2 :
	                  (r - g) / C + 4
	        );
	    H = ((H + 360) % 6) * 60 / 360;
	    S = C == 0 ? 0 : C / V;
	    return {h: H, s: S, b: V, toString: hsbtoString};
	};
	/*\
	 * Snap.rgb2hsl
	 [ method ]
	 **
	 * Converts RGB values to an HSL object
	 - r (number) red
	 - g (number) green
	 - b (number) blue
	 = (object) HSL object in the following format:
	 o {
	 o     h (number) hue,
	 o     s (number) saturation,
	 o     l (number) luminosity
	 o }
	\*/
	Snap.rgb2hsl = function (r, g, b) {
	    b = prepareRGB(r, g, b);
	    r = b[0];
	    g = b[1];
	    b = b[2];

	    var H, S, L, M, m, C;
	    M = mmax(r, g, b);
	    m = mmin(r, g, b);
	    C = M - m;
	    H = (C == 0 ? null :
	         M == r ? (g - b) / C :
	         M == g ? (b - r) / C + 2 :
	                  (r - g) / C + 4);
	    H = ((H + 360) % 6) * 60 / 360;
	    L = (M + m) / 2;
	    S = (C == 0 ? 0 :
	         L < .5 ? C / (2 * L) :
	                  C / (2 - 2 * L));
	    return {h: H, s: S, l: L, toString: hsltoString};
	};

	// Transformations
	// SIERRA Snap.parsePathString(): By _array of arrays,_ I assume you mean a format like this for two separate segments? [ ["M10,10","L90,90"], ["M90,10","L10,90"] ] Otherwise how is each command structured?
	/*\
	 * Snap.parsePathString
	 [ method ]
	 **
	 * Utility method
	 **
	 * Parses given path string into an array of arrays of path segments
	 - pathString (string|array) path string or array of segments (in the last case it is returned straight away)
	 = (array) array of segments
	\*/
	Snap.parsePathString = function (pathString) {
	    if (!pathString) {
	        return null;
	    }
	    var pth = Snap.path(pathString);
	    if (pth.arr) {
	        return Snap.path.clone(pth.arr);
	    }
	    
	    var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
	        data = [];
	    if (is(pathString, "array") && is(pathString[0], "array")) { // rough assumption
	        data = Snap.path.clone(pathString);
	    }
	    if (!data.length) {
	        Str(pathString).replace(pathCommand, function (a, b, c) {
	            var params = [],
	                name = b.toLowerCase();
	            c.replace(pathValues, function (a, b) {
	                b && params.push(+b);
	            });
	            if (name == "m" && params.length > 2) {
	                data.push([b].concat(params.splice(0, 2)));
	                name = "l";
	                b = b == "m" ? "l" : "L";
	            }
	            if (name == "o" && params.length == 1) {
	                data.push([b, params[0]]);
	            }
	            if (name == "r") {
	                data.push([b].concat(params));
	            } else while (params.length >= paramCounts[name]) {
	                data.push([b].concat(params.splice(0, paramCounts[name])));
	                if (!paramCounts[name]) {
	                    break;
	                }
	            }
	        });
	    }
	    data.toString = Snap.path.toString;
	    pth.arr = Snap.path.clone(data);
	    return data;
	};
	/*\
	 * Snap.parseTransformString
	 [ method ]
	 **
	 * Utility method
	 **
	 * Parses given transform string into an array of transformations
	 - TString (string|array) transform string or array of transformations (in the last case it is returned straight away)
	 = (array) array of transformations
	\*/
	var parseTransformString = Snap.parseTransformString = function (TString) {
	    if (!TString) {
	        return null;
	    }
	    var paramCounts = {r: 3, s: 4, t: 2, m: 6},
	        data = [];
	    if (is(TString, "array") && is(TString[0], "array")) { // rough assumption
	        data = Snap.path.clone(TString);
	    }
	    if (!data.length) {
	        Str(TString).replace(tCommand, function (a, b, c) {
	            var params = [],
	                name = b.toLowerCase();
	            c.replace(pathValues, function (a, b) {
	                b && params.push(+b);
	            });
	            data.push([b].concat(params));
	        });
	    }
	    data.toString = Snap.path.toString;
	    return data;
	};
	function svgTransform2string(tstr) {
	    var res = [];
	    tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
	        params = params.split(/\s*,\s*|\s+/);
	        if (name == "rotate" && params.length == 1) {
	            params.push(0, 0);
	        }
	        if (name == "scale") {
	            if (params.length > 2) {
	                params = params.slice(0, 2);
	            } else if (params.length == 2) {
	                params.push(0, 0);
	            }
	            if (params.length == 1) {
	                params.push(params[0], 0, 0);
	            }
	        }
	        if (name == "skewX") {
	            res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
	        } else if (name == "skewY") {
	            res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
	        } else {
	            res.push([name.charAt(0)].concat(params));
	        }
	        return all;
	    });
	    return res;
	}
	Snap._.svgTransform2string = svgTransform2string;
	Snap._.rgTransform = /^[a-z][\s]*-?\.?\d/i;
	function transform2matrix(tstr, bbox) {
	    var tdata = parseTransformString(tstr),
	        m = new Snap.Matrix;
	    if (tdata) {
	        for (var i = 0, ii = tdata.length; i < ii; i++) {
	            var t = tdata[i],
	                tlen = t.length,
	                command = Str(t[0]).toLowerCase(),
	                absolute = t[0] != command,
	                inver = absolute ? m.invert() : 0,
	                x1,
	                y1,
	                x2,
	                y2,
	                bb;
	            if (command == "t" && tlen == 2){
	                m.translate(t[1], 0);
	            } else if (command == "t" && tlen == 3) {
	                if (absolute) {
	                    x1 = inver.x(0, 0);
	                    y1 = inver.y(0, 0);
	                    x2 = inver.x(t[1], t[2]);
	                    y2 = inver.y(t[1], t[2]);
	                    m.translate(x2 - x1, y2 - y1);
	                } else {
	                    m.translate(t[1], t[2]);
	                }
	            } else if (command == "r") {
	                if (tlen == 2) {
	                    bb = bb || bbox;
	                    m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
	                } else if (tlen == 4) {
	                    if (absolute) {
	                        x2 = inver.x(t[2], t[3]);
	                        y2 = inver.y(t[2], t[3]);
	                        m.rotate(t[1], x2, y2);
	                    } else {
	                        m.rotate(t[1], t[2], t[3]);
	                    }
	                }
	            } else if (command == "s") {
	                if (tlen == 2 || tlen == 3) {
	                    bb = bb || bbox;
	                    m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
	                } else if (tlen == 4) {
	                    if (absolute) {
	                        x2 = inver.x(t[2], t[3]);
	                        y2 = inver.y(t[2], t[3]);
	                        m.scale(t[1], t[1], x2, y2);
	                    } else {
	                        m.scale(t[1], t[1], t[2], t[3]);
	                    }
	                } else if (tlen == 5) {
	                    if (absolute) {
	                        x2 = inver.x(t[3], t[4]);
	                        y2 = inver.y(t[3], t[4]);
	                        m.scale(t[1], t[2], x2, y2);
	                    } else {
	                        m.scale(t[1], t[2], t[3], t[4]);
	                    }
	                }
	            } else if (command == "m" && tlen == 7) {
	                m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
	            }
	        }
	    }
	    return m;
	}
	Snap._.transform2matrix = transform2matrix;
	Snap._unit2px = unit2px;
	var contains = glob.doc.contains || glob.doc.compareDocumentPosition ?
	    function (a, b) {
	        var adown = a.nodeType == 9 ? a.documentElement : a,
	            bup = b && b.parentNode;
	            return a == bup || !!(bup && bup.nodeType == 1 && (
	                adown.contains ?
	                    adown.contains(bup) :
	                    a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
	            ));
	    } :
	    function (a, b) {
	        if (b) {
	            while (b) {
	                b = b.parentNode;
	                if (b == a) {
	                    return true;
	                }
	            }
	        }
	        return false;
	    };
	function getSomeDefs(el) {
	    var p = (el.node.ownerSVGElement && wrap(el.node.ownerSVGElement)) ||
	            (el.node.parentNode && wrap(el.node.parentNode)) ||
	            Snap.select("svg") ||
	            Snap(0, 0),
	        pdefs = p.select("defs"),
	        defs  = pdefs == null ? false : pdefs.node;
	    if (!defs) {
	        defs = make("defs", p.node).node;
	    }
	    return defs;
	}
	function getSomeSVG(el) {
	    return el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || Snap.select("svg");
	}
	Snap._.getSomeDefs = getSomeDefs;
	Snap._.getSomeSVG = getSomeSVG;
	function unit2px(el, name, value) {
	    var svg = getSomeSVG(el).node,
	        out = {},
	        mgr = svg.querySelector(".svg---mgr");
	    if (!mgr) {
	        mgr = $("rect");
	        $(mgr, {x: -9e9, y: -9e9, width: 10, height: 10, "class": "svg---mgr", fill: "none"});
	        svg.appendChild(mgr);
	    }
	    function getW(val) {
	        if (val == null) {
	            return E;
	        }
	        if (val == +val) {
	            return val;
	        }
	        $(mgr, {width: val});
	        try {
	            return mgr.getBBox().width;
	        } catch (e) {
	            return 0;
	        }
	    }
	    function getH(val) {
	        if (val == null) {
	            return E;
	        }
	        if (val == +val) {
	            return val;
	        }
	        $(mgr, {height: val});
	        try {
	            return mgr.getBBox().height;
	        } catch (e) {
	            return 0;
	        }
	    }
	    function set(nam, f) {
	        if (name == null) {
	            out[nam] = f(el.attr(nam) || 0);
	        } else if (nam == name) {
	            out = f(value == null ? el.attr(nam) || 0 : value);
	        }
	    }
	    switch (el.type) {
	        case "rect":
	            set("rx", getW);
	            set("ry", getH);
	        case "image":
	            set("width", getW);
	            set("height", getH);
	        case "text":
	            set("x", getW);
	            set("y", getH);
	        break;
	        case "circle":
	            set("cx", getW);
	            set("cy", getH);
	            set("r", getW);
	        break;
	        case "ellipse":
	            set("cx", getW);
	            set("cy", getH);
	            set("rx", getW);
	            set("ry", getH);
	        break;
	        case "line":
	            set("x1", getW);
	            set("x2", getW);
	            set("y1", getH);
	            set("y2", getH);
	        break;
	        case "marker":
	            set("refX", getW);
	            set("markerWidth", getW);
	            set("refY", getH);
	            set("markerHeight", getH);
	        break;
	        case "radialGradient":
	            set("fx", getW);
	            set("fy", getH);
	        break;
	        case "tspan":
	            set("dx", getW);
	            set("dy", getH);
	        break;
	        default:
	            set(name, getW);
	    }
	    svg.removeChild(mgr);
	    return out;
	}
	/*\
	 * Snap.select
	 [ method ]
	 **
	 * Wraps a DOM element specified by CSS selector as @Element
	 - query (string) CSS selector of the element
	 = (Element) the current element
	\*/
	Snap.select = function (query) {
	    query = Str(query).replace(/([^\\]):/g, "$1\\:");
	    return wrap(glob.doc.querySelector(query));
	};
	/*\
	 * Snap.selectAll
	 [ method ]
	 **
	 * Wraps DOM elements specified by CSS selector as set or array of @Element
	 - query (string) CSS selector of the element
	 = (Element) the current element
	\*/
	Snap.selectAll = function (query) {
	    var nodelist = glob.doc.querySelectorAll(query),
	        set = (Snap.set || Array)();
	    for (var i = 0; i < nodelist.length; i++) {
	        set.push(wrap(nodelist[i]));
	    }
	    return set;
	};

	function add2group(list) {
	    if (!is(list, "array")) {
	        list = Array.prototype.slice.call(arguments, 0);
	    }
	    var i = 0,
	        j = 0,
	        node = this.node;
	    while (this[i]) delete this[i++];
	    for (i = 0; i < list.length; i++) {
	        if (list[i].type == "set") {
	            list[i].forEach(function (el) {
	                node.appendChild(el.node);
	            });
	        } else {
	            node.appendChild(list[i].node);
	        }
	    }
	    var children = node.childNodes;
	    for (i = 0; i < children.length; i++) {
	        this[j++] = wrap(children[i]);
	    }
	    return this;
	}
	// Hub garbage collector every 10s
	setInterval(function () {
	    for (var key in hub) if (hub[has](key)) {
	        var el = hub[key],
	            node = el.node;
	        if (el.type != "svg" && !node.ownerSVGElement || el.type == "svg" && (!node.parentNode || "ownerSVGElement" in node.parentNode && !node.ownerSVGElement)) {
	            delete hub[key];
	        }
	    }
	}, 1e4);
	function Element(el) {
	    if (el.snap in hub) {
	        return hub[el.snap];
	    }
	    var svg;
	    try {
	        svg = el.ownerSVGElement;
	    } catch(e) {}
	    /*\
	     * Element.node
	     [ property (object) ]
	     **
	     * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
	     > Usage
	     | // draw a circle at coordinate 10,10 with radius of 10
	     | var c = paper.circle(10, 10, 10);
	     | c.node.onclick = function () {
	     |     c.attr("fill", "red");
	     | };
	    \*/
	    this.node = el;
	    if (svg) {
	        this.paper = new Paper(svg);
	    }
	    /*\
	     * Element.type
	     [ property (string) ]
	     **
	     * SVG tag name of the given element.
	    \*/
	    this.type = el.tagName || el.nodeName;
	    var id = this.id = ID(this);
	    this.anims = {};
	    this._ = {
	        transform: []
	    };
	    el.snap = id;
	    hub[id] = this;
	    if (this.type == "g") {
	        this.add = add2group;
	    }
	    if (this.type in {g: 1, mask: 1, pattern: 1, symbol: 1}) {
	        for (var method in Paper.prototype) if (Paper.prototype[has](method)) {
	            this[method] = Paper.prototype[method];
	        }
	    }
	}
	   /*\
	     * Element.attr
	     [ method ]
	     **
	     * Gets or sets given attributes of the element.
	     **
	     - params (object) contains key-value pairs of attributes you want to set
	     * or
	     - param (string) name of the attribute
	     = (Element) the current element
	     * or
	     = (string) value of attribute
	     > Usage
	     | el.attr({
	     |     fill: "#fc0",
	     |     stroke: "#000",
	     |     strokeWidth: 2, // CamelCase...
	     |     "fill-opacity": 0.5, // or dash-separated names
	     |     width: "*=2" // prefixed values
	     | });
	     | console.log(el.attr("fill")); // #fc0
	     * Prefixed values in format `"+=10"` supported. All four operations
	     * (`+`, `-`, `*` and `/`) could be used. Optionally you can use units for `+`
	     * and `-`: `"+=2em"`.
	    \*/
	    Element.prototype.attr = function (params, value) {
	        var el = this,
	            node = el.node;
	        if (!params) {
	            if (node.nodeType != 1) {
	                return {
	                    text: node.nodeValue
	                };
	            }
	            var attr = node.attributes,
	                out = {};
	            for (var i = 0, ii = attr.length; i < ii; i++) {
	                out[attr[i].nodeName] = attr[i].nodeValue;
	            }
	            return out;
	        }
	        if (is(params, "string")) {
	            if (arguments.length > 1) {
	                var json = {};
	                json[params] = value;
	                params = json;
	            } else {
	                return eve("snap.util.getattr." + params, el).firstDefined();
	            }
	        }
	        for (var att in params) {
	            if (params[has](att)) {
	                eve("snap.util.attr." + att, el, params[att]);
	            }
	        }
	        return el;
	    };
	/*\
	 * Snap.parse
	 [ method ]
	 **
	 * Parses SVG fragment and converts it into a @Fragment
	 **
	 - svg (string) SVG string
	 = (Fragment) the @Fragment
	\*/
	Snap.parse = function (svg) {
	    var f = glob.doc.createDocumentFragment(),
	        full = true,
	        div = glob.doc.createElement("div");
	    svg = Str(svg);
	    if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
	        svg = "<svg>" + svg + "</svg>";
	        full = false;
	    }
	    div.innerHTML = svg;
	    svg = div.getElementsByTagName("svg")[0];
	    if (svg) {
	        if (full) {
	            f = svg;
	        } else {
	            while (svg.firstChild) {
	                f.appendChild(svg.firstChild);
	            }
	        }
	    }
	    return new Fragment(f);
	};
	function Fragment(frag) {
	    this.node = frag;
	}
	// SIERRA Snap.fragment() could especially use a code example
	/*\
	 * Snap.fragment
	 [ method ]
	 **
	 * Creates a DOM fragment from a given list of elements or strings
	 **
	 - varargs (…) SVG string
	 = (Fragment) the @Fragment
	\*/
	Snap.fragment = function () {
	    var args = Array.prototype.slice.call(arguments, 0),
	        f = glob.doc.createDocumentFragment();
	    for (var i = 0, ii = args.length; i < ii; i++) {
	        var item = args[i];
	        if (item.node && item.node.nodeType) {
	            f.appendChild(item.node);
	        }
	        if (item.nodeType) {
	            f.appendChild(item);
	        }
	        if (typeof item == "string") {
	            f.appendChild(Snap.parse(item).node);
	        }
	    }
	    return new Fragment(f);
	};

	function make(name, parent) {
	    var res = $(name);
	    parent.appendChild(res);
	    var el = wrap(res);
	    return el;
	}
	function Paper(w, h) {
	    var res,
	        desc,
	        defs,
	        proto = Paper.prototype;
	    if (w && w.tagName == "svg") {
	        if (w.snap in hub) {
	            return hub[w.snap];
	        }
	        var doc = w.ownerDocument;
	        res = new Element(w);
	        desc = w.getElementsByTagName("desc")[0];
	        defs = w.getElementsByTagName("defs")[0];
	        if (!desc) {
	            desc = $("desc");
	            desc.appendChild(doc.createTextNode("Created with Snap"));
	            res.node.appendChild(desc);
	        }
	        if (!defs) {
	            defs = $("defs");
	            res.node.appendChild(defs);
	        }
	        res.defs = defs;
	        for (var key in proto) if (proto[has](key)) {
	            res[key] = proto[key];
	        }
	        res.paper = res.root = res;
	    } else {
	        res = make("svg", glob.doc.body);
	        $(res.node, {
	            height: h,
	            version: 1.1,
	            width: w,
	            xmlns: xmlns
	        });
	    }
	    return res;
	}
	function wrap(dom) {
	    if (!dom) {
	        return dom;
	    }
	    if (dom instanceof Element || dom instanceof Fragment) {
	        return dom;
	    }
	    if (dom.tagName && dom.tagName.toLowerCase() == "svg") {
	        return new Paper(dom);
	    }
	    if (dom.tagName && dom.tagName.toLowerCase() == "object" && dom.type == "image/svg+xml") {
	        return new Paper(dom.contentDocument.getElementsByTagName("svg")[0]);
	    }
	    return new Element(dom);
	}

	Snap._.make = make;
	Snap._.wrap = wrap;
	/*\
	 * Paper.el
	 [ method ]
	 **
	 * Creates an element on paper with a given name and no attributes
	 **
	 - name (string) tag name
	 - attr (object) attributes
	 = (Element) the current element
	 > Usage
	 | var c = paper.circle(10, 10, 10); // is the same as...
	 | var c = paper.el("circle").attr({
	 |     cx: 10,
	 |     cy: 10,
	 |     r: 10
	 | });
	 | // and the same as
	 | var c = paper.el("circle", {
	 |     cx: 10,
	 |     cy: 10,
	 |     r: 10
	 | });
	\*/
	Paper.prototype.el = function (name, attr) {
	    var el = make(name, this.node);
	    attr && el.attr(attr);
	    return el;
	};
	/*\
	 * Element.children
	 [ method ]
	 **
	 * Returns array of all the children of the element.
	 = (array) array of Elements
	\*/
	Element.prototype.children = function () {
	    var out = [],
	        ch = this.node.childNodes;
	    for (var i = 0, ii = ch.length; i < ii; i++) {
	        out[i] = Snap(ch[i]);
	    }
	    return out;
	};
	function jsonFiller(root, o) {
	    for (var i = 0, ii = root.length; i < ii; i++) {
	        var item = {
	                type: root[i].type,
	                attr: root[i].attr()
	            },
	            children = root[i].children();
	        o.push(item);
	        if (children.length) {
	            jsonFiller(children, item.childNodes = []);
	        }
	    }
	}
	/*\
	 * Element.toJSON
	 [ method ]
	 **
	 * Returns object representation of the given element and all its children.
	 = (object) in format
	 o {
	 o     type (string) this.type,
	 o     attr (object) attributes map,
	 o     childNodes (array) optional array of children in the same format
	 o }
	\*/
	Element.prototype.toJSON = function () {
	    var out = [];
	    jsonFiller([this], out);
	    return out[0];
	};
	// default
	eve.on("snap.util.getattr", function () {
	    var att = eve.nt();
	    att = att.substring(att.lastIndexOf(".") + 1);
	    var css = att.replace(/[A-Z]/g, function (letter) {
	        return "-" + letter.toLowerCase();
	    });
	    if (cssAttr[has](css)) {
	        return this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(css);
	    } else {
	        return $(this.node, att);
	    }
	});
	var cssAttr = {
	    "alignment-baseline": 0,
	    "baseline-shift": 0,
	    "clip": 0,
	    "clip-path": 0,
	    "clip-rule": 0,
	    "color": 0,
	    "color-interpolation": 0,
	    "color-interpolation-filters": 0,
	    "color-profile": 0,
	    "color-rendering": 0,
	    "cursor": 0,
	    "direction": 0,
	    "display": 0,
	    "dominant-baseline": 0,
	    "enable-background": 0,
	    "fill": 0,
	    "fill-opacity": 0,
	    "fill-rule": 0,
	    "filter": 0,
	    "flood-color": 0,
	    "flood-opacity": 0,
	    "font": 0,
	    "font-family": 0,
	    "font-size": 0,
	    "font-size-adjust": 0,
	    "font-stretch": 0,
	    "font-style": 0,
	    "font-variant": 0,
	    "font-weight": 0,
	    "glyph-orientation-horizontal": 0,
	    "glyph-orientation-vertical": 0,
	    "image-rendering": 0,
	    "kerning": 0,
	    "letter-spacing": 0,
	    "lighting-color": 0,
	    "marker": 0,
	    "marker-end": 0,
	    "marker-mid": 0,
	    "marker-start": 0,
	    "mask": 0,
	    "opacity": 0,
	    "overflow": 0,
	    "pointer-events": 0,
	    "shape-rendering": 0,
	    "stop-color": 0,
	    "stop-opacity": 0,
	    "stroke": 0,
	    "stroke-dasharray": 0,
	    "stroke-dashoffset": 0,
	    "stroke-linecap": 0,
	    "stroke-linejoin": 0,
	    "stroke-miterlimit": 0,
	    "stroke-opacity": 0,
	    "stroke-width": 0,
	    "text-anchor": 0,
	    "text-decoration": 0,
	    "text-rendering": 0,
	    "unicode-bidi": 0,
	    "visibility": 0,
	    "word-spacing": 0,
	    "writing-mode": 0
	};

	eve.on("snap.util.attr", function (value) {
	    var att = eve.nt(),
	        attr = {};
	    att = att.substring(att.lastIndexOf(".") + 1);
	    attr[att] = value;
	    var style = att.replace(/-(\w)/gi, function (all, letter) {
	            return letter.toUpperCase();
	        }),
	        css = att.replace(/[A-Z]/g, function (letter) {
	            return "-" + letter.toLowerCase();
	        });
	    if (cssAttr[has](css)) {
	        this.node.style[style] = value == null ? E : value;
	    } else {
	        $(this.node, attr);
	    }
	});
	(function (proto) {}(Paper.prototype));

	// simple ajax
	/*\
	 * Snap.ajax
	 [ method ]
	 **
	 * Simple implementation of Ajax
	 **
	 - url (string) URL
	 - postData (object|string) data for post request
	 - callback (function) callback
	 - scope (object) #optional scope of callback
	 * or
	 - url (string) URL
	 - callback (function) callback
	 - scope (object) #optional scope of callback
	 = (XMLHttpRequest) the XMLHttpRequest object, just in case
	\*/
	Snap.ajax = function (url, postData, callback, scope){
	    var req = new XMLHttpRequest,
	        id = ID();
	    if (req) {
	        if (is(postData, "function")) {
	            scope = callback;
	            callback = postData;
	            postData = null;
	        } else if (is(postData, "object")) {
	            var pd = [];
	            for (var key in postData) if (postData.hasOwnProperty(key)) {
	                pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
	            }
	            postData = pd.join("&");
	        }
	        req.open((postData ? "POST" : "GET"), url, true);
	        if (postData) {
	            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	        }
	        if (callback) {
	            eve.once("snap.ajax." + id + ".0", callback);
	            eve.once("snap.ajax." + id + ".200", callback);
	            eve.once("snap.ajax." + id + ".304", callback);
	        }
	        req.onreadystatechange = function() {
	            if (req.readyState != 4) return;
	            eve("snap.ajax." + id + "." + req.status, scope, req);
	        };
	        if (req.readyState == 4) {
	            return req;
	        }
	        req.send(postData);
	        return req;
	    }
	};
	/*\
	 * Snap.load
	 [ method ]
	 **
	 * Loads external SVG file as a @Fragment (see @Snap.ajax for more advanced AJAX)
	 **
	 - url (string) URL
	 - callback (function) callback
	 - scope (object) #optional scope of callback
	\*/
	Snap.load = function (url, callback, scope) {
	    Snap.ajax(url, function (req) {
	        var f = Snap.parse(req.responseText);
	        scope ? callback.call(scope, f) : callback(f);
	    });
	};
	var getOffset = function (elem) {
	    var box = elem.getBoundingClientRect(),
	        doc = elem.ownerDocument,
	        body = doc.body,
	        docElem = doc.documentElement,
	        clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
	        top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
	        left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
	    return {
	        y: top,
	        x: left
	    };
	};
	/*\
	 * Snap.getElementByPoint
	 [ method ]
	 **
	 * Returns you topmost element under given point.
	 **
	 = (object) Snap element object
	 - x (number) x coordinate from the top left corner of the window
	 - y (number) y coordinate from the top left corner of the window
	 > Usage
	 | Snap.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
	\*/
	Snap.getElementByPoint = function (x, y) {
	    var paper = this,
	        svg = paper.canvas,
	        target = glob.doc.elementFromPoint(x, y);
	    if (glob.win.opera && target.tagName == "svg") {
	        var so = getOffset(target),
	            sr = target.createSVGRect();
	        sr.x = x - so.x;
	        sr.y = y - so.y;
	        sr.width = sr.height = 1;
	        var hits = target.getIntersectionList(sr, null);
	        if (hits.length) {
	            target = hits[hits.length - 1];
	        }
	    }
	    if (!target) {
	        return null;
	    }
	    return wrap(target);
	};
	/*\
	 * Snap.plugin
	 [ method ]
	 **
	 * Let you write plugins. You pass in a function with five arguments, like this:
	 | Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
	 |     Snap.newmethod = function () {};
	 |     Element.prototype.newmethod = function () {};
	 |     Paper.prototype.newmethod = function () {};
	 | });
	 * Inside the function you have access to all main objects (and their
	 * prototypes). This allow you to extend anything you want.
	 **
	 - f (function) your plugin body
	\*/
	Snap.plugin = function (f) {
	    f(Snap, Element, Paper, glob, Fragment);
	};
	glob.win.Snap = Snap;
	return Snap;
	}(window || this));

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var elproto = Element.prototype,
	        is = Snap.is,
	        Str = String,
	        unit2px = Snap._unit2px,
	        $ = Snap._.$,
	        make = Snap._.make,
	        getSomeDefs = Snap._.getSomeDefs,
	        has = "hasOwnProperty",
	        wrap = Snap._.wrap;
	    /*\
	     * Element.getBBox
	     [ method ]
	     **
	     * Returns the bounding box descriptor for the given element
	     **
	     = (object) bounding box descriptor:
	     o {
	     o     cx: (number) x of the center,
	     o     cy: (number) x of the center,
	     o     h: (number) height,
	     o     height: (number) height,
	     o     path: (string) path command for the box,
	     o     r0: (number) radius of a circle that fully encloses the box,
	     o     r1: (number) radius of the smallest circle that can be enclosed,
	     o     r2: (number) radius of the largest circle that can be enclosed,
	     o     vb: (string) box as a viewbox command,
	     o     w: (number) width,
	     o     width: (number) width,
	     o     x2: (number) x of the right side,
	     o     x: (number) x of the left side,
	     o     y2: (number) y of the bottom edge,
	     o     y: (number) y of the top edge
	     o }
	    \*/
	    elproto.getBBox = function (isWithoutTransform) {
	        if (!Snap.Matrix || !Snap.path) {
	            return this.node.getBBox();
	        }
	        var el = this,
	            m = new Snap.Matrix;
	        if (el.removed) {
	            return Snap._.box();
	        }
	        while (el.type == "use") {
	            if (!isWithoutTransform) {
	                m = m.add(el.transform().localMatrix.translate(el.attr("x") || 0, el.attr("y") || 0));
	            }
	            if (el.original) {
	                el = el.original;
	            } else {
	                var href = el.attr("xlink:href");
	                el = el.original = el.node.ownerDocument.getElementById(href.substring(href.indexOf("#") + 1));
	            }
	        }
	        var _ = el._,
	            pathfinder = Snap.path.get[el.type] || Snap.path.get.deflt;
	        try {
	            if (isWithoutTransform) {
	                _.bboxwt = pathfinder ? Snap.path.getBBox(el.realPath = pathfinder(el)) : Snap._.box(el.node.getBBox());
	                return Snap._.box(_.bboxwt);
	            } else {
	                el.realPath = pathfinder(el);
	                el.matrix = el.transform().localMatrix;
	                _.bbox = Snap.path.getBBox(Snap.path.map(el.realPath, m.add(el.matrix)));
	                return Snap._.box(_.bbox);
	            }
	        } catch (e) {
	            // Firefox doesn’t give you bbox of hidden element
	            return Snap._.box();
	        }
	    };
	    var propString = function () {
	        return this.string;
	    };
	    function extractTransform(el, tstr) {
	        if (tstr == null) {
	            var doReturn = true;
	            if (el.type == "linearGradient" || el.type == "radialGradient") {
	                tstr = el.node.getAttribute("gradientTransform");
	            } else if (el.type == "pattern") {
	                tstr = el.node.getAttribute("patternTransform");
	            } else {
	                tstr = el.node.getAttribute("transform");
	            }
	            if (!tstr) {
	                return new Snap.Matrix;
	            }
	            tstr = Snap._.svgTransform2string(tstr);
	        } else {
	            if (!Snap._.rgTransform.test(tstr)) {
	                tstr = Snap._.svgTransform2string(tstr);
	            } else {
	                tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || "");
	            }
	            if (is(tstr, "array")) {
	                tstr = Snap.path ? Snap.path.toString.call(tstr) : Str(tstr);
	            }
	            el._.transform = tstr;
	        }
	        var m = Snap._.transform2matrix(tstr, el.getBBox(1));
	        if (doReturn) {
	            return m;
	        } else {
	            el.matrix = m;
	        }
	    }
	    /*\
	     * Element.transform
	     [ method ]
	     **
	     * Gets or sets transformation of the element
	     **
	     - tstr (string) transform string in Snap or SVG format
	     = (Element) the current element
	     * or
	     = (object) transformation descriptor:
	     o {
	     o     string (string) transform string,
	     o     globalMatrix (Matrix) matrix of all transformations applied to element or its parents,
	     o     localMatrix (Matrix) matrix of transformations applied only to the element,
	     o     diffMatrix (Matrix) matrix of difference between global and local transformations,
	     o     global (string) global transformation as string,
	     o     local (string) local transformation as string,
	     o     toString (function) returns `string` property
	     o }
	    \*/
	    elproto.transform = function (tstr) {
	        var _ = this._;
	        if (tstr == null) {
	            var papa = this,
	                global = new Snap.Matrix(this.node.getCTM()),
	                local = extractTransform(this),
	                ms = [local],
	                m = new Snap.Matrix,
	                i,
	                localString = local.toTransformString(),
	                string = Str(local) == Str(this.matrix) ?
	                            Str(_.transform) : localString;
	            while (papa.type != "svg" && (papa = papa.parent())) {
	                ms.push(extractTransform(papa));
	            }
	            i = ms.length;
	            while (i--) {
	                m.add(ms[i]);
	            }
	            return {
	                string: string,
	                globalMatrix: global,
	                totalMatrix: m,
	                localMatrix: local,
	                diffMatrix: global.clone().add(local.invert()),
	                global: global.toTransformString(),
	                total: m.toTransformString(),
	                local: localString,
	                toString: propString
	            };
	        }
	        if (tstr instanceof Snap.Matrix) {
	            this.matrix = tstr;
	            this._.transform = tstr.toTransformString();
	        } else {
	            extractTransform(this, tstr);
	        }

	        if (this.node) {
	            if (this.type == "linearGradient" || this.type == "radialGradient") {
	                $(this.node, {gradientTransform: this.matrix});
	            } else if (this.type == "pattern") {
	                $(this.node, {patternTransform: this.matrix});
	            } else {
	                $(this.node, {transform: this.matrix});
	            }
	        }

	        return this;
	    };
	    /*\
	     * Element.parent
	     [ method ]
	     **
	     * Returns the element's parent
	     **
	     = (Element) the parent element
	    \*/
	    elproto.parent = function () {
	        return wrap(this.node.parentNode);
	    };
	    /*\
	     * Element.append
	     [ method ]
	     **
	     * Appends the given element to current one
	     **
	     - el (Element|Set) element to append
	     = (Element) the parent element
	    \*/
	    /*\
	     * Element.add
	     [ method ]
	     **
	     * See @Element.append
	    \*/
	    elproto.append = elproto.add = function (el) {
	        if (el) {
	            if (el.type == "set") {
	                var it = this;
	                el.forEach(function (el) {
	                    it.add(el);
	                });
	                return this;
	            }
	            el = wrap(el);
	            this.node.appendChild(el.node);
	            el.paper = this.paper;
	        }
	        return this;
	    };
	    /*\
	     * Element.appendTo
	     [ method ]
	     **
	     * Appends the current element to the given one
	     **
	     - el (Element) parent element to append to
	     = (Element) the child element
	    \*/
	    elproto.appendTo = function (el) {
	        if (el) {
	            el = wrap(el);
	            el.append(this);
	        }
	        return this;
	    };
	    /*\
	     * Element.prepend
	     [ method ]
	     **
	     * Prepends the given element to the current one
	     **
	     - el (Element) element to prepend
	     = (Element) the parent element
	    \*/
	    elproto.prepend = function (el) {
	        if (el) {
	            if (el.type == "set") {
	                var it = this,
	                    first;
	                el.forEach(function (el) {
	                    if (first) {
	                        first.after(el);
	                    } else {
	                        it.prepend(el);
	                    }
	                    first = el;
	                });
	                return this;
	            }
	            el = wrap(el);
	            var parent = el.parent();
	            this.node.insertBefore(el.node, this.node.firstChild);
	            this.add && this.add();
	            el.paper = this.paper;
	            this.parent() && this.parent().add();
	            parent && parent.add();
	        }
	        return this;
	    };
	    /*\
	     * Element.prependTo
	     [ method ]
	     **
	     * Prepends the current element to the given one
	     **
	     - el (Element) parent element to prepend to
	     = (Element) the child element
	    \*/
	    elproto.prependTo = function (el) {
	        el = wrap(el);
	        el.prepend(this);
	        return this;
	    };
	    /*\
	     * Element.before
	     [ method ]
	     **
	     * Inserts given element before the current one
	     **
	     - el (Element) element to insert
	     = (Element) the parent element
	    \*/
	    elproto.before = function (el) {
	        if (el.type == "set") {
	            var it = this;
	            el.forEach(function (el) {
	                var parent = el.parent();
	                it.node.parentNode.insertBefore(el.node, it.node);
	                parent && parent.add();
	            });
	            this.parent().add();
	            return this;
	        }
	        el = wrap(el);
	        var parent = el.parent();
	        this.node.parentNode.insertBefore(el.node, this.node);
	        this.parent() && this.parent().add();
	        parent && parent.add();
	        el.paper = this.paper;
	        return this;
	    };
	    /*\
	     * Element.after
	     [ method ]
	     **
	     * Inserts given element after the current one
	     **
	     - el (Element) element to insert
	     = (Element) the parent element
	    \*/
	    elproto.after = function (el) {
	        el = wrap(el);
	        var parent = el.parent();
	        if (this.node.nextSibling) {
	            this.node.parentNode.insertBefore(el.node, this.node.nextSibling);
	        } else {
	            this.node.parentNode.appendChild(el.node);
	        }
	        this.parent() && this.parent().add();
	        parent && parent.add();
	        el.paper = this.paper;
	        return this;
	    };
	    /*\
	     * Element.insertBefore
	     [ method ]
	     **
	     * Inserts the element after the given one
	     **
	     - el (Element) element next to whom insert to
	     = (Element) the parent element
	    \*/
	    elproto.insertBefore = function (el) {
	        el = wrap(el);
	        var parent = this.parent();
	        el.node.parentNode.insertBefore(this.node, el.node);
	        this.paper = el.paper;
	        parent && parent.add();
	        el.parent() && el.parent().add();
	        return this;
	    };
	    /*\
	     * Element.insertAfter
	     [ method ]
	     **
	     * Inserts the element after the given one
	     **
	     - el (Element) element next to whom insert to
	     = (Element) the parent element
	    \*/
	    elproto.insertAfter = function (el) {
	        el = wrap(el);
	        var parent = this.parent();
	        el.node.parentNode.insertBefore(this.node, el.node.nextSibling);
	        this.paper = el.paper;
	        parent && parent.add();
	        el.parent() && el.parent().add();
	        return this;
	    };
	    /*\
	     * Element.remove
	     [ method ]
	     **
	     * Removes element from the DOM
	     = (Element) the detached element
	    \*/
	    elproto.remove = function () {
	        var parent = this.parent();
	        this.node.parentNode && this.node.parentNode.removeChild(this.node);
	        delete this.paper;
	        this.removed = true;
	        parent && parent.add();
	        return this;
	    };
	    /*\
	     * Element.select
	     [ method ]
	     **
	     * Gathers the nested @Element matching the given set of CSS selectors
	     **
	     - query (string) CSS selector
	     = (Element) result of query selection
	    \*/
	    elproto.select = function (query) {
	        return wrap(this.node.querySelector(query));
	    };
	    /*\
	     * Element.selectAll
	     [ method ]
	     **
	     * Gathers nested @Element objects matching the given set of CSS selectors
	     **
	     - query (string) CSS selector
	     = (Set|array) result of query selection
	    \*/
	    elproto.selectAll = function (query) {
	        var nodelist = this.node.querySelectorAll(query),
	            set = (Snap.set || Array)();
	        for (var i = 0; i < nodelist.length; i++) {
	            set.push(wrap(nodelist[i]));
	        }
	        return set;
	    };
	    /*\
	     * Element.asPX
	     [ method ]
	     **
	     * Returns given attribute of the element as a `px` value (not %, em, etc.)
	     **
	     - attr (string) attribute name
	     - value (string) #optional attribute value
	     = (Element) result of query selection
	    \*/
	    elproto.asPX = function (attr, value) {
	        if (value == null) {
	            value = this.attr(attr);
	        }
	        return +unit2px(this, attr, value);
	    };
	    // SIERRA Element.use(): I suggest adding a note about how to access the original element the returned <use> instantiates. It's a part of SVG with which ordinary web developers may be least familiar.
	    /*\
	     * Element.use
	     [ method ]
	     **
	     * Creates a `<use>` element linked to the current element
	     **
	     = (Element) the `<use>` element
	    \*/
	    elproto.use = function () {
	        var use,
	            id = this.node.id;
	        if (!id) {
	            id = this.id;
	            $(this.node, {
	                id: id
	            });
	        }
	        if (this.type == "linearGradient" || this.type == "radialGradient" ||
	            this.type == "pattern") {
	            use = make(this.type, this.node.parentNode);
	        } else {
	            use = make("use", this.node.parentNode);
	        }
	        $(use.node, {
	            "xlink:href": "#" + id
	        });
	        use.original = this;
	        return use;
	    };
	    function fixids(el) {
	        var els = el.selectAll("*"),
	            it,
	            url = /^\s*url\(("|'|)(.*)\1\)\s*$/,
	            ids = [],
	            uses = {};
	        function urltest(it, name) {
	            var val = $(it.node, name);
	            val = val && val.match(url);
	            val = val && val[2];
	            if (val && val.charAt() == "#") {
	                val = val.substring(1);
	            } else {
	                return;
	            }
	            if (val) {
	                uses[val] = (uses[val] || []).concat(function (id) {
	                    var attr = {};
	                    attr[name] = URL(id);
	                    $(it.node, attr);
	                });
	            }
	        }
	        function linktest(it) {
	            var val = $(it.node, "xlink:href");
	            if (val && val.charAt() == "#") {
	                val = val.substring(1);
	            } else {
	                return;
	            }
	            if (val) {
	                uses[val] = (uses[val] || []).concat(function (id) {
	                    it.attr("xlink:href", "#" + id);
	                });
	            }
	        }
	        for (var i = 0, ii = els.length; i < ii; i++) {
	            it = els[i];
	            urltest(it, "fill");
	            urltest(it, "stroke");
	            urltest(it, "filter");
	            urltest(it, "mask");
	            urltest(it, "clip-path");
	            linktest(it);
	            var oldid = $(it.node, "id");
	            if (oldid) {
	                $(it.node, {id: it.id});
	                ids.push({
	                    old: oldid,
	                    id: it.id
	                });
	            }
	        }
	        for (i = 0, ii = ids.length; i < ii; i++) {
	            var fs = uses[ids[i].old];
	            if (fs) {
	                for (var j = 0, jj = fs.length; j < jj; j++) {
	                    fs[j](ids[i].id);
	                }
	            }
	        }
	    }
	    /*\
	     * Element.clone
	     [ method ]
	     **
	     * Creates a clone of the element and inserts it after the element
	     **
	     = (Element) the clone
	    \*/
	    elproto.clone = function () {
	        var clone = wrap(this.node.cloneNode(true));
	        if ($(clone.node, "id")) {
	            $(clone.node, {id: clone.id});
	        }
	        fixids(clone);
	        clone.insertAfter(this);
	        return clone;
	    };
	    /*\
	     * Element.toDefs
	     [ method ]
	     **
	     * Moves element to the shared `<defs>` area
	     **
	     = (Element) the element
	    \*/
	    elproto.toDefs = function () {
	        var defs = getSomeDefs(this);
	        defs.appendChild(this.node);
	        return this;
	    };
	    /*\
	     * Element.toPattern
	     [ method ]
	     **
	     * Creates a `<pattern>` element from the current element
	     **
	     * To create a pattern you have to specify the pattern rect:
	     - x (string|number)
	     - y (string|number)
	     - width (string|number)
	     - height (string|number)
	     = (Element) the `<pattern>` element
	     * You can use pattern later on as an argument for `fill` attribute:
	     | var p = paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
	     |         fill: "none",
	     |         stroke: "#bada55",
	     |         strokeWidth: 5
	     |     }).pattern(0, 0, 10, 10),
	     |     c = paper.circle(200, 200, 100);
	     | c.attr({
	     |     fill: p
	     | });
	    \*/
	    elproto.pattern = elproto.toPattern = function (x, y, width, height) {
	        var p = make("pattern", getSomeDefs(this));
	        if (x == null) {
	            x = this.getBBox();
	        }
	        if (is(x, "object") && "x" in x) {
	            y = x.y;
	            width = x.width;
	            height = x.height;
	            x = x.x;
	        }
	        $(p.node, {
	            x: x,
	            y: y,
	            width: width,
	            height: height,
	            patternUnits: "userSpaceOnUse",
	            id: p.id,
	            viewBox: [x, y, width, height].join(" ")
	        });
	        p.node.appendChild(this.node);
	        return p;
	    };
	// SIERRA Element.marker(): clarify what a reference point is. E.g., helps you offset the object from its edge such as when centering it over a path.
	// SIERRA Element.marker(): I suggest the method should accept default reference point values.  Perhaps centered with (refX = width/2) and (refY = height/2)? Also, couldn't it assume the element's current _width_ and _height_? And please specify what _x_ and _y_ mean: offsets? If so, from where?  Couldn't they also be assigned default values?
	    /*\
	     * Element.marker
	     [ method ]
	     **
	     * Creates a `<marker>` element from the current element
	     **
	     * To create a marker you have to specify the bounding rect and reference point:
	     - x (number)
	     - y (number)
	     - width (number)
	     - height (number)
	     - refX (number)
	     - refY (number)
	     = (Element) the `<marker>` element
	     * You can specify the marker later as an argument for `marker-start`, `marker-end`, `marker-mid`, and `marker` attributes. The `marker` attribute places the marker at every point along the path, and `marker-mid` places them at every point except the start and end.
	    \*/
	    // TODO add usage for markers
	    elproto.marker = function (x, y, width, height, refX, refY) {
	        var p = make("marker", getSomeDefs(this));
	        if (x == null) {
	            x = this.getBBox();
	        }
	        if (is(x, "object") && "x" in x) {
	            y = x.y;
	            width = x.width;
	            height = x.height;
	            refX = x.refX || x.cx;
	            refY = x.refY || x.cy;
	            x = x.x;
	        }
	        $(p.node, {
	            viewBox: [x, y, width, height].join(" "),
	            markerWidth: width,
	            markerHeight: height,
	            orient: "auto",
	            refX: refX || 0,
	            refY: refY || 0,
	            id: p.id
	        });
	        p.node.appendChild(this.node);
	        return p;
	    };
	    // animation
	    function slice(from, to, f) {
	        return function (arr) {
	            var res = arr.slice(from, to);
	            if (res.length == 1) {
	                res = res[0];
	            }
	            return f ? f(res) : res;
	        };
	    }
	    var Animation = function (attr, ms, easing, callback) {
	        if (typeof easing == "function" && !easing.length) {
	            callback = easing;
	            easing = mina.linear;
	        }
	        this.attr = attr;
	        this.dur = ms;
	        easing && (this.easing = easing);
	        callback && (this.callback = callback);
	    };
	    Snap._.Animation = Animation;
	    /*\
	     * Snap.animation
	     [ method ]
	     **
	     * Creates an animation object
	     **
	     - attr (object) attributes of final destination
	     - duration (number) duration of the animation, in milliseconds
	     - easing (function) #optional one of easing functions of @mina or custom one
	     - callback (function) #optional callback function that fires when animation ends
	     = (object) animation object
	    \*/
	    Snap.animation = function (attr, ms, easing, callback) {
	        return new Animation(attr, ms, easing, callback);
	    };
	    /*\
	     * Element.inAnim
	     [ method ]
	     **
	     * Returns a set of animations that may be able to manipulate the current element
	     **
	     = (object) in format:
	     o {
	     o     anim (object) animation object,
	     o     mina (object) @mina object,
	     o     curStatus (number) 0..1 — status of the animation: 0 — just started, 1 — just finished,
	     o     status (function) gets or sets the status of the animation,
	     o     stop (function) stops the animation
	     o }
	    \*/
	    elproto.inAnim = function () {
	        var el = this,
	            res = [];
	        for (var id in el.anims) if (el.anims[has](id)) {
	            (function (a) {
	                res.push({
	                    anim: new Animation(a._attrs, a.dur, a.easing, a._callback),
	                    mina: a,
	                    curStatus: a.status(),
	                    status: function (val) {
	                        return a.status(val);
	                    },
	                    stop: function () {
	                        a.stop();
	                    }
	                });
	            }(el.anims[id]));
	        }
	        return res;
	    };
	    /*\
	     * Snap.animate
	     [ method ]
	     **
	     * Runs generic animation of one number into another with a caring function
	     **
	     - from (number|array) number or array of numbers
	     - to (number|array) number or array of numbers
	     - setter (function) caring function that accepts one number argument
	     - duration (number) duration, in milliseconds
	     - easing (function) #optional easing function from @mina or custom
	     - callback (function) #optional callback function to execute when animation ends
	     = (object) animation object in @mina format
	     o {
	     o     id (string) animation id, consider it read-only,
	     o     duration (function) gets or sets the duration of the animation,
	     o     easing (function) easing,
	     o     speed (function) gets or sets the speed of the animation,
	     o     status (function) gets or sets the status of the animation,
	     o     stop (function) stops the animation
	     o }
	     | var rect = Snap().rect(0, 0, 10, 10);
	     | Snap.animate(0, 10, function (val) {
	     |     rect.attr({
	     |         x: val
	     |     });
	     | }, 1000);
	     | // in given context is equivalent to
	     | rect.animate({x: 10}, 1000);
	    \*/
	    Snap.animate = function (from, to, setter, ms, easing, callback) {
	        if (typeof easing == "function" && !easing.length) {
	            callback = easing;
	            easing = mina.linear;
	        }
	        var now = mina.time(),
	            anim = mina(from, to, now, now + ms, mina.time, setter, easing);
	        callback && eve.once("mina.finish." + anim.id, callback);
	        return anim;
	    };
	    /*\
	     * Element.stop
	     [ method ]
	     **
	     * Stops all the animations for the current element
	     **
	     = (Element) the current element
	    \*/
	    elproto.stop = function () {
	        var anims = this.inAnim();
	        for (var i = 0, ii = anims.length; i < ii; i++) {
	            anims[i].stop();
	        }
	        return this;
	    };
	    /*\
	     * Element.animate
	     [ method ]
	     **
	     * Animates the given attributes of the element
	     **
	     - attrs (object) key-value pairs of destination attributes
	     - duration (number) duration of the animation in milliseconds
	     - easing (function) #optional easing function from @mina or custom
	     - callback (function) #optional callback function that executes when the animation ends
	     = (Element) the current element
	    \*/
	    elproto.animate = function (attrs, ms, easing, callback) {
	        if (typeof easing == "function" && !easing.length) {
	            callback = easing;
	            easing = mina.linear;
	        }
	        if (attrs instanceof Animation) {
	            callback = attrs.callback;
	            easing = attrs.easing;
	            ms = attrs.dur;
	            attrs = attrs.attr;
	        }
	        var fkeys = [], tkeys = [], keys = {}, from, to, f, eq,
	            el = this;
	        for (var key in attrs) if (attrs[has](key)) {
	            if (el.equal) {
	                eq = el.equal(key, Str(attrs[key]));
	                from = eq.from;
	                to = eq.to;
	                f = eq.f;
	            } else {
	                from = +el.attr(key);
	                to = +attrs[key];
	            }
	            var len = is(from, "array") ? from.length : 1;
	            keys[key] = slice(fkeys.length, fkeys.length + len, f);
	            fkeys = fkeys.concat(from);
	            tkeys = tkeys.concat(to);
	        }
	        var now = mina.time(),
	            anim = mina(fkeys, tkeys, now, now + ms, mina.time, function (val) {
	                var attr = {};
	                for (var key in keys) if (keys[has](key)) {
	                    attr[key] = keys[key](val);
	                }
	                el.attr(attr);
	            }, easing);
	        el.anims[anim.id] = anim;
	        anim._attrs = attrs;
	        anim._callback = callback;
	        eve("snap.animcreated." + el.id, anim);
	        eve.once("mina.finish." + anim.id, function () {
	            eve.off("mina.*." + anim.id);
	            delete el.anims[anim.id];
	            callback && callback.call(el);
	        });
	        eve.once("mina.stop." + anim.id, function () {
	            eve.off("mina.*." + anim.id);
	            delete el.anims[anim.id];
	        });
	        return el;
	    };
	    var eldata = {};
	    /*\
	     * Element.data
	     [ method ]
	     **
	     * Adds or retrieves given value associated with given key. (Don’t confuse
	     * with `data-` attributes)
	     *
	     * See also @Element.removeData
	     - key (string) key to store data
	     - value (any) #optional value to store
	     = (object) @Element
	     * or, if value is not specified:
	     = (any) value
	     > Usage
	     | for (var i = 0, i < 5, i++) {
	     |     paper.circle(10 + 15 * i, 10, 10)
	     |          .attr({fill: "#000"})
	     |          .data("i", i)
	     |          .click(function () {
	     |             alert(this.data("i"));
	     |          });
	     | }
	    \*/
	    elproto.data = function (key, value) {
	        var data = eldata[this.id] = eldata[this.id] || {};
	        if (arguments.length == 0){
	            eve("snap.data.get." + this.id, this, data, null);
	            return data;
	        }
	        if (arguments.length == 1) {
	            if (Snap.is(key, "object")) {
	                for (var i in key) if (key[has](i)) {
	                    this.data(i, key[i]);
	                }
	                return this;
	            }
	            eve("snap.data.get." + this.id, this, data[key], key);
	            return data[key];
	        }
	        data[key] = value;
	        eve("snap.data.set." + this.id, this, value, key);
	        return this;
	    };
	    /*\
	     * Element.removeData
	     [ method ]
	     **
	     * Removes value associated with an element by given key.
	     * If key is not provided, removes all the data of the element.
	     - key (string) #optional key
	     = (object) @Element
	    \*/
	    elproto.removeData = function (key) {
	        if (key == null) {
	            eldata[this.id] = {};
	        } else {
	            eldata[this.id] && delete eldata[this.id][key];
	        }
	        return this;
	    };
	    /*\
	     * Element.outerSVG
	     [ method ]
	     **
	     * Returns SVG code for the element, equivalent to HTML's `outerHTML`.
	     *
	     * See also @Element.innerSVG
	     = (string) SVG code for the element
	    \*/
	    /*\
	     * Element.toString
	     [ method ]
	     **
	     * See @Element.outerSVG
	    \*/
	    elproto.outerSVG = elproto.toString = toString(1);
	    /*\
	     * Element.innerSVG
	     [ method ]
	     **
	     * Returns SVG code for the element's contents, equivalent to HTML's `innerHTML`
	     = (string) SVG code for the element
	    \*/
	    elproto.innerSVG = toString();
	    function toString(type) {
	        return function () {
	            var res = type ? "<" + this.type : "",
	                attr = this.node.attributes,
	                chld = this.node.childNodes;
	            if (type) {
	                for (var i = 0, ii = attr.length; i < ii; i++) {
	                    res += " " + attr[i].name + '="' +
	                            attr[i].value.replace(/"/g, '\\"') + '"';
	                }
	            }
	            if (chld.length) {
	                type && (res += ">");
	                for (i = 0, ii = chld.length; i < ii; i++) {
	                    if (chld[i].nodeType == 3) {
	                        res += chld[i].nodeValue;
	                    } else if (chld[i].nodeType == 1) {
	                        res += wrap(chld[i]).toString();
	                    }
	                }
	                type && (res += "</" + this.type + ">");
	            } else {
	                type && (res += "/>");
	            }
	            return res;
	        };
	    }
	    elproto.toDataURL = function () {
	        if (window && window.btoa) {
	            var bb = this.getBBox(),
	                svg = Snap.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
	                x: +bb.x.toFixed(3),
	                y: +bb.y.toFixed(3),
	                width: +bb.width.toFixed(3),
	                height: +bb.height.toFixed(3),
	                contents: this.outerSVG()
	            });
	            return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
	        }
	    };
	    /*\
	     * Fragment.select
	     [ method ]
	     **
	     * See @Element.select
	    \*/
	    Fragment.prototype.select = elproto.select;
	    /*\
	     * Fragment.selectAll
	     [ method ]
	     **
	     * See @Element.selectAll
	    \*/
	    Fragment.prototype.selectAll = elproto.selectAll;
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var objectToString = Object.prototype.toString,
	        Str = String,
	        math = Math,
	        E = "";
	    function Matrix(a, b, c, d, e, f) {
	        if (b == null && objectToString.call(a) == "[object SVGMatrix]") {
	            this.a = a.a;
	            this.b = a.b;
	            this.c = a.c;
	            this.d = a.d;
	            this.e = a.e;
	            this.f = a.f;
	            return;
	        }
	        if (a != null) {
	            this.a = +a;
	            this.b = +b;
	            this.c = +c;
	            this.d = +d;
	            this.e = +e;
	            this.f = +f;
	        } else {
	            this.a = 1;
	            this.b = 0;
	            this.c = 0;
	            this.d = 1;
	            this.e = 0;
	            this.f = 0;
	        }
	    }
	    (function (matrixproto) {
	        /*\
	         * Matrix.add
	         [ method ]
	         **
	         * Adds the given matrix to existing one
	         - a (number)
	         - b (number)
	         - c (number)
	         - d (number)
	         - e (number)
	         - f (number)
	         * or
	         - matrix (object) @Matrix
	        \*/
	        matrixproto.add = function (a, b, c, d, e, f) {
	            var out = [[], [], []],
	                m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
	                matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
	                x, y, z, res;

	            if (a && a instanceof Matrix) {
	                matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
	            }

	            for (x = 0; x < 3; x++) {
	                for (y = 0; y < 3; y++) {
	                    res = 0;
	                    for (z = 0; z < 3; z++) {
	                        res += m[x][z] * matrix[z][y];
	                    }
	                    out[x][y] = res;
	                }
	            }
	            this.a = out[0][0];
	            this.b = out[1][0];
	            this.c = out[0][1];
	            this.d = out[1][1];
	            this.e = out[0][2];
	            this.f = out[1][2];
	            return this;
	        };
	        /*\
	         * Matrix.invert
	         [ method ]
	         **
	         * Returns an inverted version of the matrix
	         = (object) @Matrix
	        \*/
	        matrixproto.invert = function () {
	            var me = this,
	                x = me.a * me.d - me.b * me.c;
	            return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
	        };
	        /*\
	         * Matrix.clone
	         [ method ]
	         **
	         * Returns a copy of the matrix
	         = (object) @Matrix
	        \*/
	        matrixproto.clone = function () {
	            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
	        };
	        /*\
	         * Matrix.translate
	         [ method ]
	         **
	         * Translate the matrix
	         - x (number) horizontal offset distance
	         - y (number) vertical offset distance
	        \*/
	        matrixproto.translate = function (x, y) {
	            return this.add(1, 0, 0, 1, x, y);
	        };
	        /*\
	         * Matrix.scale
	         [ method ]
	         **
	         * Scales the matrix
	         - x (number) amount to be scaled, with `1` resulting in no change
	         - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
	         - cx (number) #optional horizontal origin point from which to scale
	         - cy (number) #optional vertical origin point from which to scale
	         * Default cx, cy is the middle point of the element.
	        \*/
	        matrixproto.scale = function (x, y, cx, cy) {
	            y == null && (y = x);
	            (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
	            this.add(x, 0, 0, y, 0, 0);
	            (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
	            return this;
	        };
	        /*\
	         * Matrix.rotate
	         [ method ]
	         **
	         * Rotates the matrix
	         - a (number) angle of rotation, in degrees
	         - x (number) horizontal origin point from which to rotate
	         - y (number) vertical origin point from which to rotate
	        \*/
	        matrixproto.rotate = function (a, x, y) {
	            a = Snap.rad(a);
	            x = x || 0;
	            y = y || 0;
	            var cos = +math.cos(a).toFixed(9),
	                sin = +math.sin(a).toFixed(9);
	            this.add(cos, sin, -sin, cos, x, y);
	            return this.add(1, 0, 0, 1, -x, -y);
	        };
	        /*\
	         * Matrix.skewX
	         [ method ]
	         **
	         * Skews the matrix along the x-axis
	         - x (number) Angle to skew along the x-axis (in degrees).
	        \*/
	        matrixproto.skewX = function (x) {
	            return this.skew(x, 0);
	        };
	        /*\
	         * Matrix.skewY
	         [ method ]
	         **
	         * Skews the matrix along the y-axis
	         - y (number) Angle to skew along the y-axis (in degrees).
	        \*/
	        matrixproto.skewY = function (y) {
	            return this.skew(0, y);
	        };
	        /*\
	         * Matrix.skew
	         [ method ]
	         **
	         * Skews the matrix
	         - y (number) Angle to skew along the y-axis (in degrees).
	         - x (number) Angle to skew along the x-axis (in degrees).
	        \*/
	        matrixproto.skew = function (x, y) {
	            x = x || 0;
	            y = y || 0;
	            x = Snap.rad(x);
	            y = Snap.rad(y);
	            var c = math.tan(x).toFixed(9);
	            var b = math.tan(y).toFixed(9);
	            return this.add(1, b, c, 1, 0, 0);
	        };
	        /*\
	         * Matrix.x
	         [ method ]
	         **
	         * Returns x coordinate for given point after transformation described by the matrix. See also @Matrix.y
	         - x (number)
	         - y (number)
	         = (number) x
	        \*/
	        matrixproto.x = function (x, y) {
	            return x * this.a + y * this.c + this.e;
	        };
	        /*\
	         * Matrix.y
	         [ method ]
	         **
	         * Returns y coordinate for given point after transformation described by the matrix. See also @Matrix.x
	         - x (number)
	         - y (number)
	         = (number) y
	        \*/
	        matrixproto.y = function (x, y) {
	            return x * this.b + y * this.d + this.f;
	        };
	        matrixproto.get = function (i) {
	            return +this[Str.fromCharCode(97 + i)].toFixed(4);
	        };
	        matrixproto.toString = function () {
	            return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
	        };
	        matrixproto.offset = function () {
	            return [this.e.toFixed(4), this.f.toFixed(4)];
	        };
	        function norm(a) {
	            return a[0] * a[0] + a[1] * a[1];
	        }
	        function normalize(a) {
	            var mag = math.sqrt(norm(a));
	            a[0] && (a[0] /= mag);
	            a[1] && (a[1] /= mag);
	        }
	        /*\
	         * Matrix.determinant
	         [ method ]
	         **
	         * Finds determinant of the given matrix.
	         = (number) determinant
	        \*/
	        matrixproto.determinant = function () {
	            return this.a * this.d - this.b * this.c;
	        };
	        /*\
	         * Matrix.split
	         [ method ]
	         **
	         * Splits matrix into primitive transformations
	         = (object) in format:
	         o dx (number) translation by x
	         o dy (number) translation by y
	         o scalex (number) scale by x
	         o scaley (number) scale by y
	         o shear (number) shear
	         o rotate (number) rotation in deg
	         o isSimple (boolean) could it be represented via simple transformations
	        \*/
	        matrixproto.split = function () {
	            var out = {};
	            // translation
	            out.dx = this.e;
	            out.dy = this.f;

	            // scale and shear
	            var row = [[this.a, this.c], [this.b, this.d]];
	            out.scalex = math.sqrt(norm(row[0]));
	            normalize(row[0]);

	            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
	            row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

	            out.scaley = math.sqrt(norm(row[1]));
	            normalize(row[1]);
	            out.shear /= out.scaley;

	            if (this.determinant() < 0) {
	                out.scalex = -out.scalex;
	            }

	            // rotation
	            var sin = -row[0][1],
	                cos = row[1][1];
	            if (cos < 0) {
	                out.rotate = Snap.deg(math.acos(cos));
	                if (sin < 0) {
	                    out.rotate = 360 - out.rotate;
	                }
	            } else {
	                out.rotate = Snap.deg(math.asin(sin));
	            }

	            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
	            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
	            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
	            return out;
	        };
	        /*\
	         * Matrix.toTransformString
	         [ method ]
	         **
	         * Returns transform string that represents given matrix
	         = (string) transform string
	        \*/
	        matrixproto.toTransformString = function (shorter) {
	            var s = shorter || this.split();
	            if (!+s.shear.toFixed(9)) {
	                s.scalex = +s.scalex.toFixed(4);
	                s.scaley = +s.scaley.toFixed(4);
	                s.rotate = +s.rotate.toFixed(4);
	                return  (s.dx || s.dy ? "t" + [+s.dx.toFixed(4), +s.dy.toFixed(4)] : E) + 
	                        (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E) +
	                        (s.rotate ? "r" + [+s.rotate.toFixed(4), 0, 0] : E);
	            } else {
	                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
	            }
	        };
	    })(Matrix.prototype);
	    /*\
	     * Snap.Matrix
	     [ method ]
	     **
	     * Matrix constructor, extend on your own risk.
	     * To create matrices use @Snap.matrix.
	    \*/
	    Snap.Matrix = Matrix;
	    /*\
	     * Snap.matrix
	     [ method ]
	     **
	     * Utility method
	     **
	     * Returns a matrix based on the given parameters
	     - a (number)
	     - b (number)
	     - c (number)
	     - d (number)
	     - e (number)
	     - f (number)
	     * or
	     - svgMatrix (SVGMatrix)
	     = (object) @Matrix
	    \*/
	    Snap.matrix = function (a, b, c, d, e, f) {
	        return new Matrix(a, b, c, d, e, f);
	    };
	});
	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var has = "hasOwnProperty",
	        make = Snap._.make,
	        wrap = Snap._.wrap,
	        is = Snap.is,
	        getSomeDefs = Snap._.getSomeDefs,
	        reURLValue = /^url\(#?([^)]+)\)$/,
	        $ = Snap._.$,
	        URL = Snap.url,
	        Str = String,
	        separator = Snap._.separator,
	        E = "";
	    // Attributes event handlers
	    eve.on("snap.util.attr.mask", function (value) {
	        if (value instanceof Element || value instanceof Fragment) {
	            eve.stop();
	            if (value instanceof Fragment && value.node.childNodes.length == 1) {
	                value = value.node.firstChild;
	                getSomeDefs(this).appendChild(value);
	                value = wrap(value);
	            }
	            if (value.type == "mask") {
	                var mask = value;
	            } else {
	                mask = make("mask", getSomeDefs(this));
	                mask.node.appendChild(value.node);
	            }
	            !mask.node.id && $(mask.node, {
	                id: mask.id
	            });
	            $(this.node, {
	                mask: URL(mask.id)
	            });
	        }
	    });
	    (function (clipIt) {
	        eve.on("snap.util.attr.clip", clipIt);
	        eve.on("snap.util.attr.clip-path", clipIt);
	        eve.on("snap.util.attr.clipPath", clipIt);
	    }(function (value) {
	        if (value instanceof Element || value instanceof Fragment) {
	            eve.stop();
	            if (value.type == "clipPath") {
	                var clip = value;
	            } else {
	                clip = make("clipPath", getSomeDefs(this));
	                clip.node.appendChild(value.node);
	                !clip.node.id && $(clip.node, {
	                    id: clip.id
	                });
	            }
	            $(this.node, {
	                "clip-path": URL(clip.node.id || clip.id)
	            });
	        }
	    }));
	    function fillStroke(name) {
	        return function (value) {
	            eve.stop();
	            if (value instanceof Fragment && value.node.childNodes.length == 1 &&
	                (value.node.firstChild.tagName == "radialGradient" ||
	                value.node.firstChild.tagName == "linearGradient" ||
	                value.node.firstChild.tagName == "pattern")) {
	                value = value.node.firstChild;
	                getSomeDefs(this).appendChild(value);
	                value = wrap(value);
	            }
	            if (value instanceof Element) {
	                if (value.type == "radialGradient" || value.type == "linearGradient"
	                   || value.type == "pattern") {
	                    if (!value.node.id) {
	                        $(value.node, {
	                            id: value.id
	                        });
	                    }
	                    var fill = URL(value.node.id);
	                } else {
	                    fill = value.attr(name);
	                }
	            } else {
	                fill = Snap.color(value);
	                if (fill.error) {
	                    var grad = Snap(getSomeDefs(this).ownerSVGElement).gradient(value);
	                    if (grad) {
	                        if (!grad.node.id) {
	                            $(grad.node, {
	                                id: grad.id
	                            });
	                        }
	                        fill = URL(grad.node.id);
	                    } else {
	                        fill = value;
	                    }
	                } else {
	                    fill = Str(fill);
	                }
	            }
	            var attrs = {};
	            attrs[name] = fill;
	            $(this.node, attrs);
	            this.node.style[name] = E;
	        };
	    }
	    eve.on("snap.util.attr.fill", fillStroke("fill"));
	    eve.on("snap.util.attr.stroke", fillStroke("stroke"));
	    var gradrg = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
	    eve.on("snap.util.grad.parse", function parseGrad(string) {
	        string = Str(string);
	        var tokens = string.match(gradrg);
	        if (!tokens) {
	            return null;
	        }
	        var type = tokens[1],
	            params = tokens[2],
	            stops = tokens[3];
	        params = params.split(/\s*,\s*/).map(function (el) {
	            return +el == el ? +el : el;
	        });
	        if (params.length == 1 && params[0] == 0) {
	            params = [];
	        }
	        stops = stops.split("-");
	        stops = stops.map(function (el) {
	            el = el.split(":");
	            var out = {
	                color: el[0]
	            };
	            if (el[1]) {
	                out.offset = parseFloat(el[1]);
	            }
	            return out;
	        });
	        return {
	            type: type,
	            params: params,
	            stops: stops
	        };
	    });

	    eve.on("snap.util.attr.d", function (value) {
	        eve.stop();
	        if (is(value, "array") && is(value[0], "array")) {
	            value = Snap.path.toString.call(value);
	        }
	        value = Str(value);
	        if (value.match(/[ruo]/i)) {
	            value = Snap.path.toAbsolute(value);
	        }
	        $(this.node, {d: value});
	    })(-1);
	    eve.on("snap.util.attr.#text", function (value) {
	        eve.stop();
	        value = Str(value);
	        var txt = glob.doc.createTextNode(value);
	        while (this.node.firstChild) {
	            this.node.removeChild(this.node.firstChild);
	        }
	        this.node.appendChild(txt);
	    })(-1);
	    eve.on("snap.util.attr.path", function (value) {
	        eve.stop();
	        this.attr({d: value});
	    })(-1);
	    eve.on("snap.util.attr.class", function (value) {
	        eve.stop();
	        this.node.className.baseVal = value;
	    })(-1);
	    eve.on("snap.util.attr.viewBox", function (value) {
	        var vb;
	        if (is(value, "object") && "x" in value) {
	            vb = [value.x, value.y, value.width, value.height].join(" ");
	        } else if (is(value, "array")) {
	            vb = value.join(" ");
	        } else {
	            vb = value;
	        }
	        $(this.node, {
	            viewBox: vb
	        });
	        eve.stop();
	    })(-1);
	    eve.on("snap.util.attr.transform", function (value) {
	        this.transform(value);
	        eve.stop();
	    })(-1);
	    eve.on("snap.util.attr.r", function (value) {
	        if (this.type == "rect") {
	            eve.stop();
	            $(this.node, {
	                rx: value,
	                ry: value
	            });
	        }
	    })(-1);
	    eve.on("snap.util.attr.textpath", function (value) {
	        eve.stop();
	        if (this.type == "text") {
	            var id, tp, node;
	            if (!value && this.textPath) {
	                tp = this.textPath;
	                while (tp.node.firstChild) {
	                    this.node.appendChild(tp.node.firstChild);
	                }
	                tp.remove();
	                delete this.textPath;
	                return;
	            }
	            if (is(value, "string")) {
	                var defs = getSomeDefs(this),
	                    path = wrap(defs.parentNode).path(value);
	                defs.appendChild(path.node);
	                id = path.id;
	                path.attr({id: id});
	            } else {
	                value = wrap(value);
	                if (value instanceof Element) {
	                    id = value.attr("id");
	                    if (!id) {
	                        id = value.id;
	                        value.attr({id: id});
	                    }
	                }
	            }
	            if (id) {
	                tp = this.textPath;
	                node = this.node;
	                if (tp) {
	                    tp.attr({"xlink:href": "#" + id});
	                } else {
	                    tp = $("textPath", {
	                        "xlink:href": "#" + id
	                    });
	                    while (node.firstChild) {
	                        tp.appendChild(node.firstChild);
	                    }
	                    node.appendChild(tp);
	                    this.textPath = wrap(tp);
	                }
	            }
	        }
	    })(-1);
	    eve.on("snap.util.attr.text", function (value) {
	        if (this.type == "text") {
	            var i = 0,
	                node = this.node,
	                tuner = function (chunk) {
	                    var out = $("tspan");
	                    if (is(chunk, "array")) {
	                        for (var i = 0; i < chunk.length; i++) {
	                            out.appendChild(tuner(chunk[i]));
	                        }
	                    } else {
	                        out.appendChild(glob.doc.createTextNode(chunk));
	                    }
	                    out.normalize && out.normalize();
	                    return out;
	                };
	            while (node.firstChild) {
	                node.removeChild(node.firstChild);
	            }
	            var tuned = tuner(value);
	            while (tuned.firstChild) {
	                node.appendChild(tuned.firstChild);
	            }
	        }
	        eve.stop();
	    })(-1);
	    function setFontSize(value) {
	        eve.stop();
	        if (value == +value) {
	            value += "px";
	        }
	        this.node.style.fontSize = value;
	    }
	    eve.on("snap.util.attr.fontSize", setFontSize)(-1);
	    eve.on("snap.util.attr.font-size", setFontSize)(-1);


	    eve.on("snap.util.getattr.transform", function () {
	        eve.stop();
	        return this.transform();
	    })(-1);
	    eve.on("snap.util.getattr.textpath", function () {
	        eve.stop();
	        return this.textPath;
	    })(-1);
	    // Markers
	    (function () {
	        function getter(end) {
	            return function () {
	                eve.stop();
	                var style = glob.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + end);
	                if (style == "none") {
	                    return style;
	                } else {
	                    return Snap(glob.doc.getElementById(style.match(reURLValue)[1]));
	                }
	            };
	        }
	        function setter(end) {
	            return function (value) {
	                eve.stop();
	                var name = "marker" + end.charAt(0).toUpperCase() + end.substring(1);
	                if (value == "" || !value) {
	                    this.node.style[name] = "none";
	                    return;
	                }
	                if (value.type == "marker") {
	                    var id = value.node.id;
	                    if (!id) {
	                        $(value.node, {id: value.id});
	                    }
	                    this.node.style[name] = URL(id);
	                    return;
	                }
	            };
	        }
	        eve.on("snap.util.getattr.marker-end", getter("end"))(-1);
	        eve.on("snap.util.getattr.markerEnd", getter("end"))(-1);
	        eve.on("snap.util.getattr.marker-start", getter("start"))(-1);
	        eve.on("snap.util.getattr.markerStart", getter("start"))(-1);
	        eve.on("snap.util.getattr.marker-mid", getter("mid"))(-1);
	        eve.on("snap.util.getattr.markerMid", getter("mid"))(-1);
	        eve.on("snap.util.attr.marker-end", setter("end"))(-1);
	        eve.on("snap.util.attr.markerEnd", setter("end"))(-1);
	        eve.on("snap.util.attr.marker-start", setter("start"))(-1);
	        eve.on("snap.util.attr.markerStart", setter("start"))(-1);
	        eve.on("snap.util.attr.marker-mid", setter("mid"))(-1);
	        eve.on("snap.util.attr.markerMid", setter("mid"))(-1);
	    }());
	    eve.on("snap.util.getattr.r", function () {
	        if (this.type == "rect" && $(this.node, "rx") == $(this.node, "ry")) {
	            eve.stop();
	            return $(this.node, "rx");
	        }
	    })(-1);
	    function textExtract(node) {
	        var out = [];
	        var children = node.childNodes;
	        for (var i = 0, ii = children.length; i < ii; i++) {
	            var chi = children[i];
	            if (chi.nodeType == 3) {
	                out.push(chi.nodeValue);
	            }
	            if (chi.tagName == "tspan") {
	                if (chi.childNodes.length == 1 && chi.firstChild.nodeType == 3) {
	                    out.push(chi.firstChild.nodeValue);
	                } else {
	                    out.push(textExtract(chi));
	                }
	            }
	        }
	        return out;
	    }
	    eve.on("snap.util.getattr.text", function () {
	        if (this.type == "text" || this.type == "tspan") {
	            eve.stop();
	            var out = textExtract(this.node);
	            return out.length == 1 ? out[0] : out;
	        }
	    })(-1);
	    eve.on("snap.util.getattr.#text", function () {
	        return this.node.textContent;
	    })(-1);
	    eve.on("snap.util.getattr.viewBox", function () {
	        eve.stop();
	        var vb = $(this.node, "viewBox");
	        if (vb) {
	            vb = vb.split(separator);
	            return Snap._.box(+vb[0], +vb[1], +vb[2], +vb[3]);
	        } else {
	            return;
	        }
	    })(-1);
	    eve.on("snap.util.getattr.points", function () {
	        var p = $(this.node, "points");
	        eve.stop();
	        if (p) {
	            return p.split(separator);
	        } else {
	            return;
	        }
	    })(-1);
	    eve.on("snap.util.getattr.path", function () {
	        var p = $(this.node, "d");
	        eve.stop();
	        return p;
	    })(-1);
	    eve.on("snap.util.getattr.class", function () {
	        return this.node.className.baseVal;
	    })(-1);
	    function getFontSize() {
	        eve.stop();
	        return this.node.style.fontSize;
	    }
	    eve.on("snap.util.getattr.fontSize", getFontSize)(-1);
	    eve.on("snap.util.getattr.font-size", getFontSize)(-1);
	});

	// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var rgNotSpace = /\S+/g,
	        rgBadSpace = /[\t\r\n\f]/g,
	        rgTrim = /(^\s+|\s+$)/g,
	        Str = String,
	        elproto = Element.prototype;
	    /*\
	     * Element.addClass
	     [ method ]
	     **
	     * Adds given class name or list of class names to the element.
	     - value (string) class name or space separated list of class names
	     **
	     = (Element) original element.
	    \*/
	    elproto.addClass = function (value) {
	        var classes = Str(value || "").match(rgNotSpace) || [],
	            elem = this.node,
	            className = elem.className.baseVal,
	            curClasses = className.match(rgNotSpace) || [],
	            j,
	            pos,
	            clazz,
	            finalValue;

	        if (classes.length) {
	            j = 0;
	            while ((clazz = classes[j++])) {
	                pos = curClasses.indexOf(clazz);
	                if (!~pos) {
	                    curClasses.push(clazz);
	                }
	            }

	            finalValue = curClasses.join(" ");
	            if (className != finalValue) {
	                elem.className.baseVal = finalValue;
	            }
	        }
	        return this;
	    };
	    /*\
	     * Element.removeClass
	     [ method ]
	     **
	     * Removes given class name or list of class names from the element.
	     - value (string) class name or space separated list of class names
	     **
	     = (Element) original element.
	    \*/
	    elproto.removeClass = function (value) {
	        var classes = Str(value || "").match(rgNotSpace) || [],
	            elem = this.node,
	            className = elem.className.baseVal,
	            curClasses = className.match(rgNotSpace) || [],
	            j,
	            pos,
	            clazz,
	            finalValue;
	        if (curClasses.length) {
	            j = 0;
	            while ((clazz = classes[j++])) {
	                pos = curClasses.indexOf(clazz);
	                if (~pos) {
	                    curClasses.splice(pos, 1);
	                }
	            }

	            finalValue = curClasses.join(" ");
	            if (className != finalValue) {
	                elem.className.baseVal = finalValue;
	            }
	        }
	        return this;
	    };
	    /*\
	     * Element.hasClass
	     [ method ]
	     **
	     * Checks if the element has a given class name in the list of class names applied to it.
	     - value (string) class name
	     **
	     = (boolean) `true` if the element has given class
	    \*/
	    elproto.hasClass = function (value) {
	        var elem = this.node,
	            className = elem.className.baseVal,
	            curClasses = className.match(rgNotSpace) || [];
	        return !!~curClasses.indexOf(value);
	    };
	    /*\
	     * Element.toggleClass
	     [ method ]
	     **
	     * Add or remove one or more classes from the element, depending on either
	     * the class’s presence or the value of the `flag` argument.
	     - value (string) class name or space separated list of class names
	     - flag (boolean) value to determine whether the class should be added or removed
	     **
	     = (Element) original element.
	    \*/
	    elproto.toggleClass = function (value, flag) {
	        if (flag != null) {
	            if (flag) {
	                return this.addClass(value);
	            } else {
	                return this.removeClass(value);
	            }
	        }
	        var classes = (value || "").match(rgNotSpace) || [],
	            elem = this.node,
	            className = elem.className.baseVal,
	            curClasses = className.match(rgNotSpace) || [],
	            j,
	            pos,
	            clazz,
	            finalValue;
	        j = 0;
	        while ((clazz = classes[j++])) {
	            pos = curClasses.indexOf(clazz);
	            if (~pos) {
	                curClasses.splice(pos, 1);
	            } else {
	                curClasses.push(clazz);
	            }
	        }

	        finalValue = curClasses.join(" ");
	        if (className != finalValue) {
	            elem.className.baseVal = finalValue;
	        }
	        return this;
	    };
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var operators = {
	            "+": function (x, y) {
	                    return x + y;
	                },
	            "-": function (x, y) {
	                    return x - y;
	                },
	            "/": function (x, y) {
	                    return x / y;
	                },
	            "*": function (x, y) {
	                    return x * y;
	                }
	        },
	        Str = String,
	        reUnit = /[a-z]+$/i,
	        reAddon = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
	    function getNumber(val) {
	        return val;
	    }
	    function getUnit(unit) {
	        return function (val) {
	            return +val.toFixed(3) + unit;
	        };
	    }
	    eve.on("snap.util.attr", function (val) {
	        var plus = Str(val).match(reAddon);
	        if (plus) {
	            var evnt = eve.nt(),
	                name = evnt.substring(evnt.lastIndexOf(".") + 1),
	                a = this.attr(name),
	                atr = {};
	            eve.stop();
	            var unit = plus[3] || "",
	                aUnit = a.match(reUnit),
	                op = operators[plus[1]];
	            if (aUnit && aUnit == unit) {
	                val = op(parseFloat(a), +plus[2]);
	            } else {
	                a = this.asPX(name);
	                val = op(this.asPX(name), this.asPX(name, plus[2] + unit));
	            }
	            if (isNaN(a) || isNaN(val)) {
	                return;
	            }
	            atr[name] = val;
	            this.attr(atr);
	        }
	    })(-10);
	    eve.on("snap.util.equal", function (name, b) {
	        var A, B, a = Str(this.attr(name) || ""),
	            el = this,
	            bplus = Str(b).match(reAddon);
	        if (bplus) {
	            eve.stop();
	            var unit = bplus[3] || "",
	                aUnit = a.match(reUnit),
	                op = operators[bplus[1]];
	            if (aUnit && aUnit == unit) {
	                return {
	                    from: parseFloat(a),
	                    to: op(parseFloat(a), +bplus[2]),
	                    f: getUnit(aUnit)
	                };
	            } else {
	                a = this.asPX(name);
	                return {
	                    from: a,
	                    to: op(a, this.asPX(name, bplus[2] + unit)),
	                    f: getNumber
	                };
	            }
	        }
	    })(-10);
	});
	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var proto = Paper.prototype,
	        is = Snap.is;
	    /*\
	     * Paper.rect
	     [ method ]
	     *
	     * Draws a rectangle
	     **
	     - x (number) x coordinate of the top left corner
	     - y (number) y coordinate of the top left corner
	     - width (number) width
	     - height (number) height
	     - rx (number) #optional horizontal radius for rounded corners, default is 0
	     - ry (number) #optional vertical radius for rounded corners, default is rx or 0
	     = (object) the `rect` element
	     **
	     > Usage
	     | // regular rectangle
	     | var c = paper.rect(10, 10, 50, 50);
	     | // rectangle with rounded corners
	     | var c = paper.rect(40, 40, 50, 50, 10);
	    \*/
	    proto.rect = function (x, y, w, h, rx, ry) {
	        var attr;
	        if (ry == null) {
	            ry = rx;
	        }
	        if (is(x, "object") && x == "[object Object]") {
	            attr = x;
	        } else if (x != null) {
	            attr = {
	                x: x,
	                y: y,
	                width: w,
	                height: h
	            };
	            if (rx != null) {
	                attr.rx = rx;
	                attr.ry = ry;
	            }
	        }
	        return this.el("rect", attr);
	    };
	    /*\
	     * Paper.circle
	     [ method ]
	     **
	     * Draws a circle
	     **
	     - x (number) x coordinate of the centre
	     - y (number) y coordinate of the centre
	     - r (number) radius
	     = (object) the `circle` element
	     **
	     > Usage
	     | var c = paper.circle(50, 50, 40);
	    \*/
	    proto.circle = function (cx, cy, r) {
	        var attr;
	        if (is(cx, "object") && cx == "[object Object]") {
	            attr = cx;
	        } else if (cx != null) {
	            attr = {
	                cx: cx,
	                cy: cy,
	                r: r
	            };
	        }
	        return this.el("circle", attr);
	    };

	    var preload = (function () {
	        function onerror() {
	            this.parentNode.removeChild(this);
	        }
	        return function (src, f) {
	            var img = glob.doc.createElement("img"),
	                body = glob.doc.body;
	            img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
	            img.onload = function () {
	                f.call(img);
	                img.onload = img.onerror = null;
	                body.removeChild(img);
	            };
	            img.onerror = onerror;
	            body.appendChild(img);
	            img.src = src;
	        };
	    }());

	    /*\
	     * Paper.image
	     [ method ]
	     **
	     * Places an image on the surface
	     **
	     - src (string) URI of the source image
	     - x (number) x offset position
	     - y (number) y offset position
	     - width (number) width of the image
	     - height (number) height of the image
	     = (object) the `image` element
	     * or
	     = (object) Snap element object with type `image`
	     **
	     > Usage
	     | var c = paper.image("apple.png", 10, 10, 80, 80);
	    \*/
	    proto.image = function (src, x, y, width, height) {
	        var el = this.el("image");
	        if (is(src, "object") && "src" in src) {
	            el.attr(src);
	        } else if (src != null) {
	            var set = {
	                "xlink:href": src,
	                preserveAspectRatio: "none"
	            };
	            if (x != null && y != null) {
	                set.x = x;
	                set.y = y;
	            }
	            if (width != null && height != null) {
	                set.width = width;
	                set.height = height;
	            } else {
	                preload(src, function () {
	                    Snap._.$(el.node, {
	                        width: this.offsetWidth,
	                        height: this.offsetHeight
	                    });
	                });
	            }
	            Snap._.$(el.node, set);
	        }
	        return el;
	    };
	    /*\
	     * Paper.ellipse
	     [ method ]
	     **
	     * Draws an ellipse
	     **
	     - x (number) x coordinate of the centre
	     - y (number) y coordinate of the centre
	     - rx (number) horizontal radius
	     - ry (number) vertical radius
	     = (object) the `ellipse` element
	     **
	     > Usage
	     | var c = paper.ellipse(50, 50, 40, 20);
	    \*/
	    proto.ellipse = function (cx, cy, rx, ry) {
	        var attr;
	        if (is(cx, "object") && cx == "[object Object]") {
	            attr = cx;
	        } else if (cx != null) {
	            attr ={
	                cx: cx,
	                cy: cy,
	                rx: rx,
	                ry: ry
	            };
	        }
	        return this.el("ellipse", attr);
	    };
	    // SIERRA Paper.path(): Unclear from the link what a Catmull-Rom curveto is, and why it would make life any easier.
	    /*\
	     * Paper.path
	     [ method ]
	     **
	     * Creates a `<path>` element using the given string as the path's definition
	     - pathString (string) #optional path string in SVG format
	     * Path string consists of one-letter commands, followed by comma seprarated arguments in numerical form. Example:
	     | "M10,20L30,40"
	     * This example features two commands: `M`, with arguments `(10, 20)` and `L` with arguments `(30, 40)`. Uppercase letter commands express coordinates in absolute terms, while lowercase commands express them in relative terms from the most recently declared coordinates.
	     *
	     # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a> or <a href="https://developer.mozilla.org/en/SVG/Tutorial/Paths">article about path strings at MDN</a>.</p>
	     # <table><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
	     # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
	     # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
	     # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
	     # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
	     # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
	     # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
	     # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
	     # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
	     # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
	     # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
	     # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table>
	     * * _Catmull-Rom curveto_ is a not standard SVG command and added to make life easier.
	     * Note: there is a special case when a path consists of only three commands: `M10,10R…z`. In this case the path connects back to its starting point.
	     > Usage
	     | var c = paper.path("M10 10L90 90");
	     | // draw a diagonal line:
	     | // move to 10,10, line to 90,90
	    \*/
	    proto.path = function (d) {
	        var attr;
	        if (is(d, "object") && !is(d, "array")) {
	            attr = d;
	        } else if (d) {
	            attr = {d: d};
	        }
	        return this.el("path", attr);
	    };
	    /*\
	     * Paper.g
	     [ method ]
	     **
	     * Creates a group element
	     **
	     - varargs (…) #optional elements to nest within the group
	     = (object) the `g` element
	     **
	     > Usage
	     | var c1 = paper.circle(),
	     |     c2 = paper.rect(),
	     |     g = paper.g(c2, c1); // note that the order of elements is different
	     * or
	     | var c1 = paper.circle(),
	     |     c2 = paper.rect(),
	     |     g = paper.g();
	     | g.add(c2, c1);
	    \*/
	    /*\
	     * Paper.group
	     [ method ]
	     **
	     * See @Paper.g
	    \*/
	    proto.group = proto.g = function (first) {
	        var attr,
	            el = this.el("g");
	        if (arguments.length == 1 && first && !first.type) {
	            el.attr(first);
	        } else if (arguments.length) {
	            el.add(Array.prototype.slice.call(arguments, 0));
	        }
	        return el;
	    };
	    /*\
	     * Paper.svg
	     [ method ]
	     **
	     * Creates a nested SVG element.
	     - x (number) @optional X of the element
	     - y (number) @optional Y of the element
	     - width (number) @optional width of the element
	     - height (number) @optional height of the element
	     - vbx (number) @optional viewbox X
	     - vby (number) @optional viewbox Y
	     - vbw (number) @optional viewbox width
	     - vbh (number) @optional viewbox height
	     **
	     = (object) the `svg` element
	     **
	    \*/
	    proto.svg = function (x, y, width, height, vbx, vby, vbw, vbh) {
	        var attrs = {};
	        if (is(x, "object") && y == null) {
	            attrs = x;
	        } else {
	            if (x != null) {
	                attrs.x = x;
	            }
	            if (y != null) {
	                attrs.y = y;
	            }
	            if (width != null) {
	                attrs.width = width;
	            }
	            if (height != null) {
	                attrs.height = height;
	            }
	            if (vbx != null && vby != null && vbw != null && vbh != null) {
	                attrs.viewBox = [vbx, vby, vbw, vbh];
	            }
	        }
	        return this.el("svg", attrs);
	    };
	    /*\
	     * Paper.mask
	     [ method ]
	     **
	     * Equivalent in behaviour to @Paper.g, except it’s a mask.
	     **
	     = (object) the `mask` element
	     **
	    \*/
	    proto.mask = function (first) {
	        var attr,
	            el = this.el("mask");
	        if (arguments.length == 1 && first && !first.type) {
	            el.attr(first);
	        } else if (arguments.length) {
	            el.add(Array.prototype.slice.call(arguments, 0));
	        }
	        return el;
	    };
	    /*\
	     * Paper.ptrn
	     [ method ]
	     **
	     * Equivalent in behaviour to @Paper.g, except it’s a pattern.
	     - x (number) @optional X of the element
	     - y (number) @optional Y of the element
	     - width (number) @optional width of the element
	     - height (number) @optional height of the element
	     - vbx (number) @optional viewbox X
	     - vby (number) @optional viewbox Y
	     - vbw (number) @optional viewbox width
	     - vbh (number) @optional viewbox height
	     **
	     = (object) the `pattern` element
	     **
	    \*/
	    proto.ptrn = function (x, y, width, height, vx, vy, vw, vh) {
	        if (is(x, "object")) {
	            var attr = x;
	        } else {
	            attr = {patternUnits: "userSpaceOnUse"};
	            if (x) {
	                attr.x = x;
	            }
	            if (y) {
	                attr.y = y;
	            }
	            if (width != null) {
	                attr.width = width;
	            }
	            if (height != null) {
	                attr.height = height;
	            }
	            if (vx != null && vy != null && vw != null && vh != null) {
	                attr.viewBox = [vx, vy, vw, vh];
	            } else {
	                attr.viewBox = [x || 0, y || 0, width || 0, height || 0];
	            }
	        }
	        return this.el("pattern", attr);
	    };
	    /*\
	     * Paper.use
	     [ method ]
	     **
	     * Creates a <use> element.
	     - id (string) @optional id of element to link
	     * or
	     - id (Element) @optional element to link
	     **
	     = (object) the `use` element
	     **
	    \*/
	    proto.use = function (id) {
	        if (id != null) {
	            if (id instanceof Element) {
	                if (!id.attr("id")) {
	                    id.attr({id: Snap._.id(id)});
	                }
	                id = id.attr("id");
	            }
	            if (String(id).charAt() == "#") {
	                id = id.substring(1);
	            }
	            return this.el("use", {"xlink:href": "#" + id});
	        } else {
	            return Element.prototype.use.call(this);
	        }
	    };
	    /*\
	     * Paper.symbol
	     [ method ]
	     **
	     * Creates a <symbol> element.
	     - vbx (number) @optional viewbox X
	     - vby (number) @optional viewbox Y
	     - vbw (number) @optional viewbox width
	     - vbh (number) @optional viewbox height
	     = (object) the `symbol` element
	     **
	    \*/
	    proto.symbol = function (vx, vy, vw, vh) {
	        var attr = {};
	        if (vx != null && vy != null && vw != null && vh != null) {
	            attr.viewBox = [vx, vy, vw, vh];
	        }

	        return this.el("symbol", attr);
	    };
	    /*\
	     * Paper.text
	     [ method ]
	     **
	     * Draws a text string
	     **
	     - x (number) x coordinate position
	     - y (number) y coordinate position
	     - text (string|array) The text string to draw or array of strings to nest within separate `<tspan>` elements
	     = (object) the `text` element
	     **
	     > Usage
	     | var t1 = paper.text(50, 50, "Snap");
	     | var t2 = paper.text(50, 50, ["S","n","a","p"]);
	     | // Text path usage
	     | t1.attr({textpath: "M10,10L100,100"});
	     | // or
	     | var pth = paper.path("M10,10L100,100");
	     | t1.attr({textpath: pth});
	    \*/
	    proto.text = function (x, y, text) {
	        var attr = {};
	        if (is(x, "object")) {
	            attr = x;
	        } else if (x != null) {
	            attr = {
	                x: x,
	                y: y,
	                text: text || ""
	            };
	        }
	        return this.el("text", attr);
	    };
	    /*\
	     * Paper.line
	     [ method ]
	     **
	     * Draws a line
	     **
	     - x1 (number) x coordinate position of the start
	     - y1 (number) y coordinate position of the start
	     - x2 (number) x coordinate position of the end
	     - y2 (number) y coordinate position of the end
	     = (object) the `line` element
	     **
	     > Usage
	     | var t1 = paper.line(50, 50, 100, 100);
	    \*/
	    proto.line = function (x1, y1, x2, y2) {
	        var attr = {};
	        if (is(x1, "object")) {
	            attr = x1;
	        } else if (x1 != null) {
	            attr = {
	                x1: x1,
	                x2: x2,
	                y1: y1,
	                y2: y2
	            };
	        }
	        return this.el("line", attr);
	    };
	    /*\
	     * Paper.polyline
	     [ method ]
	     **
	     * Draws a polyline
	     **
	     - points (array) array of points
	     * or
	     - varargs (…) points
	     = (object) the `polyline` element
	     **
	     > Usage
	     | var p1 = paper.polyline([10, 10, 100, 100]);
	     | var p2 = paper.polyline(10, 10, 100, 100);
	    \*/
	    proto.polyline = function (points) {
	        if (arguments.length > 1) {
	            points = Array.prototype.slice.call(arguments, 0);
	        }
	        var attr = {};
	        if (is(points, "object") && !is(points, "array")) {
	            attr = points;
	        } else if (points != null) {
	            attr = {points: points};
	        }
	        return this.el("polyline", attr);
	    };
	    /*\
	     * Paper.polygon
	     [ method ]
	     **
	     * Draws a polygon. See @Paper.polyline
	    \*/
	    proto.polygon = function (points) {
	        if (arguments.length > 1) {
	            points = Array.prototype.slice.call(arguments, 0);
	        }
	        var attr = {};
	        if (is(points, "object") && !is(points, "array")) {
	            attr = points;
	        } else if (points != null) {
	            attr = {points: points};
	        }
	        return this.el("polygon", attr);
	    };
	    // gradients
	    (function () {
	        var $ = Snap._.$;
	        // gradients' helpers
	        function Gstops() {
	            return this.selectAll("stop");
	        }
	        function GaddStop(color, offset) {
	            var stop = $("stop"),
	                attr = {
	                    offset: +offset + "%"
	                };
	            color = Snap.color(color);
	            attr["stop-color"] = color.hex;
	            if (color.opacity < 1) {
	                attr["stop-opacity"] = color.opacity;
	            }
	            $(stop, attr);
	            this.node.appendChild(stop);
	            return this;
	        }
	        function GgetBBox() {
	            if (this.type == "linearGradient") {
	                var x1 = $(this.node, "x1") || 0,
	                    x2 = $(this.node, "x2") || 1,
	                    y1 = $(this.node, "y1") || 0,
	                    y2 = $(this.node, "y2") || 0;
	                return Snap._.box(x1, y1, math.abs(x2 - x1), math.abs(y2 - y1));
	            } else {
	                var cx = this.node.cx || .5,
	                    cy = this.node.cy || .5,
	                    r = this.node.r || 0;
	                return Snap._.box(cx - r, cy - r, r * 2, r * 2);
	            }
	        }
	        function gradient(defs, str) {
	            var grad = eve("snap.util.grad.parse", null, str).firstDefined(),
	                el;
	            if (!grad) {
	                return null;
	            }
	            grad.params.unshift(defs);
	            if (grad.type.toLowerCase() == "l") {
	                el = gradientLinear.apply(0, grad.params);
	            } else {
	                el = gradientRadial.apply(0, grad.params);
	            }
	            if (grad.type != grad.type.toLowerCase()) {
	                $(el.node, {
	                    gradientUnits: "userSpaceOnUse"
	                });
	            }
	            var stops = grad.stops,
	                len = stops.length,
	                start = 0,
	                j = 0;
	            function seed(i, end) {
	                var step = (end - start) / (i - j);
	                for (var k = j; k < i; k++) {
	                    stops[k].offset = +(+start + step * (k - j)).toFixed(2);
	                }
	                j = i;
	                start = end;
	            }
	            len--;
	            for (var i = 0; i < len; i++) if ("offset" in stops[i]) {
	                seed(i, stops[i].offset);
	            }
	            stops[len].offset = stops[len].offset || 100;
	            seed(len, stops[len].offset);
	            for (i = 0; i <= len; i++) {
	                var stop = stops[i];
	                el.addStop(stop.color, stop.offset);
	            }
	            return el;
	        }
	        function gradientLinear(defs, x1, y1, x2, y2) {
	            var el = Snap._.make("linearGradient", defs);
	            el.stops = Gstops;
	            el.addStop = GaddStop;
	            el.getBBox = GgetBBox;
	            if (x1 != null) {
	                $(el.node, {
	                    x1: x1,
	                    y1: y1,
	                    x2: x2,
	                    y2: y2
	                });
	            }
	            return el;
	        }
	        function gradientRadial(defs, cx, cy, r, fx, fy) {
	            var el = Snap._.make("radialGradient", defs);
	            el.stops = Gstops;
	            el.addStop = GaddStop;
	            el.getBBox = GgetBBox;
	            if (cx != null) {
	                $(el.node, {
	                    cx: cx,
	                    cy: cy,
	                    r: r
	                });
	            }
	            if (fx != null && fy != null) {
	                $(el.node, {
	                    fx: fx,
	                    fy: fy
	                });
	            }
	            return el;
	        }
	        /*\
	         * Paper.gradient
	         [ method ]
	         **
	         * Creates a gradient element
	         **
	         - gradient (string) gradient descriptor
	         > Gradient Descriptor
	         * The gradient descriptor is an expression formatted as
	         * follows: `<type>(<coords>)<colors>`.  The `<type>` can be
	         * either linear or radial.  The uppercase `L` or `R` letters
	         * indicate absolute coordinates offset from the SVG surface.
	         * Lowercase `l` or `r` letters indicate coordinates
	         * calculated relative to the element to which the gradient is
	         * applied.  Coordinates specify a linear gradient vector as
	         * `x1`, `y1`, `x2`, `y2`, or a radial gradient as `cx`, `cy`,
	         * `r` and optional `fx`, `fy` specifying a focal point away
	         * from the center of the circle. Specify `<colors>` as a list
	         * of dash-separated CSS color values.  Each color may be
	         * followed by a custom offset value, separated with a colon
	         * character.
	         > Examples
	         * Linear gradient, relative from top-left corner to bottom-right
	         * corner, from black through red to white:
	         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
	         * Linear gradient, absolute from (0, 0) to (100, 100), from black
	         * through red at 25% to white:
	         | var g = paper.gradient("L(0, 0, 100, 100)#000-#f00:25-#fff");
	         * Radial gradient, relative from the center of the element with radius
	         * half the width, from black to white:
	         | var g = paper.gradient("r(0.5, 0.5, 0.5)#000-#fff");
	         * To apply the gradient:
	         | paper.circle(50, 50, 40).attr({
	         |     fill: g
	         | });
	         = (object) the `gradient` element
	        \*/
	        proto.gradient = function (str) {
	            return gradient(this.defs, str);
	        };
	        proto.gradientLinear = function (x1, y1, x2, y2) {
	            return gradientLinear(this.defs, x1, y1, x2, y2);
	        };
	        proto.gradientRadial = function (cx, cy, r, fx, fy) {
	            return gradientRadial(this.defs, cx, cy, r, fx, fy);
	        };
	        /*\
	         * Paper.toString
	         [ method ]
	         **
	         * Returns SVG code for the @Paper
	         = (string) SVG code for the @Paper
	        \*/
	        proto.toString = function () {
	            var doc = this.node.ownerDocument,
	                f = doc.createDocumentFragment(),
	                d = doc.createElement("div"),
	                svg = this.node.cloneNode(true),
	                res;
	            f.appendChild(d);
	            d.appendChild(svg);
	            Snap._.$(svg, {xmlns: "http://www.w3.org/2000/svg"});
	            res = d.innerHTML;
	            f.removeChild(f.firstChild);
	            return res;
	        };
	        /*\
	         * Paper.toDataURL
	         [ method ]
	         **
	         * Returns SVG code for the @Paper as Data URI string.
	         = (string) Data URI string
	        \*/
	        proto.toDataURL = function () {
	            if (window && window.btoa) {
	                return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this)));
	            }
	        };
	        /*\
	         * Paper.clear
	         [ method ]
	         **
	         * Removes all child nodes of the paper, except <defs>.
	        \*/
	        proto.clear = function () {
	            var node = this.node.firstChild,
	                next;
	            while (node) {
	                next = node.nextSibling;
	                if (node.tagName != "defs") {
	                    node.parentNode.removeChild(node);
	                } else {
	                    proto.clear.call({node: node});
	                }
	                node = next;
	            }
	        };
	    }());
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob) {
	    var elproto = Element.prototype,
	        is = Snap.is,
	        clone = Snap._.clone,
	        has = "hasOwnProperty",
	        p2s = /,?([a-z]),?/gi,
	        toFloat = parseFloat,
	        math = Math,
	        PI = math.PI,
	        mmin = math.min,
	        mmax = math.max,
	        pow = math.pow,
	        abs = math.abs;
	    function paths(ps) {
	        var p = paths.ps = paths.ps || {};
	        if (p[ps]) {
	            p[ps].sleep = 100;
	        } else {
	            p[ps] = {
	                sleep: 100
	            };
	        }
	        setTimeout(function () {
	            for (var key in p) if (p[has](key) && key != ps) {
	                p[key].sleep--;
	                !p[key].sleep && delete p[key];
	            }
	        });
	        return p[ps];
	    }
	    function box(x, y, width, height) {
	        if (x == null) {
	            x = y = width = height = 0;
	        }
	        if (y == null) {
	            y = x.y;
	            width = x.width;
	            height = x.height;
	            x = x.x;
	        }
	        return {
	            x: x,
	            y: y,
	            width: width,
	            w: width,
	            height: height,
	            h: height,
	            x2: x + width,
	            y2: y + height,
	            cx: x + width / 2,
	            cy: y + height / 2,
	            r1: math.min(width, height) / 2,
	            r2: math.max(width, height) / 2,
	            r0: math.sqrt(width * width + height * height) / 2,
	            path: rectPath(x, y, width, height),
	            vb: [x, y, width, height].join(" ")
	        };
	    }
	    function toString() {
	        return this.join(",").replace(p2s, "$1");
	    }
	    function pathClone(pathArray) {
	        var res = clone(pathArray);
	        res.toString = toString;
	        return res;
	    }
	    function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
	        if (length == null) {
	            return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
	        } else {
	            return findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y,
	                getTotLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
	        }
	    }
	    function getLengthFactory(istotal, subpath) {
	        function O(val) {
	            return +(+val).toFixed(3);
	        }
	        return Snap._.cacher(function (path, length, onlystart) {
	            if (path instanceof Element) {
	                path = path.attr("d");
	            }
	            path = path2curve(path);
	            var x, y, p, l, sp = "", subpaths = {}, point,
	                len = 0;
	            for (var i = 0, ii = path.length; i < ii; i++) {
	                p = path[i];
	                if (p[0] == "M") {
	                    x = +p[1];
	                    y = +p[2];
	                } else {
	                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
	                    if (len + l > length) {
	                        if (subpath && !subpaths.start) {
	                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
	                            sp += [
	                                "C" + O(point.start.x),
	                                O(point.start.y),
	                                O(point.m.x),
	                                O(point.m.y),
	                                O(point.x),
	                                O(point.y)
	                            ];
	                            if (onlystart) {return sp;}
	                            subpaths.start = sp;
	                            sp = [
	                                "M" + O(point.x),
	                                O(point.y) + "C" + O(point.n.x),
	                                O(point.n.y),
	                                O(point.end.x),
	                                O(point.end.y),
	                                O(p[5]),
	                                O(p[6])
	                            ].join();
	                            len += l;
	                            x = +p[5];
	                            y = +p[6];
	                            continue;
	                        }
	                        if (!istotal && !subpath) {
	                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
	                            return point;
	                        }
	                    }
	                    len += l;
	                    x = +p[5];
	                    y = +p[6];
	                }
	                sp += p.shift() + p;
	            }
	            subpaths.end = sp;
	            point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
	            return point;
	        }, null, Snap._.clone);
	    }
	    var getTotalLength = getLengthFactory(1),
	        getPointAtLength = getLengthFactory(),
	        getSubpathsAtLength = getLengthFactory(0, 1);
	    function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
	        var t1 = 1 - t,
	            t13 = pow(t1, 3),
	            t12 = pow(t1, 2),
	            t2 = t * t,
	            t3 = t2 * t,
	            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
	            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
	            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
	            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
	            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
	            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
	            ax = t1 * p1x + t * c1x,
	            ay = t1 * p1y + t * c1y,
	            cx = t1 * c2x + t * p2x,
	            cy = t1 * c2y + t * p2y,
	            alpha = (90 - math.atan2(mx - nx, my - ny) * 180 / PI);
	        // (mx > nx || my < ny) && (alpha += 180);
	        return {
	            x: x,
	            y: y,
	            m: {x: mx, y: my},
	            n: {x: nx, y: ny},
	            start: {x: ax, y: ay},
	            end: {x: cx, y: cy},
	            alpha: alpha
	        };
	    }
	    function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
	        if (!Snap.is(p1x, "array")) {
	            p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
	        }
	        var bbox = curveDim.apply(null, p1x);
	        return box(
	            bbox.min.x,
	            bbox.min.y,
	            bbox.max.x - bbox.min.x,
	            bbox.max.y - bbox.min.y
	        );
	    }
	    function isPointInsideBBox(bbox, x, y) {
	        return  x >= bbox.x &&
	                x <= bbox.x + bbox.width &&
	                y >= bbox.y &&
	                y <= bbox.y + bbox.height;
	    }
	    function isBBoxIntersect(bbox1, bbox2) {
	        bbox1 = box(bbox1);
	        bbox2 = box(bbox2);
	        return isPointInsideBBox(bbox2, bbox1.x, bbox1.y)
	            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y)
	            || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2)
	            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2)
	            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y)
	            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y)
	            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2)
	            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2)
	            || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x
	                || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x)
	            && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y
	                || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
	    }
	    function base3(t, p1, p2, p3, p4) {
	        var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
	            t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
	        return t * t2 - 3 * p1 + 3 * p2;
	    }
	    function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
	        if (z == null) {
	            z = 1;
	        }
	        z = z > 1 ? 1 : z < 0 ? 0 : z;
	        var z2 = z / 2,
	            n = 12,
	            Tvalues = [-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],
	            Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],
	            sum = 0;
	        for (var i = 0; i < n; i++) {
	            var ct = z2 * Tvalues[i] + z2,
	                xbase = base3(ct, x1, x2, x3, x4),
	                ybase = base3(ct, y1, y2, y3, y4),
	                comb = xbase * xbase + ybase * ybase;
	            sum += Cvalues[i] * math.sqrt(comb);
	        }
	        return z2 * sum;
	    }
	    function getTotLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
	        if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
	            return;
	        }
	        var t = 1,
	            step = t / 2,
	            t2 = t - step,
	            l,
	            e = .01;
	        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
	        while (abs(l - ll) > e) {
	            step /= 2;
	            t2 += (l < ll ? 1 : -1) * step;
	            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
	        }
	        return t2;
	    }
	    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	        if (
	            mmax(x1, x2) < mmin(x3, x4) ||
	            mmin(x1, x2) > mmax(x3, x4) ||
	            mmax(y1, y2) < mmin(y3, y4) ||
	            mmin(y1, y2) > mmax(y3, y4)
	        ) {
	            return;
	        }
	        var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
	            ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
	            denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

	        if (!denominator) {
	            return;
	        }
	        var px = nx / denominator,
	            py = ny / denominator,
	            px2 = +px.toFixed(2),
	            py2 = +py.toFixed(2);
	        if (
	            px2 < +mmin(x1, x2).toFixed(2) ||
	            px2 > +mmax(x1, x2).toFixed(2) ||
	            px2 < +mmin(x3, x4).toFixed(2) ||
	            px2 > +mmax(x3, x4).toFixed(2) ||
	            py2 < +mmin(y1, y2).toFixed(2) ||
	            py2 > +mmax(y1, y2).toFixed(2) ||
	            py2 < +mmin(y3, y4).toFixed(2) ||
	            py2 > +mmax(y3, y4).toFixed(2)
	        ) {
	            return;
	        }
	        return {x: px, y: py};
	    }
	    function inter(bez1, bez2) {
	        return interHelper(bez1, bez2);
	    }
	    function interCount(bez1, bez2) {
	        return interHelper(bez1, bez2, 1);
	    }
	    function interHelper(bez1, bez2, justCount) {
	        var bbox1 = bezierBBox(bez1),
	            bbox2 = bezierBBox(bez2);
	        if (!isBBoxIntersect(bbox1, bbox2)) {
	            return justCount ? 0 : [];
	        }
	        var l1 = bezlen.apply(0, bez1),
	            l2 = bezlen.apply(0, bez2),
	            n1 = ~~(l1 / 8),
	            n2 = ~~(l2 / 8),
	            dots1 = [],
	            dots2 = [],
	            xy = {},
	            res = justCount ? 0 : [];
	        for (var i = 0; i < n1 + 1; i++) {
	            var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
	            dots1.push({x: p.x, y: p.y, t: i / n1});
	        }
	        for (i = 0; i < n2 + 1; i++) {
	            p = findDotsAtSegment.apply(0, bez2.concat(i / n2));
	            dots2.push({x: p.x, y: p.y, t: i / n2});
	        }
	        for (i = 0; i < n1; i++) {
	            for (var j = 0; j < n2; j++) {
	                var di = dots1[i],
	                    di1 = dots1[i + 1],
	                    dj = dots2[j],
	                    dj1 = dots2[j + 1],
	                    ci = abs(di1.x - di.x) < .001 ? "y" : "x",
	                    cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
	                    is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
	                if (is) {
	                    if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
	                        continue;
	                    }
	                    xy[is.x.toFixed(4)] = is.y.toFixed(4);
	                    var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
	                        t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
	                    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
	                        if (justCount) {
	                            res++;
	                        } else {
	                            res.push({
	                                x: is.x,
	                                y: is.y,
	                                t1: t1,
	                                t2: t2
	                            });
	                        }
	                    }
	                }
	            }
	        }
	        return res;
	    }
	    function pathIntersection(path1, path2) {
	        return interPathHelper(path1, path2);
	    }
	    function pathIntersectionNumber(path1, path2) {
	        return interPathHelper(path1, path2, 1);
	    }
	    function interPathHelper(path1, path2, justCount) {
	        path1 = path2curve(path1);
	        path2 = path2curve(path2);
	        var x1, y1, x2, y2, x1m, y1m, x2m, y2m, bez1, bez2,
	            res = justCount ? 0 : [];
	        for (var i = 0, ii = path1.length; i < ii; i++) {
	            var pi = path1[i];
	            if (pi[0] == "M") {
	                x1 = x1m = pi[1];
	                y1 = y1m = pi[2];
	            } else {
	                if (pi[0] == "C") {
	                    bez1 = [x1, y1].concat(pi.slice(1));
	                    x1 = bez1[6];
	                    y1 = bez1[7];
	                } else {
	                    bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
	                    x1 = x1m;
	                    y1 = y1m;
	                }
	                for (var j = 0, jj = path2.length; j < jj; j++) {
	                    var pj = path2[j];
	                    if (pj[0] == "M") {
	                        x2 = x2m = pj[1];
	                        y2 = y2m = pj[2];
	                    } else {
	                        if (pj[0] == "C") {
	                            bez2 = [x2, y2].concat(pj.slice(1));
	                            x2 = bez2[6];
	                            y2 = bez2[7];
	                        } else {
	                            bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
	                            x2 = x2m;
	                            y2 = y2m;
	                        }
	                        var intr = interHelper(bez1, bez2, justCount);
	                        if (justCount) {
	                            res += intr;
	                        } else {
	                            for (var k = 0, kk = intr.length; k < kk; k++) {
	                                intr[k].segment1 = i;
	                                intr[k].segment2 = j;
	                                intr[k].bez1 = bez1;
	                                intr[k].bez2 = bez2;
	                            }
	                            res = res.concat(intr);
	                        }
	                    }
	                }
	            }
	        }
	        return res;
	    }
	    function isPointInsidePath(path, x, y) {
	        var bbox = pathBBox(path);
	        return isPointInsideBBox(bbox, x, y) &&
	               interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
	    }
	    function pathBBox(path) {
	        var pth = paths(path);
	        if (pth.bbox) {
	            return clone(pth.bbox);
	        }
	        if (!path) {
	            return box();
	        }
	        path = path2curve(path);
	        var x = 0, 
	            y = 0,
	            X = [],
	            Y = [],
	            p;
	        for (var i = 0, ii = path.length; i < ii; i++) {
	            p = path[i];
	            if (p[0] == "M") {
	                x = p[1];
	                y = p[2];
	                X.push(x);
	                Y.push(y);
	            } else {
	                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
	                X = X.concat(dim.min.x, dim.max.x);
	                Y = Y.concat(dim.min.y, dim.max.y);
	                x = p[5];
	                y = p[6];
	            }
	        }
	        var xmin = mmin.apply(0, X),
	            ymin = mmin.apply(0, Y),
	            xmax = mmax.apply(0, X),
	            ymax = mmax.apply(0, Y),
	            bb = box(xmin, ymin, xmax - xmin, ymax - ymin);
	        pth.bbox = clone(bb);
	        return bb;
	    }
	    function rectPath(x, y, w, h, r) {
	        if (r) {
	            return [
	                ["M", +x + (+r), y],
	                ["l", w - r * 2, 0],
	                ["a", r, r, 0, 0, 1, r, r],
	                ["l", 0, h - r * 2],
	                ["a", r, r, 0, 0, 1, -r, r],
	                ["l", r * 2 - w, 0],
	                ["a", r, r, 0, 0, 1, -r, -r],
	                ["l", 0, r * 2 - h],
	                ["a", r, r, 0, 0, 1, r, -r],
	                ["z"]
	            ];
	        }
	        var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
	        res.toString = toString;
	        return res;
	    }
	    function ellipsePath(x, y, rx, ry, a) {
	        if (a == null && ry == null) {
	            ry = rx;
	        }
	        x = +x;
	        y = +y;
	        rx = +rx;
	        ry = +ry;
	        if (a != null) {
	            var rad = Math.PI / 180,
	                x1 = x + rx * Math.cos(-ry * rad),
	                x2 = x + rx * Math.cos(-a * rad),
	                y1 = y + rx * Math.sin(-ry * rad),
	                y2 = y + rx * Math.sin(-a * rad),
	                res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
	        } else {
	            res = [
	                ["M", x, y],
	                ["m", 0, -ry],
	                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
	                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
	                ["z"]
	            ];
	        }
	        res.toString = toString;
	        return res;
	    }
	    var unit2px = Snap._unit2px,
	        getPath = {
	        path: function (el) {
	            return el.attr("path");
	        },
	        circle: function (el) {
	            var attr = unit2px(el);
	            return ellipsePath(attr.cx, attr.cy, attr.r);
	        },
	        ellipse: function (el) {
	            var attr = unit2px(el);
	            return ellipsePath(attr.cx || 0, attr.cy || 0, attr.rx, attr.ry);
	        },
	        rect: function (el) {
	            var attr = unit2px(el);
	            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height, attr.rx, attr.ry);
	        },
	        image: function (el) {
	            var attr = unit2px(el);
	            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height);
	        },
	        line: function (el) {
	            return "M" + [el.attr("x1") || 0, el.attr("y1") || 0, el.attr("x2"), el.attr("y2")];
	        },
	        polyline: function (el) {
	            return "M" + el.attr("points");
	        },
	        polygon: function (el) {
	            return "M" + el.attr("points") + "z";
	        },
	        deflt: function (el) {
	            var bbox = el.node.getBBox();
	            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
	        }
	    };
	    function pathToRelative(pathArray) {
	        var pth = paths(pathArray),
	            lowerCase = String.prototype.toLowerCase;
	        if (pth.rel) {
	            return pathClone(pth.rel);
	        }
	        if (!Snap.is(pathArray, "array") || !Snap.is(pathArray && pathArray[0], "array")) {
	            pathArray = Snap.parsePathString(pathArray);
	        }
	        var res = [],
	            x = 0,
	            y = 0,
	            mx = 0,
	            my = 0,
	            start = 0;
	        if (pathArray[0][0] == "M") {
	            x = pathArray[0][1];
	            y = pathArray[0][2];
	            mx = x;
	            my = y;
	            start++;
	            res.push(["M", x, y]);
	        }
	        for (var i = start, ii = pathArray.length; i < ii; i++) {
	            var r = res[i] = [],
	                pa = pathArray[i];
	            if (pa[0] != lowerCase.call(pa[0])) {
	                r[0] = lowerCase.call(pa[0]);
	                switch (r[0]) {
	                    case "a":
	                        r[1] = pa[1];
	                        r[2] = pa[2];
	                        r[3] = pa[3];
	                        r[4] = pa[4];
	                        r[5] = pa[5];
	                        r[6] = +(pa[6] - x).toFixed(3);
	                        r[7] = +(pa[7] - y).toFixed(3);
	                        break;
	                    case "v":
	                        r[1] = +(pa[1] - y).toFixed(3);
	                        break;
	                    case "m":
	                        mx = pa[1];
	                        my = pa[2];
	                    default:
	                        for (var j = 1, jj = pa.length; j < jj; j++) {
	                            r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
	                        }
	                }
	            } else {
	                r = res[i] = [];
	                if (pa[0] == "m") {
	                    mx = pa[1] + x;
	                    my = pa[2] + y;
	                }
	                for (var k = 0, kk = pa.length; k < kk; k++) {
	                    res[i][k] = pa[k];
	                }
	            }
	            var len = res[i].length;
	            switch (res[i][0]) {
	                case "z":
	                    x = mx;
	                    y = my;
	                    break;
	                case "h":
	                    x += +res[i][len - 1];
	                    break;
	                case "v":
	                    y += +res[i][len - 1];
	                    break;
	                default:
	                    x += +res[i][len - 2];
	                    y += +res[i][len - 1];
	            }
	        }
	        res.toString = toString;
	        pth.rel = pathClone(res);
	        return res;
	    }
	    function pathToAbsolute(pathArray) {
	        var pth = paths(pathArray);
	        if (pth.abs) {
	            return pathClone(pth.abs);
	        }
	        if (!is(pathArray, "array") || !is(pathArray && pathArray[0], "array")) { // rough assumption
	            pathArray = Snap.parsePathString(pathArray);
	        }
	        if (!pathArray || !pathArray.length) {
	            return [["M", 0, 0]];
	        }
	        var res = [],
	            x = 0,
	            y = 0,
	            mx = 0,
	            my = 0,
	            start = 0,
	            pa0;
	        if (pathArray[0][0] == "M") {
	            x = +pathArray[0][1];
	            y = +pathArray[0][2];
	            mx = x;
	            my = y;
	            start++;
	            res[0] = ["M", x, y];
	        }
	        var crz = pathArray.length == 3 &&
	            pathArray[0][0] == "M" &&
	            pathArray[1][0].toUpperCase() == "R" &&
	            pathArray[2][0].toUpperCase() == "Z";
	        for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
	            res.push(r = []);
	            pa = pathArray[i];
	            pa0 = pa[0];
	            if (pa0 != pa0.toUpperCase()) {
	                r[0] = pa0.toUpperCase();
	                switch (r[0]) {
	                    case "A":
	                        r[1] = pa[1];
	                        r[2] = pa[2];
	                        r[3] = pa[3];
	                        r[4] = pa[4];
	                        r[5] = pa[5];
	                        r[6] = +pa[6] + x;
	                        r[7] = +pa[7] + y;
	                        break;
	                    case "V":
	                        r[1] = +pa[1] + y;
	                        break;
	                    case "H":
	                        r[1] = +pa[1] + x;
	                        break;
	                    case "R":
	                        var dots = [x, y].concat(pa.slice(1));
	                        for (var j = 2, jj = dots.length; j < jj; j++) {
	                            dots[j] = +dots[j] + x;
	                            dots[++j] = +dots[j] + y;
	                        }
	                        res.pop();
	                        res = res.concat(catmullRom2bezier(dots, crz));
	                        break;
	                    case "O":
	                        res.pop();
	                        dots = ellipsePath(x, y, pa[1], pa[2]);
	                        dots.push(dots[0]);
	                        res = res.concat(dots);
	                        break;
	                    case "U":
	                        res.pop();
	                        res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
	                        r = ["U"].concat(res[res.length - 1].slice(-2));
	                        break;
	                    case "M":
	                        mx = +pa[1] + x;
	                        my = +pa[2] + y;
	                    default:
	                        for (j = 1, jj = pa.length; j < jj; j++) {
	                            r[j] = +pa[j] + ((j % 2) ? x : y);
	                        }
	                }
	            } else if (pa0 == "R") {
	                dots = [x, y].concat(pa.slice(1));
	                res.pop();
	                res = res.concat(catmullRom2bezier(dots, crz));
	                r = ["R"].concat(pa.slice(-2));
	            } else if (pa0 == "O") {
	                res.pop();
	                dots = ellipsePath(x, y, pa[1], pa[2]);
	                dots.push(dots[0]);
	                res = res.concat(dots);
	            } else if (pa0 == "U") {
	                res.pop();
	                res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
	                r = ["U"].concat(res[res.length - 1].slice(-2));
	            } else {
	                for (var k = 0, kk = pa.length; k < kk; k++) {
	                    r[k] = pa[k];
	                }
	            }
	            pa0 = pa0.toUpperCase();
	            if (pa0 != "O") {
	                switch (r[0]) {
	                    case "Z":
	                        x = +mx;
	                        y = +my;
	                        break;
	                    case "H":
	                        x = r[1];
	                        break;
	                    case "V":
	                        y = r[1];
	                        break;
	                    case "M":
	                        mx = r[r.length - 2];
	                        my = r[r.length - 1];
	                    default:
	                        x = r[r.length - 2];
	                        y = r[r.length - 1];
	                }
	            }
	        }
	        res.toString = toString;
	        pth.abs = pathClone(res);
	        return res;
	    }
	    function l2c(x1, y1, x2, y2) {
	        return [x1, y1, x2, y2, x2, y2];
	    }
	    function q2c(x1, y1, ax, ay, x2, y2) {
	        var _13 = 1 / 3,
	            _23 = 2 / 3;
	        return [
	                _13 * x1 + _23 * ax,
	                _13 * y1 + _23 * ay,
	                _13 * x2 + _23 * ax,
	                _13 * y2 + _23 * ay,
	                x2,
	                y2
	            ];
	    }
	    function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
	        // for more information of where this math came from visit:
	        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
	        var _120 = PI * 120 / 180,
	            rad = PI / 180 * (+angle || 0),
	            res = [],
	            xy,
	            rotate = Snap._.cacher(function (x, y, rad) {
	                var X = x * math.cos(rad) - y * math.sin(rad),
	                    Y = x * math.sin(rad) + y * math.cos(rad);
	                return {x: X, y: Y};
	            });
	        if (!recursive) {
	            xy = rotate(x1, y1, -rad);
	            x1 = xy.x;
	            y1 = xy.y;
	            xy = rotate(x2, y2, -rad);
	            x2 = xy.x;
	            y2 = xy.y;
	            var cos = math.cos(PI / 180 * angle),
	                sin = math.sin(PI / 180 * angle),
	                x = (x1 - x2) / 2,
	                y = (y1 - y2) / 2;
	            var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
	            if (h > 1) {
	                h = math.sqrt(h);
	                rx = h * rx;
	                ry = h * ry;
	            }
	            var rx2 = rx * rx,
	                ry2 = ry * ry,
	                k = (large_arc_flag == sweep_flag ? -1 : 1) *
	                    math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
	                cx = k * rx * y / ry + (x1 + x2) / 2,
	                cy = k * -ry * x / rx + (y1 + y2) / 2,
	                f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
	                f2 = math.asin(((y2 - cy) / ry).toFixed(9));

	            f1 = x1 < cx ? PI - f1 : f1;
	            f2 = x2 < cx ? PI - f2 : f2;
	            f1 < 0 && (f1 = PI * 2 + f1);
	            f2 < 0 && (f2 = PI * 2 + f2);
	            if (sweep_flag && f1 > f2) {
	                f1 = f1 - PI * 2;
	            }
	            if (!sweep_flag && f2 > f1) {
	                f2 = f2 - PI * 2;
	            }
	        } else {
	            f1 = recursive[0];
	            f2 = recursive[1];
	            cx = recursive[2];
	            cy = recursive[3];
	        }
	        var df = f2 - f1;
	        if (abs(df) > _120) {
	            var f2old = f2,
	                x2old = x2,
	                y2old = y2;
	            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
	            x2 = cx + rx * math.cos(f2);
	            y2 = cy + ry * math.sin(f2);
	            res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
	        }
	        df = f2 - f1;
	        var c1 = math.cos(f1),
	            s1 = math.sin(f1),
	            c2 = math.cos(f2),
	            s2 = math.sin(f2),
	            t = math.tan(df / 4),
	            hx = 4 / 3 * rx * t,
	            hy = 4 / 3 * ry * t,
	            m1 = [x1, y1],
	            m2 = [x1 + hx * s1, y1 - hy * c1],
	            m3 = [x2 + hx * s2, y2 - hy * c2],
	            m4 = [x2, y2];
	        m2[0] = 2 * m1[0] - m2[0];
	        m2[1] = 2 * m1[1] - m2[1];
	        if (recursive) {
	            return [m2, m3, m4].concat(res);
	        } else {
	            res = [m2, m3, m4].concat(res).join().split(",");
	            var newres = [];
	            for (var i = 0, ii = res.length; i < ii; i++) {
	                newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
	            }
	            return newres;
	        }
	    }
	    function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
	        var t1 = 1 - t;
	        return {
	            x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
	            y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
	        };
	    }
	    
	    // Returns bounding box of cubic bezier curve.
	    // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
	    // Original version: NISHIO Hirokazu
	    // Modifications: https://github.com/timo22345
	    function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
	        var tvalues = [],
	            bounds = [[], []],
	            a, b, c, t, t1, t2, b2ac, sqrtb2ac;
	        for (var i = 0; i < 2; ++i) {
	            if (i == 0) {
	                b = 6 * x0 - 12 * x1 + 6 * x2;
	                a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
	                c = 3 * x1 - 3 * x0;
	            } else {
	                b = 6 * y0 - 12 * y1 + 6 * y2;
	                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
	                c = 3 * y1 - 3 * y0;
	            }
	            if (abs(a) < 1e-12) {
	                if (abs(b) < 1e-12) {
	                    continue;
	                }
	                t = -c / b;
	                if (0 < t && t < 1) {
	                    tvalues.push(t);
	                }
	                continue;
	            }
	            b2ac = b * b - 4 * c * a;
	            sqrtb2ac = math.sqrt(b2ac);
	            if (b2ac < 0) {
	                continue;
	            }
	            t1 = (-b + sqrtb2ac) / (2 * a);
	            if (0 < t1 && t1 < 1) {
	                tvalues.push(t1);
	            }
	            t2 = (-b - sqrtb2ac) / (2 * a);
	            if (0 < t2 && t2 < 1) {
	                tvalues.push(t2);
	            }
	        }

	        var x, y, j = tvalues.length,
	            jlen = j,
	            mt;
	        while (j--) {
	            t = tvalues[j];
	            mt = 1 - t;
	            bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
	            bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
	        }

	        bounds[0][jlen] = x0;
	        bounds[1][jlen] = y0;
	        bounds[0][jlen + 1] = x3;
	        bounds[1][jlen + 1] = y3;
	        bounds[0].length = bounds[1].length = jlen + 2;


	        return {
	          min: {x: mmin.apply(0, bounds[0]), y: mmin.apply(0, bounds[1])},
	          max: {x: mmax.apply(0, bounds[0]), y: mmax.apply(0, bounds[1])}
	        };
	    }

	    function path2curve(path, path2) {
	        var pth = !path2 && paths(path);
	        if (!path2 && pth.curve) {
	            return pathClone(pth.curve);
	        }
	        var p = pathToAbsolute(path),
	            p2 = path2 && pathToAbsolute(path2),
	            attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
	            attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
	            processPath = function (path, d, pcom) {
	                var nx, ny;
	                if (!path) {
	                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
	                }
	                !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
	                switch (path[0]) {
	                    case "M":
	                        d.X = path[1];
	                        d.Y = path[2];
	                        break;
	                    case "A":
	                        path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
	                        break;
	                    case "S":
	                        if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
	                            nx = d.x * 2 - d.bx;          // And reflect the previous
	                            ny = d.y * 2 - d.by;          // command's control point relative to the current point.
	                        }
	                        else {                            // or some else or nothing
	                            nx = d.x;
	                            ny = d.y;
	                        }
	                        path = ["C", nx, ny].concat(path.slice(1));
	                        break;
	                    case "T":
	                        if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
	                            d.qx = d.x * 2 - d.qx;        // And make a reflection similar
	                            d.qy = d.y * 2 - d.qy;        // to case "S".
	                        }
	                        else {                            // or something else or nothing
	                            d.qx = d.x;
	                            d.qy = d.y;
	                        }
	                        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
	                        break;
	                    case "Q":
	                        d.qx = path[1];
	                        d.qy = path[2];
	                        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
	                        break;
	                    case "L":
	                        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
	                        break;
	                    case "H":
	                        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
	                        break;
	                    case "V":
	                        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
	                        break;
	                    case "Z":
	                        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
	                        break;
	                }
	                return path;
	            },
	            fixArc = function (pp, i) {
	                if (pp[i].length > 7) {
	                    pp[i].shift();
	                    var pi = pp[i];
	                    while (pi.length) {
	                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
	                        p2 && (pcoms2[i] = "A"); // the same as above
	                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
	                    }
	                    pp.splice(i, 1);
	                    ii = mmax(p.length, p2 && p2.length || 0);
	                }
	            },
	            fixM = function (path1, path2, a1, a2, i) {
	                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
	                    path2.splice(i, 0, ["M", a2.x, a2.y]);
	                    a1.bx = 0;
	                    a1.by = 0;
	                    a1.x = path1[i][1];
	                    a1.y = path1[i][2];
	                    ii = mmax(p.length, p2 && p2.length || 0);
	                }
	            },
	            pcoms1 = [], // path commands of original path p
	            pcoms2 = [], // path commands of original path p2
	            pfirst = "", // temporary holder for original path command
	            pcom = ""; // holder for previous path command of original path
	        for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
	            p[i] && (pfirst = p[i][0]); // save current path command

	            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
	            {
	                pcoms1[i] = pfirst; // Save current path command
	                i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
	            }
	            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

	            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
	            // which may produce multiple C:s
	            // so we have to make sure that C is also C in original path

	            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

	            if (p2) { // the same procedures is done to p2
	                p2[i] && (pfirst = p2[i][0]);
	                if (pfirst != "C") {
	                    pcoms2[i] = pfirst;
	                    i && (pcom = pcoms2[i - 1]);
	                }
	                p2[i] = processPath(p2[i], attrs2, pcom);

	                if (pcoms2[i] != "A" && pfirst == "C") {
	                    pcoms2[i] = "C";
	                }

	                fixArc(p2, i);
	            }
	            fixM(p, p2, attrs, attrs2, i);
	            fixM(p2, p, attrs2, attrs, i);
	            var seg = p[i],
	                seg2 = p2 && p2[i],
	                seglen = seg.length,
	                seg2len = p2 && seg2.length;
	            attrs.x = seg[seglen - 2];
	            attrs.y = seg[seglen - 1];
	            attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
	            attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
	            attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
	            attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
	            attrs2.x = p2 && seg2[seg2len - 2];
	            attrs2.y = p2 && seg2[seg2len - 1];
	        }
	        if (!p2) {
	            pth.curve = pathClone(p);
	        }
	        return p2 ? [p, p2] : p;
	    }
	    function mapPath(path, matrix) {
	        if (!matrix) {
	            return path;
	        }
	        var x, y, i, j, ii, jj, pathi;
	        path = path2curve(path);
	        for (i = 0, ii = path.length; i < ii; i++) {
	            pathi = path[i];
	            for (j = 1, jj = pathi.length; j < jj; j += 2) {
	                x = matrix.x(pathi[j], pathi[j + 1]);
	                y = matrix.y(pathi[j], pathi[j + 1]);
	                pathi[j] = x;
	                pathi[j + 1] = y;
	            }
	        }
	        return path;
	    }

	    // http://schepers.cc/getting-to-the-point
	    function catmullRom2bezier(crp, z) {
	        var d = [];
	        for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
	            var p = [
	                        {x: +crp[i - 2], y: +crp[i - 1]},
	                        {x: +crp[i],     y: +crp[i + 1]},
	                        {x: +crp[i + 2], y: +crp[i + 3]},
	                        {x: +crp[i + 4], y: +crp[i + 5]}
	                    ];
	            if (z) {
	                if (!i) {
	                    p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
	                } else if (iLen - 4 == i) {
	                    p[3] = {x: +crp[0], y: +crp[1]};
	                } else if (iLen - 2 == i) {
	                    p[2] = {x: +crp[0], y: +crp[1]};
	                    p[3] = {x: +crp[2], y: +crp[3]};
	                }
	            } else {
	                if (iLen - 4 == i) {
	                    p[3] = p[2];
	                } else if (!i) {
	                    p[0] = {x: +crp[i], y: +crp[i + 1]};
	                }
	            }
	            d.push(["C",
	                  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
	                  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
	                  (p[1].x + 6 * p[2].x - p[3].x) / 6,
	                  (p[1].y + 6*p[2].y - p[3].y) / 6,
	                  p[2].x,
	                  p[2].y
	            ]);
	        }

	        return d;
	    }

	    // export
	    Snap.path = paths;

	    /*\
	     * Snap.path.getTotalLength
	     [ method ]
	     **
	     * Returns the length of the given path in pixels
	     **
	     - path (string) SVG path string
	     **
	     = (number) length
	    \*/
	    Snap.path.getTotalLength = getTotalLength;
	    /*\
	     * Snap.path.getPointAtLength
	     [ method ]
	     **
	     * Returns the coordinates of the point located at the given length along the given path
	     **
	     - path (string) SVG path string
	     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
	     **
	     = (object) representation of the point:
	     o {
	     o     x: (number) x coordinate,
	     o     y: (number) y coordinate,
	     o     alpha: (number) angle of derivative
	     o }
	    \*/
	    Snap.path.getPointAtLength = getPointAtLength;
	    /*\
	     * Snap.path.getSubpath
	     [ method ]
	     **
	     * Returns the subpath of a given path between given start and end lengths
	     **
	     - path (string) SVG path string
	     - from (number) length, in pixels, from the start of the path to the start of the segment
	     - to (number) length, in pixels, from the start of the path to the end of the segment
	     **
	     = (string) path string definition for the segment
	    \*/
	    Snap.path.getSubpath = function (path, from, to) {
	        if (this.getTotalLength(path) - to < 1e-6) {
	            return getSubpathsAtLength(path, from).end;
	        }
	        var a = getSubpathsAtLength(path, to, 1);
	        return from ? getSubpathsAtLength(a, from).end : a;
	    };
	    /*\
	     * Element.getTotalLength
	     [ method ]
	     **
	     * Returns the length of the path in pixels (only works for `path` elements)
	     = (number) length
	    \*/
	    elproto.getTotalLength = function () {
	        if (this.node.getTotalLength) {
	            return this.node.getTotalLength();
	        }
	    };
	    // SIERRA Element.getPointAtLength()/Element.getTotalLength(): If a <path> is broken into different segments, is the jump distance to the new coordinates set by the _M_ or _m_ commands calculated as part of the path's total length?
	    /*\
	     * Element.getPointAtLength
	     [ method ]
	     **
	     * Returns coordinates of the point located at the given length on the given path (only works for `path` elements)
	     **
	     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
	     **
	     = (object) representation of the point:
	     o {
	     o     x: (number) x coordinate,
	     o     y: (number) y coordinate,
	     o     alpha: (number) angle of derivative
	     o }
	    \*/
	    elproto.getPointAtLength = function (length) {
	        return getPointAtLength(this.attr("d"), length);
	    };
	    // SIERRA Element.getSubpath(): Similar to the problem for Element.getPointAtLength(). Unclear how this would work for a segmented path. Overall, the concept of _subpath_ and what I'm calling a _segment_ (series of non-_M_ or _Z_ commands) is unclear.
	    /*\
	     * Element.getSubpath
	     [ method ]
	     **
	     * Returns subpath of a given element from given start and end lengths (only works for `path` elements)
	     **
	     - from (number) length, in pixels, from the start of the path to the start of the segment
	     - to (number) length, in pixels, from the start of the path to the end of the segment
	     **
	     = (string) path string definition for the segment
	    \*/
	    elproto.getSubpath = function (from, to) {
	        return Snap.path.getSubpath(this.attr("d"), from, to);
	    };
	    Snap._.box = box;
	    /*\
	     * Snap.path.findDotsAtSegment
	     [ method ]
	     **
	     * Utility method
	     **
	     * Finds dot coordinates on the given cubic beziér curve at the given t
	     - p1x (number) x of the first point of the curve
	     - p1y (number) y of the first point of the curve
	     - c1x (number) x of the first anchor of the curve
	     - c1y (number) y of the first anchor of the curve
	     - c2x (number) x of the second anchor of the curve
	     - c2y (number) y of the second anchor of the curve
	     - p2x (number) x of the second point of the curve
	     - p2y (number) y of the second point of the curve
	     - t (number) position on the curve (0..1)
	     = (object) point information in format:
	     o {
	     o     x: (number) x coordinate of the point,
	     o     y: (number) y coordinate of the point,
	     o     m: {
	     o         x: (number) x coordinate of the left anchor,
	     o         y: (number) y coordinate of the left anchor
	     o     },
	     o     n: {
	     o         x: (number) x coordinate of the right anchor,
	     o         y: (number) y coordinate of the right anchor
	     o     },
	     o     start: {
	     o         x: (number) x coordinate of the start of the curve,
	     o         y: (number) y coordinate of the start of the curve
	     o     },
	     o     end: {
	     o         x: (number) x coordinate of the end of the curve,
	     o         y: (number) y coordinate of the end of the curve
	     o     },
	     o     alpha: (number) angle of the curve derivative at the point
	     o }
	    \*/
	    Snap.path.findDotsAtSegment = findDotsAtSegment;
	    /*\
	     * Snap.path.bezierBBox
	     [ method ]
	     **
	     * Utility method
	     **
	     * Returns the bounding box of a given cubic beziér curve
	     - p1x (number) x of the first point of the curve
	     - p1y (number) y of the first point of the curve
	     - c1x (number) x of the first anchor of the curve
	     - c1y (number) y of the first anchor of the curve
	     - c2x (number) x of the second anchor of the curve
	     - c2y (number) y of the second anchor of the curve
	     - p2x (number) x of the second point of the curve
	     - p2y (number) y of the second point of the curve
	     * or
	     - bez (array) array of six points for beziér curve
	     = (object) bounding box
	     o {
	     o     x: (number) x coordinate of the left top point of the box,
	     o     y: (number) y coordinate of the left top point of the box,
	     o     x2: (number) x coordinate of the right bottom point of the box,
	     o     y2: (number) y coordinate of the right bottom point of the box,
	     o     width: (number) width of the box,
	     o     height: (number) height of the box
	     o }
	    \*/
	    Snap.path.bezierBBox = bezierBBox;
	    /*\
	     * Snap.path.isPointInsideBBox
	     [ method ]
	     **
	     * Utility method
	     **
	     * Returns `true` if given point is inside bounding box
	     - bbox (string) bounding box
	     - x (string) x coordinate of the point
	     - y (string) y coordinate of the point
	     = (boolean) `true` if point is inside
	    \*/
	    Snap.path.isPointInsideBBox = isPointInsideBBox;
	    Snap.closest = function (x, y, X, Y) {
	        var r = 100,
	            b = box(x - r / 2, y - r / 2, r, r),
	            inside = [],
	            getter = X[0].hasOwnProperty("x") ? function (i) {
	                return {
	                    x: X[i].x,
	                    y: X[i].y
	                };
	            } : function (i) {
	                return {
	                    x: X[i],
	                    y: Y[i]
	                };
	            },
	            found = 0;
	        while (r <= 1e6 && !found) {
	            for (var i = 0, ii = X.length; i < ii; i++) {
	                var xy = getter(i);
	                if (isPointInsideBBox(b, xy.x, xy.y)) {
	                    found++;
	                    inside.push(xy);
	                    break;
	                }
	            }
	            if (!found) {
	                r *= 2;
	                b = box(x - r / 2, y - r / 2, r, r)
	            }
	        }
	        if (r == 1e6) {
	            return;
	        }
	        var len = Infinity,
	            res;
	        for (i = 0, ii = inside.length; i < ii; i++) {
	            var l = Snap.len(x, y, inside[i].x, inside[i].y);
	            if (len > l) {
	                len = l;
	                inside[i].len = l;
	                res = inside[i];
	            }
	        }
	        return res;
	    };
	    /*\
	     * Snap.path.isBBoxIntersect
	     [ method ]
	     **
	     * Utility method
	     **
	     * Returns `true` if two bounding boxes intersect
	     - bbox1 (string) first bounding box
	     - bbox2 (string) second bounding box
	     = (boolean) `true` if bounding boxes intersect
	    \*/
	    Snap.path.isBBoxIntersect = isBBoxIntersect;
	    /*\
	     * Snap.path.intersection
	     [ method ]
	     **
	     * Utility method
	     **
	     * Finds intersections of two paths
	     - path1 (string) path string
	     - path2 (string) path string
	     = (array) dots of intersection
	     o [
	     o     {
	     o         x: (number) x coordinate of the point,
	     o         y: (number) y coordinate of the point,
	     o         t1: (number) t value for segment of path1,
	     o         t2: (number) t value for segment of path2,
	     o         segment1: (number) order number for segment of path1,
	     o         segment2: (number) order number for segment of path2,
	     o         bez1: (array) eight coordinates representing beziér curve for the segment of path1,
	     o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
	     o     }
	     o ]
	    \*/
	    Snap.path.intersection = pathIntersection;
	    Snap.path.intersectionNumber = pathIntersectionNumber;
	    /*\
	     * Snap.path.isPointInside
	     [ method ]
	     **
	     * Utility method
	     **
	     * Returns `true` if given point is inside a given closed path.
	     *
	     * Note: fill mode doesn’t affect the result of this method.
	     - path (string) path string
	     - x (number) x of the point
	     - y (number) y of the point
	     = (boolean) `true` if point is inside the path
	    \*/
	    Snap.path.isPointInside = isPointInsidePath;
	    /*\
	     * Snap.path.getBBox
	     [ method ]
	     **
	     * Utility method
	     **
	     * Returns the bounding box of a given path
	     - path (string) path string
	     = (object) bounding box
	     o {
	     o     x: (number) x coordinate of the left top point of the box,
	     o     y: (number) y coordinate of the left top point of the box,
	     o     x2: (number) x coordinate of the right bottom point of the box,
	     o     y2: (number) y coordinate of the right bottom point of the box,
	     o     width: (number) width of the box,
	     o     height: (number) height of the box
	     o }
	    \*/
	    Snap.path.getBBox = pathBBox;
	    Snap.path.get = getPath;
	    /*\
	     * Snap.path.toRelative
	     [ method ]
	     **
	     * Utility method
	     **
	     * Converts path coordinates into relative values
	     - path (string) path string
	     = (array) path string
	    \*/
	    Snap.path.toRelative = pathToRelative;
	    /*\
	     * Snap.path.toAbsolute
	     [ method ]
	     **
	     * Utility method
	     **
	     * Converts path coordinates into absolute values
	     - path (string) path string
	     = (array) path string
	    \*/
	    Snap.path.toAbsolute = pathToAbsolute;
	    /*\
	     * Snap.path.toCubic
	     [ method ]
	     **
	     * Utility method
	     **
	     * Converts path to a new path where all segments are cubic beziér curves
	     - pathString (string|array) path string or array of segments
	     = (array) array of segments
	    \*/
	    Snap.path.toCubic = path2curve;
	    /*\
	     * Snap.path.map
	     [ method ]
	     **
	     * Transform the path string with the given matrix
	     - path (string) path string
	     - matrix (object) see @Matrix
	     = (string) transformed path string
	    \*/
	    Snap.path.map = mapPath;
	    Snap.path.toString = toString;
	    Snap.path.clone = pathClone;
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob) {
	    var mmax = Math.max,
	        mmin = Math.min;

	    // Set
	    var Set = function (items) {
	        this.items = [];
		this.bindings = {};
	        this.length = 0;
	        this.type = "set";
	        if (items) {
	            for (var i = 0, ii = items.length; i < ii; i++) {
	                if (items[i]) {
	                    this[this.items.length] = this.items[this.items.length] = items[i];
	                    this.length++;
	                }
	            }
	        }
	    },
	    setproto = Set.prototype;
	    /*\
	     * Set.push
	     [ method ]
	     **
	     * Adds each argument to the current set
	     = (object) original element
	    \*/
	    setproto.push = function () {
	        var item,
	            len;
	        for (var i = 0, ii = arguments.length; i < ii; i++) {
	            item = arguments[i];
	            if (item) {
	                len = this.items.length;
	                this[len] = this.items[len] = item;
	                this.length++;
	            }
	        }
	        return this;
	    };
	    /*\
	     * Set.pop
	     [ method ]
	     **
	     * Removes last element and returns it
	     = (object) element
	    \*/
	    setproto.pop = function () {
	        this.length && delete this[this.length--];
	        return this.items.pop();
	    };
	    /*\
	     * Set.forEach
	     [ method ]
	     **
	     * Executes given function for each element in the set
	     *
	     * If the function returns `false`, the loop stops running.
	     **
	     - callback (function) function to run
	     - thisArg (object) context object for the callback
	     = (object) Set object
	    \*/
	    setproto.forEach = function (callback, thisArg) {
	        for (var i = 0, ii = this.items.length; i < ii; i++) {
	            if (callback.call(thisArg, this.items[i], i) === false) {
	                return this;
	            }
	        }
	        return this;
	    };
	    /*\
	     * Set.animate
	     [ method ]
	     **
	     * Animates each element in set in sync.
	     *
	     **
	     - attrs (object) key-value pairs of destination attributes
	     - duration (number) duration of the animation in milliseconds
	     - easing (function) #optional easing function from @mina or custom
	     - callback (function) #optional callback function that executes when the animation ends
	     * or
	     - animation (array) array of animation parameter for each element in set in format `[attrs, duration, easing, callback]`
	     > Usage
	     | // animate all elements in set to radius 10
	     | set.animate({r: 10}, 500, mina.easein);
	     | // or
	     | // animate first element to radius 10, but second to radius 20 and in different time
	     | set.animate([{r: 10}, 500, mina.easein], [{r: 20}, 1500, mina.easein]);
	     = (Element) the current element
	    \*/
	    setproto.animate = function (attrs, ms, easing, callback) {
	        if (typeof easing == "function" && !easing.length) {
	            callback = easing;
	            easing = mina.linear;
	        }
	        if (attrs instanceof Snap._.Animation) {
	            callback = attrs.callback;
	            easing = attrs.easing;
	            ms = easing.dur;
	            attrs = attrs.attr;
	        }
	        var args = arguments;
	        if (Snap.is(attrs, "array") && Snap.is(args[args.length - 1], "array")) {
	            var each = true;
	        }
	        var begin,
	            handler = function () {
	                if (begin) {
	                    this.b = begin;
	                } else {
	                    begin = this.b;
	                }
	            },
	            cb = 0,
	            set = this,
	            callbacker = callback && function () {
	                if (++cb == set.length) {
	                    callback.call(this);
	                }
	            };
	        return this.forEach(function (el, i) {
	            eve.once("snap.animcreated." + el.id, handler);
	            if (each) {
	                args[i] && el.animate.apply(el, args[i]);
	            } else {
	                el.animate(attrs, ms, easing, callbacker);
	            }
	        });
	    };
	    setproto.remove = function () {
	        while (this.length) {
	            this.pop().remove();
	        }
	        return this;
	    };
	    /*\
	     * Set.bind
	     [ method ]
	     **
	     * Specifies how to handle a specific attribute when applied
	     * to a set.
	     *
	     **
	     - attr (string) attribute name
	     - callback (function) function to run
	     * or
	     - attr (string) attribute name
	     - element (Element) specific element in the set to apply the attribute to
	     * or
	     - attr (string) attribute name
	     - element (Element) specific element in the set to apply the attribute to
	     - eattr (string) attribute on the element to bind the attribute to
	     = (object) Set object
	    \*/
	    setproto.bind = function (attr, a, b) {
	        var data = {};
	        if (typeof a == "function") {
	            this.bindings[attr] = a;
	        } else {
	            var aname = b || attr;
	            this.bindings[attr] = function (v) {
	                data[aname] = v;
	                a.attr(data);
	            };
	        }
	        return this;
	    };
	    setproto.attr = function (value) {
	        var unbound = {};
	        for (var k in value) {
	            if (this.bindings[k]) {
	                this.bindings[k](value[k]);
	            } else {
	                unbound[k] = value[k];
	            }
	        }
	        for (var i = 0, ii = this.items.length; i < ii; i++) {
	            this.items[i].attr(unbound);
	        }
	        return this;
	    };
	    /*\
	     * Set.clear
	     [ method ]
	     **
	     * Removes all elements from the set
	    \*/
	    setproto.clear = function () {
	        while (this.length) {
	            this.pop();
	        }
	    };
	    /*\
	     * Set.splice
	     [ method ]
	     **
	     * Removes range of elements from the set
	     **
	     - index (number) position of the deletion
	     - count (number) number of element to remove
	     - insertion… (object) #optional elements to insert
	     = (object) set elements that were deleted
	    \*/
	    setproto.splice = function (index, count, insertion) {
	        index = index < 0 ? mmax(this.length + index, 0) : index;
	        count = mmax(0, mmin(this.length - index, count));
	        var tail = [],
	            todel = [],
	            args = [],
	            i;
	        for (i = 2; i < arguments.length; i++) {
	            args.push(arguments[i]);
	        }
	        for (i = 0; i < count; i++) {
	            todel.push(this[index + i]);
	        }
	        for (; i < this.length - index; i++) {
	            tail.push(this[index + i]);
	        }
	        var arglen = args.length;
	        for (i = 0; i < arglen + tail.length; i++) {
	            this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
	        }
	        i = this.items.length = this.length -= count - arglen;
	        while (this[i]) {
	            delete this[i++];
	        }
	        return new Set(todel);
	    };
	    /*\
	     * Set.exclude
	     [ method ]
	     **
	     * Removes given element from the set
	     **
	     - element (object) element to remove
	     = (boolean) `true` if object was found and removed from the set
	    \*/
	    setproto.exclude = function (el) {
	        for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) {
	            this.splice(i, 1);
	            return true;
	        }
	        return false;
	    };
	    setproto.insertAfter = function (el) {
	        var i = this.items.length;
	        while (i--) {
	            this.items[i].insertAfter(el);
	        }
	        return this;
	    };
	    setproto.getBBox = function () {
	        var x = [],
	            y = [],
	            x2 = [],
	            y2 = [];
	        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
	            var box = this.items[i].getBBox();
	            x.push(box.x);
	            y.push(box.y);
	            x2.push(box.x + box.width);
	            y2.push(box.y + box.height);
	        }
	        x = mmin.apply(0, x);
	        y = mmin.apply(0, y);
	        x2 = mmax.apply(0, x2);
	        y2 = mmax.apply(0, y2);
	        return {
	            x: x,
	            y: y,
	            x2: x2,
	            y2: y2,
	            width: x2 - x,
	            height: y2 - y,
	            cx: x + (x2 - x) / 2,
	            cy: y + (y2 - y) / 2
	        };
	    };
	    setproto.clone = function (s) {
	        s = new Set;
	        for (var i = 0, ii = this.items.length; i < ii; i++) {
	            s.push(this.items[i].clone());
	        }
	        return s;
	    };
	    setproto.toString = function () {
	        return "Snap\u2018s set";
	    };
	    setproto.type = "set";
	    // export
	    Snap.Set = Set;
	    Snap.set = function () {
	        var set = new Set;
	        if (arguments.length) {
	            set.push.apply(set, Array.prototype.slice.call(arguments, 0));
	        }
	        return set;
	    };
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob) {
	    var names = {},
	        reUnit = /[a-z]+$/i,
	        Str = String;
	    names.stroke = names.fill = "colour";
	    function getEmpty(item) {
	        var l = item[0];
	        switch (l.toLowerCase()) {
	            case "t": return [l, 0, 0];
	            case "m": return [l, 1, 0, 0, 1, 0, 0];
	            case "r": if (item.length == 4) {
	                return [l, 0, item[2], item[3]];
	            } else {
	                return [l, 0];
	            }
	            case "s": if (item.length == 5) {
	                return [l, 1, 1, item[3], item[4]];
	            } else if (item.length == 3) {
	                return [l, 1, 1];
	            } else {
	                return [l, 1];
	            }
	        }
	    }
	    function equaliseTransform(t1, t2, getBBox) {
	        t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
	        t1 = Snap.parseTransformString(t1) || [];
	        t2 = Snap.parseTransformString(t2) || [];
	        var maxlength = Math.max(t1.length, t2.length),
	            from = [],
	            to = [],
	            i = 0, j, jj,
	            tt1, tt2;
	        for (; i < maxlength; i++) {
	            tt1 = t1[i] || getEmpty(t2[i]);
	            tt2 = t2[i] || getEmpty(tt1);
	            if ((tt1[0] != tt2[0]) ||
	                (tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3])) ||
	                (tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4]))
	                ) {
	                    t1 = Snap._.transform2matrix(t1, getBBox());
	                    t2 = Snap._.transform2matrix(t2, getBBox());
	                    from = [["m", t1.a, t1.b, t1.c, t1.d, t1.e, t1.f]];
	                    to = [["m", t2.a, t2.b, t2.c, t2.d, t2.e, t2.f]];
	                    break;
	            }
	            from[i] = [];
	            to[i] = [];
	            for (j = 0, jj = Math.max(tt1.length, tt2.length); j < jj; j++) {
	                j in tt1 && (from[i][j] = tt1[j]);
	                j in tt2 && (to[i][j] = tt2[j]);
	            }
	        }
	        return {
	            from: path2array(from),
	            to: path2array(to),
	            f: getPath(from)
	        };
	    }
	    function getNumber(val) {
	        return val;
	    }
	    function getUnit(unit) {
	        return function (val) {
	            return +val.toFixed(3) + unit;
	        };
	    }
	    function getViewBox(val) {
	        return val.join(" ");
	    }
	    function getColour(clr) {
	        return Snap.rgb(clr[0], clr[1], clr[2]);
	    }
	    function getPath(path) {
	        var k = 0, i, ii, j, jj, out, a, b = [];
	        for (i = 0, ii = path.length; i < ii; i++) {
	            out = "[";
	            a = ['"' + path[i][0] + '"'];
	            for (j = 1, jj = path[i].length; j < jj; j++) {
	                a[j] = "val[" + (k++) + "]";
	            }
	            out += a + "]";
	            b[i] = out;
	        }
	        return Function("val", "return Snap.path.toString.call([" + b + "])");
	    }
	    function path2array(path) {
	        var out = [];
	        for (var i = 0, ii = path.length; i < ii; i++) {
	            for (var j = 1, jj = path[i].length; j < jj; j++) {
	                out.push(path[i][j]);
	            }
	        }
	        return out;
	    }
	    function isNumeric(obj) {
	        return isFinite(parseFloat(obj));
	    }
	    function arrayEqual(arr1, arr2) {
	        if (!Snap.is(arr1, "array") || !Snap.is(arr2, "array")) {
	            return false;
	        }
	        return arr1.toString() == arr2.toString();
	    }
	    Element.prototype.equal = function (name, b) {
	        return eve("snap.util.equal", this, name, b).firstDefined();
	    };
	    eve.on("snap.util.equal", function (name, b) {
	        var A, B, a = Str(this.attr(name) || ""),
	            el = this;
	        if (names[name] == "colour") {
	            A = Snap.color(a);
	            B = Snap.color(b);
	            return {
	                from: [A.r, A.g, A.b, A.opacity],
	                to: [B.r, B.g, B.b, B.opacity],
	                f: getColour
	            };
	        }
	        if (name == "viewBox") {
	            A = this.attr(name).vb.split(" ").map(Number);
	            B = b.split(" ").map(Number);
	            return {
	                from: A,
	                to: B,
	                f: getViewBox
	            };
	        }
	        if (name == "transform" || name == "gradientTransform" || name == "patternTransform") {
	            if (b instanceof Snap.Matrix) {
	                b = b.toTransformString();
	            }
	            if (!Snap._.rgTransform.test(b)) {
	                b = Snap._.svgTransform2string(b);
	            }
	            return equaliseTransform(a, b, function () {
	                return el.getBBox(1);
	            });
	        }
	        if (name == "d" || name == "path") {
	            A = Snap.path.toCubic(a, b);
	            return {
	                from: path2array(A[0]),
	                to: path2array(A[1]),
	                f: getPath(A[0])
	            };
	        }
	        if (name == "points") {
	            A = Str(a).split(Snap._.separator);
	            B = Str(b).split(Snap._.separator);
	            return {
	                from: A,
	                to: B,
	                f: function (val) { return val; }
	            };
	        }
	        if (isNumeric(a) && isNumeric(b)) {
	            return {
	                from: parseFloat(a),
	                to: parseFloat(b),
	                f: getNumber
	            };
	        }
	        var aUnit = a.match(reUnit),
	            bUnit = Str(b).match(reUnit);
	        if (aUnit && arrayEqual(aUnit, bUnit)) {
	            return {
	                from: parseFloat(a),
	                to: parseFloat(b),
	                f: getUnit(aUnit)
	            };
	        } else {
	            return {
	                from: this.asPX(name),
	                to: this.asPX(name, b),
	                f: getNumber
	            };
	        }
	    });
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob) {
	    var elproto = Element.prototype,
	    has = "hasOwnProperty",
	    supportsTouch = "createTouch" in glob.doc,
	    events = [
	        "click", "dblclick", "mousedown", "mousemove", "mouseout",
	        "mouseover", "mouseup", "touchstart", "touchmove", "touchend",
	        "touchcancel"
	    ],
	    touchMap = {
	        mousedown: "touchstart",
	        mousemove: "touchmove",
	        mouseup: "touchend"
	    },
	    getScroll = function (xy, el) {
	        var name = xy == "y" ? "scrollTop" : "scrollLeft",
	            doc = el && el.node ? el.node.ownerDocument : glob.doc;
	        return doc[name in doc.documentElement ? "documentElement" : "body"][name];
	    },
	    preventDefault = function () {
	        this.returnValue = false;
	    },
	    preventTouch = function () {
	        return this.originalEvent.preventDefault();
	    },
	    stopPropagation = function () {
	        this.cancelBubble = true;
	    },
	    stopTouch = function () {
	        return this.originalEvent.stopPropagation();
	    },
	    addEvent = function (obj, type, fn, element) {
	        var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
	            f = function (e) {
	                var scrollY = getScroll("y", element),
	                    scrollX = getScroll("x", element);
	                if (supportsTouch && touchMap[has](type)) {
	                    for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
	                        if (e.targetTouches[i].target == obj || obj.contains(e.targetTouches[i].target)) {
	                            var olde = e;
	                            e = e.targetTouches[i];
	                            e.originalEvent = olde;
	                            e.preventDefault = preventTouch;
	                            e.stopPropagation = stopTouch;
	                            break;
	                        }
	                    }
	                }
	                var x = e.clientX + scrollX,
	                    y = e.clientY + scrollY;
	                return fn.call(element, e, x, y);
	            };

	        if (type !== realName) {
	            obj.addEventListener(type, f, false);
	        }

	        obj.addEventListener(realName, f, false);

	        return function () {
	            if (type !== realName) {
	                obj.removeEventListener(type, f, false);
	            }

	            obj.removeEventListener(realName, f, false);
	            return true;
	        };
	    },
	    drag = [],
	    dragMove = function (e) {
	        var x = e.clientX,
	            y = e.clientY,
	            scrollY = getScroll("y"),
	            scrollX = getScroll("x"),
	            dragi,
	            j = drag.length;
	        while (j--) {
	            dragi = drag[j];
	            if (supportsTouch) {
	                var i = e.touches && e.touches.length,
	                    touch;
	                while (i--) {
	                    touch = e.touches[i];
	                    if (touch.identifier == dragi.el._drag.id || dragi.el.node.contains(touch.target)) {
	                        x = touch.clientX;
	                        y = touch.clientY;
	                        (e.originalEvent ? e.originalEvent : e).preventDefault();
	                        break;
	                    }
	                }
	            } else {
	                e.preventDefault();
	            }
	            var node = dragi.el.node,
	                o,
	                next = node.nextSibling,
	                parent = node.parentNode,
	                display = node.style.display;
	            // glob.win.opera && parent.removeChild(node);
	            // node.style.display = "none";
	            // o = dragi.el.paper.getElementByPoint(x, y);
	            // node.style.display = display;
	            // glob.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
	            // o && eve("snap.drag.over." + dragi.el.id, dragi.el, o);
	            x += scrollX;
	            y += scrollY;
	            eve("snap.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
	        }
	    },
	    dragUp = function (e) {
	        Snap.unmousemove(dragMove).unmouseup(dragUp);
	        var i = drag.length,
	            dragi;
	        while (i--) {
	            dragi = drag[i];
	            dragi.el._drag = {};
	            eve("snap.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
	            eve.off("snap.drag.*." + dragi.el.id);
	        }
	        drag = [];
	    };
	    /*\
	     * Element.click
	     [ method ]
	     **
	     * Adds a click event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.unclick
	     [ method ]
	     **
	     * Removes a click event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.dblclick
	     [ method ]
	     **
	     * Adds a double click event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.undblclick
	     [ method ]
	     **
	     * Removes a double click event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.mousedown
	     [ method ]
	     **
	     * Adds a mousedown event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.unmousedown
	     [ method ]
	     **
	     * Removes a mousedown event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.mousemove
	     [ method ]
	     **
	     * Adds a mousemove event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.unmousemove
	     [ method ]
	     **
	     * Removes a mousemove event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.mouseout
	     [ method ]
	     **
	     * Adds a mouseout event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.unmouseout
	     [ method ]
	     **
	     * Removes a mouseout event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.mouseover
	     [ method ]
	     **
	     * Adds a mouseover event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.unmouseover
	     [ method ]
	     **
	     * Removes a mouseover event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.mouseup
	     [ method ]
	     **
	     * Adds a mouseup event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.unmouseup
	     [ method ]
	     **
	     * Removes a mouseup event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.touchstart
	     [ method ]
	     **
	     * Adds a touchstart event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.untouchstart
	     [ method ]
	     **
	     * Removes a touchstart event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.touchmove
	     [ method ]
	     **
	     * Adds a touchmove event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.untouchmove
	     [ method ]
	     **
	     * Removes a touchmove event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.touchend
	     [ method ]
	     **
	     * Adds a touchend event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.untouchend
	     [ method ]
	     **
	     * Removes a touchend event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    
	    /*\
	     * Element.touchcancel
	     [ method ]
	     **
	     * Adds a touchcancel event handler to the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    /*\
	     * Element.untouchcancel
	     [ method ]
	     **
	     * Removes a touchcancel event handler from the element
	     - handler (function) handler for the event
	     = (object) @Element
	    \*/
	    for (var i = events.length; i--;) {
	        (function (eventName) {
	            Snap[eventName] = elproto[eventName] = function (fn, scope) {
	                if (Snap.is(fn, "function")) {
	                    this.events = this.events || [];
	                    this.events.push({
	                        name: eventName,
	                        f: fn,
	                        unbind: addEvent(this.node || document, eventName, fn, scope || this)
	                    });
	                } else {
	                    for (var i = 0, ii = this.events.length; i < ii; i++) if (this.events[i].name == eventName) {
	                        try {
	                            this.events[i].f.call(this);
	                        } catch (e) {}
	                    }
	                }
	                return this;
	            };
	            Snap["un" + eventName] =
	            elproto["un" + eventName] = function (fn) {
	                var events = this.events || [],
	                    l = events.length;
	                while (l--) if (events[l].name == eventName &&
	                               (events[l].f == fn || !fn)) {
	                    events[l].unbind();
	                    events.splice(l, 1);
	                    !events.length && delete this.events;
	                    return this;
	                }
	                return this;
	            };
	        })(events[i]);
	    }
	    /*\
	     * Element.hover
	     [ method ]
	     **
	     * Adds hover event handlers to the element
	     - f_in (function) handler for hover in
	     - f_out (function) handler for hover out
	     - icontext (object) #optional context for hover in handler
	     - ocontext (object) #optional context for hover out handler
	     = (object) @Element
	    \*/
	    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
	        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
	    };
	    /*\
	     * Element.unhover
	     [ method ]
	     **
	     * Removes hover event handlers from the element
	     - f_in (function) handler for hover in
	     - f_out (function) handler for hover out
	     = (object) @Element
	    \*/
	    elproto.unhover = function (f_in, f_out) {
	        return this.unmouseover(f_in).unmouseout(f_out);
	    };
	    var draggable = [];
	    // SIERRA unclear what _context_ refers to for starting, ending, moving the drag gesture.
	    // SIERRA Element.drag(): _x position of the mouse_: Where are the x/y values offset from?
	    // SIERRA Element.drag(): much of this member's doc appears to be duplicated for some reason.
	    // SIERRA Unclear about this sentence: _Additionally following drag events will be triggered: drag.start.<id> on start, drag.end.<id> on end and drag.move.<id> on every move._ Is there a global _drag_ object to which you can assign handlers keyed by an element's ID?
	    /*\
	     * Element.drag
	     [ method ]
	     **
	     * Adds event handlers for an element's drag gesture
	     **
	     - onmove (function) handler for moving
	     - onstart (function) handler for drag start
	     - onend (function) handler for drag end
	     - mcontext (object) #optional context for moving handler
	     - scontext (object) #optional context for drag start handler
	     - econtext (object) #optional context for drag end handler
	     * Additionaly following `drag` events are triggered: `drag.start.<id>` on start, 
	     * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element is dragged over another element 
	     * `drag.over.<id>` fires as well.
	     *
	     * Start event and start handler are called in specified context or in context of the element with following parameters:
	     o x (number) x position of the mouse
	     o y (number) y position of the mouse
	     o event (object) DOM event object
	     * Move event and move handler are called in specified context or in context of the element with following parameters:
	     o dx (number) shift by x from the start point
	     o dy (number) shift by y from the start point
	     o x (number) x position of the mouse
	     o y (number) y position of the mouse
	     o event (object) DOM event object
	     * End event and end handler are called in specified context or in context of the element with following parameters:
	     o event (object) DOM event object
	     = (object) @Element
	    \*/
	    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
	        var el = this;
	        if (!arguments.length) {
	            var origTransform;
	            return el.drag(function (dx, dy) {
	                this.attr({
	                    transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
	                });
	            }, function () {
	                origTransform = this.transform().local;
	            });
	        }
	        function start(e, x, y) {
	            (e.originalEvent || e).preventDefault();
	            el._drag.x = x;
	            el._drag.y = y;
	            el._drag.id = e.identifier;
	            !drag.length && Snap.mousemove(dragMove).mouseup(dragUp);
	            drag.push({el: el, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
	            onstart && eve.on("snap.drag.start." + el.id, onstart);
	            onmove && eve.on("snap.drag.move." + el.id, onmove);
	            onend && eve.on("snap.drag.end." + el.id, onend);
	            eve("snap.drag.start." + el.id, start_scope || move_scope || el, x, y, e);
	        }
	        function init(e, x, y) {
	            eve("snap.draginit." + el.id, el, e, x, y);
	        }
	        eve.on("snap.draginit." + el.id, start);
	        el._drag = {};
	        draggable.push({el: el, start: start, init: init});
	        el.mousedown(init);
	        return el;
	    };
	    /*
	     * Element.onDragOver
	     [ method ]
	     **
	     * Shortcut to assign event handler for `drag.over.<id>` event, where `id` is the element's `id` (see @Element.id)
	     - f (function) handler for event, first argument would be the element you are dragging over
	    \*/
	    // elproto.onDragOver = function (f) {
	    //     f ? eve.on("snap.drag.over." + this.id, f) : eve.unbind("snap.drag.over." + this.id);
	    // };
	    /*\
	     * Element.undrag
	     [ method ]
	     **
	     * Removes all drag event handlers from the given element
	    \*/
	    elproto.undrag = function () {
	        var i = draggable.length;
	        while (i--) if (draggable[i].el == this) {
	            this.unmousedown(draggable[i].init);
	            draggable.splice(i, 1);
	            eve.unbind("snap.drag.*." + this.id);
	            eve.unbind("snap.draginit." + this.id);
	        }
	        !draggable.length && Snap.unmousemove(dragMove).unmouseup(dragUp);
	        return this;
	    };
	});

	// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
	// 
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	// 
	// http://www.apache.org/licenses/LICENSE-2.0
	// 
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob) {
	    var elproto = Element.prototype,
	        pproto = Paper.prototype,
	        rgurl = /^\s*url\((.+)\)/,
	        Str = String,
	        $ = Snap._.$;
	    Snap.filter = {};
	    /*\
	     * Paper.filter
	     [ method ]
	     **
	     * Creates a `<filter>` element
	     **
	     - filstr (string) SVG fragment of filter provided as a string
	     = (object) @Element
	     * Note: It is recommended to use filters embedded into the page inside an empty SVG element.
	     > Usage
	     | var f = paper.filter('<feGaussianBlur stdDeviation="2"/>'),
	     |     c = paper.circle(10, 10, 10).attr({
	     |         filter: f
	     |     });
	    \*/
	    pproto.filter = function (filstr) {
	        var paper = this;
	        if (paper.type != "svg") {
	            paper = paper.paper;
	        }
	        var f = Snap.parse(Str(filstr)),
	            id = Snap._.id(),
	            width = paper.node.offsetWidth,
	            height = paper.node.offsetHeight,
	            filter = $("filter");
	        $(filter, {
	            id: id,
	            filterUnits: "userSpaceOnUse"
	        });
	        filter.appendChild(f.node);
	        paper.defs.appendChild(filter);
	        return new Element(filter);
	    };
	    
	    eve.on("snap.util.getattr.filter", function () {
	        eve.stop();
	        var p = $(this.node, "filter");
	        if (p) {
	            var match = Str(p).match(rgurl);
	            return match && Snap.select(match[1]);
	        }
	    });
	    eve.on("snap.util.attr.filter", function (value) {
	        if (value instanceof Element && value.type == "filter") {
	            eve.stop();
	            var id = value.node.id;
	            if (!id) {
	                $(value.node, {id: value.id});
	                id = value.id;
	            }
	            $(this.node, {
	                filter: Snap.url(id)
	            });
	        }
	        if (!value || value == "none") {
	            eve.stop();
	            this.node.removeAttribute("filter");
	        }
	    });
	    /*\
	     * Snap.filter.blur
	     [ method ]
	     **
	     * Returns an SVG markup string for the blur filter
	     **
	     - x (number) amount of horizontal blur, in pixels
	     - y (number) #optional amount of vertical blur, in pixels
	     = (string) filter representation
	     > Usage
	     | var f = paper.filter(Snap.filter.blur(5, 10)),
	     |     c = paper.circle(10, 10, 10).attr({
	     |         filter: f
	     |     });
	    \*/
	    Snap.filter.blur = function (x, y) {
	        if (x == null) {
	            x = 2;
	        }
	        var def = y == null ? x : [x, y];
	        return Snap.format('\<feGaussianBlur stdDeviation="{def}"/>', {
	            def: def
	        });
	    };
	    Snap.filter.blur.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.shadow
	     [ method ]
	     **
	     * Returns an SVG markup string for the shadow filter
	     **
	     - dx (number) #optional horizontal shift of the shadow, in pixels
	     - dy (number) #optional vertical shift of the shadow, in pixels
	     - blur (number) #optional amount of blur
	     - color (string) #optional color of the shadow
	     - opacity (number) #optional `0..1` opacity of the shadow
	     * or
	     - dx (number) #optional horizontal shift of the shadow, in pixels
	     - dy (number) #optional vertical shift of the shadow, in pixels
	     - color (string) #optional color of the shadow
	     - opacity (number) #optional `0..1` opacity of the shadow
	     * which makes blur default to `4`. Or
	     - dx (number) #optional horizontal shift of the shadow, in pixels
	     - dy (number) #optional vertical shift of the shadow, in pixels
	     - opacity (number) #optional `0..1` opacity of the shadow
	     = (string) filter representation
	     > Usage
	     | var f = paper.filter(Snap.filter.shadow(0, 2, 3)),
	     |     c = paper.circle(10, 10, 10).attr({
	     |         filter: f
	     |     });
	    \*/
	    Snap.filter.shadow = function (dx, dy, blur, color, opacity) {
	        if (typeof blur == "string") {
	            color = blur;
	            opacity = color;
	            blur = 4;
	        }
	        if (typeof color != "string") {
	            opacity = color;
	            color = "#000";
	        }
	        color = color || "#000";
	        if (blur == null) {
	            blur = 4;
	        }
	        if (opacity == null) {
	            opacity = 1;
	        }
	        if (dx == null) {
	            dx = 0;
	            dy = 2;
	        }
	        if (dy == null) {
	            dy = dx;
	        }
	        color = Snap.color(color);
	        return Snap.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
	            color: color,
	            dx: dx,
	            dy: dy,
	            blur: blur,
	            opacity: opacity
	        });
	    };
	    Snap.filter.shadow.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.grayscale
	     [ method ]
	     **
	     * Returns an SVG markup string for the grayscale filter
	     **
	     - amount (number) amount of filter (`0..1`)
	     = (string) filter representation
	    \*/
	    Snap.filter.grayscale = function (amount) {
	        if (amount == null) {
	            amount = 1;
	        }
	        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
	            a: 0.2126 + 0.7874 * (1 - amount),
	            b: 0.7152 - 0.7152 * (1 - amount),
	            c: 0.0722 - 0.0722 * (1 - amount),
	            d: 0.2126 - 0.2126 * (1 - amount),
	            e: 0.7152 + 0.2848 * (1 - amount),
	            f: 0.0722 - 0.0722 * (1 - amount),
	            g: 0.2126 - 0.2126 * (1 - amount),
	            h: 0.0722 + 0.9278 * (1 - amount)
	        });
	    };
	    Snap.filter.grayscale.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.sepia
	     [ method ]
	     **
	     * Returns an SVG markup string for the sepia filter
	     **
	     - amount (number) amount of filter (`0..1`)
	     = (string) filter representation
	    \*/
	    Snap.filter.sepia = function (amount) {
	        if (amount == null) {
	            amount = 1;
	        }
	        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
	            a: 0.393 + 0.607 * (1 - amount),
	            b: 0.769 - 0.769 * (1 - amount),
	            c: 0.189 - 0.189 * (1 - amount),
	            d: 0.349 - 0.349 * (1 - amount),
	            e: 0.686 + 0.314 * (1 - amount),
	            f: 0.168 - 0.168 * (1 - amount),
	            g: 0.272 - 0.272 * (1 - amount),
	            h: 0.534 - 0.534 * (1 - amount),
	            i: 0.131 + 0.869 * (1 - amount)
	        });
	    };
	    Snap.filter.sepia.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.saturate
	     [ method ]
	     **
	     * Returns an SVG markup string for the saturate filter
	     **
	     - amount (number) amount of filter (`0..1`)
	     = (string) filter representation
	    \*/
	    Snap.filter.saturate = function (amount) {
	        if (amount == null) {
	            amount = 1;
	        }
	        return Snap.format('<feColorMatrix type="saturate" values="{amount}"/>', {
	            amount: 1 - amount
	        });
	    };
	    Snap.filter.saturate.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.hueRotate
	     [ method ]
	     **
	     * Returns an SVG markup string for the hue-rotate filter
	     **
	     - angle (number) angle of rotation
	     = (string) filter representation
	    \*/
	    Snap.filter.hueRotate = function (angle) {
	        angle = angle || 0;
	        return Snap.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
	            angle: angle
	        });
	    };
	    Snap.filter.hueRotate.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.invert
	     [ method ]
	     **
	     * Returns an SVG markup string for the invert filter
	     **
	     - amount (number) amount of filter (`0..1`)
	     = (string) filter representation
	    \*/
	    Snap.filter.invert = function (amount) {
	        if (amount == null) {
	            amount = 1;
	        }
	//        <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" color-interpolation-filters="sRGB"/>
	        return Snap.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
	            amount: amount,
	            amount2: 1 - amount
	        });
	    };
	    Snap.filter.invert.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.brightness
	     [ method ]
	     **
	     * Returns an SVG markup string for the brightness filter
	     **
	     - amount (number) amount of filter (`0..1`)
	     = (string) filter representation
	    \*/
	    Snap.filter.brightness = function (amount) {
	        if (amount == null) {
	            amount = 1;
	        }
	        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
	            amount: amount
	        });
	    };
	    Snap.filter.brightness.toString = function () {
	        return this();
	    };
	    /*\
	     * Snap.filter.contrast
	     [ method ]
	     **
	     * Returns an SVG markup string for the contrast filter
	     **
	     - amount (number) amount of filter (`0..1`)
	     = (string) filter representation
	    \*/
	    Snap.filter.contrast = function (amount) {
	        if (amount == null) {
	            amount = 1;
	        }
	        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
	            amount: amount,
	            amount2: .5 - amount / 2
	        });
	    };
	    Snap.filter.contrast.toString = function () {
	        return this();
	    };
	});

	// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	    var box = Snap._.box,
	        is = Snap.is,
	        firstLetter = /^[^a-z]*([tbmlrc])/i,
	        toString = function () {
	            return "T" + this.dx + "," + this.dy;
	        };
	    /*\
	     * Element.getAlign
	     [ method ]
	     **
	     * Returns shift needed to align the element relatively to given element.
	     * If no elements specified, parent `<svg>` container will be used.
	     - el (object) @optional alignment element
	     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
	     = (object|string) Object in format `{dx: , dy: }` also has a string representation as a transformation string
	     > Usage
	     | el.transform(el.getAlign(el2, "top"));
	     * or
	     | var dy = el.getAlign(el2, "top").dy;
	    \*/
	    Element.prototype.getAlign = function (el, way) {
	        if (way == null && is(el, "string")) {
	            way = el;
	            el = null;
	        }
	        el = el || this.paper;
	        var bx = el.getBBox ? el.getBBox() : box(el),
	            bb = this.getBBox(),
	            out = {};
	        way = way && way.match(firstLetter);
	        way = way ? way[1].toLowerCase() : "c";
	        switch (way) {
	            case "t":
	                out.dx = 0;
	                out.dy = bx.y - bb.y;
	            break;
	            case "b":
	                out.dx = 0;
	                out.dy = bx.y2 - bb.y2;
	            break;
	            case "m":
	                out.dx = 0;
	                out.dy = bx.cy - bb.cy;
	            break;
	            case "l":
	                out.dx = bx.x - bb.x;
	                out.dy = 0;
	            break;
	            case "r":
	                out.dx = bx.x2 - bb.x2;
	                out.dy = 0;
	            break;
	            default:
	                out.dx = bx.cx - bb.cx;
	                out.dy = 0;
	            break;
	        }
	        out.toString = toString;
	        return out;
	    };
	    /*\
	     * Element.align
	     [ method ]
	     **
	     * Aligns the element relatively to given one via transformation.
	     * If no elements specified, parent `<svg>` container will be used.
	     - el (object) @optional alignment element
	     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
	     = (object) this element
	     > Usage
	     | el.align(el2, "top");
	     * or
	     | el.align("middle");
	    \*/
	    Element.prototype.align = function (el, way) {
	        return this.transform("..." + this.getAlign(el, way));
	    };
	});

	return Snap;
	}));
	}.call(window));

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 *  SVG elements must have:
	 *  	viewbox with original dimensions
	 *  	
	 */

	var AL = function(svgPath, containerID, onloadSprites, onloadSounds) {


		this.container = document.getElementById(containerID);

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
			// self.cnv.appendTo(self.container);
			// self.container.setAttribute('cz-shortcut-listen', true);

			// get inline style from spritesheet
			// var styleElt = f.node.getElementsByTagName('style')[0];
			// document.body.appendChild(styleElt);

			callback();
		});
	};

	module.exports = AL;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var AL = __webpack_require__(3);

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

		/**
		 *  id of the symbol, which will be "shape-<name_of_orig_export>_<illustrator_label_name>"
		 *  @type {[type]}
		 */
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

		// append to the AL instance's container html element
		self.cnv.appendTo(self.instance.container);

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
		self.rescale(0.9);
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
		this.framePos++;
		var nextFrag = this.frames[ this.framePos % this.frames.length].children();

		var i = 0;
		this.cnv.children().forEach(function( elt ) {
			try {
				var props = nextFrag[i].attr();
				// dont override these attribtues
				delete props.style;
				delete props.class;

				elt.stop();
				elt.animate(props, duration, mina.bounce);
			} catch(e) {
				return;
			}
			i++;
		});

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

/***/ }
/******/ ]);