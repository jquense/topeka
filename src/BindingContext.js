import React from 'react';
import uncontrollable from 'uncontrollable';
import invariant from 'invariant';
import updateIn from './updateIn';
import expr from 'property-expr';

class BindingContext extends React.Component {

  static propTypes = {
    /**
     * BindingContext value object, can be left uncontrolled;
     * use the `defaultValue` prop to initialize an uncontrolled BindingContext.
     *
     * BindingContext assumes that `value` is immutable so you must provide a _new_ value
     * object to trigger an update. The `<Binding/>` components do this by default.
     */
    value: React.PropTypes.object,

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
    onChange: React.PropTypes.func,

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
    getter: React.PropTypes.func,

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
    setter: React.PropTypes.func
  }

  static childContextTypes = {
    registerWithBindingContext: React.PropTypes.func
  }

  static defaultProps = {
    getter: (path, model) => path ? expr.getter(path, true)(model || {}) : model,
    setter: (path, model, val) => updateIn(model, path, val)
  }

  constructor(props, context){
    super(props, context)
    this._handlers = []
  }

  getChildContext() {
    return this._context || (this._context = {

      registerWithBindingContext: listener => {
        let remove = () => this._handlers.splice(this._handlers.indexOf(listener), 1)

        this._handlers.push(listener)
        listener(this._listenerContext(this.props))

        return {
          remove,
          onChange: (mapValue, args) => this._update(mapValue, args)
        }
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value)
      this._emit(nextProps);
  }

  render() {
    return React.Children.only(this.props.children)
  }

  _update(mapValue, args){
    var model = this.props.value
      , updater = this.props.setter
      , paths = [];

    if (process.env.NODE_ENV !== 'production')
      updater = wrapSetter(updater)

    for (var key in mapValue ) if (mapValue.hasOwnProperty(key)) {
      let field = mapValue[key]
        , value;

      if (typeof field === 'function')
        value = field(...args)
      else if (field === '.' || field == null || args[0] == null)
        value = args[0]
      else {
        value = expr.getter(field, true)(args[0])
      }

      if (paths.indexOf(key) === -1)
        paths.push(key)

      model = updater(key, model, value)
    }

    this.props.onChange(model, paths)
  }

  _emit(props) {
    let context = this._listenerContext(props);
    this._handlers.forEach(fn => fn(context))
  }

  _listenerContext(props){
    return {
      value: pathOrAccessor => typeof pathOrAccessor === 'function'
        ? pathOrAccessor(props.value)
        : props.getter(pathOrAccessor, props.value)
    }
  }
}

function wrapSetter(setter){
  return (...args) => {
    var result = setter(...args)
    invariant(result && typeof result === 'object',
      '`setter(..)` props must return the form value object after updating a value.')
    return result
  }
}


export default uncontrollable(BindingContext, { value: 'onChange' });
