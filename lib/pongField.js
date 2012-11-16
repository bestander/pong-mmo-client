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
      this.size = {
        width: options.width,
        height: options.height
      };
      this.paddles = {
        first: null,
        second: null
      };
      this.gameEventsEmitter = gameEventsEmitter;
      this.ball = null;
    },

    addBall: function (ball){
      if(this.ball){
        throw "Ball already present";
      }
      this.ball = {
        object: ball,
        position: {x: this.size.width / 2, y: this.size.height / 2}
      };
      this.gameEventsEmitter.emit(this._static.events.BallAdded, this.ball.position);
    },

    addPaddle: function (paddle){
      if(!this.paddles.first){
        this.paddles.first = {
          object: paddle,
          position: {x: 0, y: this._static.PADDLE_INITIAL_Y_POSITION}
        };
        this.gameEventsEmitter.emit(this._static.events.PaddleAdded, this.paddles.first.position);

      } else if(!this.paddles.second){
        this.paddles.second = {
          object: paddle,
          position: {x: this.size.width, y: this._static.PADDLE_INITIAL_Y_POSITION}
        };
        this.gameEventsEmitter.emit(this._static.events.PaddleAdded, this.paddles.second.position);

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