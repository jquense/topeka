import React from 'react';
import { Binding, BindingContext } from '../src'
import tsp from 'teaspoon'

let eventValue = e => e.target.value;


describe('Bindings', ()=> {

  it('should update the form value', function(){
    let change = sinon.spy()
    let inst = tsp(
          <BindingContext onChange={change}>
            <Binding bindTo='name' mapValue={eventValue}>
              <input type='text'/>
            </Binding>
          </BindingContext>
        ).render()

    inst.first('input').trigger('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })

  it('should fire child handlers', function(){
    let localSpy = sinon.spy()
      , change = sinon.spy()

    tsp(
      <BindingContext onChange={change}>
        <Binding bindTo='name' mapValue={eventValue}>
          <input type='text' onChange={localSpy} />
        </Binding>
      </BindingContext>
    ).render()
    .first('input')
    .trigger('change')

    change.should.have.been.calledOnce
    localSpy.should.have.been.calledOnce.and.calledAfter(change)
  })

  it('should fire child handlers before update', function(){
    let localSpy = sinon.spy()
      , change = sinon.spy()
      , inst = tsp(
          <BindingContext onChange={change}>
            <Binding bindTo='name' mapValue={eventValue} updateAfterChild>
              <input type='text' onChange={localSpy} />
            </Binding>
          </BindingContext>
        ).render()

    inst.first('input').trigger('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce
    localSpy.should.have.been.calledOnce.and.calledBefore(change)
  })

  it('should handle function children', function(){
    let change = sinon.spy()

    tsp(
      <BindingContext onChange={change}>
        <Binding bindTo='name' mapValue={eventValue} updateAfterChild>
          {(props) =>
            <input type='text' {...props} />
          }
        </Binding>
      </BindingContext>
    )
    .render()
    .first('input')
    .trigger('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce.and.calledWith({ name: 'Jill' })
  })
})
