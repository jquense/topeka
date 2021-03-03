# topeka

topeka leverages react context, to create low friction input bindings for complex or nested values.


## Usage

```jsx
import { Binding, useBinding } from 'topeka';


const BoundInput = ({ name, ...props }) => {
  const [value, onChange] = useBinding(name);

  return <input {...props} name={name} value={value} onChange={onChange} />;
};

function App() {
  const [value, setValue] = useState({});

  return (
    <div>
      <BindingContext value={value} onChange={setValue}>
        <section>
          <BoundInput name="name.first" type="text" placeholder="first name" />

          <BoundInput name="name.surname" type="text" placeholder="surname" />

          <BoundInput name="name.surname" type="number" placeholder="age" />
        </section>
      </BindingContext>
      <div>
        <h5>current value: </h5>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
}
```
