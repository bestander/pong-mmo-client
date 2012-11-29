/*
 * Super Pong HTML5 multiplayer game
 *
 *
 *
 * Author: Svetlana Raeva (svetlana.myth@gmail.com)
 * Author: Konstantin Raev (bestander@gmail.com)
 * Released under the MIT license
*/
var CAAT = require('CAAT').CAAT;

exports.start = function (){
  "use strict";
  CAAT.loop(20);
};

var _director_4= new CAAT.Director().initialize(
  600,
  200,
  document.getElementById('_c4') );

var _scene_4= _director_4.createScene();

// these numbers correspond to anchor values:
// TOP_LEFT     TOP     TOP_RIGHT
// LEFT         CENTER  RIGHT
// BOTTOM_LEFT  BOTTOM  BOTTOM_RIGHT
var anchor= [
  0,0, 0.50,0, 1.00,0,
  0, 0.50, 0.50, 0.50, 1.00, 0.50,
  0, 1.00, 0.50, 1.00, 1.00, 1.00
];

var i;

for( i=0; i<9; i++ ) {

  // background actors under rotating ones. Just to have a reference
  // of where the anchor is.
  var _scene_4_rotating_actor_background = new CAAT.Actor().
    setLocation( 50+50*(i%3), 35+50*((i/3)>>0) ).
    setSize( 30, 30 ).
    setFillStyle('#ffffff').
    setStrokeStyle('#000000').
    // do not accept mouse events.
    enableEvents(false);
  _scene_4.addChild( _scene_4_rotating_actor_background );

  // rotating actors.
  var _scene_4_rotating_actor = new CAAT.Actor().
    setLocation( 50+50*(i%3), 35+50*((i/3)>>0) ).
    setSize( 30, 30 ).
    setFillStyle('#ff0000');
  // never ending rotating behavior
  var _scene_4_rotating_behavior= new CAAT.RotateBehavior().
    setCycle(true).
    setFrameTime( 0, 2000 ).
    setValues(0, 2*Math.PI, anchor[i*2], anchor[i*2+1] );
  _scene_4_rotating_actor.addBehavior( _scene_4_rotating_behavior );
  _scene_4.addChild( _scene_4_rotating_actor );

  // scaling actors
  var _scene_4_scaling_actor= new CAAT.Actor().
    setLocation( 300+60*(i%3), 30+60*((i/3)>>0) ).
    setSize( 30, 30 ).
    setFillStyle('#ff00ff');
  // never ending scaling behavior
  var _scene_4_scaling_behavior= new CAAT.ScaleBehavior().
    setCycle(true).
    setFrameTime( 0, 2000 ).
    setValues( .5, 1.5, .5, 1.5, anchor[i*2], anchor[i*2+1] ).
    setPingPong();
  _scene_4_scaling_actor.addBehavior(_scene_4_scaling_behavior);
  _scene_4.addChild( _scene_4_scaling_actor );
}

CAAT.loop(20);

