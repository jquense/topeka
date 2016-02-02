import React from 'react';
import { render } from 'react-dom';
import { Binding, BindingContext } from 'topeka';
import Modal from 'react-bootstrap/lib/Modal'
import './styles.less';

let eventValue = e => e.target.value;

let App = ()=> {
  return (
    <BindingContext
      defaultValue={{}}
    >
      <section>
        <Modal show>
          <Modal.Body>
            <div className='form-group'>
              <Binding
                bindTo='name'
                mapValue={e => eventValue(e)}
              >
                <input type='text' placeholder='' className='form-control'/>
              </Binding>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </BindingContext>
  )
}


let mount = document.createElement('div')
document.body.appendChild(mount)

render(<App/>, mount)
