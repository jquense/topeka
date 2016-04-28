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

  ChildBridge.prototype.render = function render() {
    var _this = this;

    var _props = this.props;
    var inject = _props.inject;
    var child = _props.children;

    var create = function create(element) {
      return _react.cloneElement(_react2['default'].Children.only(element), _extends({}, inject(element), _this.events(element)));
    };

    if (typeof child === 'function') return child(create);

    return create(child);
  };

  ChildBridge.prototype.events = function events(child) {
    var _this2 = this;

    var _props2 = this.props;
    var events = _props2.events;
    var onEvent = _props2.onEvent;

    if (events == null) {
      return null;
    }

    events = [].concat(events);

    return events.reduce(function (map, event) {
      map[event] = onEvent.bind(_this2, event, child.props[event]);
      return map;
    }, {});
  };

  _createClass(ChildBridge, null, [{
    key: 'propTypes',
    value: {
      events: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.string]),
      onEvent: _react.PropTypes.func.isRequired,
      inject: _react.PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  return ChildBridge;
})(_react2['default'].Component);

exports['default'] = ChildBridge;
module.exports = exports['default'];