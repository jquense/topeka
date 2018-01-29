"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.Consumer = exports.Provider = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uncontrollable = _interopRequireDefault(require("uncontrollable"));

var _invariant = _interopRequireDefault(require("invariant"));

var _propertyExpr = _interopRequireDefault(require("property-expr"));

var _createReactContext = _interopRequireDefault(require("create-react-context"));

var _updateIn = _interopRequireDefault(require("./updateIn"));

var defaultSetter = function defaultSetter(path, model, val) {
  return (0, _updateIn.default)(model, path, val);
};

function wrapSetter(setter) {
  return function () {
    var result = setter.apply(void 0, arguments);
    !(result && typeof result === 'object') ? process.env.NODE_ENV !== "production" ? (0, _invariant.default)(false, '`setter(..)` props must return the form value object after updating a value.') : invariant(false) : void 0;
    return result;
  };
}

var _createContext = (0, _createReactContext.default)({
  getValue: function getValue() {},
  updateBindingValue: function updateBindingValue() {}
}),
    Provider = _createContext.Provider,
    Consumer = _createContext.Consumer;

exports.Consumer = Consumer;
exports.Provider = Provider;

var BindingContext =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(BindingContext, _React$Component);

  function BindingContext() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _initialiseProps.call((0, _assertThisInitialized2.default)(_this));

    _this.bindingContext = _this.getBindingContext(_this.props.value, _this.props.getter);
    return _this;
  }

  var _proto = BindingContext.prototype;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(_ref) {
    var value = _ref.value,
        getter = _ref.getter;
    if (value === this.props.value && getter === this.props.getter) return;
    this.bindingContext = this.getBindingContext(value, getter);
  };

  _proto.getBindingContext = function getBindingContext(value, getter) {
    return {
      updateBindingValue: this.updateBindingValue,
      getValue: function getValue(pathOrAccessor) {
        return typeof pathOrAccessor === 'function' ? pathOrAccessor(value, getter) : getter(pathOrAccessor, value);
      }
    };
  };

  _proto.render = function render() {
    return _react.default.createElement(Provider, {
      value: this.bindingContext
    }, this.props.children);
  };

  return BindingContext;
}(_react.default.Component);

Object.defineProperty(BindingContext, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    /**
     * BindingContext value object, can be left uncontrolled;
     * use the `defaultValue` prop to initialize an uncontrolled BindingContext.
     *
     * BindingContext assumes that `value` is immutable so you must provide a _new_ value
     * object to trigger an update. The `<Binding/>` components do this by default.
     */
    value: _propTypes.default.object,

    /**
     * Callback that is called when the `value` prop changes.
     *
     * ```js
     * function(
     * 	value: object,
     * 	updatedPaths: array<string>
     * )
     * ```
     */
    onChange: _propTypes.default.func,

    /**
     * A function used to extract value paths from the Context value.
     * `getter` is called with `path` and `value` and should return the value at that path.
     * `getter()` is used when a `<Binding/>` provides a string `accessor`.
     *
     * ```js
     * function(
     *  path: string,
     *  value: any,
     * ) -> object
     * ```
     */
    getter: _propTypes.default.func,

    /**
     * A value setter function. `setter` is called with `path`, the context `value` and the path `value`.
     * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
     *
     * ```js
     * function(
     *  path: string,
     *  formValue: object,
     *  pathValue: any
     * ) -> object
     * ```
     */
    setter: _propTypes.default.func
  }
});
Object.defineProperty(BindingContext, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    getter: function getter(path, model) {
      return path ? _propertyExpr.default.getter(path, true)(model || {}) : model;
    },
    setter: defaultSetter
  }
});

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  Object.defineProperty(this, "updateBindingValue", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(mapValue, args) {
      var _this2$props = _this2.props,
          model = _this2$props.value,
          updater = _this2$props.setter,
          onChange = _this2$props.onChange;
      var paths = [];
      if (process.env.NODE_ENV !== 'production') updater = wrapSetter(updater);
      Object.keys(mapValue).forEach(function (key) {
        var field = mapValue[key],
            value;
        if (typeof field === 'function') value = field.apply(void 0, args);else if (field === '.' || field == null || args[0] == null) value = args[0];else {
          value = _propertyExpr.default.getter(field, true)(args[0]);
        }
        if (paths.indexOf(key) === -1) paths.push(key);
        model = updater(key, model, value, defaultSetter);
      });
      onChange(model, paths);
    }
  });
};

var _default = (0, _uncontrollable.default)(BindingContext, {
  value: 'onChange'
});

exports.default = _default;