/**
 * Game master(s) specify game objects' positions at different times.
 * The renderer engine needs only one position at a given time, so this queue holds all timestamped positions for a
 * given object and allows the rendering engine to pick the most accurate position for current time.
 */
"use strict";

function GameObjectPositionsQueue () {

};