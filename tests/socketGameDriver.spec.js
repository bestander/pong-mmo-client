/*jshint node:true indent:2*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true afterEach:true jasmine:true runs waitsFor*/
"use strict";

var GameDriver = require("pong-mmo-client/src/socketGameDriver.js");
var Emitter = require('component-emitter');
var _ = require('bestander-lodash')._;


describe("When Socket Game Driver", function () {

  var socketMock;
  var rendererMock;
  var gameDriver;

  beforeEach(function () {
    // replace socket.io socket with a simple events emitter
    socketMock = new Emitter();
    spyOn(socketMock, "on").andCallThrough();
    spyOn(socketMock, "emit").andCallThrough();
    
    rendererMock = jasmine.createSpyObj('rendererMock', ['showScene', 'addPlayer', 'removePlayer', 'addBall', 'removeBall',
      'playerReady', 'renderGameUpdate', 'playerScored']);
    gameDriver = new GameDriver(socketMock, rendererMock);
  });

  describe("is created", function () {

    it('without a socket or renderer it throws an error', function () {
      var throwing = function () {
        var driver = new GameDriver();
      };
      expect(throwing).toThrow(new Error("socket is not defined"));
      throwing = function () {
        var driver = new GameDriver(socketMock);
      };
      expect(throwing).toThrow(new Error("renderer is not defined"));
    });

    it("it sends a LAG_CHECK command", function () {
      function getLagCheckMessages(socket) {
        return _.filter(socket.emit.calls, function (elem) {
          return elem.args[0] === 'LAG_CHECK';
        });
      }

      var driver;
      var socket = new Emitter();
      spyOn(socket, "emit").andCallThrough();

      expect(getLagCheckMessages(socket).length).toBe(0);
      driver = new GameDriver(socket, rendererMock);
      expect(getLagCheckMessages(socket).length).toBe(1);
    });

  });

  describe('function "startNewGame" is called', function () {
    it('it sends command START_GAME to server', function () {
      function getStartNewGameMessages(socket) {
        return _.filter(socket.emit.calls, function (elem) {
          return elem.args[0] === 'START_GAME';
        });
      }
      expect(getStartNewGameMessages(socketMock).length).toBe(0);
      gameDriver.startNewGame();
      expect(getStartNewGameMessages(socketMock).length).toBe(1);
    });

  });

  describe('receives from server game setup command', function () {
    describe('GAME_ENTERED', function () {
      it('it calls renderer.showScene with dimensions taken from command', function () {
        expect(rendererMock.showScene).not.toHaveBeenCalled();
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 50}});
        expect(rendererMock.showScene).toHaveBeenCalledWith({width: 40, height: 50});
      });
    });

    describe('PLAYER_JOINED', function () {
      it('it calls renderer.addPlayer with parameters taken from command', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
        expect(rendererMock.addPlayer).toHaveBeenCalledWith({type: "left", name: "Bob"});

      });
      it('before GAME_ENTERED command it ignores PLAYER_JOINED', function () {
        socketMock.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
        expect(rendererMock.addPlayer).not.toHaveBeenCalled();

      });
    });

    describe('PLAYER_QUIT', function () {
      it('it calls renderer.addPlayer with parameters taken from command', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('PLAYER_QUIT', {type: "left"});
        expect(rendererMock.removePlayer).toHaveBeenCalledWith({type: "left"});
      });
      it('before GAME_ENTERED command it ignores PLAYER_QUIT', function () {
        socketMock.emit('PLAYER_QUIT', {type: "left"});
        expect(rendererMock.removePlayer).not.toHaveBeenCalled();
      });
    });

    describe('PLAYER_READY', function () {
      it('it calls renderer.playerReady with the type of player who is ready', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('PLAYER_READY', {type: "right"});
        expect(rendererMock.playerReady).toHaveBeenCalledWith({type: "right"});
      });
      it('before GAME_ENTERED command it ignores PLAYER_READY', function () {
        socketMock.emit('PLAYER_READY', {type: "left"});
        expect(rendererMock.playerReady).not.toHaveBeenCalled();
      });

    });
  });

  describe('function "ready" is called', function () {
    it('it sends READY message to server', function () {
      socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
      gameDriver.ready();
      expect(socketMock.emit).toHaveBeenCalledWith("READY");
    });
    it('before GAME_ENTERED command it does not send anything', function () {
      gameDriver.ready();
      expect(socketMock.emit).not.toHaveBeenCalledWith("READY");
    });

  });


  describe('receives from server current match-related command', function () {
    describe('MATCH_STARTED', function () {
      it('it calls renderer.addBall', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('MATCH_STARTED');
        expect(rendererMock.addBall).toHaveBeenCalled();
      });
      xit('it starts taking game commands from User Input Handler', function () {
        // TODO in next iteration
        expect(true).toBeFalsy();
      });
    });
    
    describe('MATCH_STOPPED', function () {
      it('it calls renderer.removeBall', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('MATCH_STARTED');
        expect(rendererMock.removeBall).not.toHaveBeenCalled();
        socketMock.emit('MATCH_STOPPED');
        expect(rendererMock.removeBall).toHaveBeenCalled();
      });
      xit('it stops taking commands from User Input Handler', function () {
        // TODO in next iteration
        expect(true).toBeFalsy();
      });
    });
    describe('OBJECTS_MOVED', function () {
      it('it calls renderer.renderGameUpdate passing all the objects positions from the command', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
        socketMock.emit('PLAYER_JOINED', {type: "right", name: "Rob"});
        socketMock.emit('MATCH_STARTED');
        
        socketMock.emit('OBJECTS_MOVED', {
          ball: {x: 5, y: 8},
          left_player: {y: 7},
          right_player: {y: 10},
          time: Date.now()
        });
        expect(rendererMock.renderGameUpdate).toHaveBeenCalledWith({
          'BALL': {
            'position': {x: 5, y: 8}
          },
          'leftPlayer': {
            'position': {y: 7}
          },
          'rightPlayer': {
            'position': {y: 10}
          },
          'delay': 0
        });

      });
      it('it calls renderer.renderGameUpdate with client-server lag compensation', function () {
        gameDriver = new GameDriver(socketMock, rendererMock);
        socketMock.emit("LAG_RESPONSE", {
          time: Date.now() + 5000
        });
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('MATCH_STARTED');

        expect(rendererMock.renderGameUpdate).not.toHaveBeenCalled();
        expect(rendererMock.renderGameUpdate.calls.length).toBe(0);

        socketMock.emit('OBJECTS_MOVED', {
          ball: {x: 10, y: 12},
          time: Date.now() + 6000
        });
        expect(rendererMock.renderGameUpdate.calls.length).toBe(1);

//        expect(rendererMock.renderGameUpdate).toHaveBeenCalledWith({
//          'BALL': {
//            'position': {x: 10, y: 12}
//          },
//          'delay': 1000
//        });


      });
    });
    describe('PLAYER_SCORED', function () {
      it('it calls renderer.playerScored passing the player type and score points from the command', function () {
        expect(true).toBeFalsy();
        
      });
    });
  });

  describe('function "executePlayerCommand" is called', function () {
    it('it sends the passed command to the server', function () {
      expect(true).toBeFalsy();
      
    });

    it('more than once within 100 ms it passes the second and more commands to server in one batch', function () {
      expect(true).toBeFalsy();
      
    });
    
    // TODO move command could be rendered straight away with some extrapolation
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
        socketMock.emit("GAME_UPDATE", {
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

      socketMock.on("LAG_CHECK", function (data) {
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
        socketMock.emit("LAG_RESPONSE", {
          id: lagCheckId,
          time: new Date().getTime() + 5000
        });
        socketMock.emit("GAME_UPDATE", {
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

      socketMock.on("LAG_CHECK", function (data) {
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
          socketMock.emit("LAG_RESPONSE", {
            id: lagCheckId,
            time: time
          });
          socketMock.emit("GAME_UPDATE", {
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





});

