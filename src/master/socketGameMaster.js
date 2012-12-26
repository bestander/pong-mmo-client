/**
 * A socket.io implementation of game master: all game physics are implemented on a remote server.
 * The HTML file must have an io global object defined, this is achieved by <script src="/socket.io/socket.io.js"></script>
 */
/*global io:true */
"use strict";

var GameMaster = require('./gameMaster.js');
var uid = require('uid');


function SocketGameMaster (gameEventEmitter, playerCommandsEmitters, remoteServer) {
  GameMaster.call(this, gameEventEmitter, playerCommandsEmitters);
  this._socket = io.connect(remoteServer);
  this._defineGameSocketMessages();
  this._serverAndClientTimeDifferenceMillisec = 0;
  this._updateLagTime();
  this._defineCommandsHandler();
}

SocketGameMaster.prototype = Object.create(GameMaster.prototype);

SocketGameMaster.prototype._defineGameSocketMessages = function () {
  var that = this;
  this._socket.on("WORLD_UPDATE", function (data) {
    that._gameEvents.emit("BALL_CHANGED_POSITION", {
      time: data.time + that._serverAndClientTimeDifferenceMillisec,
      position: data.ball.position
    });
    if(data.players){
      that._gameEvents.emit("PLAYER_1_CHANGED_POSITION", {
        time: data.time + that._serverAndClientTimeDifferenceMillisec,
        position: data.players[0].position
      });
      that._gameEvents.emit("PLAYER_2_CHANGED_POSITION", {
        time: data.time + that._serverAndClientTimeDifferenceMillisec,
        position: data.players[1].position
      });
    }
  });
};

SocketGameMaster.prototype._updateLagTime = function () {
  // send ping request to server and server will return it's local time, the lag time will be:
  // server's time - client's time - half the round trip time.
  var requestId = uid(4);
  var that = this;
  var timeSent = new Date().getTime();
  this._socket.on("LAG_RESPONSE", function (data) {
    // server and client time difference
    var currentTime = new Date().getTime();
    that._serverAndClientTimeDifferenceMillisec = currentTime - data.time;
    // network lag compensation = half of round trip time
    that._serverAndClientTimeDifferenceMillisec -= (currentTime - timeSent) / 2;
  });
  this._socket.emit("LAG_CHECK", requestId);
};

SocketGameMaster.prototype._defineCommandsHandler = function () {
  // todo
};



module.exports = SocketGameMaster;
