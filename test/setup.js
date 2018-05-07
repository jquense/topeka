const Enzyme = require('enzyme')
const Adapter = require('@monastic.panic/enzyme-adapter-react-16')

const chai = require('chai')
const sinonChai = require('sinon-chai')

chai.should()
chai.use(require('dirty-chai'))
chai.use(sinonChai)

Enzyme.configure({ adapter: new Adapter() })
