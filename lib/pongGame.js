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
      this.field = new Field({width: params.fieldWidth, height: params.fieldHeight}, this.gameEventsEmitter);
      this.addField(this.field);
      this.field.addBall(new objects.Ball());
      this.field.addPaddle(new objects.Paddle());
      this.field.addPaddle(new objects.Paddle());
    },

    addField:function (fieldToAdd) {
      this.field = fieldToAdd;
      this.gameEventsEmitter.emit(this._static.events.FieldCreated, {
        width: this.field.size.width,
        height: this.field.size.height
      });
    },

    startMatch: function () {
      var loop;
      var game = this;
      game.field.ball.object.velocity = {
        dx: 5,
        dy: 5
      };
      loop = function() {
        game.field.ball.position.x += game.field.ball.object.velocity.dx;
        game.field.ball.position.y += game.field.ball.object.velocity.dy;
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
