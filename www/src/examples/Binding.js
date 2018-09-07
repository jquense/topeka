let Names = props => {
  return (
    <BindingContext {...props}>
      <div>
        <div className="form-group">
          <Binding bindTo="first">
            {props => (
              <input
                type="text"
                placeholder="first name"
                className="form-control"
                {...props}
              />
            )}
          </Binding>
        </div>
        <div className="form-group">
          <Binding bindTo="surname">
            {props => (
              <input
                type="text"
                placeholder="surname"
                className="form-control"
                {...props}
              />
            )}
          </Binding>
        </div>
      </div>
    </BindingContext>
  )
}

let Surround = props => <div {...props}>{props.children}</div>

let App = () => {
  return (
    <BindingContext defaultValue={{}}>
      <section>
        <Binding bindTo="name">{props => <Names {...props} />}</Binding>

        <div className="form-group">
          <Binding bindTo="age" mapValue={e => parseFloat(e.target.value)}>
            {props => (
              <input
                type="number"
                placeholder="age"
                className="form-control"
                {...props}
              />
            )}
          </Binding>
        </div>
        <div className="form-group">
          <Binding bindTo="colors[0].name">
            {props => (
              <Surround>
                <select {...props} className="form-control">
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Yellow</option>
                </select>
              </Surround>
            )}
          </Binding>
        </div>
        <div className="form-group">
          <Binding bindTo="colors[1].name">
            {props => (
              <select {...props} className="form-control">
                <option>Red</option>
                <option>Blue</option>
                <option>Yellow</option>
              </select>
            )}
          </Binding>
        </div>
        <div>
          <h5>current value: </h5>
          <Binding bindTo={model => JSON.stringify(model, null, 2)}>
            {({ value }) => <pre>{value}</pre>}
          </Binding>
        </div>
      </section>
    </BindingContext>
  )
}

render(<App />)
