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
      var socket;
      beforeEach(function () {
        socket = new Emitter();
        spyOn(socket, "on").andCallThrough();
        spyOn(socket, "emit").andCallThrough();
      });
      
      it('it calls renderer.renderGameUpdate passing all the objects positions from the command', function () {
        var updateParams;
        var driver = new GameDriver(socket, rendererMock);
        socket.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socket.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
        socket.emit('PLAYER_JOINED', {type: "right", name: "Rob"});
        socket.emit('MATCH_STARTED');

        socket.emit('OBJECTS_MOVED', {
          ball: {x: 5, y: 8},
          left_player: {y: 7},
          right_player: {y: 10},
          time: Date.now()
        });
        updateParams = rendererMock.renderGameUpdate.mostRecentCall.args[0];
        expect(updateParams.BALL).toEqual({'position': {x: 5, y: 8}});
        expect(updateParams.leftPlayer).toEqual({'position': {y: 7}});
        expect(updateParams.rightPlayer).toEqual({'position': {y: 10}});

      });
      
      it('it calls renderer.renderGameUpdate with client-server time difference compensation', function () {
        var updateParams;
        var driver = new GameDriver(socket, rendererMock);

        socket.emit("LAG_RESPONSE", {
          time: Date.now() + 5000
        });
        socket.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socket.emit('MATCH_STARTED');

        expect(rendererMock.renderGameUpdate).not.toHaveBeenCalled();
        expect(rendererMock.renderGameUpdate.calls.length).toBe(0);

        socket.emit('OBJECTS_MOVED', {
          ball: {x: 10, y: 12},
          time: Date.now() + 6000
        });
        expect(rendererMock.renderGameUpdate.calls.length).toBe(1);
        updateParams = rendererMock.renderGameUpdate.mostRecentCall.args[0];
        expect(updateParams.BALL).toEqual({'position': {x: 10, y: 12}});
        expect(updateParams.delay).toBeCloseTo(1000, -1);

        socket.emit('OBJECTS_MOVED', {
          ball: {x: 11, y: 14},
          time: Date.now() + 7000
        });
        updateParams = rendererMock.renderGameUpdate.mostRecentCall.args[0];
        expect(updateParams.BALL).toEqual({'position': {x: 11, y: 14}});
        expect(updateParams.delay).toBeCloseTo(2000, -1);
      });

      it('it calls renderer.renderGameUpdate with network delay compensation', function () {
 
        var updateParams;
        var driver = new GameDriver(socket, rendererMock);
        // introduce 500 millis delay
        var startTime = Date.now();
        spyOn(Date, 'now').andReturn(startTime + 500);

        // and 5000 millis time difference
        socket.emit("LAG_RESPONSE", {
          time: startTime + 5000
        });

        socket.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socket.emit('MATCH_STARTED');

        // and to make it even funnier, the object moved event is fired 1000 ms after GameDriver was created
        Date.now.andReturn(startTime + 1000);
        socket.emit('OBJECTS_MOVED', {
          ball: {x: 10, y: 12},
          time: startTime + 7000
        });


        expect(rendererMock.renderGameUpdate.calls.length).toBe(1);
        updateParams = rendererMock.renderGameUpdate.mostRecentCall.args[0];
        expect(updateParams.BALL).toEqual({'position': {x: 10, y: 12}});
        // 1. At startTime + 500 we received LAG_RESPONSE with server time being equal to startTime + 5000, this means 
        // that client clock is behind server by 4500 ms
        // 2. But the lag of getting server's clock was 500 ms, i.e. time for message to travel from server to client is
        // about 250 ms. I.e. the clock difference is 4500 - 250 = 4250 ms
        // 3. If we subtract 4250 ms from server timestamp of OBJECTS_MOVED event, we will get client timestamp of the event,
        // considering that current time us startTime + 1000 then the delay for animation will be (7000 - 4250) - 1000 = 1750
        expect(updateParams.delay).toBeCloseTo(1750, -1);


      });
    });
    describe('PLAYER_SCORED', function () {
      it('it calls renderer.playerScored passing the player type and score points from the command', function () {
        socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
        socketMock.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
        socketMock.emit('PLAYER_SCORED', {type: "left", points: 21});
        expect(rendererMock.playerScored).toHaveBeenCalledWith({type: "left", points: 21});
        
      });
    });
  });

  describe('function "executePlayerCommand" is called', function () {
    it('it sends the passed command to the server', function () {
      var command;
      socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
      socketMock.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
      socketMock.emit('MATCH_STARTED');
      command = {someCommandToSendToServer: 1};
      gameDriver.executePlayerCommand(command);
      expect(socketMock.emit).toHaveBeenCalledWith('PLAYER_COMMAND', [command]);
    });

    it('more than once within 100 ms it passes the second and more commands to server in one batch', function () {
      var batch;
      var command;
      jasmine.Clock.useMock();

      function getSentCommands(socket) {
        return _.filter(socket.emit.calls, function (elem) {
          return elem.args[0] === 'PLAYER_COMMAND';
        });
      }

      socketMock.emit('GAME_ENTERED', {field: {width: 40, height: 40}});
      socketMock.emit('PLAYER_JOINED', {type: "left", name: "Bob"});
      socketMock.emit('MATCH_STARTED');
      command = {someCommandToSendToServer: 2};
      gameDriver.executePlayerCommand(command);
      expect(socketMock.emit).toHaveBeenCalledWith('PLAYER_COMMAND', [command]);
      expect(getSentCommands(socketMock).length).toBe(1);
      
      batch = [];
      command = {someCommandToSendToServer: 3};
      batch.push(command);
      gameDriver.executePlayerCommand(command);
      command = {someCommandToSendToServer: 4};
      batch.push(command);
      gameDriver.executePlayerCommand(command);
      command = {someCommandToSendToServer: 5};
      batch.push(command);
      gameDriver.executePlayerCommand(command);

      jasmine.Clock.tick(100);
      expect(getSentCommands(socketMock).length).toBe(2);
      expect(_.last(getSentCommands(socketMock)).args).toEqual('PLAYER_COMMAND', batch);

      command = {someCommandToSendToServer: 5};
      gameDriver.executePlayerCommand(command);
      expect(socketMock.emit).toHaveBeenCalledWith('PLAYER_COMMAND', [command]);
      expect(getSentCommands(socketMock).length).toBe(3);

    });
    
    // TODO paddle move commands could be rendered straight away with some extrapolation on renderer side
  });

});

