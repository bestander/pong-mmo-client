/**
 * game entity that wraps things up
 */
"use strict";

var Emitter = require('emitter');
var SocketGameMaster = require('./master/socketGameMaster.js');
var CaatGameRenderer = require('./rendering/caatGameRenderer.js');


var Game = function () {
  this.gameEventsEmitter = new Emitter();
  //this.playerCommands = new emitter.Emitter();
  //this.gameMaster = new SocketGameMaster(this.gameEventsEmitter, [this.playerCommands], "http://localhost");
  this.renderer = new CaatGameRenderer(this.gameEventsEmitter);
  this.renderer.startRendering();
  //var player1 = new Player();

};

module.exports = Game;

