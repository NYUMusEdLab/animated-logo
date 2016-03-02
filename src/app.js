// Make snap.svg.js compatible with webpack
// Keep an eye on this issue: https://github.com/adobe-webplatform/Snap.svg/issues/341
var Snap = require('imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js');

// Fix a bug in snap.svg.js when animating svg poly points
// Keep an eye on this issue: https://github.com/adobe-webplatform/Snap.svg/issues/373
// Here's the source of the fix: http://stackoverflow.com/questions/34991254/animate-polygon-points-snap-svg
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