/**
 * Game renderer engine.
 * Interprets game events from game master into visual representation
 */

"use strict";

function GameRenderer (gameEvents) {
  this._gameEvents = gameEvents;
}

module.exports = GameRenderer;