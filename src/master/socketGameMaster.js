/**
 * A socket.io implementation of game master: all game physics are implemented on a remote server.
 * The HTML file must have an io global object defined, this is achieved by <script src="/socket.io/socket.io.js"></script>
 */
/*global io:true */
"use strict";

var GameMaster = require('./gameMaster.js');


var SocketGameMaster = function (gameEventEmitter, playerCommandsEmitters, remoteServer) {
  GameMaster.call(this, gameEventEmitter, playerCommandsEmitters);
  this.socket = io.connect(remoteServer);
  this.socket.on("OBJECT_ADDED", function (data) {
    //gameEventEmitter.emit()
  });
  this.socket.on("BALL_MOVED", function (data) {

  });
  this.socket.on("PADDLE_MOVED", function (data) {

  });

};

SocketGameMaster.prototype = Object.create(GameMaster.prototype);


module.exports = SocketGameMaster;
