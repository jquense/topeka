import React from 'react';
import { render } from 'react-dom';
import { inspect } from 'util'
import { Binding, BindingContext } from 'topeka';
import Playground from '@monastic.panic/component-playground';
import PropTable from './PropTable';
import BindingMetadata from 'component-metadata-loader!topeka/Binding';
import BindingContextMetadata from 'component-metadata-loader!topeka/BindingContext';

import '@monastic.panic/component-playground/codemirror.css';
import './styles.less';

class App extends React.Component {

  state = {
    value: {}
  }

  render(){
    return (
      <div className='container'>
        <h2>Example</h2>
        <Playground
          scope={{ React, render, Binding, BindingContext, inspect }}
          code={require('!!raw-loader!./binding')}
          className='overlay-example'
          editorOptions={{ theme: 'neo', viewportMargin: Infinity }}
        />
        <h2>API</h2>
        <PropTable
          component='BindingContext'
          metadata={BindingContextMetadata}
        />
        <PropTable
          component='Binding'
          metadata={BindingMetadata}
        />
      </div>
    )
  }
}

let mount = document.createElement('div')
document.body.appendChild(mount)

render(<App/>, mount)
