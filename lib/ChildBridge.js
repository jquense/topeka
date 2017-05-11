'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChildBridge = function (_React$Component) {
  _inherits(ChildBridge, _React$Component);

  function ChildBridge() {
    _classCallCheck(this, ChildBridge);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  ChildBridge.prototype.componentWillMount = function componentWillMount() {
    this.events = {};
    this.processEvents(this.props.events);
  };

  ChildBridge.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.processEvents(nextProps.events);
  };

  ChildBridge.prototype.processEvents = function processEvents(events) {
    var _this2 = this;

    if (events) [].concat(events).forEach(function (event) {
      _this2.events[event] = _this2.events[event] || function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this2.handleEvent(event, args);
      };
    });
  };

  ChildBridge.prototype.handleEvent = function handleEvent(event, args) {
    var _props;

    (_props = this.props).onEvent.apply(_props, [event].concat(args));
  };

  ChildBridge.prototype.render = function render() {
    var child = this.props.children;


    if (!child) return null;

    return child(_extends({}, this.events));
  };

  return ChildBridge;
}(_react2.default.Component);

ChildBridge.propTypes = {
  events: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.string]),
  children: _propTypes2.default.func,
  onEvent: _propTypes2.default.func.isRequired
};
ChildBridge.defaultProps = {
  events: []
};
exports.default = ChildBridge;