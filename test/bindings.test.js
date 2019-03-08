/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'

import { Binding, BindingContext, useBinding } from '../src'

describe('Bindings', () => {
  class StaticContainer extends React.Component {
    shouldComponentUpdate(props) {
      return !!props.shouldUpdate // eslint-disable-line
    }
    render() {
      return this.props.children
    }
  }

  const BoundInput = ({ name }) => {
    const [value = '', handleChange] = useBinding(name)
    return <input type="text" value={value} onChange={handleChange} />
  }

  it('should update the form value: hook', function() {
    let change = sinon.spy()

    let inst = mount(
      <BindingContext onChange={change}>
        <BoundInput name="name" />
      </BindingContext>
    )

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill', tagName: 'DIV' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })

  it('should update the form value: Binding', function() {
    let change = sinon.spy()

    let inst = mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name">
          {(value, onChange) => (
            <input value={value || ''} onChange={onChange} {...this.props} />
          )}
        </Binding>
      </BindingContext>
    )

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill', tagName: 'DIV' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })

  it('should always update if binding value changed', function() {
    let change = sinon.spy()
    let value = { name: 'sally', eyes: 'hazel' }
    let count = 0

    const CountRenders = ({ name }) => {
      const [value = '', handleChange] = useBinding(name)
      useEffect(() => {
        count++
      })
      return <input type="text" value={value} onChange={handleChange} />
    }

    let wrapper = mount(
      <BindingContext onChange={change} value={value}>
        <StaticContainer shouldUpdate={false}>
          <CountRenders name="name" />
        </StaticContainer>
      </BindingContext>
    )

    count.should.equal(0)

    wrapper.setProps({ value: { ...value, eyes: 'brown' } })

    count.should.equal(1)

    wrapper.setProps({ value: { ...value, name: 'Sallie' } })

    count.should.equal(2)
  })

  it('should update if props change', function() {
    let count = 0
    const CountRenders = ({ name }) => {
      const [value = '', handleChange] = useBinding(name)
      useEffect(() => {
        count++
      })
      return <input type="text" value={value} onChange={handleChange} />
    }

    let wrapper = mount(<CountRenders bindTo="name" />)

    count.should.equal(0)

    wrapper.setProps({ bindTo: 'fooo' })

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
              {(value, onChange) => (
                <Input value={value} onChange={onChange} {...this.props} />
              )}
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
