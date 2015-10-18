import React from 'react';
import { Binding, BindingContext } from '../src'
import $ from 'teaspoon'

let eventValue = e => e.target.value;


describe('Bindings', ()=> {

  it('should update the form value', function(){
    var value
      , change = sinon.spy(v => value = v)
      , inst = $(
          <BindingContext onChange={change}>
            <Binding bindTo='name' mapValue={eventValue}>
              <input type='text'/>
            </Binding>
          </BindingContext>
        ).render()

    inst.first('input').trigger('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce

    value.should.eql({ name: 'Jill' })
  })
})
