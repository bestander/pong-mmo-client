/*jshint node:true indent:2 laxcomma:true*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true jasmine:true */
"use strict";

var Game = require("super-pong/lib/pongGame.js");
var Field = require("super-pong/lib/pongField.js");
var events = require("super-pong/lib/gameEvents.js");

/**
 * search latest event index in the event list of a jasmine spied object
 * @param event event identifier
 * @param calls calls array of spied object
 * @return {Array} arguments with which the event was emitted or null if none found
 */
function findArgumentsOfTheLatestEvent(event, calls) {
  var i = calls.length - 1;
  while (i >= 0) {
    if (calls[i].args[0] === event) {
      return calls[i].args;
    }
    i -= 1;
  }
  return null;
}

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
      var size = {width: 100, height: 100};

      expect(gameEventsEmitter.emit.calls.length).toEqual(4);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.FIELD_CREATED, size);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.BALL_ADDED, {x: size.width / 2, y: size.height / 2});
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_ADDED, {x: 0, y: 10});
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_ADDED, {x: size.width, y: 10});

    });
  });

  describe("constructor emits", function () {
    it("FieldAdded event with field measures", function () {
      var params = {fieldWidth: 300, fieldHeight: 400};
      var game = new Game(gameEventsEmitter, params);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.FIELD_CREATED,
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
      var eventArgs;
      var initialBallLocation;
      var game;

      game = new Game(gameEventsEmitter);
      game.startMatch();

      initialBallLocation = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_ADDED, gameEventsEmitter.emit.calls)[1];
      expect(initialBallLocation).toEqual({x: 50, y: 50});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).not.toEqual(initialBallLocation);

    });
  });

  describe("Start match with ball set impulse to", function () {
    var initialBallLocation
      , game
      , timerCallback;
    var eventArgs;

    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();


      game = new Game(gameEventsEmitter);
      initialBallLocation = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_ADDED, gameEventsEmitter.emit.calls)[1];

    });

    it("incorrect direction throws an error", function () {
      var throwing;

      throwing = function () {
        game.startMatch({
          ballXSpeed: "a",
          ballYSpeed: 0
        });
      };
      expect(throwing).toThrow("incorrect ball initial direction");

      throwing = function () {
        game.startMatch({
          ballXSpeed: 0,
          ballYSpeed: "c"
        });
      };
      expect(throwing).toThrow("incorrect ball initial direction");

    });

    it("right makes ball move right on the next step", function () {
      game.startMatch({
        ballXSpeed: 5,
        ballYSpeed: 0
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).toEqual({
        x: initialBallLocation.x + 5,
        y: initialBallLocation.y
      });
    });

    it("left makes ball move left on the next step", function () {
      game.startMatch({
        ballXSpeed: -10,
        ballYSpeed: 0
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).toEqual({
        x: initialBallLocation.x - 10,
        y: initialBallLocation.y
      });

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).toEqual({
        x: initialBallLocation.x - 20,
        y: initialBallLocation.y
      });

    });

    it("up makes ball move up on the next step", function () {
      game.startMatch({
        ballXSpeed: 0,
        ballYSpeed: -5
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).toEqual({
        x: initialBallLocation.x,
        y: initialBallLocation.y - 5
      });

    });

    it("down makes ball move down on the next step", function () {
      game.startMatch({
        ballXSpeed: 0,
        ballYSpeed: 5
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).toEqual({
        x: initialBallLocation.x,
        y: initialBallLocation.y + 5
      });
    });

    it("up-right makes ball move up and to the right on the next step", function () {
      game.startMatch({
        ballXSpeed: 5,
        ballYSpeed: -5
      });
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      eventArgs = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls);
      expect(eventArgs).not.toBeNull();
      expect(eventArgs[1]).toEqual({
        x: initialBallLocation.x + 5,
        y: initialBallLocation.y - 5
      });

    });

  });

  describe("Ball bouncing", function () {
    var game
      , timerCallback;
    var initialBallLocation;


    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();

      game = new Game(gameEventsEmitter, {fieldWidth: 40, fieldHeight: 40});
      initialBallLocation = findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_ADDED, gameEventsEmitter.emit.calls)[1];
    });

    it("from top edge changes vertical speed to opposite but horizontal remains unchanged", function () {
      game.startMatch({
        ballXSpeed: 5,
        ballYSpeed: -10
      });

      expect(initialBallLocation).toEqual({x: 20, y: 20});
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls)[1])
        .toEqual({x: 30, y: 0});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls)[1])
        .toEqual({x: 35, y: 10});

    });

    it("from bottom edge changes vertical speed to opposite but horizontal remains unchanged", function () {
      game.startMatch({
        ballXSpeed: -5,
        ballYSpeed: 10
      });

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls)[1])
        .toEqual({x: 10, y: 40});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls)[1])
        .toEqual({x: 5, y: 10});

    });

    it("from right paddle bounces left with the same speed and vertical speed is unchanged", function () {
      game.startMatch({
        ballXSpeed: -5,
        ballYSpeed: 10
      });
      game.movePaddle(Field["static"].PaddlesEnum.SECOND, )

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls)[1])
        .toEqual({x: 10, y: 40});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(findArgumentsOfTheLatestEvent(events.GameEventsEnum.BALL_POSITION_CHANGED, gameEventsEmitter.emit.calls)[1])
        .toEqual({x: 5, y: 10});


      game.field.ball.object.giveImpulse({
        x: 10,
        y: 4
      });
      game.field.paddles.second.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 40, y: 28});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: 4});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 28});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 30, y: 32});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: 4});

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
        y: 4
      });
      game.field.paddles.first.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 0, y: 28});
      expect(game.field.ball.object.velocity).toEqual({dx: -10, dy: 4});
      expect(game.field.paddles.first.position).toEqual({x: 0, y: 28});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.ball.position).toEqual({x: 10, y: 32});
      expect(game.field.ball.object.velocity).toEqual({dx: 10, dy: 4});

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

  describe("Paddle receiving impulse", function () {

    var game
      , timerCallback;

    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();

      game = new Game(gameEventsEmitter, {fieldWidth: 40, fieldHeight: 80});
      game.startMatch();
    });

    it("DOWN moves down, slows down and stops eventually", function () {

      game.field.paddles.first.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      game.field.paddles.second.object.giveImpulse("DOWN");
      expect(game.field.paddles.first.position).toEqual({x: 0, y: 20});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 28});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 20});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 34});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 28});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 38});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 34});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 41});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 38});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 43});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 41});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 44});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 43});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 44});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 44});

    });

    it("UP moves up, slows down and stops eventually", function () {

      game.field.paddles.first.object.giveImpulse("DOWN");
      game.field.paddles.second.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      game.field.paddles.first.object.giveImpulse("UP");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      game.field.paddles.second.object.giveImpulse("UP");

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 34});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 44});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 26});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 34});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 20});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 26});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 16});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 20});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 13});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 16});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 11});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 13});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 10});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 11});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 10});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 10});

    });

  });

  describe("Paddle hitting", function () {

    var game
      , timerCallback;

    beforeEach(function () {
      timerCallback = jasmine.createSpy('timerCallback');
      jasmine.Clock.useMock();

      game = new Game(gameEventsEmitter, {fieldWidth: 40, fieldHeight: 30});
      game.startMatch();
    });

    it("ceiling stops moving", function () {
      game.field.paddles.second.object.giveImpulse("UP");
      game.field.paddles.first.object.giveImpulse("UP");

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 10});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 10});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 0});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 0});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 0});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 0});

    });

    it("floor stops moving", function () {
      game.field.paddles.second.object.giveImpulse("DOWN");
      game.field.paddles.first.object.giveImpulse("DOWN");

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);
      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 28});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 28});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 30});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 30});

      jasmine.Clock.tick(game._static.TICK_DURATION_MS);

      expect(game.field.paddles.first.position).toEqual({x: 0, y: 30});
      expect(game.field.paddles.second.position).toEqual({x: 40, y: 30});

    });
  });


  describe("Ball scoring", function () {

  });

});

