import update from '../src/updateIn'
import chai from 'chai'

const { assert, expect } = chai

describe('immutable setter', () => {
  it('should create different objects', () => {
    const objA = { foo: [{ bar: { quuz: 10 } }], baz: { quuz: 10 } }
    const objB = update(objA, 'foo[0].bar.quuz', 5)

    assert(objA !== objB)
    assert(objA.baz === objB.baz)
    assert(objA.foo !== objB.foo)
    assert(objA.foo[0] !== objB.foo[0])
    assert(objA.foo[0].bar !== objB.foo[0].bar)
    assert(objA.foo[0].bar.quuz !== objB.foo[0].bar.quuz)

    assert(objB.foo[0].bar.quuz === 5)
  })

  it('should safely set missing branches', () => {
    const objA = { baz: { quuz: 10 } }
    const objB = update(objA, 'foo[0].bar.quuz', 5)

    assert(objA !== objB)
    assert(objA.baz === objB.baz)

    assert(objA.foo === undefined)
    assert.deepEqual(objB.foo, [{ bar: { quuz: 5 } }])
  })

  it('should not try to copy null', () => {
    expect(() => update({ foo: null }, 'foo.bar', 5)).to.not.throw()
  })

  it('should consider null', () => {
    chai.expect(update({ foo: null }, 'foo.bar', 5)).to.eql({
      foo: { bar: 5 },
    })
  })

  it('should work when input is undefined', () => {
    const obj = update(void 0, 'foo[0].bar.quuz', 5)

    assert.deepEqual(obj, { foo: [{ bar: { quuz: 5 } }] })
  })
})
