/**
 * Game renderer for pong game.
 * See ReadMe.md for design details
 */

/*global document:true requestAnimationFrame:true */
"use strict";

var THREE = require('three');
var Interpolator = require('animation-smoother');


/**
 * Create game renderer object
 * @param graphicsContainerId html container for game renderer, its real size defines the size of viewport
 * @constructor
 */
function PongGameRenderer(graphicsContainerId) {
  this._graphicsContainerId = graphicsContainerId;
}

module.exports = PongGameRenderer;

/**
 * change rendering scene: intro, lobby, match
 */
PongGameRenderer.prototype.showScene = function () {
  var animate;
  var sphere;
  var sphereMaterial;
  var scene;
  var renderer;
  var camera;
  var radius, segments, rings;
  var container = document.getElementById(this._graphicsContainerId);
  var width = container.style.width.replace("px", "");
  var height = container.style.height.replace("px", "");

  // set some camera attributes
  var VIEW_ANGLE, ASPECT, NEAR, FAR;
  VIEW_ANGLE = 45;
  ASPECT = width / height;
  NEAR = 0.1;
  FAR = 10000;

  // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 300;

  // start the renderer
  renderer.setSize(width, height);

  // attach the render-supplied DOM element
  container.appendChild(renderer.domElement);

  // set up the sphere vars
  radius = 10;
  segments = 16;
  rings = 16;

  // create the sphere's material
  sphereMaterial = new THREE.MeshLambertMaterial(
  {
    color:0xCC0000
  });

  // create a new mesh with
  // sphere geometry - we will cover
  // the sphereMaterial next!
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius,
      segments,
      rings),
    sphereMaterial);

  // add the sphere to the scene
  scene.add(sphere);

  this._ballPositions = new Interpolator({x: 50, y: 50});
  this._ballPositions.onCoordinateRequest(function () {
    sphere.position.x = this.x;
    sphere.position.y = this.y;
  });

  animate = function() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    Interpolator.updateAll();
    renderer.render(scene, camera);
  };
  animate();
};

/**
 * render changes to game: objects changed positions, player scored
 */
PongGameRenderer.prototype.renderGameUpdate = function (objects) {
  this._ballPositions.scheduleNext({
    x: objects.BALL.position.x,
    y: objects.BALL.position.y
  }, objects.delay);
};

/**
 * add object to current scene
 */
PongGameRenderer.prototype.addObject = function () {

};

/**
 * remove object from scene
 * @param id
 */
PongGameRenderer.prototype.removeObject = function (id) {

};



