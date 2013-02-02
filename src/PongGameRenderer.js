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
  this._scene = null;
  this._ballObject = null;
}

module.exports = PongGameRenderer;

/**
 * display scene: intro, lobby, match
 * @param field with width and height properties
 */
PongGameRenderer.prototype.showScene = function (field) {
  var boundingBox;
  var boundingBoxConfig;
  var pointLight;
  var that = this;
  var animate;
  var renderer;
  var camera;
  var container = document.getElementById(this._graphicsContainerId);
  var VIEW_ANGLE, ASPECT, NEAR, FAR;

  VIEW_ANGLE = 45;
  NEAR = 0.1;
  FAR = 10000;
  this._fieldWidth = container.style.width.replace("px", "");
  this._filedHeight = container.style.height.replace("px", "");
  ASPECT = this._fieldWidth / this._filedHeight;

  // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  // start the renderer
  renderer.setSize(this._fieldWidth, this._filedHeight);

  camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);
  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 600;

  this._scene = new THREE.Scene();
  this._scene.add(camera);

  // create a point light
  pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

//  this._scene.add(pointLight);

  // outer bounds
  boundingBoxConfig = {
    width: this._fieldWidth,
    height: this._filedHeight,
    depth: 1200,
    splitX: 6,
    splitY: 6,
    splitZ: 20
  };
  boundingBox = new THREE.Mesh(
    new THREE.CubeGeometry(
      boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth,
      boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
    new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } )
  );
  this._scene.add(boundingBox);


  // attach the render-supplied DOM element
  container.appendChild(renderer.domElement);

  animate = function() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    Interpolator.updateAll();
    renderer.render(that._scene, camera);
  };
  animate();
};

/**
 * render changes to game: objects changed positions, player scored
 */
PongGameRenderer.prototype.renderGameUpdate = function (objects) {
  if(objects.BALL && this._ballObject){
    this._ballObject.interpolated.scheduleNext({
      x: objects.BALL.position.x,
      y: objects.BALL.position.y
    }, objects.delay);
  }
  if(objects.leftPlayer && this._leftPlayer){
    this._leftPlayer.interpolated.scheduleNext({
      y: objects.leftPlayer.position.y
    }, objects.delay);
  }
  if(objects.rightPlayer && this._rightPlayer){
    this._rightPlayer.interpolated.scheduleNext({
      y: objects.rightPlayer.position.y
    }, objects.delay);
  }
};

/**
 * add ball to field
 * @param [position] position on the field, optional
 */
PongGameRenderer.prototype.addBall = function (position) {
  position = position || {x: 0, y: 0};
  if(!this._ballObject){
    // create the sphere's material
    this._ballObject = new THREE.Mesh(
      new THREE.SphereGeometry(
        10,
        16,
        16),
      new THREE.MeshLambertMaterial(
        {
          color:0xCC0000
        })
    );
    this._defineInterpolator(this._ballObject, position);
    this._scene.add(this._ballObject);
  }
};

PongGameRenderer.prototype.removeBall = function () {
  this._scene.remove(this._ballObject);
  this._ballObject = null;
};


PongGameRenderer.prototype.addPlayer = function (params) {
  if(params.type === 'left' && !this._leftPlayer){
    // create the sphere's material
    this._leftPlayer = this._definePaddle();
    this._defineInterpolator(this._leftPlayer, {x: -this._fieldWidth / 2, y: 100});
    this._scene.add(this._leftPlayer);
  }
  if(params.type === 'right' && !this._rightPlayer){
    // create the sphere's material
    this._rightPlayer = this._definePaddle();
    this._defineInterpolator(this._rightPlayer, {x: this._fieldWidth / 2, y: 100});
    this._scene.add(this._rightPlayer);
  }
};

PongGameRenderer.prototype.removePlayer = function (type) {
  if(type === 'left') {
    this._scene.remove(this._leftPlayer);
    this._leftPlayer = null;
  }
  if(type === 'right') {
    this._scene.remove(this._rightPlayer);
    this._rightPlayer = null;
  }
};

// TODO player ready
PongGameRenderer.prototype.playerReady = function (type) {
  
};

// TODO player scored

// TODO single delay for all events

// TODO show scene scale

PongGameRenderer.prototype._definePaddle = function () {
  return new THREE.Mesh(
    new THREE.CubeGeometry(
      5,
      60,
      1),
    new THREE.MeshLambertMaterial(
      {
        color:0xCC0000
      })
  );
};

PongGameRenderer.prototype._defineInterpolator = function (object, initialPosition) {
  object.position.x = initialPosition.x;
  object.position.y = initialPosition.y;
  object.interpolated = new Interpolator(initialPosition);
  object.interpolated.onCoordinateRequest(function () {
    object.position.x = this.x;
    object.position.y = this.y;
  });
};

