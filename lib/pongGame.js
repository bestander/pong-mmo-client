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

    initGame:function (emitter, params) {
    },

    constructor: function(emitter, params){
      var field;
      this._field = field;
      this.gameEventsEmitter = emitter;
      field = new Field({width: params.fieldWidth, height: params.fieldHeight}, this.gameEventsEmitter);
      this.addField(field);
      field.addBall(new objects.Ball());
      field.addPaddle(new objects.Paddle());
      field.addPaddle(new objects.Paddle());
    },

    addField:function (fieldToAdd) {
      this._field = fieldToAdd;
      this.gameEventsEmitter.emit(exports.API.events.FieldCreated, {
        width: this._field._size.width,
        height: this._field._size.height
      });
    }
  }
});

module.exports = Game;
