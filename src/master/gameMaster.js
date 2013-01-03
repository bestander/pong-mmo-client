"use strict";


function GameMaster (gameEventEmitter, playerCommandsEmitters) {
  this._gameEvents = gameEventEmitter;
  this._playerCommands = playerCommandsEmitters;
}

module.exports = GameMaster;
