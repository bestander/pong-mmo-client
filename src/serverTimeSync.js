/***
 * Client-server time synchronizer
 * - requests current time from server and calculates lag time
 * - pipes server MATCH_UPDATE messages and augments the server time with local time
 */

/*jshint camelcase:false, indent:2, quotmark:true, nomen:false, onevar:false, passfail:false */
'use strict';

var EventEmitter = require('events').EventEmitter;
var clone = require('clone');

/**
 * Create time sync
 * @param socket socket.io connection
 * @constructor
 */
function ServerTimeSync(socket) {
  if (!socket) {
    throw new Error('socket is not defined');
  }
  this._socket = socket;
  this._clientToServerTimeDifferenceMillis = 0;
  this._eventEmitter = new EventEmitter();
  this._pingServer();
  this._pipeTimedEvents();
}

module.exports = ServerTimeSync;

/**
 * @returns {EventEmitter} this events emitter emits events with local time
 */
ServerTimeSync.prototype.getEventEmitter = function () {
  return this._eventEmitter;
};

ServerTimeSync.prototype._pingServer = function () {
  // send ping request to server and server will return it's local time, the lag time will be:
  // server's time - client's time - half the round trip time.
  var that = this;
  var clientRequestTime = Date.now();
  this._socket.on('LAG_RESPONSE', function (response) {
    // server and client time difference
    var clientNow = Date.now();
    that._clientToServerTimeDifferenceMillis = clientNow - response.time;
    // network lag compensation = half of round trip time
    that._clientToServerTimeDifferenceMillis -= (clientNow - clientRequestTime) / 2;
  });
  this._socket.emit('LAG_CHECK');
};

ServerTimeSync.prototype._pipeTimedEvents = function () {
  var that = this;
  this._socket.on('MATCH_UPDATE', function (data) {
    var newData;
    var clientTimeLineStamp;
    var update = {};
    if (data.ball) {
      update.BALL = {
        'position' : data.ball
      };
    }
    if (data.left_player) {
      update.leftPlayer = {
        'position' : data.left_player
      };
    }
    if (data.right_player) {
      update.rightPlayer = {
        'position' : data.right_player
      };
    }
    clientTimeLineStamp = data.time + that._clientToServerTimeDifferenceMillis;
    newData = clone(data); 
    newData.time = clientTimeLineStamp;
    that._eventEmitter.emit('MATCH_UPDATE', newData);
  });
};
