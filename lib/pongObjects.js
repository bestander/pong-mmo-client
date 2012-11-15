/**
 * pong field object, takes care of every game object on it
 */
/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js')
  ;


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
