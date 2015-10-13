let eventValue = e => e.target.value;

let Names = props => {
  return (
    <BindingContext {...props}>
      <div>
        <div className='form-group'>
          <Binding bindTo='first' mapValue={eventValue}>
            <input type='text' placeholder='first name' className='form-control'/>
          </Binding>
        </div>
        <div className='form-group'>
          <Binding bindTo='surname' mapValue={eventValue}>
            <input type='text' placeholder='surname' className='form-control'/>
          </Binding>
        </div>
      </div>
    </BindingContext>
  )
}

class App extends React.Component {

  state = {
    value: {}
  }

  render(){
    return (
      <div>
        <BindingContext
          value={this.state.value}
          onChange={value => this.setState({ value }) }
        >
          <section>
            <Binding bindTo='name'>
              <Names />
            </Binding>

            <div className='form-group'>
              <Binding
                bindTo='age'
                mapValue={e => +eventValue(e)}
              >
                <input type='number' placeholder='age' className='form-control'/>
              </Binding>
            </div>
            <div className='form-group'>
              <Binding
                bindTo='colors[0].name'
                mapValue={eventValue}
              >
                <select className='form-control'>
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Yellow</option>
                </select>
              </Binding>
            </div>
            <div className='form-group'>
              <Binding
                bindTo='colors[1].name'
                mapValue={eventValue}
              >
                <select className='form-control'>
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Yellow</option>
                </select>
              </Binding>
            </div>
          </section>
        </BindingContext>
        <div>
          <h5>current value: </h5>
          <pre>{JSON.stringify(this.state.value, null, 2) }</pre>
        </div>
      </div>
    )
  }
}

render(<App/>, mountNode)
