/**
 * Game renderer engine.
 * Interprets game events from game master into visual representation
 */

"use strict";

var GameRenderer = function (gameEvents) {
  this._gameEvents = gameEvents;
};

module.exports = GameRenderer;