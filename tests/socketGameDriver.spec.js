/*jshint node:true indent:2*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true afterEach:true jasmine:true window runs waitsFor*/
"use strict";

var GameDriver = require("pong-mmo-client/src/socketGameDriver.js");
var Emitter = require('component-emitter');
var _ = require('bestander-lodash')._;


describe("Socket Game Driver", function () {

  // socket mock
  var socket;

  beforeEach(function () {
    // replace socket.io socket with a simple events emitter
    socket = new Emitter();
    spyOn(socket, "on").andCallThrough();
    spyOn(socket, "emit").andCallThrough();
    // socket io mock
    window.io = {
      connect: function (remoteServer) {
        return socket;
      }
    };
    spyOn(window.io, 'connect').andCallThrough();

  });

  describe("when created", function () {
    it("initiates a socket.io connection to a specified server", function () {
      var address = "http://game.com";
      var gameDriver = new GameDriver(address);
      expect(window.io.connect).toHaveBeenCalledWith(address);
    });

    it("synchronizes clocks with server sending a LAG_CHECK command", function () {
      var gameDriver;
      var address = "http://game.com";
      var lagCheckParams;

      expect(socket.emit).not.toHaveBeenCalled();
      socket.on("LAG_CHECK", function (data) {
        lagCheckParams = data;
      });

      runs(function () {
        gameDriver = new GameDriver(address);
      });

      waitsFor(function () {
        return lagCheckParams && (typeof lagCheckParams === "string") && lagCheckParams.length === 4;
      }, "socket should have emit LAG_CHECK command", 100);

    });

    it('makes LAG_CHECK request every 2 seconds and notifies renderer about PING each time it receives a response', function () {

    });

    xit('sends "START_GAME" command', function () {
      var gameDriver = new gameDriver(gameEventsEmitter, [], 'http://address');
      expect(_.filter(socket.emit.calls, function (elem) {
        return elem.args[0] === 'START_GAME';
      }).length).toBe(1);


    });

  });

  xdescribe("waits for GAME_UPDATE message from server", function () {

    var ballPositionEvent;
    var p1PositionEvent;
    var p2PositionEvent;

    beforeEach(function () {
      gameEventsEmitter.on("BALL_CHANGED_POSITION", function (data) {
        ballPositionEvent = data;
      });
      gameEventsEmitter.on("PLAYER_1_CHANGED_POSITION", function (data) {
        p1PositionEvent = data;
      });
      gameEventsEmitter.on("PLAYER_2_CHANGED_POSITION", function (data) {
        p2PositionEvent = data;
      });
    });

    afterEach(function () {
      ballPositionEvent = null;
      p1PositionEvent = null;
      p2PositionEvent = null;
    });

    it("and emits object change state events", function () {
      var address = "http://game.com";
      var gameDriver = new gameDriver(gameEventsEmitter, [], address);

      runs(function () {
        socket.emit("GAME_UPDATE", {
          time: new Date().getTime(),
          ball: {
            position: {
              x: 22,
              y: 33
            }
          },
          players: [
            {
              position: {
                x: 0,
                y: 10
              }
            },
            {
              position: {
                x: 100,
                y: 20
              }
            }
          ]
        });
      });
      waitsFor(function () {
        return ballPositionEvent && p1PositionEvent && p2PositionEvent;
      }, "Game events should have been emitted", 100);

      runs(function () {
        expect(ballPositionEvent.position).toEqual({x: 22, y: 33});
        expect(p1PositionEvent.position).toEqual({x: 0, y: 10});
        expect(p2PositionEvent.position).toEqual({x: 100, y: 20});
        // game events timed instantly as there is no lag compensation
        expect(Math.abs(ballPositionEvent.time - new Date().getTime())).toBeLessThan(101);
        expect(ballPositionEvent.time).toEqual(p1PositionEvent.time);
        expect(ballPositionEvent.time).toEqual(p2PositionEvent.time);
      });


    });

    it("and emits events with consideration of server and client time difference", function () {
      var address = "http://game.com";
      var lagCheckId;

      socket.on("LAG_CHECK", function (data) {
        lagCheckId = data;
      });

      runs(function () {
        var gameDriver = new gameDriver(gameEventsEmitter, [], address);
      });

      waitsFor(function () {
        return lagCheckId;
      }, "Master should have requested server time", 100);

      runs(function () {
        // make server 5 seconds ahead of client
        socket.emit("LAG_RESPONSE", {
          id: lagCheckId,
          time: new Date().getTime() + 5000
        });
        socket.emit("GAME_UPDATE", {
          time: new Date().getTime() + 6000,
          ball: {
            position: {
              x: 22,
              y: 33
            }
          }
        });
      });

      waitsFor(function () {
        return ballPositionEvent;
      }, "Game events should have been emitted", 100);

      runs(function () {
        // client ball move event should occur with compensation of server time difference
        var eventTimeDiff = Math.abs(new Date().getTime() + 1000 - ballPositionEvent.time);
        expect(eventTimeDiff).toBeLessThan(101);
      });
    });

    it("and emits events with consideration of network lag time", function () {
      var address = "http://game.com";
      var lagCheckId;

      socket.on("LAG_CHECK", function (data) {
        lagCheckId = data;
      });

      runs(function () {
        var gameDriver = new gameDriver(gameEventsEmitter, [], address);
      });

      waitsFor(function () {
        return lagCheckId;
      }, "Master should have requested server time", 100);

      runs(function () {
        // make the round trip 300 ms
        var time = new Date().getTime();
        setTimeout(function () {
          socket.emit("LAG_RESPONSE", {
            id: lagCheckId,
            time: time
          });
          socket.emit("GAME_UPDATE", {
            time: time,
            ball: {
              position: {
                x: 22,
                y: 33
              }
            }
          });
        }, 300);
      });

      waitsFor(function () {
        return ballPositionEvent;
      }, "Game events should have been emitted", 400);

      runs(function () {
        // client ball move event occurred 150 ms ago
        var eventTimeDiff = Math.abs(ballPositionEvent.time - (new Date().getTime() - 150));
        expect(eventTimeDiff).toBeLessThan(101);
      });
    });
  });

  xdescribe('waits for ENTERED_GAME message', function () {
    
    var gameParams = {
      width: 500,
      height: 400,
      scale: 20
    };
    
    it('and responds with READY command', function () {
      var gameDriver = new gameDriver(gameEventsEmitter, [], 'http://address');
      expect(_.filter(socket.emit.calls, function (elem) {
        return elem.args[0] === 'READY';
      }).length).toBe(0);
      
      socket.emit('ENTERED_GAME', gameParams);
      expect(_.filter(socket.emit.calls, function (elem) {
        return elem.args[0] === 'READY';
      }).length).toBe(1);
    });

    it('and initiates renderer with game parameters', function () {
      // TODO I guess game master should interface to renderer directly
      expect(true).toBeFalsy();

    });
  });

  xdescribe("Listens to player commands", function () {
    it("and periodically sends them to server", function () {

    });
  });



});

