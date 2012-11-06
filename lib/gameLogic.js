/*
 * Super Pong HTML5 multiplayer game
 *
 * Author: Konstantin Raev (bestander@gmail.com)
 * Released under the MIT license
 */

/*jslint node:true laxcomma:true*/
"use strict";

var gameEventsEmitter
  , currentGame
  , currentMatch
  , declare = require('declare.js')
  ;

/**
 * API of the module
 * @type {Object}
 */
exports.API = {
  /**
   * events that module can emit, see API {@link http://github.com/component/emitter}
   */
  events: {
    FieldCreated: {width: 50, height: 50},
    BallAdded: {x: 0, y:0},
    PaddleAdded: {x:0, y:0}
  },
  /**
   * Init game module
   * @param emitter see API {@link http://github.com/component/emitter}
   * @param params @type {{fieldWidth: number, fieldHeight: number}}
   */
  initGame: function (emitter, params){
    gameEventsEmitter = emitter;
    currentGame = new Game();
    currentGame.addField(new Field(params.fieldWidth, params.fieldHeight));
  },

  startMatch: null,

  movePaddle: null

};

var Ball = function () {
  this.position = {
    x:0,
    y:0
  };

  this.velocity = {
    dx:0,
    dy:0
  };

  this.changePosition = function () {
    // TODO just for testing
    this.position.x += 1;
    this.position.y += 2;

  };
};

var Paddle = function () {
  this.position = {
    x:0,
    y:0
  };
  this.length = 0;
  this.step = 0;

  this.movePaddle = function (directionY) {

  };
};

var Game = function () {

  var field;
  /**
   * add field object to game
   * @param {Field} fieldToAdd
   */
  this.addField = function(fieldToAdd){
    field = fieldToAdd;
    gameEventsEmitter.emit(exports.API.events.FieldCreated, {width: field.dimentions.width, height: field.dimentions.height});
  };


};

/**
 * Game field
 * @param {number} width
 * @param {number} height
 * @constructor
 */
var Field = function (width, height) {
  this.dimentions = {
    width: width,
    height: height
  };
};



