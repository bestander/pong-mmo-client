/**
 * Author: Konstantin Raev (bestander@gmail.com)
 *
 * Released under the MIT license
 * Renderer that uses CAAT engine
 */
"use strict";

var GameRenderer = require('./gameRenderer.js');
var THREE = require('three');
var TWEEN = require('tween.js');


function CaatGameRenderer (gameEvents){
  GameRenderer.call(this, gameEvents);
  this._defineEventHandlers();
  this._tween = new TWEEN.Tween({x: 0, y: 0});
  this._initScene();
}

CaatGameRenderer.prototype = Object.create(GameRenderer.prototype);

CaatGameRenderer.prototype._defineEventHandlers = function () {
  var that = this;
  this._gameEvents.on("BALL_CHANGED_POSITION", function (data) {
    that._scheduleObjectRender("BALL", that._convertCoordFromBox2dToCanvas(data.position), data.time);
  });
  this._gameEvents.on("PLAYER_1_CHANGED_POSITION", function (data) {
    that._scheduleObjectRender("PLAYER_1", that._convertCoordFromBox2dToCanvas(data.position), data.time);
  });
  this._gameEvents.on("PLAYER_2_CHANGED_POSITION", function (data) {
    that._scheduleObjectRender("PLAYER_2", that._convertCoordFromBox2dToCanvas(data.position), data.time);
  });
};

CaatGameRenderer.prototype._convertCoordFromBox2dToCanvas = function (pos) {
  // TODO
  return pos;
};

CaatGameRenderer.prototype._scheduleObjectRender = function (objectPositionsBag, position, time) {
  // TODO this one is cool and tricky: because we receive new positions at random times because of network lags we have to
  // display the objects a bit behind then server's time, this will make the graphics smoother
  console.log("%s is located at %s at %t", objectPositionsBag, JSON.stringify(position), time);
  this._tween.to({
    x: position.x * 8,
    y: position.y * 8
  }, 1000).start();
};

module.exports = CaatGameRenderer;

CaatGameRenderer.prototype._initScene = function () {

  // set the scene size
  var WIDTH = 400,
    HEIGHT = 400;

// set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
  var $container = document.getElementById('container');

// create a WebGL renderer, camera
// and a scene
  var renderer = new THREE.WebGLRenderer();
  var camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  var scene = new THREE.Scene();

// add the camera to the scene
  scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
  camera.position.z = 300;

// start the renderer
  renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
  $container.appendChild(renderer.domElement);
  
  // set up the sphere vars
  var radius = 10,
    segments = 16,
    rings = 16;

  // create the sphere's material
  var sphereMaterial =
    new THREE.MeshLambertMaterial(
      {
        color: 0xCC0000
      });

// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
  var sphere = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),

    sphereMaterial);

// add the sphere to the scene
  scene.add(sphere);

  this._tween.onUpdate(function () {
    sphere.position.x = this.x;
    sphere.position.y = this.y;
  });
  animate();
  

  function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    
    TWEEN.update();
    renderer.render( scene, camera );

  }
};


