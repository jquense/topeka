import React from 'react'
import PropTypes from 'prop-types'
import uncontrollable from 'uncontrollable'
import invariant from 'invariant'
import expr from 'property-expr'

import updateIn from './updateIn'

let defaultSetter = (path, model, val) => updateIn(model, path, val)

function wrapSetter(setter) {
  return (...args) => {
    var result = setter(...args)
    invariant(
      result && typeof result === 'object',
      '`setter(..)` props must return the form value object after updating a value.'
    )
    return result
  }
}

export const { Provider, Consumer } = React.createContext({
  getValue() {},
  updateBindingValue() {},
})

class BindingContext extends React.Component {
  static propTypes = {
    /**
     * BindingContext value object, can be left uncontrolled;
     * use the `defaultValue` prop to initialize an uncontrolled BindingContext.
     *
     * BindingContext assumes that `value` is immutable so you must provide a _new_ value
     * object to trigger an update. The `<Binding/>` components do this by default.
     */
    value: PropTypes.object,

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
    onChange: PropTypes.func,

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
    getter: PropTypes.func,

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
    setter: PropTypes.func,
  }

  static defaultProps = {
    getter: (path, model) =>
      path ? expr.getter(path, true)(model || {}) : model,
    setter: defaultSetter,
  }

  static getDerivedStateFromProps({ value, getter, touched }, prevState) {
    if (
      value === prevState.value &&
      getter === prevState.getter &&
      touched === prevState.touched
    ) {
      return null
    }

    return {
      value,
      getter,
      bindingContext: {
        updateBindingValue: prevState.bindingContext.updateBindingValue,
        getValue: pathOrAccessor =>
          typeof pathOrAccessor === 'function'
            ? pathOrAccessor(value, getter)
            : getter(pathOrAccessor, value),
      },
    }
  }

  constructor(...args) {
    super(...args)

    this.state = {
      bindingContext: {
        updateBindingValue: this.updateBindingValue,
      },
    }
  }

  updateBindingValue = (mapValue, args) => {
    let { value: model, setter: updater, onChange } = this.props
    let paths = []

    if (process.env.NODE_ENV !== 'production') updater = wrapSetter(updater)

    Object.keys(mapValue).forEach(key => {
      let field = mapValue[key],
        value

      if (typeof field === 'function') value = field(...args)
      else if (field === '.' || field == null || args[0] == null)
        value = args[0]
      else {
        value = expr.getter(field, true)(args[0])
      }

      if (paths.indexOf(key) === -1) paths.push(key)

      model = updater(key, model, value, defaultSetter)
    })

    onChange(model, paths)
  }

  render() {
    return (
      <Provider value={this.state.bindingContext}>
        {this.props.children}
      </Provider>
    )
  }
}

export default uncontrollable(BindingContext, {
  value: 'onChange',
  touched: 'onTouch',
})
