/**
 * pong field object, takes care of every game object on it
 */
/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js')
  , Field = require('./pongField.js')
  , objects = require('./pongObjects.js')
  ;

/**
 * Game object, holds references to other business entities
 */
var Game = declare({



  instance:{

    constructor: function(emitter, params){
      params = params || {};
      this.gameEventsEmitter = emitter;
      this._field = new Field({width: params.fieldWidth, height: params.fieldHeight}, this.gameEventsEmitter);
      this.addField(this._field);
      this._field.addBall(new objects.Ball());
      this._field.addPaddle(new objects.Paddle());
      this._field.addPaddle(new objects.Paddle());
    },

    addField:function (fieldToAdd) {
      this._field = fieldToAdd;
      this.gameEventsEmitter.emit(this._static.events.FieldCreated, {
        width: this._field._size.width,
        height: this._field._size.height
      });
    },

    startMatch: function () {
      var game = this;
      var loop = function() {
        game._field._ball.position.x += 1;
      };
      setInterval(loop, this._static.TICK_DURATION_MS);
    }

  },

  "static": {
    TICK_DURATION_MS: 100,
    events: {
      FieldCreated: "FieldCreated"
    }
  }
});

module.exports = Game;
