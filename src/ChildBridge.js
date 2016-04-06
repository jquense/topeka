import React, { cloneElement, PropTypes } from 'react';

class ChildBridge extends React.Component {

  static propTypes = {
    events: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    onEvent: PropTypes.func.isRequired,
    inject: PropTypes.func.isRequired
  }

  render(){
    let { inject, children: child } = this.props

    let create = element => cloneElement(React.Children.only(element), {
      ...inject(element),
      ...this.events(element)
    })

    if (typeof child === 'function')
      return child(create)

    return create(child)
  }

  events(child){
    let { events, onEvent } = this.props;
    if (events == null) {
      return null
    }

    events = [].concat(events);

    return events.reduce((map, event) => {
      map[event] = onEvent.bind(this, event, child.props[event])
      return map
    }, {})
  }
}

export default ChildBridge;
