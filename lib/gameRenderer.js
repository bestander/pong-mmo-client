define('gameRenderer', ['jquery'], function ($) {


  return {

    init: function(containerId) {
      var container = $('#'+containerId);
      var a = container.append('<canvas id="myCanvas" width="600" height="600"></canvas>');
      var canvas = $(container).find("canvas")[0];
      var context = canvas.getContext("2d");
      context.fillStyle = "#000000";
      context.fillRect(0, 0, 600, 600);
    },

    addObject: function() {},
    moveObject: function() {}
  }

});
