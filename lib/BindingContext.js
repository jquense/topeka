"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uncontrollable = _interopRequireDefault(require("uncontrollable"));

var _invariant = _interopRequireDefault(require("invariant"));

var _propertyExpr = _interopRequireDefault(require("property-expr"));

var _updateIn = _interopRequireDefault(require("./updateIn"));

var defaultSetter = function defaultSetter(path, model, val) {
  return (0, _updateIn.default)(model, path, val);
};

var BindingContext =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(BindingContext, _React$Component);

  function BindingContext(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    _this._handlers = [];
    return _this;
  }

  var _proto = BindingContext.prototype;

  _proto.getChildContext = function getChildContext() {
    var _this2 = this;

    return this._context || (this._context = {
      registerWithBindingContext: function registerWithBindingContext(listener) {
        var remove = function remove() {
          return _this2._handlers.splice(_this2._handlers.indexOf(listener), 1);
        };

        _this2._handlers.push(listener);

        listener(_this2._listenerContext(_this2.props));
        return {
          remove: remove,
          onChange: function onChange(mapValue, args) {
            return _this2._update(mapValue, args);
          }
        };
      }
    });
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) this._emit(nextProps);
  };

  _proto.render = function render() {
    return _react.default.Children.only(this.props.children);
  };

  _proto._update = function _update(mapValue, args) {
    var model = this.props.value,
        updater = this.props.setter,
        paths = [];
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
    this.props.onChange(model, paths);
  };

  _proto._emit = function _emit(props) {
    var context = this._listenerContext(props);

    this._handlers.forEach(function (fn) {
      return fn(context);
    });
  };

  _proto._listenerContext = function _listenerContext(props) {
    return {
      value: function value(pathOrAccessor) {
        return typeof pathOrAccessor === 'function' ? pathOrAccessor(props.value, props.getter) : props.getter(pathOrAccessor, props.value);
      }
    };
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
Object.defineProperty(BindingContext, "childContextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    registerWithBindingContext: _propTypes.default.func
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

function wrapSetter(setter) {
  return function () {
    var result = setter.apply(void 0, arguments);
    !(result && typeof result === 'object') ? process.env.NODE_ENV !== "production" ? (0, _invariant.default)(false, '`setter(..)` props must return the form value object after updating a value.') : invariant(false) : void 0;
    return result;
  };
}

var _default = (0, _uncontrollable.default)(BindingContext, {
  value: 'onChange'
});

exports.default = _default;
module.exports = exports["default"];