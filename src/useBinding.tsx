import { SyntheticEvent, useCallback } from 'react'
import { useBindingContext } from './BindingContext'
import useValue, { Mapper } from './useValue'

export type MapToValue<TValue, TIn = any> =
  | Mapper<TValue, TIn>
  | keyof TValue
  | { [P in keyof TValue]?: string | Mapper<TValue[P]> }

function extractTargetValue<TIn = any>(eventOrValue: SyntheticEvent | TIn) {
  if (
    !eventOrValue ||
    typeof eventOrValue !== 'object' ||
    !('target' in eventOrValue)
  )
    return eventOrValue

  const {
    type,
    value,
    checked,
    multiple,
    files,
  } = eventOrValue.target as HTMLInputElement

  if (type === 'file') return multiple ? files : files && files[0]
  if (/number|range/.test(type)) {
    let parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }

  return /checkbox|radio/.test(type) ? checked : value
}

function useBinding<TValue, TIn = any>(
  bindTo: Mapper<TValue> | keyof TValue,
  mapValue: MapToValue<TValue, TIn> = extractTargetValue as any,
) {
  const { updateBindingValue } = useBindingContext()
  const value = useValue(bindTo)

  const handleEvent = useCallback(
    (...args) => {
      let mapper = mapValue
      if (typeof bindTo === 'string' && typeof mapValue !== 'object') {
        mapper = { [bindTo]: mapValue } as any
      }

      if (mapper) {
        updateBindingValue(mapper, args)
      }
    },
    [bindTo, mapValue, updateBindingValue],
  )

  return [value, handleEvent]
}

export default useBinding
