/**
 * pong field object, takes care of every game object on it
 */
/*jslint node:true laxcomma:true*/
"use strict";

var declare = require('declare.js');
var Field = require('./pongField.js');
var objects = require('./pongObjects.js');
var events = require("./gameEvents.js");


/**
 * Game object, holds references to other business entities
 */
var Game = declare({



  instance:{

    constructor: function(emitter, params){
      params = params || {};
      this.gameEventsEmitter = emitter;
      this._field = new Field({width: params.fieldWidth, height: params.fieldHeight}, this.gameEventsEmitter);
      this._field.addBall(new objects.Ball());
      this._field.addPaddle(new objects.Paddle());
      this._field.addPaddle(new objects.Paddle());
    },

    startMatch: function () {
      var loop;
      var game = this;
      loop = function() {

        // ball movement
//        var secondPaddleVerticalRange;
//        var firstPaddleVerticalRange;
//        var x = game._field.ball.position.x;
//        var dx = game._field.ball.object.velocity.dx;
//
//        var y = game._field.ball.position.y;
//        var dy = game._field.ball.object.velocity.dy;

//        // horizontal ball bounce
//        if(x + dx < 0){
//          firstPaddleVerticalRange = [
//            game._field.paddles.first.position.y,
//            game._field.paddles.first.position.y + game._field.paddles.first.object._static.PADDLE_LENGTH
//          ];
//          if(y >= firstPaddleVerticalRange[0] && y <= firstPaddleVerticalRange[1]){
//            // bounce
//            game._field.ball.object.velocity.dx = -dx;
//            dx = -dx;
//          } else {
//            // score for player 2
//            console.log("score player 2");
//          }
//        } else if (x + dx > game._field.size.height){
//          secondPaddleVerticalRange = [
//            game._field.paddles.second.position.y,
//            game._field.paddles.second.position.y + game._field.paddles.second.object._static.PADDLE_LENGTH
//          ];
//          if(y >= secondPaddleVerticalRange[0] && y <= secondPaddleVerticalRange[1]){
//            // bounce
//            game._field.ball.object.velocity.dx = -dx;
//            dx = -dx;
//          } else {
//            // score for player 1
//            console.log("score player 1");
//          }
//        }
//        game._field.ball.position.x += dx;

//        // vertical ball bounce
//        if(y + dy < 0 || y + dy > game._field.size.width){
//          game._field.ball.object.velocity.dy = -dy;
//          dy = -dy;
//        }
//
//        game._field.ball.position.y += dy;
//
//        // paddle movement
//        game._field.paddles.first.position.y += game._field.paddles.first.object.velocity.dy;
//        if(game._field.paddles.first.position.y < 0){
//          game._field.paddles.first.position.y = 0;
//          game._field.paddles.first.object.stop();
//        }
//        if(game._field.paddles.first.position.y > game._field.size.height){
//          game._field.paddles.first.position.y = game._field.size.height;
//          game._field.paddles.first.object.stop();
//        }
//        game._field.paddles.first.object.slowdown();
//
//        game._field.paddles.second.position.y += game._field.paddles.second.object.velocity.dy;
//        if(game._field.paddles.second.position.y < 0){
//          game._field.paddles.second.position.y = 0;
//          game._field.paddles.second.object.stop();
//        }
//        if(game._field.paddles.second.position.y > game._field.size.height){
//          game._field.paddles.second.position.y = game._field.size.height;
//          game._field.paddles.second.object.stop();
//        }
//        game._field.paddles.second.object.slowdown();

      };
      game._field.getBall().giveImpulse({
        x: 5,
        y: 5
      });
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
