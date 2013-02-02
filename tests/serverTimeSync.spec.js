/**
 * Open JasmineSpecRunner.html in a browser to run the tests
 */

/*jshint camelcase:false, indent:2, quotmark:true, nomen:false, onevar:false, passfail:false, nonew:false */
/*global it:true describe:true expect:true spyOn:true beforeEach:true afterEach:true jasmine:true runs waitsFor*/
'use strict';

var ServerTimeSync = require('pong-mmo-client/src/serverTimeSync.js');
var EventEmitter = require('juliangruber-events').EventEmitter;
var _ = require('bestander-lodash')._;

/**
 * filter jasmine spied function calls by first argument
 * @param calls calls array
 * @param firstArg value of first arg
 */
function getCallsFilteredByFirstArg(calls, firstArg) {
  return _.filter(calls, function (elem) {
    return elem.args[0] === firstArg;
  });
}

describe('Server Time Sync', function () {

  var socket;
  
  beforeEach(function () {
    socket = new EventEmitter();
  });
  
  it('should be created with socket as argument', function () {
    var throwing = function () {
      var sync = new ServerTimeSync();
    };
    expect(throwing).toThrow(new Error('socket is not defined'));
  });

  it('should send LAG_CHECK command', function () {
    var sync;
    spyOn(socket, 'emit').andCallThrough();

    expect(getCallsFilteredByFirstArg(socket.emit.calls, 'LAG_CHECK').length).toBe(0);
    sync = new ServerTimeSync(socket);
    expect(getCallsFilteredByFirstArg(socket.emit.calls, 'LAG_CHECK').length).toBe(1);
  });

  describe('should handle MATCH_UPDATE command and', function () {

    it('emit MATCH_UPDATE event passing parameters from the command', function () {
      var data;
      var sync = new ServerTimeSync(socket);
      spyOn(sync.getEventEmitter(), 'emit').andCallThrough();

      data = {
        ball : {x : 5, y : 8},
        left_player : {y : 7},
        right_player : {y : 10},
        time : Date.now()
      };
      socket.emit('MATCH_UPDATE', data);
      expect(sync.getEventEmitter().emit).toHaveBeenCalledWith('MATCH_UPDATE', data);
    });

    it('compensates time difference when there is no network lag', function () {
      var messageTime;
      var data;
      var sync = new ServerTimeSync(socket);
      spyOn(sync.getEventEmitter(), 'emit').andCallThrough();

      socket.emit('LAG_RESPONSE', {
        time: Date.now() + 5000
      });

      messageTime = Date.now() + 6000;
      data = {
        ball : {x : 5, y : 8},
        left_player : {y : 7},
        right_player : {y : 10},
        time : messageTime
      };

      socket.emit('MATCH_UPDATE', data);
      expect(sync.getEventEmitter().emit.mostRecentCall.args[0]).toBe('MATCH_UPDATE');
      expect(sync.getEventEmitter().emit.mostRecentCall.args[1].time).toBeCloseTo(Date.now() + 1000, -1);
      
      // expect original message was not changed
      expect(data.time).toBe(messageTime);
    });

    it('compensates both server time being ahead of client time and network lag', function () {

      var updateParams;
      var data;
      var startTime;
      var sync = new ServerTimeSync(socket);
      spyOn(sync.getEventEmitter(), 'emit').andCallThrough();
      // introduce 500 millis delay
      startTime = Date.now();
      spyOn(Date, 'now').andReturn(startTime + 500);

      // and 5000 millis time difference
      socket.emit('LAG_RESPONSE', {
        time: startTime + 5000
      });

      // and to make it even funnier, the object moved event is fired 1000 ms after GameDriver was created
      Date.now.andReturn(startTime + 1000);
      data = {
        ball : {x : 10, y : 12},
        time : startTime + 7000
      };

      socket.emit('MATCH_UPDATE', data);


      updateParams = sync.getEventEmitter().emit.mostRecentCall.args[1];
      expect(updateParams.ball).toEqual({x: 10, y: 12});
      // 1. The lag of getting server's clock was 500 ms, i.e. time for message to travel from server to client is
      // about 250 ms
      // 2. At moment (0 + 250) ms on the client, the server time was 0 + 5000 ms, then client time = server time + 5000 - 250
      // 3. If we subtract 4750 ms from server timestamp of OBJECTS_MOVED event, we will get client timestamp of the event,
      // considering that current time on client: 7000 - 4750 = 2250 in client time line
      expect(updateParams.time).toBeCloseTo(startTime + 2250, -1);
    });

    it('compensates both server time being behind client time and network lag', function () {

      var data;
      var startTime;
      var updateParams;
      var sync = new ServerTimeSync(socket);
      spyOn(sync.getEventEmitter(), 'emit').andCallThrough();
      // introduce 400 millis delay
      startTime = Date.now();
      spyOn(Date, 'now').andReturn(startTime + 400);

      // and 5000 millis time difference
      socket.emit('LAG_RESPONSE', {
        time: startTime - 5000
      });

      // and to make it even funnier, the object moved event is fired 1000 ms after GameDriver was created
      Date.now.andReturn(startTime + 1000);
      data = {
        ball : {x : 10, y : 12},
        time : startTime - 4000
      };
      socket.emit('MATCH_UPDATE', data);

      updateParams = sync.getEventEmitter().emit.mostRecentCall.args[1];
      expect(updateParams.ball).toEqual({x: 10, y: 12});
      // 1. The lag of getting server's clock was 400 ms, i.e. time for message to travel from server to client is
      // about 200 ms
      // 2. At moment (0 + 200) ms on the client, the server time was (0 - 5000) ms, then client time = server time - 5000 - 200
      // 3. If we add 5200 ms to server timestamp of OBJECTS_MOVED event, we will get client timestamp of the event,
      // considering that current time on client: -4000 + 5200 = 1200 in client time line
      expect(updateParams.time).toBeCloseTo(startTime + 1200, -1);


    });
  });

});

