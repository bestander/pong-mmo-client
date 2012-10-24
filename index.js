/*
 * Super Pong HTML5 multiplayer game
 *
 *
 *
 * Author: Svetlana Raeva (svetlana.myth@gmail.com)
 * Author: Konstantin Raev (bestander@gmail.com)
 * Released under the MIT license
*/
var $ = require('jquery')
  , logic = require('./lib/gameLogic')
  , renderer = require('./lib/gameRenderer')
  ;

var game = logic.startGame(function (position) {
  console.log("ball changed position to " + JSON.stringify(position));
  });

function drawRectangle(myRect, context) {
  context.beginPath();
  context.rect(myRect.x, myRect.y, myRect.width, myRect.height);
  context.fillStyle = "#FFFFFF";
  context.fill();
  context.stroke();
}

function animate(myRect, canvas, context, startTime) {
  // update
  var time = (new Date()).getTime() - startTime;

  var linearSpeed = 100;
  // pixels / second
  var newX = linearSpeed * time / 1000;

  if (newX < canvas.width - myRect.width) {
    myRect.x = newX;
  }

  // clear
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";
  context.fillRect(0, 0, 600, 600);

  //alert("x = " + myRect.x + " y=" + myRect.y);

  drawRectangle(myRect, context);

  // request new frame
  requestAnimFrame(function () {
    animate(myRect, canvas, context, startTime);
  });
}


var oldInit = function () {
  window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.fillStyle = "#000000";
    context.fillRect(0, 0, 600, 600);

    var myRect = {
      x:10,
      y:10,
      width:20,
      height:20
    };

    drawRectangle(myRect, context);

    setTimeout(function () {
      var startTime = (new Date()).getTime();
      animate(myRect, canvas, context, startTime);
    }, 1000);
  };
};

module.exports = {
  init: function(divId){
    renderer.init(divId)
  },

  startGame:function () {
    alert("start game");
  },

  movePaddle:function () {
    alert("movePaddle");
  }

};
