import React, { cloneElement, PropTypes } from 'react';

class ChildBridge extends React.Component {

  static propTypes = {
    events: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    onEvent: PropTypes.func.isRequired,
    inject: PropTypes.func.isRequired
  };

  static defaultProps = {
    events: []
  };

  componentWillMount() {
    this.events = {};
    this.processEvents(this.props.events)
  }

  componentWillReceiveProps(nextProps) {
    this.processEvents(nextProps.events)
  }

  processEvents(events) {
    [].concat(events).forEach(event => {
      this.events[event] =
        this.events[event] || ((...args) => this.handleEvent(event, args))
    });
  }

  handleEvent(event, args) {
    let handler = this.currentChild.props[event];
    this.props.onEvent(event, handler, ...args)
  }

  createChild = (element) => {
    let { inject } = this.props;

    this.currentChild = element;

    return cloneElement(React.Children.only(element), {
      ...inject(element),
      ...this.events
    })
  }

  render() {
    let { children: child } = this.props

    if (typeof child === 'function')
      return child(this.createChild)

    return this.createChild(child)
  }
}

export default ChildBridge;
