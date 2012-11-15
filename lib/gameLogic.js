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
  , Field = require('./pongField.js')
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
    FieldCreated: "FieldCreated"
  },
  /**
   * Init game module
   * @param emitter see API {@link http://github.com/component/emitter}
   * @param params @type {{fieldWidth: number, fieldHeight: number}}
   */
  initGame:function (emitter, params) {
    gameEventsEmitter = emitter;
    currentGame = new Game();
    currentGame.addField(new Field({width: params.fieldWidth, height: params.fieldHeight}, gameEventsEmitter));
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

