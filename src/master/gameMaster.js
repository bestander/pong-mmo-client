"use strict";


var GameMaster = function (gameEventEmitter, playerCommandsEmitters) {
  this._gameEvents = gameEventEmitter;
  this._playerCommands = playerCommandsEmitters;
};

module.exports = GameMaster;
