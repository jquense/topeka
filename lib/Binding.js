'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ChildBridge = require('./ChildBridge');

var _ChildBridge2 = _interopRequireDefault(_ChildBridge);

function mapValue(props, propName, componentName) {
  var isOpaqueAccessor = typeof props.bindTo === 'function';

  if (isOpaqueAccessor) {
    if (typeof props[propName] === 'function') return new Error(propName + ' must be an Object or a String, when `bindTo` is a function');
  }

  return _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string, _react.PropTypes.func])(props, propName, componentName);
}

var Binding = (function (_React$Component) {
  _inherits(Binding, _React$Component);

  _createClass(Binding, null, [{
    key: 'propTypes',
    value: {
      /**
       * A callback prop name that the Binding should listen for changes on.
       *
       * ```js
       * <Binding changeProp='onSelect'>
       *   <MyDropDown />
       * </Binding>
       * ```
       */
      changeProp: _react.PropTypes.string.isRequired,

      /**
       * A prop name for the Binding to set from the BindingContext.
       *
       * ```js
       * <Binding valueProp='selectedValue'>
       *   <MyDropDown />
       * </Binding>
       * ```
       */
      valueProp: _react.PropTypes.string.isRequired,

      /**
       * An field name or accessor function, extracting the Binding value
       * from the overall BindingContext value. If a function, it's called
       * with the form value, and the current Form `getter`.
       *
       * ```js
       * <Binding bindTo='details.name'>
       *   <input />
       * </Binding>
       *
       * <Binding
       *   bindTo={(model, getter) => {
       *     let [first, last] = getter(model, 'details.name').split(' ')
       *     return { first, last }
       *   }}
       * >
       *  <MyDropdown />
       * </Binding>
       * ```
       */
      bindTo: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]).isRequired,

      /**
       * Customize how the Binding return value maps to the overall BindingContext `value`.
       * `mapValue` can be a a string property name or a function that returns a
       * value to be set to the `bindTo` field.
       *
       * ```js
       * <Binding
       *   bindTo='name'
       *   mapValue={dropdownValue =>
       *     dropdownValue.first + ' ' + dropdownValue.last
       *   }
       * >
       *  <MyDropdown />
       * </Binding>
       * ```
       *
       * You can also provide an object hash, mapping paths of the BindingContext `value`
       * to fields in the Binding value using a string field name, or a function accessor.
       *
       * ```js
       * <Binding
       *   bindTo={model => {
       *     let [first, last] = model.name.split(' ')
       *     return { first, last }
       *   }}
       *   mapValue={{
       *    name: dropdownValue =>
       *      dropdownValue.first + ' ' + dropdownValue.last
       *   }}
       * >
       *   <MyDropdown />
       * </Binding>
       * ```
       */
      mapValue: mapValue,

      /**
       * The element to be bound. You can also specify a function child for components
       * that nest and alter children. Or need more nuanced control over the injection process.
       *
       * ```js
       * let Surround = (props) => <div {...props}>{props.children}</div>
       *
       * <Binding>
       * {(bind)=>
       *   <Surround>
       *     {bind(<input type='text'/>)}
       *   </Surround>
       * }
       * </Binding>
       * ```
       */
      children: _react.PropTypes.oneOfType([_react.PropTypes.node, _react.PropTypes.func]).isRequired,

      /**
       * Configures the change callback to fire _after_ the child's change handler,
       * if there is one.
       */
      updateAfterChild: _react.PropTypes.bool
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      changeProp: 'onChange',
      valueProp: 'value',
      updateAfterChild: false
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      registerWithBindingContext: _react.PropTypes.func
    },
    enumerable: true
  }]);

  function Binding() {
    _classCallCheck(this, Binding);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _React$Component.call.apply(_React$Component, [this].concat(args));
    this._inject = this._inject.bind(this);
    this._change = this._change.bind(this);
  }

  Binding.prototype.componentWillMount = function componentWillMount() {
    this.registerWithBindingContext();
  };

  Binding.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, _, nextContext) {
    this.registerWithBindingContext(nextProps, nextContext);
  };

  Binding.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;
    if (this.bindingContext) {
      this.bindingContext.remove();
    }
  };

  Binding.prototype.render = function render() {
    var _props = this.props;
    var changeProp = _props.changeProp;
    var children = _props.children;

    return _react2['default'].createElement(
      _ChildBridge2['default'],
      {
        inject: this._inject,
        events: changeProp,
        onEvent: this._change
      },
      children
    );
  };

  Binding.prototype.registerWithBindingContext = function registerWithBindingContext() {
    var _this = this;

    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? this.context : arguments[1];

    var register = context.registerWithBindingContext,
        first = true;

    if (register && !this.bindingContext) this.bindingContext = register(function (bindingContext) {
      var last = _this._value;
      _this._value = bindingContext.value(props.bindTo);

      if (!first && last !== _this._value && !_this.unmounted) _this.forceUpdate();

      first = false;
    });
  };

  Binding.prototype._inject = function _inject() {
    var _ref;

    var valueProp = this.props.valueProp;
    var isRegistered = !!this.bindingContext;

    // let the underlying child prop "shine"
    // through in cases where we have nothing to override with
    if (isRegistered) return _ref = {}, _ref[valueProp] = this._value, _ref;

    return {};
  };

  Binding.prototype._change = function _change(event, childHandler) {
    var _props2 = this.props;
    var bindTo = _props2.bindTo;
    var mapValue = _props2.mapValue;
    var updateAfterChild = _props2.updateAfterChild;

    if (typeof bindTo === 'string') {
      var _mapValue;

      if (typeof mapValue !== 'object') mapValue = (_mapValue = {}, _mapValue[bindTo] = mapValue, _mapValue);
    }

    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (!this.bindingContext || !mapValue) {
      if (childHandler) childHandler.apply(undefined, args);
      return;
    }

    if (updateAfterChild && childHandler) childHandler.apply(undefined, args);

    this.bindingContext.onChange(mapValue, args);

    if (!updateAfterChild && childHandler) childHandler.apply(undefined, args);
  };

  return Binding;
})(_react2['default'].Component);

exports['default'] = Binding;
module.exports = exports['default'];