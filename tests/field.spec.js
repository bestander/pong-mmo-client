/*jshint node:true indent:2 laxcomma:true*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true */
"use strict";

var Field = require("super-pong/lib/pongField.js")
  ;

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
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);

      expect(gameEventsEmitter.emit.calls.length).toEqual(0);
      expect(field._size.width).toEqual(100);
      expect(field._size.height).toEqual(200);
      expect(field._ball).toBeNull();
      expect(field._paddles.first).toBeNull();
      expect(field._paddles.second).toBeNull();
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

      expect(field._size.width).toBe(100);
      expect(field._size.height).toBe(100);
    });
  });

  describe("add ball function", function () {
    it("adds a ball to a field and positions it in the centre", function () {
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var ball = {
        internalField: "value"
      };
      field.addBall(ball);

      position = {x: 50, y: 100};
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(field._static.events.BallAdded, position);
      expect(field._ball.object).toBe(ball);
      expect(field._ball.position).toEqual(position);
    });
  });

  describe("add paddle function", function () {
    it("called first time adds left paddle", function () {
      var position;
      var field = new Field({width: 100, height: 200}, gameEventsEmitter);
      var paddle = {
        someField: "value"
      };
      field.addPaddle(paddle);

      position = {x: 0, y: field._static.PADDLE_INITIAL_Y_POSITION};
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(field._static.events.PaddleAdded, position);
      expect(field._paddles.first.object).toBe(paddle);
      expect(field._paddles.first.position).toEqual(position);
      expect(field._paddles.second).toBeNull();
      expect(field._ball).toBeNull();
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
      expect(gameEventsEmitter.emit.calls.length).toBe(2);
      expect(gameEventsEmitter.emit).toHaveBeenCalledWith(field._static.events.PaddleAdded, position);
      expect(field._paddles.first.object).toBe(paddle);
      expect(field._paddles.second.object).toBe(paddle);
      expect(field._paddles.second.position).toEqual(position);
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

});
