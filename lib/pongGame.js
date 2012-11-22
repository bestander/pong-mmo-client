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
      // TODO parameters for tick speed
      this.gameEventsEmitter = emitter;
      this._field = new Field({width: params.fieldWidth, height: params.fieldHeight}, this.gameEventsEmitter);
      this._field.addBall(new objects.Ball());
      this._field.addPaddle(new objects.Paddle());
      this._field.addPaddle(new objects.Paddle());
    },

    startMatch: function startMatch(params) {
      var correctBallPositionAndSpeed;
      var applyBallBounceModifications;
      var loop;
      var game = this;
      if(this.matchId){
        throw "Match already started";
      }
      params = params || {ballXSpeed: 5, ballYSpeed: 5};
      if(isNaN(params.ballXSpeed) || isNaN(params.ballYSpeed)){
        throw "incorrect ball initial direction";
      }

      applyBallBounceModifications = function applyBallBounceModifications(ball, field){
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

      };

      correctBallPositionAndSpeed = function correctBallPositionAndSpeed(ball, field){
        // calculated position
        var expectedY = ball.position.y + ball.object._velocity.dy;
        var expectedX = ball.position.x + ball.object._velocity.dx;
        // corrected position
        var correctedY = Math.abs(expectedY);
        var correctedX = Math.abs(ball.position.x + ball.object._velocity.dx);
        if(ball.position.y > field._size.height){
          correctedY = 2*field._size.width - correctedY;
        }

        // vertical ball bounce
        if(expectedY <= 0 || expectedY >= field._size.width){
          ball.object.giveImpulse({dx: ball.object._velocity.dx, dy: -ball.object._velocity.dy});
        }

        // final move
        field.moveBall({x: correctedX , y: correctedY});
      };

      loop = function loop() {

        // ball movement
        var ball = game._field.getBall();
        correctBallPositionAndSpeed(ball, game._field);
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
      game._field.getBall().object.giveImpulse({dx: params.ballXSpeed, dy: params.ballYSpeed});
      // TODO no one notices exceptions in the loop
      this.matchId = setInterval(loop, this._static.TICK_DURATION_MS);
    },

    stopMatch: function stopMatch() {
      clearInterval(this.matchId);
      this.matchId = null;
    },

    movePaddle: function movePaddle(type, direction){
      this._field.movePaddle(type, direction);
    }

  },

  "static": {
    TICK_DURATION_MS: 100
  }
});

module.exports = Game;
