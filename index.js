'use strict';
var Renderer = require('./src/pongGameRenderer.js');
var SocketDriver = require('./src/socketGameDriver.js');

module.exports = {
  /**
   * init pong client
   * @param socket socket.io connected socket
   * @param graphicsContainerId container where to create a canvas
   * @returns {SocketDriver} socket driver which controls all client side state
   */
  init: function (socket, graphicsContainerId) {
    return new SocketDriver(socket, new Renderer(graphicsContainerId));
  }
};
