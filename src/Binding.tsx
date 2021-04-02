import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useBinding from './useBinding';

const propTypes = {
  /**
   * An field name or accessor function, extracting the Binding value
   * from the overall BindingContext value. If a function, it's called
   * with the form value, and the current Form `getter`.
   *
   * ```jsx
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
  bindTo: PropTypes.elementType.isRequired,

  /**
   * Customize how the Binding return value maps to the overall BindingContext `value`.
   * `mapValue` can be a a string property name or a function that returns a
   * value to be set to the `bindTo` field.
   *
   * **note:** the default value will attempt to extract the value from `target.value`
   * so that native inputs will just work as expected.
   *
   * ```jsx
   * <Binding
   *   bindTo='name'
   *   mapValue={dropdownValue =>
   *     dropdownValue.first + ' ' + dropdownValue.last
   *   }
   * >
   *  {(value, onChange) => <MyDropDown value={value} onChange={onChange} />}
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
   *   {(value, onChange) => <MyDropDown value={value} onChange={onChange} />}
   * </Binding>
   * ```
   *
   * @type func | string | object
   */
  mapValue(props, propName, ...args) {
    if (
      typeof props.bindTo === 'function' &&
      typeof props[propName] === 'function'
    )
      return new Error(
        `${propName} must be an Object or a string, when \`bindTo\` is a function`
      );
    // @ts-ignore
    return PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.func,
      // @ts-ignore
    ])(props, propName, ...args);
  },

  /**
   * A render function that returns a react element and is
   * passed the binding callbacks and value.
   *
   * ```jsx
   * let Surround = (onChange) => <div value={value}>{props.children}</div>
   *
   * <Binding>
   * {(value, onChange) =>
   *   <Surround>
   *     <input type='text' value={value} onChange={onChange} />
   *   </Surround>
   * }
   * </Binding>
   * ```
   */
  children: PropTypes.func.isRequired,
};

const defaultProps = {
  changeProp: 'onChange',
  valueProp: 'value',
};

function Binding<TValue>({ bindTo, mapValue, children }) {
  const [value, handleEvent] = useBinding<TValue>(bindTo, mapValue);

  const element = useMemo(() => children(value, handleEvent), [
    value,
    handleEvent,
    children,
  ]);

  return element;
}

Binding.defaultProps = defaultProps;
Binding.propTypes = propTypes;

export default Binding;
