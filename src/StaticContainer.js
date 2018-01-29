import React from 'react'

export default class StaticContainer extends React.Component {
  shouldComponentUpdate(props) {
    return !!props.shouldUpdate
  }
  render() {
    return this.props.children(this.props.props) // eslint-disable-line
  }
}
