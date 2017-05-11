'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ChildBridge = require('./ChildBridge');

var _ChildBridge2 = _interopRequireDefault(_ChildBridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function extractTargetValue(arg) {
  if (arg && arg.target && arg.target.tagName) {
    return arg.target.value;
  }
  return arg;
}

function mapValue(props, propName, componentName) {
  var isOpaqueAccessor = typeof props.bindTo === 'function';

  if (isOpaqueAccessor) {
    if (typeof props[propName] === 'function') return new Error(propName + ' must be an Object or a String, when `bindTo` is a function');
  }

  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string, _propTypes2.default.func]).apply(undefined, [props, propName, componentName].concat(args));
}

var Binding = function (_React$Component) {
  _inherits(Binding, _React$Component);

  function Binding() {
    var _temp, _this, _ret;

    _classCallCheck(this, Binding);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
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


    return _react2.default.createElement(
      _ChildBridge2.default,
      { events: changeProp, onEvent: this.handleEvent },
      this.inject
    );
  };

  Binding.prototype.registerWithBindingContext = function registerWithBindingContext() {
    var _this2 = this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.context;

    var register = context.registerWithBindingContext,
        first = true;

    if (register && !this.bindingContext) this.bindingContext = register(function (bindingContext) {
      var last = _this2._value;
      _this2._value = bindingContext.value(props.bindTo);

      if (!first && last !== _this2._value && !_this2.unmounted) _this2.forceUpdate();

      first = false;
    });
  };

  return Binding;
}(_react2.default.Component);

Binding.propTypes = {
  /**
   * A callback prop name that the Binding should listen for changes on.
   *
   * ```js
   * <Binding changeProp='onSelect'>
   *   <MyDropDown />
   * </Binding>
   * ```
   */
  changeProp: _propTypes2.default.string.isRequired,

  /**
   * A prop name for the Binding to set from the BindingContext.
   *
   * ```js
   * <Binding valueProp='selectedValue'>
   *   <MyDropDown />
   * </Binding>
   * ```
   */
  valueProp: _propTypes2.default.string.isRequired,

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
  bindTo: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,

  /**
   * Customize how the Binding return value maps to the overall BindingContext `value`.
   * `mapValue` can be a a string property name or a function that returns a
   * value to be set to the `bindTo` field.
   *
   * **note:** the default value will attempt to extract the value from `target.value`
   * so that native inputs will just work as expected.
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
  children: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]).isRequired,

  /**
   * Configures the change callback to fire _after_ the child's change handler,
   * if there is one.
   */
  updateAfterChild: _propTypes2.default.bool
};
Binding.defaultProps = {
  changeProp: 'onChange',
  valueProp: 'value',
  updateAfterChild: false
};
Binding.contextTypes = {
  registerWithBindingContext: _propTypes2.default.func
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.handleEvent = function (event) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    var _props = _this3.props,
        bindTo = _props.bindTo,
        children = _props.children,
        _props$mapValue = _props.mapValue,
        mapValue = _props$mapValue === undefined ? extractTargetValue : _props$mapValue,
        updateAfterChild = _props.updateAfterChild;


    var childHandler = _react2.default.isValidElement(children) && children.props[event];

    if (typeof bindTo === 'string') {
      var _mapValue;

      if ((typeof mapValue === 'undefined' ? 'undefined' : _typeof(mapValue)) !== 'object') mapValue = (_mapValue = {}, _mapValue[bindTo] = mapValue, _mapValue);
    }

    if (updateAfterChild && childHandler) childHandler.apply(undefined, args);

    if (_this3.bindingContext && mapValue) _this3.bindingContext.onChange(mapValue, args);

    if (!updateAfterChild && childHandler) childHandler.apply(undefined, args);
  };

  this.inject = function (props) {
    var _props2 = _this3.props,
        valueProp = _props2.valueProp,
        children = _props2.children;


    if (_this3.bindingContext) props[valueProp] = _this3._value;

    if (typeof children === 'function') return children(props);

    return _react2.default.cloneElement(children, props);
  };
};

exports.default = Binding;