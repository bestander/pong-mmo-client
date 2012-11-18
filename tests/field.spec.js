/*jshint node:true indent:2 laxcomma:true*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true */
"use strict";

var Field = require("super-pong/lib/pongField.js");
var events = require("super-pong/lib/gameEvents.js");

describe("Pong Field", function () {

  var gameEventsEmitter;

  beforeEach(function () {
    gameEventsEmitter = {
      emit: function (name, param) {

      }
    };
    spyOn(gameEventsEmitter, "emit");
  });

  describe("constructor", function () {
    it("defines width and height and no objects are added", function () {
      var size = {width: 100, height: 200};
      var field = new Field(size, gameEventsEmitter);

      expect(gameEventsEmitter.emit.calls.length).toEqual(1);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.FIELD_CREATED, size);

    });
  });

  describe("constructor without", function () {
    it("event emitter supplied throws an error", function () {
      var create = function () {
        var field = new Field({width: 100, height: 200});
      };
      expect(create).toThrow("Event emitter not supplied");
    });

    it("width or height creates a field with standard dimensions", function () {
      var field = new Field(null, gameEventsEmitter);

      expect(gameEventsEmitter.emit.calls.length).toEqual(1);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.FIELD_CREATED, {width: 100, height: 100});
    });
  });

  describe("'add ball' function", function () {
    it("adds a ball to a field and positions it in the centre", function () {
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var ball = {
        internalField: "value"
      };
      expect(field.getBall()).toBeNull();
      field.addBall(ball);

      position = {x: 50, y: 100};
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.BALL_ADDED, position);
      expect(field.getBall()).not.toBeNull();
    });
  });

  describe("'add ball' twice throws an error", function () {
    it("adds a ball to a field and positions it in the centre", function () {
      var addTwice;
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var ball = {
        internalField: "value"
      };
      field.addBall(ball);
      addTwice = function () {
        field.addBall(ball);
      };
      expect(addTwice).toThrow("Ball already present");
    });
  });

  describe("'add paddle' function", function () {
    it("called first time adds left paddle", function () {
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var paddle = {
        someField: "value"
      };
      expect(field.getPaddle(field._static.PaddlesEnum.FIRST)).toBeNull();
      expect(field.getPaddle(field._static.PaddlesEnum.SECOND)).toBeNull();
      field.addPaddle(paddle);

      position = {x: 0, y: field._static.PADDLE_INITIAL_Y_POSITION};
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_ADDED, position);
      expect(gameEventsEmitter.emit.calls.length).toEqual(2);
      expect(field.getPaddle(field._static.PaddlesEnum.FIRST)).not.toBeNull();
      expect(field.getPaddle(field._static.PaddlesEnum.SECOND)).toBeNull();

    });

    it("called second time adds right paddle", function () {
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var paddle = {
        someField: "value"
      };
      field.addPaddle(paddle);
      field.addPaddle(paddle);

      position = {x: 100, y: field._static.PADDLE_INITIAL_Y_POSITION};
      expect(gameEventsEmitter.emit.calls.length).toBe(3);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_ADDED, position);
      expect(field.getPaddle(field._static.PaddlesEnum.FIRST)).not.toBeNull();
      expect(field.getPaddle(field._static.PaddlesEnum.SECOND)).not.toBeNull();
    });

    it("called third time throws an error", function () {
      var addThird;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var paddle = {
        someField: "value"
      };
      field.addPaddle(paddle);
      field.addPaddle(paddle);
      addThird = function () {
        field.addPaddle(paddle);
      };
      expect(addThird).toThrow("There are two paddles already");
    });
  });

  describe("Move ball", function () {
    it("without any ball present throws an error", function () {
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var moveFunction = function () {
        field.moveBall();
      };
      expect(moveFunction).toThrow("No ball present");
    });

    it("to position beyond field size throws an error", function () {
      var moveFunction;
      var field = new Field({width: 250, height: 300}, gameEventsEmitter);
      field.addBall();

      moveFunction = function () {
        field.moveBall({x: -1, y: 10});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

      moveFunction = function () {
        field.moveBall({x: 10, y: -1});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

      moveFunction = function () {
        field.moveBall({x: -1, y: -1});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

      moveFunction = function () {
        field.moveBall({x: 251, y: 10});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

      moveFunction = function () {
        field.moveBall({x: 250, y: 301});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

      moveFunction = function () {
        field.moveBall({x: 251, y: 310});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

      moveFunction = function () {
        field.moveBall({x: "a", y: "b"});
      };
      expect(moveFunction).toThrow("Wrong position for ball");

    });


    it("changes ball postilion within field size", function () {
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      field.addBall();
      position = {x: 75, y: 126};
      field.moveBall(position);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.BALL_POSITION_CHANGED, position);
    });
  });

  describe("Move Paddle", function () {
    it("Without specifying which paddle throws an error", function () {
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var throwable;

      throwable = function () {
        field.movePaddle(field._static.PaddlesEnum.FIRST, {dy : 10});
      };
      expect(throwable).toThrow("Paddle not found");

      field.addPaddle();
      field.movePaddle(field._static.PaddlesEnum.FIRST, {dy: 10});
      throwable = function () {
        field.movePaddle(field._static.PaddlesEnum.SECOND, {dy: 10});
      };
      expect(throwable).toThrow("Paddle not found");

      field.addPaddle();
      field.movePaddle(field._static.PaddlesEnum.FIRST, {dy: 10});
      field.movePaddle(field._static.PaddlesEnum.SECOND, {dy: 10});
    });

    it("with incorrect distance throws an error", function () {
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var throwable;

      field.addPaddle();
      field.addPaddle();

      throwable = function () {
        field.movePaddle(field._static.PaddlesEnum.FIRST, {dy : "a"});
      };
      expect(throwable).toThrow("Incorrect distance to move paddle");

      throwable = function () {
        field.movePaddle(field._static.PaddlesEnum.SECOND, {dy : "a"});
      };
      expect(throwable).toThrow("Incorrect distance to move paddle");

    });

    it("moves the paddle up and down", function () {
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      field.addPaddle();
      field.addPaddle();

      field.movePaddle(field._static.PaddlesEnum.FIRST, {dy: 10});
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_POSITION_CHANGED, {
        type: field._static.PaddlesEnum.FIRST,
        y: 20
      });

      field.movePaddle(field._static.PaddlesEnum.SECOND, {dy: -10});
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_POSITION_CHANGED, {
        type: field._static.PaddlesEnum.SECOND,
        y: 0
      });
    });

    it("Beyond screen height stops paddle at the edge", function () {
      var field = new Field({width: 100, height: 100}, gameEventsEmitter);
      field.addPaddle();
      field.addPaddle();

      field.movePaddle(field._static.PaddlesEnum.FIRST, {dy: 100});
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_POSITION_CHANGED, {
        type: field._static.PaddlesEnum.FIRST,
        y: 99
      });

      field.movePaddle(field._static.PaddlesEnum.SECOND, {dy: -100});
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(events.GameEventsEnum.PADDLE_POSITION_CHANGED, {
        type: field._static.PaddlesEnum.SECOND,
        y: 0
      });

    });
  });

});
