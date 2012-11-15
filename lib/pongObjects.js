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

exports.Paddle = declare({
  instance: {
    constructor: function(){
      this._length = this._static.PADDLE_LENGTH;
    }
  },
  "static": {
    PADDLE_LENGTH: 10
  }
});


