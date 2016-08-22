'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var ChildBridge = (function (_React$Component) {
  _inherits(ChildBridge, _React$Component);

  function ChildBridge() {
    _classCallCheck(this, ChildBridge);

    _React$Component.apply(this, arguments);
  }

  ChildBridge.prototype.componentWillMount = function componentWillMount() {
    this.events = {};
    this.processEvents(this.props.events);
  };

  ChildBridge.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.processEvents(nextProps.events);
  };

  ChildBridge.prototype.processEvents = function processEvents(events) {
    var _this = this;

    if (events) [].concat(events).forEach(function (event) {
      _this.events[event] = _this.events[event] || function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this.handleEvent(event, args);
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

  _createClass(ChildBridge, null, [{
    key: 'propTypes',
    value: {
      events: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.string]),
      children: _react.PropTypes.func,
      onEvent: _react.PropTypes.func.isRequired
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      events: []
    },
    enumerable: true
  }]);

  return ChildBridge;
})(_react2['default'].Component);

exports['default'] = ChildBridge;
module.exports = exports['default'];