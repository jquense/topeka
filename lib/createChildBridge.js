"use strict";

exports.__esModule = true;
exports.default = createChildBridge;

function createChildBridge(handleEvent, render) {
  var eventMap = {};

  var getEvents = function getEvents(events) {
    var result = {};

    if (events) {
      ;
      [].concat(events).forEach(function (event) {
        eventMap[event] = result[event] = eventMap[event] || function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          handleEvent.apply(void 0, [event].concat(args));
        };
      });
    }

    return result;
  };

  return function (events) {
    return render(getEvents(events));
  };
}

module.exports = exports["default"];