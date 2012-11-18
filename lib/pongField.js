/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js');
var events = require('./gameEvents.js');

/**
 * Game field - just a container that keeps track of positions and visibility of all game objects.
 * Such matters and speed and behaviour are handled in other modules.
 * Emits events:
 * FIELD_CREATED
 * BALL_ADDED
 * PADDLE_ADDED
 * BALL_POSITION_CHANGED
 * PADDLE_POSITION_CHANGED
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
      this._paddles = {};
      this._ball = null;
      this.gameEventsEmitter = gameEventsEmitter;
      this.gameEventsEmitter.emit(events.GameEventsEnum.FIELD_CREATED, {width: this._size.width, height: this._size.height});
    },

    addBall: function (ball){
      if(this._ball){
        throw "Ball already present";
      }
      this._ball = {
        object: ball,
        position: {x: this._size.width / 2, y: this._size.height / 2}
      };
      this.gameEventsEmitter.emit(events.GameEventsEnum.BALL_ADDED, this._ball.position);
    },

    getBall: function(){
      if(!this._ball){
        return null;
      }
      return this._ball;
    },

    moveBall: function(position){
      if(!this._ball){
        throw "No ball present";
      }
      //noinspection OverlyComplexBooleanExpressionJS
      if(position.x > this._size.width || position.x < 0 || isNaN(position.x) ||
        position.y > this._size.height || position.y < 0 || isNaN(position.y)){
        throw "Wrong position for ball";
      }
      this._ball.position = {x: position.x, y: position.y};
      this.gameEventsEmitter.emit(events.GameEventsEnum.BALL_POSITION_CHANGED, this._ball.position);
    },

    addPaddle: function (paddle){
      var position;
      if(!this._paddles[this._static.PaddlesEnum.FIRST]){
        position = {x: 0, y: this._static.PADDLE_INITIAL_Y_POSITION};
        this._paddles[this._static.PaddlesEnum.FIRST] = {
          object: paddle,
          position: position
        };

      } else if (!this._paddles[this._static.PaddlesEnum.SECOND]){
        position = {x: this._size.width, y: this._static.PADDLE_INITIAL_Y_POSITION};
        this._paddles[this._static.PaddlesEnum.SECOND] = {
          object: paddle,
          position: position
        };

      } else {
        throw "There are two paddles already";
      }
      this.gameEventsEmitter.emit(events.GameEventsEnum.PADDLE_ADDED, position);
    },

    getPaddle: function (type){
      if(!this._paddles[type]){
        return null;
      }
      return this._paddles[type];
    },

    movePaddle: function (type, position) {
      var paddle = this._paddles[type];
      if(!paddle){
        throw "Paddle not found";
      }
      if(!position || isNaN(position.dy)){
        throw "Incorrect distance to move paddle";
      }
      paddle.position.y += position.dy;
      if(paddle.position.y >= this._size.height){
        paddle.position.y = this._size.height - 1;
      }
      if(paddle.position.y < 0){
        paddle.position.y = 0;
      }
      this.gameEventsEmitter.emit(events.GameEventsEnum.PADDLE_POSITION_CHANGED, {type: type, y: paddle.position.y});

    }
  },



  "static": {
    PADDLE_INITIAL_Y_POSITION: 10,
    PaddlesEnum: {
      FIRST: "FIRST",
      SECOND: "SECOND"
    }
  }
});

module.exports = Field;