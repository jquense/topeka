import React, { cloneElement, PropTypes } from 'react';
import Bridge from './ChildBridge'
import chain from 'chain-function';

function mapValue(props, propValue, componentName){
  let isOpaqueAccessor = typeof props.bindTo === 'function';

  if (isOpaqueAccessor) {
    if (!props[propName])
      return new Error(propName + ' is required when `bindTo` is a function')

    if (typeof props[propName] === 'function')
      return new Error(propName + ' must be an Object or a String, when `bindTo` is a function')
  }

  return PropTypes.oneOfType([
    PropTypes.object, PropTypes.string, PropTypes.func
  ])(props, propValue, componentName)
}


class Binding extends React.Component {

  static propTypes = {
    /**
     * A callback prop name that the Binding should listen for changes on.
     *
     * ```js
     * <Binding changeProp='onSelect'>
     *   <MyDropDown />
     * </Binding>
     * ```
     */
    changeProp: PropTypes.string.isRequired,

    /**
     * A prop name for the Binding to set from the BindingContext.
     *
     * ```js
     * <Binding valueProp='selectedValue'>
     *   <MyDropDown />
     * </Binding>
     * ```
     */
    valueProp: PropTypes.string.isRequired,

    /**
     * An field name or accessor function, extracting the Binding value from the overall
     * BindingContext value
     *
     * ```js
     * <Binding bindTo='name'>
     *   <input />
     * </Binding>
     *
     * <Binding
     *   bindTo={model => {
     *     let [first, last] = model.name.split(' ')
     *     return { first, last }
     *   }}
     * >
     *  <MyDropdown />
     * </Binding>
     * ```
     */
    bindTo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,

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
    mapValue
  }

  static defaultProps = {
    changeProp: 'onChange',
    valueProp: 'value',
  }

  static contextTypes = {
    registerWithBindingContext: PropTypes.func,
  }

  constructor(...args){
    super(...args)
    this._inject = this._inject.bind(this)
    this._change = this._change.bind(this)
  }

  componentWillMount() {
    let first = true;

    this.bindingContext = this.context.registerWithBindingContext(context => {
      let last = this._value;
      this._value = context.value(this.props.bindTo)

      if (!first && last !== this._value)
        this.forceUpdate()

      first = false;
    })
  }

  render(){
    let { changeProp, valueProp, children } = this.props
    let child = React.Children.only(children);

    return (
      <Bridge
        inject={this._inject}
        events={changeProp}
        onEvent={this._change}
      >
        {child}
      </Bridge>
    )
  }

  _inject(){
    let { valueProp } = this.props;

    return { [valueProp]: this._value }
  }

  _change(event, childHandler, ...args){
    let bindTo = this.props.bindTo;
    let mapValue = this.props.mapValue;

    childHandler && childHandler(...args)

    if (typeof bindTo === 'string') {
      if (typeof mapValue !== 'object')
        mapValue = { [bindTo]: mapValue }
    }

    this.bindingContext.onChange(mapValue, args)
  }
}

export default Binding;
