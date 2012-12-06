/**
 * game entity that wraps things up
 */
"use strict";

var Emitter = require('emitter');
var SocketGameMaster = require('./master/socketGameMaster.js');
var CaatGameRenderer = require('./rendering/caatGameRenderer.js');


var Game = function (serverUrl) {
  this.gameEventsEmitter = new Emitter();
  this.playerCommands = new Emitter();
  this.gameMaster = new SocketGameMaster(this.gameEventsEmitter, [this.playerCommands], serverUrl);
  this.renderer = new CaatGameRenderer(this.gameEventsEmitter);
  this.renderer.startRendering();
  //var player1 = new Player();

};

module.exports = Game;

