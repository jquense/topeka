export default function createChildBridge(handleEvent, deprecatedRender) {
  let eventMap = {}

  const getEvents = events => {
    const result = {}
    if (events) {
      ;[].concat(events).forEach(event => {
        eventMap[event] = result[event] =
          eventMap[event] ||
          ((...args) => {
            handleEvent(event, ...args)
          })
      })
    }
    return result
  }

  return deprecatedRender
    ? event => deprecatedRender(getEvents(event))
    : getEvents
}
