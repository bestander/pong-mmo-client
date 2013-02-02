/**
 * bootstrap for pong game client.
 * Directs the flow of game update events to renderer or to filters if necessary
 */

/*jshint camelcase:false, indent:2, quotmark:true, nomen:false, onevar:false, passfail:false */
'use strict';

var Renderer = require('./src/pongGameRenderer.js');
var CommandsHandler = require('./src/playerCommandsHandler.js');
var ServerTimeSync = require('./src/serverTimeSync.js');

var EventEmitter = require('events').EventEmitter;

/**
 * pipe specific events from source event emitter to destination event emitter
 * @param source event emitter
 * @param destination event emitter
 * @param event event name
 */
function pipeEvents(source, destination, event) {
  source.on(event, function (data) {
    destination.emit(event, data);
  });
}

module.exports = {
  
  
  /**
   * init pong client that connects to server to get game updates
   * @param socket socket.io connected socket
   * @param canvasContainer container where to create a canvas
   */
  initServerGame: function (socket, canvasContainer) {
    var renderer;
    var messageQueue = new EventEmitter();
    var serverTimeFilter = new ServerTimeSync(socket);
    pipeEvents(socket, messageQueue, 'PLAYER_JOINED');
    pipeEvents(socket, messageQueue, 'PLAYER_QUIT');
    pipeEvents(socket, messageQueue, 'PLAYER_READY');
    pipeEvents(socket, messageQueue, 'PLAYER_SCORE_CHANGED');
    pipeEvents(socket, messageQueue, 'MATCH_STARTED');
    pipeEvents(socket, messageQueue, 'MATCH_STOPPED');

    pipeEvents(socket, serverTimeFilter, 'MATCH_UPDATE');
    pipeEvents(serverTimeFilter, messageQueue, 'MATCH_UPDATE');

    renderer = new Renderer(canvasContainer, messageQueue);
    return new CommandsHandler(socket);
  }
};
