/**
 * Author: Konstantin Raev (bestander@gmail.com)
 *
 * Released under the MIT license
 * Renderer that uses CAAT engine
 */
"use strict";

var GameRenderer = require('./gameRenderer.js');
var CAAT = require('CAAT').CAAT;


var CaatGameRenderer = function (gameEvents){
  GameRenderer.call(this, gameEvents);
  this._defineEventHandlers();
  initScene();
};

CaatGameRenderer.prototype = Object.create(GameRenderer.prototype);

CaatGameRenderer.prototype.startRendering = function(){
  CAAT.loop(20);
};

CaatGameRenderer.prototype._defineEventHandlers = function () {
  var that = this;
  this._gameEvents.on("BALL_CHANGED_POSITION", function (data) {
    that._getNormalizedPositionFromBox2dToCaat(data.position);
  });
  this._gameEvents.on("PLAYER_1_CHANGED_POSITION", function (data) {

  });
  this._gameEvents.on("PLAYER_2_CHANGED_POSITION", function (data) {

  });
};

CaatGameRenderer.prototype._getNormalizedPositionFromBox2dToCaat = function (pos) {
  // TODO
  return pos;
};

CaatGameRenderer.prototype._scheduleObjectRender = function (objectPositionsBag, position, time) {
  // TODO this one is cool and tricky: because we receive new positions at random times because of network lags we have to
  // display the objects a bit behind then server's time, this will make the graphics smoother
  console.log("%s is at %s on %t");
};

module.exports = CaatGameRenderer;

var initScene = function () {
  var _director_4= new CAAT.Director().initialize(
    600,
    400);

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
};


