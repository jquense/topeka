import prop from 'property-expr'

const IS_ARRAY = /^\d+$/;

export default function update(model, path, value) {
  var parts = prop.split(path)
    , newModel = copy(model)
    , part, islast;

  if (newModel == null)
    newModel = IS_ARRAY.test(parts[0]) ? [] : {}

  var current = newModel

  for (var idx = 0; idx < parts.length; idx++) {
    islast = idx === (parts.length - 1)
    part = clean(parts[idx])

    if (islast)
      current[part] = value

    else {
      current = (current[part] = current[part] == null
        ? IS_ARRAY.test(parts[idx + 1]) ? [] : {}
        : copy(current[part]))
    }
  }

  return newModel
}

function clean(part) {
  return isQuoted(part)
    ? part.substr(1, part.length - 2) : part
}

function isQuoted(str){
  return typeof str === 'string' && str
      && (str[0] === '"' || str[0] === "'")
}

function copy(value) {
  return Array.isArray(value)
    ? value.concat()
    : value !== null && typeof value === 'object'
      ? Object.assign(new value.constructor(), value)
      : value
}
