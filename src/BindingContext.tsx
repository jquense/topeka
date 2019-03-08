import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import useUncontrolled from 'uncontrollable/hook'
import invariant from 'invariant'
import expr from 'property-expr'

import updateIn from './updateIn'
import { MapToValue, Mapper } from './useBinding'

let defaultSetter = (path, model, val) => updateIn(model, path, val)

function wrapSetter(setter: any) {
  return (...args: any[]) => {
    var result = setter(...args)
    invariant(
      result && typeof result === 'object',
      '`setter(..)` props must return the form value object after updating a value.'
    )
    return result
  }
}

type ReactBindingContext<T> = {
  getValue<T>(path: Mapper<T> | keyof T): T
  updateBindingValue<T>(path: MapToValue<T>, args: any[]): void
}

export const Context = React.createContext<ReactBindingContext<any>>({
  getValue<T>(_path: Mapper<T> | keyof T): T {
    return
  },
  updateBindingValue<T>(_path: MapToValue<T>, _args: any[]) {},
})

type Setter = <TValue>(path: string, value: TValue, fieldValue: any) => TValue

type Props<TValue> = {
  value?: TValue
  defaultValue?: TValue
  onChange(value: TValue, paths: string[]): void
  getter?: (path: string, value: TValue) => any
  setter?: (
    path: string,
    value: TValue,
    fieldValue: any,
    defaultSetter: Setter
  ) => TValue
  children?: React.ReactNode
}

function BindingContext<TValue>(uncontrolledProps: Props<TValue>) {
  let {
    value: model,
    onChange,
    getter,
    setter,
    children,
  }: Props<TValue> = useUncontrolled(uncontrolledProps, { value: 'onChange' })

  if (process.env.NODE_ENV !== 'production') {
    setter = wrapSetter(setter)
  }

  const updateBindingValue = useCallback(
    (mapValue, args) => {
      let paths = []

      Object.keys(mapValue).forEach(key => {
        let field = mapValue[key]
        let value

        if (typeof field === 'function') value = field(...args)
        else if (field === '.' || field == null || args[0] == null)
          value = args[0]
        else {
          value = expr.getter(field, true)(args[0])
        }

        if (paths.indexOf(key) === -1) paths.push(key)

        model = setter(key, model, value, defaultSetter)
      })
      onChange(model, paths)
    },
    [model, onChange, setter]
  )

  const getValue = useCallback(
    pathOrAccessor =>
      typeof pathOrAccessor === 'function'
        ? pathOrAccessor(model, getter)
        : getter(pathOrAccessor, model),
    [getter, model]
  )

  const contextValue = useMemo(() => ({ getValue, updateBindingValue }), [
    getValue,
    updateBindingValue,
  ])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

BindingContext.propTypes = {
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

BindingContext.defaultProps = {
  getter: (path, model) =>
    path ? expr.getter(path, true)(model || {}) : model,
  setter: defaultSetter,
}
export default BindingContext
