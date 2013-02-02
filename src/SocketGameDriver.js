/***
 * Game driver for Pong MMO client.
 * The driver is responsible for:
 * - interpreting the game object state into commands for game renderer
 * - reading players' input and informing game object about users' intentions
 *
 * Current implementation connects to a remote server which hosts the game object.
 */

/*jshint camelcase:false, indent:2, quotmark:true, nomen:false, onevar:false, passfail:false */
'use strict';

/**
 * Create driver object
 * @param socket socket.io connection
 * @param renderer game renderer
 * @constructor
 */
function SocketGameDriver(socket, renderer) {
  if (!socket) {
    throw new Error('socket is not defined');
  }
  if (!renderer) {
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

SocketGameDriver.prototype.executePlayerCommand = function (command) {
  this._socket.emit('PLAYER_COMMAND', command);
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
    that._clientToServerTimeDifferenceMillis -= (clientNow - clientRequestTime) / 2;
  });
  this._socket.emit('LAG_CHECK');
};


SocketGameDriver.prototype._defineGameSetupCommandsHandler = function () {
  var that = this;
  this._socket.on('ENTERED_GAME', function (data) {
    that._sceneRendered = true;
    that._renderer.showScene(data.field);
    data.players.forEach(function (player) {
      that._renderer.addPlayer(player);
    });
  });
  this._socket.on('PLAYER_JOINED', function (data) {
    if (that._sceneRendered === true) {
      that._renderer.addPlayer(data);
    }
  });
  this._socket.on('PLAYER_QUIT', function (data) {
    if (that._sceneRendered === true) {
      that._renderer.removePlayer(data);
    }
  });
  this._socket.on('PLAYER_READY', function (data) {
    if (that._sceneRendered === true) {
      that._renderer.playerReady(data);
    }
  });
};

SocketGameDriver.prototype._defineMatchCommandsHandler = function () {
  var that = this;
  this._socket.on('MATCH_STARTED', function () {
    console.log('match started');
  });
  this._socket.on('MATCH_STOPPED', function () {
    console.log('match stopped');
  });
  this._socket.on('MATCH_UPDATE', function (data) {
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
    update.delay = clientTimeLineStamp - Date.now();
    that._renderer.renderGameUpdate(update);
  });
  this._socket.on('PLAYER_SCORE_CHANGED', function (data) {
    that._renderer.playerScored(data);
  });

};
