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
      this.velocity = {
        dx:0,
        dy:0
      };
    },

    /**
     * push the ball in a direction
     * @param direction {{x: number, y: number}}
     */
    giveImpulse: function (direction) {
      this.velocity.dx = direction.x;
      this.velocity.dy = direction.y;
    }
  }
});

exports.Paddle = declare({
  instance: {
    constructor: function(){
      this.length = this._static.PADDLE_LENGTH;
      this.velocity = {
        dy: 0
      };
    },

    /**
     * give impulse to paddle
     * @param direction {Paddle._static.MOVE_DIRECTIONS}
     */
    giveImpulse: function (direction) {
      if (direction === this._static.MOVE_DIRECTIONS[0]) {
        this.velocity.dy = -this._static.IMPULSE_SPEED;
      } else {
        this.velocity.dy = this._static.IMPULSE_SPEED;
      }
    },

    /**
     * to add a feeling of inertia in paddle control we have paddle slowdown function
     * apply it every step to make the paddle move slower
     */
    slowdown: function () {
      this.velocity.dy = Math.floor(this.velocity.dy * this._static.SLOWDOWN_FACTOR);
    }
  },
  "static": {
    PADDLE_LENGTH: 10,
    MOVE_DIRECTIONS: ["UP", "DOWN"],
    IMPULSE_SPEED: 5,
    SLOWDOWN_FACTOR: 0.5
  }
});


