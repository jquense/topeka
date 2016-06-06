'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _updateIn = require('./updateIn');

var _updateIn2 = _interopRequireDefault(_updateIn);

var _propertyExpr = require('property-expr');

var _propertyExpr2 = _interopRequireDefault(_propertyExpr);

var BindingContext = (function (_React$Component) {
  _inherits(BindingContext, _React$Component);

  _createClass(BindingContext, null, [{
    key: 'propTypes',
    value: {
      /**
       * BindingContext value object, can be left uncontrolled;
       * use the `defaultValue` prop to initialize an uncontrolled BindingContext.
       *
       * BindingContext assumes that `value` is immutable so you must provide a _new_ value
       * object to trigger an update. The `<Binding/>` components do this by default.
       */
      value: _react2['default'].PropTypes.object,

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
      onChange: _react2['default'].PropTypes.func,

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
      getter: _react2['default'].PropTypes.func,

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
      setter: _react2['default'].PropTypes.func
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      registerWithBindingContext: _react2['default'].PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      getter: function getter(path, model) {
        return path ? _propertyExpr2['default'].getter(path, true)(model || {}) : model;
      },
      setter: function setter(path, model, val) {
        return _updateIn2['default'](model, path, val);
      }
    },
    enumerable: true
  }]);

  function BindingContext(props, context) {
    _classCallCheck(this, BindingContext);

    _React$Component.call(this, props, context);
    this._handlers = [];
  }

  BindingContext.prototype.getChildContext = function getChildContext() {
    var _this = this;

    return this._context || (this._context = {

      registerWithBindingContext: function registerWithBindingContext(listener) {
        var remove = function remove() {
          return _this._handlers.splice(_this._handlers.indexOf(listener), 1);
        };

        _this._handlers.push(listener);
        listener(_this._listenerContext(_this.props));

        return {
          remove: remove,
          onChange: function onChange(mapValue, args) {
            return _this._update(mapValue, args);
          }
        };
      }
    });
  };

  BindingContext.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) this._emit(nextProps);
  };

  BindingContext.prototype.render = function render() {
    return _react2['default'].Children.only(this.props.children);
  };

  BindingContext.prototype._update = function _update(mapValue, args) {
    var model = this.props.value,
        updater = this.props.setter,
        paths = [];

    if (process.env.NODE_ENV !== 'production') updater = wrapSetter(updater);

    for (var key in mapValue) if (mapValue.hasOwnProperty(key)) {
      var field = mapValue[key],
          value = undefined;

      if (typeof field === 'function') value = field.apply(undefined, args);else if (field === '.' || field == null || args[0] == null) value = args[0];else {
        value = _propertyExpr2['default'].getter(field, true)(args[0]);
      }

      if (paths.indexOf(key) === -1) paths.push(key);

      model = updater(key, model, value);
    }

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
})(_react2['default'].Component);

function wrapSetter(setter) {
  return function () {
    var result = setter.apply(undefined, arguments);
    _invariant2['default'](result && typeof result === 'object', '`setter(..)` props must return the form value object after updating a value.');
    return result;
  };
}

exports['default'] = _uncontrollable2['default'](BindingContext, { value: 'onChange' });
module.exports = exports['default'];