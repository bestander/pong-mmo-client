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
  , declare = require('declare.js')
  ;

/**
 * API of the module
 * @type {Object}
 */
exports.API = {
  /**
   * events that module can emit, see API {@link http://github.com/component/emitter}
   */
  events:{
    FieldCreated: "FieldCreated",
    BallAdded: "BallAdded",
    PaddleAdded: "PaddleAdded"
  },
  /**
   * Init game module
   * @param emitter see API {@link http://github.com/component/emitter}
   * @param params @type {{fieldWidth: number, fieldHeight: number}}
   */
  initGame:function (emitter, params) {
    gameEventsEmitter = emitter;
    currentGame = new Game();
    currentGame.addField(new Field({width: params.fieldWidth, height: params.fieldHeight}));
    currentGame._field.addBall(new Ball({x: params.fieldWidth / 2, y: params.fieldHeight / 2}));
  }
};

/**
 * Game object, holds references to other business entities
 */
var Game = declare({

  instance:{

    constructor: function(){
      this._field = null;
    },

    addField:function (fieldToAdd) {
      this._field = fieldToAdd;
      gameEventsEmitter.emit(exports.API.events.FieldCreated, {
        width: this._field._size.width,
        height: this._field._size.height
      });
    }
  }
});

/**
 * Game field
 * @param {number} width
 * @param {number} height
 * @constructor
 */
var Field = declare({
  instance:{
    constructor:function (options) {
      options = options || {};
      this._size = {
        width: options.width,
        height: options.height
      };
    },

    addBall: function (ball){
      this._ball = ball;
      gameEventsEmitter.emit(exports.API.events.BallAdded, {x: ball._position.x, y: ball._position.y});
    }
  }
});


var Ball = declare({
  instance:{
    constructor:function (options) {
      options = options || {};
      this._position = {
        x:options.x,
        y:options.y
      };
      this._velocity = {
        dx:0,
        dy:0
      };
    },
    /**
     * next game iteration occurred, move in space to your next position
     */
    step:function () {
      console.log("stepping through");
    }
  }
});

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

