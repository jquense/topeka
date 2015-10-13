import React, { cloneElement, PropTypes } from 'react';
import chain from 'chain-function';

class ChildBridge extends React.Component {

  static propTypes = {
    events: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]).isRequired,
    onEvent: PropTypes.func.isRequired,
    inject: PropTypes.func.isRequired,
  }

  render(){
    let { inject, children } = this.props
    let child = React.Children.only(children);

    return cloneElement(child, {
      ...inject(child),
      ...this.events(child)
    })
  }

  events(child){
    let { events, onEvent } = this.props;
    events = events == null ? [] : [].concat(events);
    return events.reduce((map, evt) => {
      map[evt] = onEvent.bind(this, evt, child.props[event])
      return map
    }, {})
  }
}

export default ChildBridge;
