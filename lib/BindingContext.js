'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _propertyExpr = require('property-expr');

var _propertyExpr2 = _interopRequireDefault(_propertyExpr);

var _updateIn = require('./updateIn');

var _updateIn2 = _interopRequireDefault(_updateIn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultSetter = function defaultSetter(path, model, val) {
  return (0, _updateIn2.default)(model, path, val);
};

var BindingContext = function (_React$Component) {
  _inherits(BindingContext, _React$Component);

  function BindingContext(props, context) {
    _classCallCheck(this, BindingContext);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this._handlers = [];
    return _this;
  }

  BindingContext.prototype.getChildContext = function getChildContext() {
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

  BindingContext.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) this._emit(nextProps);
  };

  BindingContext.prototype.render = function render() {
    return _react2.default.Children.only(this.props.children);
  };

  BindingContext.prototype._update = function _update(mapValue, args) {
    var model = this.props.value,
        updater = this.props.setter,
        paths = [];

    if (process.env.NODE_ENV !== 'production') updater = wrapSetter(updater);

    Object.keys(mapValue).forEach(function (key) {
      var field = mapValue[key],
          value = void 0;

      if (typeof field === 'function') value = field.apply(undefined, args);else if (field === '.' || field == null || args[0] == null) value = args[0];else {
        value = _propertyExpr2.default.getter(field, true)(args[0]);
      }

      if (paths.indexOf(key) === -1) paths.push(key);

      model = updater(key, model, value, defaultSetter);
    });

    this.props.onChange(model, paths);
  };

  BindingContext.prototype._emit = function _emit(props) {
    var context = this._listenerContext(props);
    this._handlers.forEach(function (fn) {
      return fn(context);
    });
  };

  BindingContext.prototype._listenerContext = function _listenerContext(props) {
    return {
      value: function value(pathOrAccessor) {
        return typeof pathOrAccessor === 'function' ? pathOrAccessor(props.value, props.getter) : props.getter(pathOrAccessor, props.value);
      }
    };
  };

  return BindingContext;
}(_react2.default.Component);

BindingContext.propTypes = {
  /**
   * BindingContext value object, can be left uncontrolled;
   * use the `defaultValue` prop to initialize an uncontrolled BindingContext.
   *
   * BindingContext assumes that `value` is immutable so you must provide a _new_ value
   * object to trigger an update. The `<Binding/>` components do this by default.
   */
  value: _propTypes2.default.object,

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
  onChange: _propTypes2.default.func,

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
  getter: _propTypes2.default.func,

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
  setter: _propTypes2.default.func
};
BindingContext.childContextTypes = {
  registerWithBindingContext: _propTypes2.default.func
};
BindingContext.defaultProps = {
  getter: function getter(path, model) {
    return path ? _propertyExpr2.default.getter(path, true)(model || {}) : model;
  },
  setter: defaultSetter
};


function wrapSetter(setter) {
  return function () {
    var result = setter.apply(undefined, arguments);
    !(result && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '`setter(..)` props must return the form value object after updating a value.') : (0, _invariant2.default)(false) : void 0;
    return result;
  };
}

exports.default = (0, _uncontrollable2.default)(BindingContext, { value: 'onChange' });