"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ChildBridge = _interopRequireDefault(require("./ChildBridge"));

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

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func]).apply(void 0, [props, propName, componentName].concat(args));
}

var Binding =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Binding, _React$Component);

  function Binding() {
    var _temp, _this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (_temp = _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this, _initialiseProps.call((0, _assertThisInitialized2.default)(_this)), _temp) || (0, _assertThisInitialized2.default)(_this);
  }

  var _proto = Binding.prototype;

  _proto.componentWillMount = function componentWillMount() {
    this.registerWithBindingContext();
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps, _, nextContext) {
    this.registerWithBindingContext(nextProps, nextContext);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;

    if (this.bindingContext) {
      this.bindingContext.remove();
    }
  };

  _proto.render = function render() {
    var changeProp = this.props.changeProp;
    return _react.default.createElement(_ChildBridge.default, {
      events: changeProp,
      onEvent: this.handleEvent
    }, this.inject);
  };

  _proto.registerWithBindingContext = function registerWithBindingContext(props, context) {
    var _this2 = this;

    if (props === void 0) {
      props = this.props;
    }

    if (context === void 0) {
      context = this.context;
    }

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
}(_react.default.Component);

Object.defineProperty(Binding, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
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
    changeProp: _propTypes.default.string.isRequired,

    /**
     * A prop name for the Binding to set from the BindingContext.
     *
     * ```js
     * <Binding valueProp='selectedValue'>
     *   <MyDropDown />
     * </Binding>
     * ```
     */
    valueProp: _propTypes.default.string.isRequired,

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
    bindTo: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]).isRequired,

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
    children: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func]).isRequired,

    /**
     * Configures the change callback to fire _after_ the child's change handler,
     * if there is one.
     */
    updateAfterChild: _propTypes.default.bool
  }
});
Object.defineProperty(Binding, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    changeProp: 'onChange',
    valueProp: 'value',
    updateAfterChild: false
  }
});
Object.defineProperty(Binding, "contextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    registerWithBindingContext: _propTypes.default.func
  }
});

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  Object.defineProperty(this, "handleEvent", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(event) {
      var _this3$props = _this3.props,
          bindTo = _this3$props.bindTo,
          children = _this3$props.children,
          _this3$props$mapValue = _this3$props.mapValue,
          mapValue = _this3$props$mapValue === void 0 ? extractTargetValue : _this3$props$mapValue,
          updateAfterChild = _this3$props.updateAfterChild;
      var childHandler = _react.default.isValidElement(children) && children.props[event];

      if (typeof bindTo === 'string') {
        var _mapValue;

        if (typeof mapValue !== 'object') mapValue = (_mapValue = {}, _mapValue[bindTo] = mapValue, _mapValue);
      }

      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (updateAfterChild && childHandler) childHandler.apply(void 0, args);
      if (_this3.bindingContext && mapValue) _this3.bindingContext.onChange(mapValue, args);
      if (!updateAfterChild && childHandler) childHandler.apply(void 0, args);
    }
  });
  Object.defineProperty(this, "inject", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value(props) {
      var _this3$props2 = _this3.props,
          valueProp = _this3$props2.valueProp,
          children = _this3$props2.children;
      if (_this3.bindingContext) props[valueProp] = _this3._value;
      if (typeof children === 'function') return children(props);
      return _react.default.cloneElement(children, props);
    }
  });
};

var _default = Binding;
exports.default = _default;
module.exports = exports["default"];