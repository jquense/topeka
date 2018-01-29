import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'

import { Binding, BindingContext } from '../src'

let eventValue = e => e.target.value

describe('Bindings', () => {
  it('should update the form value', function() {
    let change = sinon.spy()
    let inst = mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name" mapValue={eventValue}>
          <input type="text" />
        </Binding>
      </BindingContext>
    )

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })

  it('should fire child handlers', function() {
    let localSpy = sinon.spy()
    let change = sinon.spy()

    mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name" mapValue={eventValue}>
          <input type="text" onChange={localSpy} />
        </Binding>
      </BindingContext>
    )
      .find('input')
      .first()
      .simulate('change')

    change.should.have.been.calledOnce()
    localSpy.should.have.been.calledOnce.and.calledAfter(change)
  })

  it('should fire child handlers before update', function() {
    let localSpy = sinon.spy()
    let change = sinon.spy()
    let inst = mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name" mapValue={eventValue} updateAfterChild>
          <input type="text" onChange={localSpy} />
        </Binding>
      </BindingContext>
    )

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce()
    localSpy.should.have.been.calledOnce.and.calledBefore(change)
  })

  it('should handle function children', function() {
    let change = sinon.spy()

    mount(
      <BindingContext onChange={change}>
        <Binding bindTo="name" mapValue={eventValue} updateAfterChild>
          {props => <input type="text" {...props} />}
        </Binding>
      </BindingContext>
    )
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })
})
