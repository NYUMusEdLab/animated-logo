var Tone = require('tone');
var Snap = require('imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js');
window.Snap = Snap;
window.Tone = Tone;

Snap.plugin( function( Snap, Element, Paper, global ) {
   Element.prototype.polyAnimate = function( destPoints, duration, easing, callback ) {
   var poly = this;
    Snap.animate( this.attr('points'), destPoints,  
       function( val ){ poly.attr({ points: val }) }, duration, easing, callback)
    };
});

var AL = require('./core');
require('./letter');

module.exports = window.AL = AL;