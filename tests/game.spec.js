/*jshint node:true indent:2 laxcomma:true*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true jasmine:true */
"use strict";

var Game = require("super-pong/lib/pongGame.js")
  ;

describe("Pong Game", function () {

  var gameEventsEmitter;

  beforeEach(function () {
    gameEventsEmitter = {
      emit: function () {
      }
    };
    spyOn(gameEventsEmitter, "emit");
  });

  describe("constructor with no parameters", function () {
    it("creates a field of standard size with ball and paddles", function () {
      var game = new Game(gameEventsEmitter);
      expect(game._field._paddles.first).not.toBeNull();
      expect(game._field._paddles.second).not.toBeNull();
      expect(game._field._ball).not.toBeNull();
      expect(game._field._ball.position.x).toEqual(game._field._size.width / 2);
      expect(game._field._ball.position.y).toEqual(game._field._size.height / 2);
    });
  });

  describe("constructor emits", function () {
    it("FieldAdded event with field measures", function () {
      var params = {fieldWidth: 300, fieldHeight: 400};
      var game = new Game(gameEventsEmitter, params);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(game._static.events.FieldCreated,
        {width: params.fieldWidth, height: params.fieldHeight});
    });
  });

  describe("constructor without event emitter", function () {
    it("throws an error", function () {
      var construct
        , game;
      construct = function () {
        game = new Game();
      };
      expect(construct).toThrow("Event emitter not supplied");
    });
  });

  describe("start match", function () {

    var timerCallback;

    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();
    });

    it("makes the ball moving", function () {
      var initialBallLocation
        , game;

      game = new Game(gameEventsEmitter);
      initialBallLocation = {
        x: game._field._ball.position.x,
        y: game._field._ball.position.y
      };
      game.startMatch();
      expect(game._field._ball.position).toEqual(initialBallLocation);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game._field._ball.position).not.toEqual(initialBallLocation);
    });
  });


});
