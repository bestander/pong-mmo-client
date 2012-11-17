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

        // ball movement
        var secondPaddleVerticalRange;
        var firstPaddleVerticalRange;
        var x = game.field.ball.position.x;
        var dx = game.field.ball.object.velocity.dx;

        var y = game.field.ball.position.y;
        var dy = game.field.ball.object.velocity.dy;

        // horizontal ball bounce
        if(x + dx < 0){
          firstPaddleVerticalRange = [
            game.field.paddles.first.position.y,
            game.field.paddles.first.position.y + game.field.paddles.first.object._static.PADDLE_LENGTH
          ];
          if(y >= firstPaddleVerticalRange[0] && y <= firstPaddleVerticalRange[1]){
            // bounce
            game.field.ball.object.velocity.dx = -dx;
            dx = -dx;
          } else {
           // score for player 2
           console.log("score player 2");
          }
        } else if (x + dx > game.field.size.height){
          secondPaddleVerticalRange = [
            game.field.paddles.second.position.y,
            game.field.paddles.second.position.y + game.field.paddles.second.object._static.PADDLE_LENGTH
          ];
          if(y >= secondPaddleVerticalRange[0] && y <= secondPaddleVerticalRange[1]){
            // bounce
            game.field.ball.object.velocity.dx = -dx;
            dx = -dx;
          } else {
            // score for player 1
            console.log("score player 1");
          }
        }
        game.field.ball.position.x += dx;

        // vertical ball bounce
        if(y + dy < 0 || y + dy > game.field.size.width){
          game.field.ball.object.velocity.dy = -dy;
          dy = -dy;
        }

        game.field.ball.position.y += dy;

        // paddle movement
        game.field.paddles.first.position.y += game.field.paddles.first.object.velocity.dy;
        if(game.field.paddles.first.position.y < 0){
          game.field.paddles.first.position.y = 0;
          game.field.paddles.first.object.stop();
        }
        if(game.field.paddles.first.position.y > game.field.size.height){
          game.field.paddles.first.position.y = game.field.size.height;
          game.field.paddles.first.object.stop();
        }
        game.field.paddles.first.object.slowdown();

        game.field.paddles.second.position.y += game.field.paddles.second.object.velocity.dy;
        if(game.field.paddles.second.position.y < 0){
          game.field.paddles.second.position.y = 0;
          game.field.paddles.second.object.stop();
        }
        if(game.field.paddles.second.position.y > game.field.size.height){
          game.field.paddles.second.position.y = game.field.size.height;
          game.field.paddles.second.object.stop();
        }
        game.field.paddles.second.object.slowdown();

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
