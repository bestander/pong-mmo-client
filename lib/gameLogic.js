
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
    this.position.x = this.position.x + 1;
    this.position.y = this.position.y + 2;

  }
};

var Paddle = function () {
  this.position = {
    x:0,
    y:0
  };
  this.length = 0;
  this.step = 0;

  this.movePaddle = function (directionY) {

  }
};

var Game = function (ballChangedPositionCallback) {
  this.scores = {
    player1:0,
    player2:0
  };

  var ball = new Ball();

  var nextTick = function () {
    ball.changePosition();
    ballChangedPositionCallback(ball.position)

    window.setTimeout(nextTick, 1000 / 60);
  }

  this.start = function () {
    nextTick();
  }

  this.start();


};

var Field = function () {
  this.dimentions = {
    x:0,
    y:0
  };
}


exports.startGame = function(callback){
                return new Game(callback);
              };

exports.movePaddle = function() {};
