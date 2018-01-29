"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var StaticContainer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(StaticContainer, _React$Component);

  function StaticContainer() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = StaticContainer.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(props) {
    return !!props.shouldUpdate;
  };

  _proto.render = function render() {
    return this.props.children(this.props.props); // eslint-disable-line
  };

  return StaticContainer;
}(_react.default.Component);

exports.default = StaticContainer;
module.exports = exports["default"];