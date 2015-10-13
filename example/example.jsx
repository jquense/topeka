import React from 'react';
import { render } from 'react-dom';
import { inspect } from 'util'
import { Binding, BindingContext } from 'topeka';
import Playground from '@jquense/component-playground';

import './styles.less';

class App extends React.Component {

  state = {
    value: {}
  }

  render(){
    return (
      <div className='container'>
        <Playground
          babelConfig={{ stage: 0 }}
          scope={{ React, render, Binding, BindingContext, inspect }}
          codeText={require('!!raw!./binding')}
          className='overlay-example'
          lineNumbers={false}
          lang="js"
          theme="neo"
        />
      </div>
    )
  }
}

let mount = document.createElement('div')
document.body.appendChild(mount)

render(<App/>, mount)
