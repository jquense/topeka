import React from 'react';
import { render } from 'react-dom';
import { inspect } from 'util'
import { Binding, BindingContext } from 'topeka';
import Playground from '@jquense/component-playground';
import PropTable from './PropTable';
import BindingMetadata from '../metadata-loader!topeka/Binding';
import BindingContextMetadata from '../metadata-loader!topeka/BindingContext';

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
          babelConfig={{ stage: 0 }}
          scope={{ React, render, Binding, BindingContext, inspect }}
          codeText={require('!!raw!./binding')}
          className='overlay-example'
          lineNumbers={false}
          lang="js"
          theme="neo"
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
