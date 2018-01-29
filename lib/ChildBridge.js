"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var ChildBridge =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(ChildBridge, _React$Component);

  function ChildBridge() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = ChildBridge.prototype;

  _proto.componentWillMount = function componentWillMount() {
    this.events = {};
    this.processEvents(this.props.events);
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.processEvents(nextProps.events);
  };

  _proto.processEvents = function processEvents(events) {
    var _this = this;

    if (events) [].concat(events).forEach(function (event) {
      _this.events[event] = _this.events[event] || function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this.handleEvent(event, args);
      };
    });
  };

  _proto.handleEvent = function handleEvent(event, args) {
    var _props;

    (_props = this.props).onEvent.apply(_props, [event].concat(args));
  };

  _proto.render = function render() {
    var child = this.props.children;
    if (!child) return null;
    return child((0, _extends2.default)({}, this.events));
  };

  return ChildBridge;
}(_react.default.Component);

Object.defineProperty(ChildBridge, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    events: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.string]),
    children: _propTypes.default.func,
    onEvent: _propTypes.default.func.isRequired
  }
});
Object.defineProperty(ChildBridge, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    events: []
  }
});
var _default = ChildBridge;
exports.default = _default;
module.exports = exports["default"];