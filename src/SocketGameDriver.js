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
 * @param gameServerAddress game server network address 
 * @constructor
 */
function SocketGameDriver (gameServerAddress) {
  this._socket = io.connect(gameServerAddress);
}

module.exports = SocketGameDriver;