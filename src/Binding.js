import React, { PropTypes } from 'react';
import Bridge from './ChildBridge'

function mapValue(props, propName, componentName){
  let isOpaqueAccessor = typeof props.bindTo === 'function';

  if (isOpaqueAccessor) {
    if (typeof props[propName] === 'function')
      return new Error(propName + ' must be an Object or a String, when `bindTo` is a function')
  }

  return PropTypes.oneOfType([
    PropTypes.object, PropTypes.string, PropTypes.func
  ])(props, propName, componentName)
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
    mapValue,

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
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired,

    /**
     * Configures the change callback to fire _after_ the child's change handler,
     * if there is one.
     */
    updateAfterChild: PropTypes.bool
  }

  static defaultProps = {
    changeProp: 'onChange',
    valueProp: 'value',
    updateAfterChild: false
  }

  static contextTypes = {
    registerWithBindingContext: PropTypes.func
  }

  constructor(...args){
    super(...args)
    this._inject = this._inject.bind(this)
    this._change = this._change.bind(this)
  }

  componentWillMount() {
    this.registerWithBindingContext()
  }

  componentWillReceiveProps(nextProps, _, nextContext) {
    this.registerWithBindingContext(nextProps, nextContext)
  }

  componentWillUnmount() {
    this.unmounted = true
    if (this.bindingContext) {
      this.bindingContext.remove()
    }
  }

  render(){
    let { changeProp, children } = this.props

    return (
      <Bridge
        inject={this._inject}
        events={changeProp}
        onEvent={this._change}
      >
        {children}
      </Bridge>
    )
  }

  registerWithBindingContext(props = this.props, context = this.context) {
    let register = context.registerWithBindingContext
      , first = true;

    if (register && !this.bindingContext)
      this.bindingContext = register(bindingContext => {
        let last = this._value;
        this._value = bindingContext.value(props.bindTo)

        if (!first && last !== this._value && !this.unmounted)
          this.forceUpdate()

        first = false;
      })
  }

  _inject() {
    let { valueProp } = this.props
      , isRegistered = !!this.bindingContext;

    // let the underlying child prop "shine"
    // through in cases where we have nothing to override with
    if (isRegistered)
      return { [valueProp]: this._value }

    return {}
  }

  _change(event, childHandler, ...args) {
    let { bindTo, mapValue, updateAfterChild } = this.props;

    if (typeof bindTo === 'string') {
      if (typeof mapValue !== 'object')
        mapValue = { [bindTo]: mapValue }
    }

    if (!this.bindingContext || !mapValue) {
      if (childHandler)
        childHandler(...args)
      return
    }

    if (updateAfterChild && childHandler)
      childHandler(...args)

    this.bindingContext.onChange(mapValue, args)

    if (!updateAfterChild && childHandler)
      childHandler(...args)
  }
}

export default Binding;
