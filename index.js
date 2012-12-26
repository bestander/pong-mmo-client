"use strict";

var Emitter = require('emitter');
var SocketGameMaster = require('./src/master/socketGameMaster.js');
var CaatGameRenderer = require('./src/rendering/caatGameRenderer.js');

function PongClient (serverUrl) {
  this.gameEventsEmitter = new Emitter();
  this.playerCommands = new Emitter();
  this.gameMaster = new SocketGameMaster(this.gameEventsEmitter, [this.playerCommands], serverUrl);
  this.renderer = new CaatGameRenderer(this.gameEventsEmitter);
  this.renderer.startRendering();
  //var player1 = new Player();
}

module.exports = PongClient;
