"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BindingContext = require("./BindingContext");

var _createChildBridge = _interopRequireDefault(require("./createChildBridge"));

var _StaticContainer = _interopRequireDefault(require("./StaticContainer"));

function extractTargetValue(arg) {
  if (arg && arg.target && arg.target.tagName) {
    return arg.target.value;
  }

  return arg;
}

var Binding =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inheritsLoose2.default)(Binding, _React$PureComponent);

  function Binding(props, context) {
    var _this;

    _this = _React$PureComponent.call(this, props, context) || this;

    _initialiseProps.call((0, _assertThisInitialized2.default)(_this));

    _this.renderChild = (0, _createChildBridge.default)(_this.handleEvent, function (props) {
      var _this$props = _this.props,
          valueProp = _this$props.valueProp,
          children = _this$props.children,
          bindTo = _this$props.bindTo;
      var valueChanged = true;

      if (_this.bindingContext) {
        var lastValue = _this.bindingValue;
        props[valueProp] = _this.bindingValue = _this.bindingContext.getValue(bindTo);
        valueChanged = lastValue !== _this.bindingValue;
      }

      return _react.default.createElement(_StaticContainer.default, {
        props: props,
        shouldUpdate: _this.propsUpdated || valueChanged
      }, children);
    });
    return _this;
  }

  var _proto = Binding.prototype;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.propsUpdated = nextProps !== this.props;
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.propsUpdated = false;
  };

  _proto.render = function render() {
    var _this2 = this;

    var changeProp = this.props.changeProp;
    return _react.default.createElement(_BindingContext.Consumer, null, function (bindingContext) {
      _this2.bindingContext = bindingContext;
      return _this2.renderChild(changeProp);
    });
  };

  return Binding;
}(_react.default.PureComponent);

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
     *   {props => <MyDropDown {...props} />}
     * </Binding>
     * ```
     */
    changeProp: _propTypes.default.string.isRequired,

    /**
     * A prop name for the Binding to set from the BindingContext.
     *
     * ```js
     * <Binding valueProp='selectedValue'>
     *   {props => <MyDropDown {...props} />}
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
     *  {props => <MyDropDown {...props} />}
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
     *  {props => <MyDropDown {...props} />}
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
     *   {props => <MyDropDown {...props} />}
     * </Binding>
     * ```
     *
     * @type func | string | object
     */
    mapValue: function mapValue(props, propName, componentName) {
      if (typeof props.bindTo === 'function' && typeof props[propName] === 'function') return new Error(propName + " must be an Object or a string, when `bindTo` is a function");

      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }

      return _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string, _propTypes.default.func]).apply(void 0, [props, propName, componentName].concat(args));
    },

    /**
     * A render function that returns a react element and is
     * passed the binding callbacks and value.
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
    children: _propTypes.default.func.isRequired
  }
});
Object.defineProperty(Binding, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    changeProp: 'onChange',
    valueProp: 'value'
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
          _this3$props$mapValue = _this3$props.mapValue,
          mapValue = _this3$props$mapValue === void 0 ? extractTargetValue : _this3$props$mapValue;

      if (typeof bindTo === 'string') {
        var _mapValue;

        if (typeof mapValue !== 'object') mapValue = (_mapValue = {}, _mapValue[bindTo] = mapValue, _mapValue);
      }

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (_this3.bindingContext && mapValue) _this3.bindingContext.updateBindingValue(mapValue, args);
    }
  });
};

var _default = Binding;
exports.default = _default;
module.exports = exports["default"];