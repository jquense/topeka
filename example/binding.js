let eventValue = e => e.target.value;

let Names = props => {
  return (
    <BindingContext {...props}>
      <div>
        <div className='form-group'>
          <Binding accessor='first' mapValue={eventValue}>
            <input type='text' placeholder='first name' className='form-control'/>
          </Binding>
        </div>
        <div className='form-group'>
          <Binding accessor='surname' mapValue={eventValue}>
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
            <Binding accessor='name'>
              <Names />
            </Binding>

            <div className='form-group'>
              <Binding
                accessor='age'
                mapValue={e => +eventValue(e)}
              >
                <input type='number' placeholder='age' className='form-control'/>
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
