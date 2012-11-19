/**
 * pong game objects without much logic in them
 */
/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js')
  ;


exports.Ball = declare({
  instance:{
    constructor:function () {
      this._velocity = {
        dx:0,
        dy:0
      };
    },

    /**
     * push the ball in a direction
     * @param direction {{x: number, y: number}}
     */
    giveImpulse: function (direction) {
      this._velocity.dx = direction.dx;
      this._velocity.dy = direction.dy;
    }
  }
});

exports.Paddle = declare({
  instance: {
    constructor: function(){
      this._length = this._static.PADDLE_LENGTH;
      this._velocity = {
        dy: 0
      };
    },

    /**
     * give impulse to paddle
     * @param direction {Paddle._static.MOVE_DIRECTIONS}
     */
    giveImpulse: function (direction) {
      if (direction === this._static.MOVE_DIRECTIONS[0]) {
        this._velocity.dy = -this._static.IMPULSE_SPEED;
      } else {
        this._velocity.dy = this._static.IMPULSE_SPEED;
      }
    },

    /**
     * to add a feeling of inertia in paddle control we have paddle slowdown function
     * apply it every step to make the paddle move slower
     */
    slowdown: function () {
      if(this._velocity.dy > 0){
        this._velocity.dy = Math.floor(this._velocity.dy * this._static.SLOWDOWN_FACTOR);
      } else {
        this._velocity.dy = Math.ceil(this._velocity.dy * this._static.SLOWDOWN_FACTOR);
      }
    },

    stop: function () {
      this._velocity.dy = 0;
    }
  },
  "static": {
    PADDLE_LENGTH: 10,
    MOVE_DIRECTIONS: ["UP", "DOWN"],
    IMPULSE_SPEED: 10,
    SLOWDOWN_FACTOR: 0.8
  }
});


