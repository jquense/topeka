export default function createChildBridge(handleEvent, render) {
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

  return events => render(getEvents(events))
}
