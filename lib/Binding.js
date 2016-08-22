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

  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string, _react.PropTypes.func]).apply(undefined, [props, propName, componentName].concat(args));
}

var Binding = (function (_React$Component) {
  _inherits(Binding, _React$Component);

  function Binding() {
    var _this = this;

    _classCallCheck(this, Binding);

    _React$Component.apply(this, arguments);

    this.handleEvent = function (event) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var _props = _this.props;
      var bindTo = _props.bindTo;
      var children = _props.children;
      var mapValue = _props.mapValue;
      var updateAfterChild = _props.updateAfterChild;

      var childHandler = _react2['default'].isValidElement(children) && children.props[event];

      if (typeof bindTo === 'string') {
        var _mapValue;

        if (typeof mapValue !== 'object') mapValue = (_mapValue = {}, _mapValue[bindTo] = mapValue, _mapValue);
      }

      if (updateAfterChild && childHandler) childHandler.apply(undefined, args);

      if (_this.bindingContext && mapValue) _this.bindingContext.onChange(mapValue, args);

      if (!updateAfterChild && childHandler) childHandler.apply(undefined, args);
    };

    this.inject = function (props) {
      var _props2 = _this.props;
      var valueProp = _props2.valueProp;
      var children = _props2.children;

      if (_this.bindingContext) props[valueProp] = _this._value;

      if (typeof children === 'function') return children(props);

      return _react2['default'].cloneElement(children, props);
    };
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
    var changeProp = this.props.changeProp;

    return _react2['default'].createElement(
      _ChildBridge2['default'],
      {
        events: changeProp,
        onEvent: this.handleEvent
      },
      this.inject
    );
  };

  Binding.prototype.registerWithBindingContext = function registerWithBindingContext() {
    var _this2 = this;

    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? this.context : arguments[1];

    var register = context.registerWithBindingContext,
        first = true;

    if (register && !this.bindingContext) this.bindingContext = register(function (bindingContext) {
      var last = _this2._value;
      _this2._value = bindingContext.value(props.bindTo);

      if (!first && last !== _this2._value && !_this2.unmounted) _this2.forceUpdate();

      first = false;
    });
  };

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
       * {(props)=>
       *   <Surround>
       *     <input type='text' {...props} />
       *   </Surround>
       * }
       * </Binding>
       * ```
       */
      children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]).isRequired,

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

  return Binding;
})(_react2['default'].Component);

exports['default'] = Binding;
module.exports = exports['default'];