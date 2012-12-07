/*jshint node:true indent:2*/
/*global it:true describe:true expect:true spyOn:true beforeEach:true afterEach:true jasmine:true window*/
"use strict";

var GameMaster = require("pong-mmo-client/src/master/socketGameMaster.js");

//var events = require("super-pong/lib/gameEvents.js");

/**
 * search latest event index in the event list of a jasmine spied object
 * @param event event identifier
 * @param calls calls array of spied object
 * @return {Array} arguments with which the event was emitted or null if none found
 */
function findArgumentsOfTheLatestEvent(event, calls) {
  var i = calls.length - 1;
  while (i >= 0) {
    if (calls[i].args[0] === event) {
      return calls[i].args;
    }
    i -= 1;
  }
  return null;
}

describe("Socket Game Master", function () {

  // out events emitter
  var gameEventsEmitter;

  // socket mock
  var socket;

  beforeEach(function () {
    socket = jasmine.createSpyObj('socket', ['on', 'emit']);
    // socket io mock
    window.io = {
      connect: function (remoteServer) {
        return socket;
      }
    };
    spyOn(window.io, 'connect').andCallThrough();
    gameEventsEmitter = {
      emit: function (event, params) {
        console.log("event: " + event + " params: " + JSON.stringify(params));
      }
    };
    spyOn(gameEventsEmitter, "emit");
  });

  describe("constructor call", function () {
    it("initiates a socket.io connection to a specified server", function () {
      var address = "http://game.com";
      var gameMaster = new GameMaster(gameEventsEmitter, [], address);
      expect(window.io.connect).toHaveBeenCalledWith(address);
    });

    it("initiates a client-server time synchronization routine", function () {

    });

  });

  describe("listens to socket UPDATE_WORLD messages", function () {
    it("and emits object change state events", function () {

    });

    it("and emits events with consideration of server and client time difference", function () {

    });
  });

  describe("Listens to player commands", function () {
    it("and periodically sends them to server", function () {

    });
  });



});

