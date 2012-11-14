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
    currentGame._field.addBall(new Ball());
    currentGame._field.addPaddle(new Paddle());
    currentGame._field.addPaddle(new Paddle());
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
      this._paddles = {
        first: null,
        second: null
      };
      this._ball = null;
    },

    addBall: function (ball){
      if(this._ball){
        throw "Ball already present";
      }
      this._ball = {
        object: ball,
        position: {x: this._size.width / 2, y: this._size.height / 2}
      };
      gameEventsEmitter.emit(exports.API.events.BallAdded, this._ball.position);
    },

    addPaddle: function (paddle){
      if(!this._paddles.first){
        this._paddles.first = {
          object: paddle,
          position: {x: 0, y: this._static.PADDLE_INITIAL_Y_POSITION}
        };
        gameEventsEmitter.emit(exports.API.events.PaddleAdded, this._paddles.first.position);

      } else if(!this._paddles.second){
        this._paddles.second = {
          object: paddle,
          position: {x: this._size.width, y: this._static.PADDLE_INITIAL_Y_POSITION}
        };
        gameEventsEmitter.emit(exports.API.events.PaddleAdded, this._paddles.second.position);

      } else {
        throw "There are two paddles already";
      }
    }
  },

  "static": {
    PADDLE_INITIAL_Y_POSITION: 10
  }
});


var Ball = declare({
  instance:{
    constructor:function (options) {
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

var Paddle = declare({
  instance: {
    constructor: function(){
      this._length = this._static.PADDLE_LENGTH;
    }
  },
  "static": {
    PADDLE_LENGTH: 10
  }
});

