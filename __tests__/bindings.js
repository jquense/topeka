import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'

import { Binding, BindingContext } from '../src'

describe('Bindings', () => {
  class StaticContainer extends React.Component {
    shouldComponentUpdate(props) {
      return !!props.shouldUpdate
    }
    render() {
      return this.props.children
    }
  }

  it('should update the form value', function() {
    let change = sinon.spy()
    let inst = mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name">
          {props => <input type="text" {...props} />}
        </Binding>
      </BindingContext>
    )

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill', tagName: 'DIV' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })

  it('should handle function children', function() {
    let change = sinon.spy()

    mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name">
          {props => <input type="text" {...props} />}
        </Binding>
      </BindingContext>
    )
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill', tagName: 'DIV' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })

  it('should only update if binding value changed', function() {
    let change = sinon.spy()
    let value = { name: 'sally', eyes: 'hazel' }
    let count = 0

    class Input extends React.Component {
      componentDidUpdate() {
        count++
      }
      render = () => <input type="text" {...this.props} />
    }

    let wrapper = mount(
      <BindingContext onChange={change} value={value}>
        <StaticContainer shouldUpdate={false}>
          <Binding bindTo="name">{props => <Input {...props} />}</Binding>
        </StaticContainer>
      </BindingContext>
    )

    count.should.equal(0)

    wrapper.setProps({ value: { ...value, eyes: 'brown' } })

    count.should.equal(0)

    wrapper.setProps({ value: { ...value, name: 'Sallie' } })

    count.should.equal(1)
  })

  it('should not prevent input updates', function() {
    let change = sinon.spy()
    let value = { name: 'sally', eyes: 'hazel' }
    let count = 0

    class Input extends React.Component {
      componentDidUpdate() {
        count++
      }
      render = () => <input type="text" {...this.props} />
    }

    class Parent extends React.Component {
      render() {
        return (
          <BindingContext onChange={change} value={value}>
            <Binding bindTo="name">
              {props => <Input {...props} {...this.props} />}
            </Binding>
          </BindingContext>
        )
      }
    }

    let wrapper = mount(<Parent />)

    count.should.equal(0)

    wrapper.setProps({ foo: 'bar' })

    count.should.equal(1)
  })
})
