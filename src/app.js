var Tone = require('tone');
var Snap = require('imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js');
window.Snap = Snap;
window.Tone = Tone;

var AL = require('./core');
require('./letter');

module.exports = window.AL = AL;