/**
 * pong field object, takes care of every game object on it
 */
/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js')
  ;

/**
 * Game field
 * @param {number} width
 * @param {number} height
 * @constructor
 */
var Field = declare({
  instance:{
    constructor:function (options, gameEventsEmitter) {
      options = options || {};
      options.width = options.width || 100;
      options.height = options.height || 100;

      if(!gameEventsEmitter){
        throw "Event emitter not supplied";
      }
      this._size = {
        width: options.width,
        height: options.height
      };
      this._paddles = {
        first: null,
        second: null
      };
      this.gameEventsEmitter = gameEventsEmitter;
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
      this.gameEventsEmitter.emit(this._static.events.BallAdded, this._ball.position);
    },

    addPaddle: function (paddle){
      if(!this._paddles.first){
        this._paddles.first = {
          object: paddle,
          position: {x: 0, y: this._static.PADDLE_INITIAL_Y_POSITION}
        };
        this.gameEventsEmitter.emit(this._static.events.PaddleAdded, this._paddles.first.position);

      } else if(!this._paddles.second){
        this._paddles.second = {
          object: paddle,
          position: {x: this._size.width, y: this._static.PADDLE_INITIAL_Y_POSITION}
        };
        this.gameEventsEmitter.emit(this._static.events.PaddleAdded, this._paddles.second.position);

      } else {
        throw "There are two paddles already";
      }
    }
  },

  "static": {
    PADDLE_INITIAL_Y_POSITION: 10,
    events: {
      PaddleAdded: "PaddleAdded",
      BallAdded: "BallAdded"
    }
  }
});

module.exports = Field;