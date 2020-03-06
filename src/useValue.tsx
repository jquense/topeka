import { useBindingContext } from './BindingContext'

export type Mapper<TOut, TIn = any> = (input: TIn) => TOut

function useValue<TValue>(bindTo: Mapper<TValue> | keyof TValue) {
  const ctx = useBindingContext()

  return ctx?.getValue(bindTo)
}

export default useValue
