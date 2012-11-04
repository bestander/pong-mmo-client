/*
 * Super Pong HTML5 multiplayer game
 *
 * Author: Konstantin Raev (bestander@gmail.com)
 * Released under the MIT license
 */

/*jslint node:true laxcomma:true*/
"use strict";

var gameEventsEmitter
  , currentGame
  , currentMatch
  ;

/**
 * API of the module
 * @type {Object}
 */
exports.API = {
  /**
   * events that module can emit, see API {@link http://github.com/component/emitter}
   */
  events: {
    FieldCreated: {width: 50, height: 50},
    BallAdded: {x: 0, y:0},
    PaddleAdded: {x:0, y:0}
  },
  /**
   * Init game module
   * @param emitter see API {@link http://github.com/component/emitter}
   * @param params @type {Object}
   */
  initGame: function (emitter, params){
    gameEventsEmitter = emitter;
    currentGame = new Game();
    //gameEventsEmitter.emit("FieldCreated", {width: 100, height: 50});
    //currentGame.addField(new Field());
    //gameEventsEmitter.emit("gameInitialized");
  },

  startMatch: null,

  movePaddle: null

};

var Ball = function () {
  this.position = {
    x:0,
    y:0
  };

  this.velocity = {
    dx:0,
    dy:0
  };

  this.changePosition = function () {
    // TODO just for testing
    this.position.x += 1;
    this.position.y += 2;

  };
};

var Paddle = function () {
  this.position = {
    x:0,
    y:0
  };
  this.length = 0;
  this.step = 0;

  this.movePaddle = function (directionY) {

  };
};

var Game = function (ballChangedPositionCallback) {
  this.scores = {
    player1:0,
    player2:0
  };

  var ball = new Ball();

  var nextTick = function () {
    ball.changePosition();
    ballChangedPositionCallback(ball.position);

    window.setTimeout(nextTick, 1000 / 60);
  };

  this.start = function () {
    nextTick();
  };

  //this.start();


};

var Field = function () {
  this.dimentions = {
    x:0,
    y:0
  };
};



