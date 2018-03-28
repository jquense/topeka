import React from 'react'
import PropTypes from 'prop-types'
import polyfill from 'react-lifecycles-compat'

import { Consumer } from './BindingContext'
import createBridge from './createChildBridge'
import StaticContainer from './StaticContainer'

function extractTargetValue(arg) {
  if (arg && arg.target && arg.target.tagName) {
    return arg.target.value
  }
  return arg
}

class Binding extends React.PureComponent {
  static propTypes = {
    /**
     * A callback prop name that the Binding should listen for changes on.
     *
     * ```js
     * <Binding changeProp='onSelect'>
     *   {props => <MyDropDown {...props} />}
     * </Binding>
     * ```
     */
    changeProp: PropTypes.string.isRequired,

    /**
     * A prop name for the Binding to set from the BindingContext.
     *
     * ```js
     * <Binding valueProp='selectedValue'>
     *   {props => <MyDropDown {...props} />}
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
     *  {props => <MyDropDown {...props} />}
     * </Binding>
     * ```
     */
    bindTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

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
    mapValue(props, propName, componentName, ...args) {
      if (
        typeof props.bindTo === 'function' &&
        typeof props[propName] === 'function'
      )
        return new Error(
          `${propName} must be an Object or a string, when \`bindTo\` is a function`
        )

      return PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
        PropTypes.func,
      ])(props, propName, componentName, ...args)
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
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    changeProp: 'onChange',
    valueProp: 'value',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const propsChanged = prevState && nextProps !== prevState.__lastProps

    return { propsChanged, __lastProps: nextProps }
  }

  constructor(props, context) {
    super(props, context)

    this.renderChild = createBridge(this.handleEvent, props => {
      let { valueProp, children, bindTo } = this.props
      let valueChanged = true

      if (this.bindingContext) {
        let lastValue = this.bindingValue
        props[valueProp] = this.bindingValue = this.bindingContext.getValue(
          bindTo
        )
        valueChanged = lastValue !== this.bindingValue
      }
      const { propsChanged } = this.state
      return (
        <StaticContainer
          props={props}
          shouldUpdate={propsChanged || valueChanged}
        >
          {children}
        </StaticContainer>
      )
    })
  }

  handleEvent = (event, ...args) => {
    let { bindTo, mapValue = extractTargetValue } = this.props

    if (typeof bindTo === 'string') {
      if (typeof mapValue !== 'object') mapValue = { [bindTo]: mapValue }
    }

    if (this.bindingContext && mapValue)
      this.bindingContext.updateBindingValue(mapValue, args)
  }

  render() {
    let { changeProp } = this.props

    return (
      <Consumer>
        {bindingContext => {
          this.bindingContext = bindingContext
          return this.renderChild(changeProp)
        }}
      </Consumer>
    )
  }
}

export default polyfill(Binding)
