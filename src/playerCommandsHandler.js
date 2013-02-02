/**
 * translates commands into events that will be sent to server
 */

/*jshint camelcase:false, indent:2, quotmark:true, nomen:false, onevar:false, passfail:false */
'use strict';

/**
 * @param eventEmitter object on which events should be emitted for player commands
 * @constructor
 */
function PlayerCommandsHandler(eventEmitter) {
  this._emitter = eventEmitter;
}

module.exports = PlayerCommandsHandler;

PlayerCommandsHandler.prototype.ready = function () {
  this._emitter('PLAYER_COMMAND', 'READY');
};