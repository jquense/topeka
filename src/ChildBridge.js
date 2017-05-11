import React from 'react';
import PropTypes from 'prop-types';

class ChildBridge extends React.Component {

  static propTypes = {
    events: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    children: PropTypes.func,
    onEvent: PropTypes.func.isRequired
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
    if (events)
      [].concat(events).forEach(event => {
        this.events[event] =
          this.events[event] || ((...args) => this.handleEvent(event, args))
      });
  }

  handleEvent(event, args) {
    this.props.onEvent(event, ...args)
  }

  render() {
    let { children: child } = this.props

    if (!child)
      return null

    return child({ ...this.events })
  }
}

export default ChildBridge;
