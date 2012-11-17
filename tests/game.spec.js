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
      expect(game.field.paddles.first).not.toBeNull();
      expect(game.field.paddles.second).not.toBeNull();
      expect(game.field.ball).not.toBeNull();
      expect(game.field.ball.position.x).toEqual(game.field.size.width / 2);
      expect(game.field.ball.position.y).toEqual(game.field.size.height / 2);
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
        x: game.field.ball.position.x,
        y: game.field.ball.position.y
      };
      game.startMatch();
      expect(game.field.ball.position).toEqual(initialBallLocation);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).not.toEqual(initialBallLocation);
    });
  });

  describe("Ball moving", function () {
    var initialBallLocation
      , game
      , timerCallback;

    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();

      game = new Game(gameEventsEmitter);
      game.startMatch();
      initialBallLocation = {
        x: game.field.ball.position.x,
        y: game.field.ball.position.y
      };
    });

    it("right appears to the right on the next step", function () {
      game.field.ball.object.giveImpulse({
        x: 5,
        y: 0
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).toEqual({
        x: initialBallLocation.x + 5,
        y: initialBallLocation.y
      });
    });

    it("left appears to the left on the next step", function () {
      game.field.ball.object.giveImpulse({
        x: -10,
        y: 0
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).toEqual({
        x: initialBallLocation.x - 10,
        y: initialBallLocation.y
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).toEqual({
        x: initialBallLocation.x - 20,
        y: initialBallLocation.y
      });

    });

    it("up appears higher on the next step", function () {
      game.field.ball.object.giveImpulse({
        x: 0,
        y: -5
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).toEqual({
        x: initialBallLocation.x,
        y: initialBallLocation.y - 5
      });

    });

    it("down appears lower on the next step", function () {
      game.field.ball.object.giveImpulse({
        x: 0,
        y: 5
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).toEqual({
        x: initialBallLocation.x,
        y: initialBallLocation.y + 5
      });

    });

    it("up-right appears higher and to the right on the next step", function () {
      game.field.ball.object.giveImpulse({
        x: 5,
        y: -5
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      expect(game.field.ball.position).toEqual({
        x: initialBallLocation.x + 5,
        y: initialBallLocation.y - 5
      });
    });

  });

  describe("Ball bouncing", function () {
    var game
      , timerCallback;

    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();

      game = new Game(gameEventsEmitter, {fieldWidth: 40, fieldHeight: 40});
      game.startMatch();
    });

    it("from top edge changes vertical speed to opposite but horizontal remains unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: 5,
        y: -10
      });
      expect(game.field.ball.position).toEqual({x: 20, y: 20});
      expect(game.field.ball.object.velocity).toEqual({dx: 5, dy: -10});
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 30, y: 0});
      expect(game.field.ball.object.velocity).toEqual({dx: 5, dy: -10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 35, y: 10});
      expect(game.field.ball.object.velocity).toEqual({dx: 5, dy: 10});

    });

    it("from bottom edge changes vertical speed to opposite but horizontal remains unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: -5,
        y: 10
      });
      expect(game.field.ball.position).toEqual({x: 20, y: 20});
      expect(game.field.ball.object.velocity).toEqual({dx: -5, dy: 10});
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 10, y: 40});
      expect(game.field.ball.object.velocity).toEqual({dx: -5, dy: 10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 5, y: 30});
      expect(game.field.ball.object.velocity).toEqual({dx: -5, dy: -10});
    });

    it("from right paddle bounces left with the same speed and vertical speed is unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: 10,
        y: 3
      });
      game.field.paddles.second.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 40, y: 26});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: 3});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 20});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 30, y: 29});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: 3});

    });

    it("from right paddle top corner bounces left with the same speed and vertical speed is unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: 10,
        y: -5
      });

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 40, y: 10});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: -5});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 30, y: 5});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: -5});

    });

    it("from right paddle bottom corner bounces left with the same speed and vertical speed is unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: 10,
        y: 0
      });

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 40, y: 20});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: 0});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 30, y: 20});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: 0});

    });

    it("from left paddle bounces right with the same speed and vertical speed is unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: -10,
        y: 3
      });
      game.field.paddles.first.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 0, y: 26});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: 3});
      expect(game.field.paddles.first.position).toEqual({x: 0, y: 20});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 10, y: 29});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: 3});

    });

    it("from left paddle top corner bounces right with the same speed and vertical speed is unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: -10,
        y: -5
      });

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 0, y: 10});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: -5});
      expect(game.field.paddles.first.position).toEqual({x: 0, y: 10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 10, y: 5});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: -5});

    });

    it("from left paddle bottom corner bounces right with the same speed and vertical speed is unchanged", function () {
      game.field.ball.object.giveImpulse({
        x: -10,
        y: 0
      });

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 0, y: 20});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: 0});
      expect(game.field.paddles.first.position).toEqual({x: 0, y: 10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 10, y: 20});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: 0});

    });

  });

  describe("Paddle receiving DOWN impulse", function () {

    it("slows down and later stops", function () {

    });

  });

  xdescribe("Ball scoring", function () {

  });

});
