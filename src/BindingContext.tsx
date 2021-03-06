/* eslint-disable @typescript-eslint/no-empty-function */
import PropTypes from 'prop-types';
import expr from 'property-expr';
import useUpdateEffect from '@restart/hooks/useUpdateEffect';
import useUpdatedRef from '@restart/hooks/useUpdatedRef';
import React, {
  useCallback,
  useMemo,
  useContext,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { useUncontrolledProp } from 'uncontrollable';
import updateIn from './updateIn';
import { MapToValue } from './useBinding';
import { Mapper } from './useValue';

type BindingValue = Record<PropertyKey, any> | unknown[];

function defaultSetter<TValue extends BindingValue>(
  path: string,
  value: TValue | undefined,
  fieldValue: unknown
) {
  return updateIn(value, path, fieldValue);
}

type ReactBindingContext = {
  getValue<T>(path: Mapper<T> | keyof T): T;
  updateBindingValue<T>(path: MapToValue<T>, args: any[]): void;
};

export const Context = React.createContext<ReactBindingContext>({
  getValue() {},
  updateBindingValue() {},
} as any);

export const useBindingContext = () => {
  return useContext(Context);
};

type Setter<TValue extends BindingValue> = (
  path: string,
  value: TValue | undefined,
  fieldValue: unknown
) => TValue;

type Props<TValue extends BindingValue> = {
  value?: TValue;
  defaultValue?: TValue;
  onChange(value: TValue, paths: string[]): void;
  getter?: (path: string, value?: TValue) => any;
  setter?: (
    path: string,
    value: TValue | undefined,
    fieldValue: unknown,
    defaultSetter: Setter<TValue>
  ) => TValue;
  children?: React.ReactNode;
};

function BindingContext<TValue extends BindingValue>({
  value: propsValue,
  defaultValue,
  onChange: propsOnChange,
  getter,
  setter,
  children,
}: Props<TValue>) {
  let [model, onChange] = useUncontrolledProp(
    propsValue,
    defaultValue,
    propsOnChange
  );
  // Why is this so complicated?
  // Well, calling onChange, from a binding multiple times would trigger
  // a change multiple times. Duh. This change, when controlled, might not flush
  // back through by the time the next change is called, leaving the updateBindingValue()
  // with a stale copy of `model`. React's setState avoids this with it's function
  // signature of useState, so we "queue" model changes locally in state, and
  // then "flush" them in an effect when the update is finished.
  let modelRef = useUpdatedRef(model);
  let pendingChangeRef = useRef(false);
  let [pendingChange, setPendingChange] = useState<[TValue, string[]]>([
    model!,
    [],
  ]);

  // This assumes that we won't get an update until all the queued setState's fire,
  // then if there is a pending change we fire onChange with it and the consolidated
  // paths
  useLayoutEffect(() => {
    const [nextModel, paths] = pendingChange;
    if (pendingChangeRef.current) {
      pendingChangeRef.current = false;
      onChange(nextModel, paths);
    }
  });

  const updateBindingValue = useCallback(
    (mapValue, args) => {
      setPendingChange((pendingState) => {
        let [nextModel, paths] = pendingState;

        // If there are no unflushed changes then use the current props model, assuming it
        // would be up to date.
        if (!pendingChangeRef.current) {
          pendingChangeRef.current = true;
          nextModel = modelRef.current!;
          paths = [];
        }

        Object.keys(mapValue).forEach((key) => {
          let field = mapValue[key];
          let value: any;

          if (typeof field === 'function') value = field(...args);
          else if (field === '.' || field == null || args[0] == null)
            value = args[0];
          else {
            value = expr.getter(field, true)(args[0]);
          }

          if (paths.indexOf(key) === -1) paths.push(key);

          nextModel = setter!(key, nextModel, value, defaultSetter);
        });

        return [nextModel, paths];
      });
    },
    [modelRef, setter]
  );

  const getValue = useCallback(
    (pathOrAccessor) =>
      typeof pathOrAccessor === 'function'
        ? pathOrAccessor(model, getter)
        : getter!(pathOrAccessor, model),
    [getter, model]
  );

  const contextValue = useMemo(() => ({ getValue, updateBindingValue }), [
    getValue,
    updateBindingValue,
  ]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
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
};

BindingContext.defaultProps = {
  getter: (path, model) =>
    path ? expr.getter(path, true)(model || {}) : model,
  setter: defaultSetter,
};
export default BindingContext;
