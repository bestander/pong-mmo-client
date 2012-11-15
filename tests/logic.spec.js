/*jshint node:true indent:2 laxcomma:true*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true */
"use strict";

var logic = require("super-pong/lib/gameLogic.js")
  ;

describe("Game logic", function () {

  var gameEventsEmitter;

  beforeEach(function () {
    gameEventsEmitter = {
        emit: function (name, param) {

        }
      };
    spyOn(gameEventsEmitter, "emit");
  });

  describe("Initialize", function () {
    it("creates a field with defined width and height", function () {
      logic.API.initGame(gameEventsEmitter, {
        fieldWidth : 100,
        fieldHeight : 50
      });

      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(logic.API.events.FieldCreated, {width: 100, height: 50});
    });

  });


  describe("Start game", function () {
    it("gives the ball non-zero speed", function () {

    });

    it("makes paddle controls responsive", function () {

    });
  });

  describe("Ball motion", function () {
    describe("Ball moving right", function () {
      it("appears to the right of it's original position on the next iteration", function () {

      });
    });

    describe("Ball moving left", function () {
      it("appears to the left of it's original position on the next iteration", function () {

      });
    });

    describe("Ball moving in left and up", function () {
      it("appears to the left and higher of it's original position on the next iteration", function () {

      });
    });

    describe("Ball moving in left and down", function () {
      it("appears to the left and lower of it's original position on the next iteration", function () {

      });
    });

    describe("Ball moving in right and up", function () {
      it("appears to the right and higher of it's original position on the next iteration", function () {

      });
    });

    describe("Ball moving in right and down", function () {
      it("appears to the right and lower of it's original position on the next iteration", function () {

      });
    });

  });

  describe("Ball bounces", function () {
    describe("Ball hitting right side or corners", function () {
      it("scores player 1 if there is no paddle on the way", function () {

      });

      it("bounces with mirrored direction if it hits paddle", function () {

      });

    });

    describe("Ball hitting left side or corners", function () {
      it("scores player 2 if there is no paddle on the way", function () {

      });

      it("bounces with mirrored direction if it hits paddle", function () {

      });

    });

    describe("Ball hitting top side", function () {
      it("bounces with mirrored speed", function () {

      });
    });

    describe("Ball hitting bottom side", function () {
      it("bounces with mirrored speed", function () {

      });
    });
  });

}); 