/***
 * Game driver for Pong MMO client.
 * The driver is responsible for:
 * - interpreting the game object state into commands for game renderer
 * - reading players' input and informing game object about users' intentions
 * 
 * Current implementation connects to a remote server which hosts the game object.
 */

/*global io:true */
"use strict";

var DELAY_BETWEEN_COMMANDS_MS = 100;

/**
 * Create driver object
 * @param socket socket.io connection
 * @param renderer game renderer
 * @constructor
 */
function SocketGameDriver (socket, renderer) {
  if(!socket){
    throw new Error('socket is not defined');
  }
  if(!renderer){
    throw new Error('renderer is not defined');
  }
  this._socket = socket;
  this._renderer = renderer;
  this._clientToServerTimeDifferenceMillis = 0;
  this._sceneRendered = false;
  this._pingServer();
  this._defineGameSetupCommandsHandler();
  this._defineMatchCommandsHandler();
}

module.exports = SocketGameDriver;

SocketGameDriver.prototype.startNewGame = function () {
  this._socket.emit('START_GAME');
};

SocketGameDriver.prototype.ready = function () {
  if(this._sceneRendered === true){
    this._socket.emit('READY');
  }
};

SocketGameDriver.prototype.executePlayerCommand = function (command) {
//  this._lastCommandSentTime = this._lastCommandSentTime || Date.now() - DELAY_BETWEEN_COMMANDS_MS;
//  
//  if(Date.now() - this._lastCommandSentTime < DELAY_BETWEEN_COMMANDS_MS){
//    // stack commands for a batch submit
//    setTimeout(this.executePlayerCommand)
//  }
  this._socket.emit('PLAYER_COMMAND', [command]);
  this._lastCommandSentTime = Date.now();
};

SocketGameDriver.prototype._pingServer = function () {
  // send ping request to server and server will return it's local time, the lag time will be:
  // server's time - client's time - half the round trip time.
  var that = this;
  var clientRequestTime = Date.now();
  this._socket.on('LAG_RESPONSE', function (response) {
    // server and client time difference
    var clientNow = Date.now();
    that._clientToServerTimeDifferenceMillis = clientNow - response.time;
    // network lag compensation = half of round trip time
    that._clientToServerTimeDifferenceMillis += (clientNow - clientRequestTime) / 2;
  });
  this._socket.emit('LAG_CHECK');
};


SocketGameDriver.prototype._defineGameSetupCommandsHandler = function () {
  var that = this;
  this._socket.on('GAME_ENTERED', function (data) {
    that._sceneRendered = true;
    that._renderer.showScene(data.field);
  });
  this._socket.on('PLAYER_JOINED', function (data) {
    if(that._sceneRendered === true){
      that._renderer.addPlayer(data);
    }
  });
  this._socket.on('PLAYER_QUIT', function (data) {
    if(that._sceneRendered === true){
      that._renderer.removePlayer(data);
    }
  });
  this._socket.on('PLAYER_READY', function (data) {
    if(that._sceneRendered === true){
      that._renderer.playerReady(data);
    }
  });
};

SocketGameDriver.prototype._defineMatchCommandsHandler = function () {
  var that = this;
  this._socket.on('MATCH_STARTED', function () {
    that._renderer.addBall();
  });
  this._socket.on('MATCH_STOPPED', function () {
    that._renderer.removeBall();
  });
  this._socket.on('OBJECTS_MOVED', function (data) {
    var update = {};
    if(data.ball){
      update.BALL = {
        'position': data.ball
      };
    }
    if(data.left_player){
      update.leftPlayer = {
        'position': data.left_player
      };
    }
    if(data.right_player){
      update.rightPlayer = {
        'position': data.right_player
      };
    }
    update.delay = data.time + that._clientToServerTimeDifferenceMillis - Date.now();
    that._renderer.renderGameUpdate(update);
  });
  this._socket.on('PLAYER_SCORED', function (data) {
    that._renderer.playerScored(data);
  });

};
