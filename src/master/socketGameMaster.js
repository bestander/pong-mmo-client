/**
 * A socket.io implementation of game master: all game physics are implemented on a remote server.
 * The HTML file must have an io global object defined, this is achieved by <script src="/socket.io/socket.io.js"></script>
 */
/*global io:true */
"use strict";

var GameMaster = require('./gameMaster.js');


var SocketGameMaster = function (gameEventEmitter, playerCommandsEmitters, remoteServer) {
  GameMaster.call(this, gameEventEmitter, playerCommandsEmitters);
  this._socket = io.connect(remoteServer);
  this._defineGameSocketMessages();
  this._serverAndClientTimeDifferenceMillisec = 0;
  this._updateLagTime();
  this._defineCommandsHandler();
};

SocketGameMaster.prototype = Object.create(GameMaster.prototype);

SocketGameMaster.prototype._defineGameSocketMessages = function () {
  var that = this;
  this._socket.on("WORLD_UPDATE", function (data) {
    that._gameEvents.emit("BALL_CHANGED_POSITION", {
      time: data.serverTime + this._serverAndClientTimeDifferenceMillisec,
      position: data.ball.position
    });
    that._gameEvents.emit("PLAYER_1_CHANGED_POSITION", {
      time: data.serverTime + this._serverAndClientTimeDifferenceMillisec,
      position: data.players[0].position
    });
    that._gameEvents.emit("PLAYER_2_CHANGED_POSITION", {
      time: data.serverTime + this._serverAndClientTimeDifferenceMillisec,
      position: data.players[1].position
    });
  });
};

SocketGameMaster.prototype._updateLagTime = function () {
  // todo send ping request to server and server will return it's local time, the lag time will be:
  // server's time - client's time - half the round trip time.
  // setInterval ...
};

SocketGameMaster.prototype._defineCommandsHandler = function () {
  // todo
};



module.exports = SocketGameMaster;
