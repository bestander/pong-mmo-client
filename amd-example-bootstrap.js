/* An example how this package can be used in a RequireJS application
 * The script just adds a DIV element to body and calls init() on the library module.
 *
 * Author: Konstantin Raev (bestander@gmail.com)
 * Released under the MIT license
 * */
define(function (require) {
  var pong = require('../../../../main')
    , $ = require('jquery')
    ;
  $("body").add("<div id='canvasElemId' style='with:400px; height:400px'/>");

  pong.init('canvasElemId');
});
