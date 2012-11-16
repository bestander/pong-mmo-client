/**
 * pong game objects without much logic in them
 */
/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js')
  ;


exports.Ball = declare({
  instance:{
    constructor:function (options) {
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
    }
  },
  "static": {
    PADDLE_LENGTH: 10
  }
});


