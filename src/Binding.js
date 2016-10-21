import React, { PropTypes } from 'react';
import Bridge from './ChildBridge'

function extractTargetValue(arg) {
  if (arg && arg.target && arg.target.tagName) {
    return arg.target.value
  }
  return arg
}

function mapValue(props, propName, componentName, ...args){
  let isOpaqueAccessor = typeof props.bindTo === 'function';

  if (isOpaqueAccessor) {
    if (typeof props[propName] === 'function')
      return new Error(propName + ' must be an Object or a String, when `bindTo` is a function')
  }

  return PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.func
  ])(props, propName, componentName, ...args)
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
    bindTo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,

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
    mapValue,

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
    children: PropTypes.oneOfType([
      PropTypes.element,
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

  handleEvent = (event, ...args) => {
    let {
        bindTo
      , children
      , mapValue = extractTargetValue
      , updateAfterChild } = this.props;

    let childHandler = React.isValidElement(children) && children.props[event]

    if (typeof bindTo === 'string') {
      if (typeof mapValue !== 'object')
        mapValue = { [bindTo]: mapValue }
    }

    if (updateAfterChild && childHandler)
      childHandler(...args)

    if (this.bindingContext && mapValue)
      this.bindingContext.onChange(mapValue, args)

    if (!updateAfterChild && childHandler)
      childHandler(...args)
  }

  inject = (props) => {
    let { valueProp, children } = this.props

    if (this.bindingContext)
      props[valueProp] = this._value

    if (typeof children === 'function')
      return children(props)

    return React.cloneElement(children, props)
  }

  render(){
    let { changeProp } = this.props

    return (
      <Bridge
        events={changeProp}
        onEvent={this.handleEvent}
      >
        {this.inject}
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
}

export default Binding;
