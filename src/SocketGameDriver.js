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
  this._serverAndClientTimeDifferenceMillisec = 0;
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


SocketGameDriver.prototype._pingServer = function () {
  // send ping request to server and server will return it's local time, the lag time will be:
  // server's time - client's time - half the round trip time.
  var that = this;
  var timeSent = new Date().getTime();
  this._socket.on('LAG_RESPONSE', function (data) {
    // server and client time difference
    var currentTime = new Date().getTime();
    that._serverAndClientTimeDifferenceMillisec = currentTime - data.time;
    // network lag compensation = half of round trip time
    that._serverAndClientTimeDifferenceMillisec -= (currentTime - timeSent) / 2;
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
    update.delay = 0;
    that._renderer.renderGameUpdate(update);
  });
};
