/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const chai = require('chai')
chai.use(require('chai-string'))
const expect = chai.expect

const {createInterfacesFromObject} = require('../dist/index')

describe('Arrays', () => {
  it('Should add one of every type to array', () => {
    const expected = `interface User {
  a: Array<string | number | null | any | boolean | A>;
}

interface A {
}
`
    const result = createInterfacesFromObject('User', {
      a: [
        'str',
        1,
        null,
        [],
        true,
        {},
      ],
    })

    expect(result).to.have.entriesCount('interface', 2)
    expect(result).to.equal(expected)
  })

  it('Should only create single interfaces if nested array with non objects', () => {
    const expected = `interface User {
  a: Array<string | number | boolean>;
}
`
    const result = createInterfacesFromObject('User', {
      a: [
        ['str', 1],
        [1],
        [[true]],
      ],
    })

    expect(result).to.equal(expected)
  })

  it('Should add any if array is empty', () => {
    const expected = `interface User {
  a: Array<any>;
}
`
    const result = createInterfacesFromObject('User', {
      a: [],
    })

    expect(result).to.equal(expected)
  })

  it('Should add string if array is of strings', () => {
    const expected = `interface User {
  a: Array<string>;
}
`
    const result = createInterfacesFromObject('User', {
      a: ['a', 'b', 'c'],
    })

    expect(result).to.equal(expected)
  })

  it('Should add number if array is of numbers', () => {
    const expected = `interface User {
  a: Array<number>;
}
`
    const result = createInterfacesFromObject('User', {
      a: [1, 2, 3, 4],
    })

    expect(result).to.equal(expected)
  })

  it('Should add null if array is of null', () => {
    const expected = `interface User {
  a: Array<null>;
}
`
    const result = createInterfacesFromObject('User', {
      a: [null, null],
    })

    expect(result).to.equal(expected)
  })

  it('Should add boolean if array is of boolean', () => {
    const expected = `interface User {
  a: Array<boolean>;
}
`
    const result = createInterfacesFromObject('User', {
      a: [true, true],
    })

    expect(result).to.equal(expected)
  })

  it('Should add seperate inteface if array contains object', () => {
    const expected = `interface User {
  a: Array<A>;
}

interface A {
  a: string;
  b: boolean;
}
`
    const result = createInterfacesFromObject('User', {
      a: [{a: 'a', b: true}],
    })

    expect(result).to.have.entriesCount('interface', 2)
    expect(result).to.equal(expected)
  })

  it('Should add one inteface for same object', () => {
    const expected = `interface User {
  a: Array<A>;
}

interface A {
  a: string;
  b: boolean;
}
`
    const result = createInterfacesFromObject('User', {
      a: [{a: 'a', b: true}, {a: 'a', b: true}, {a: 'a', b: true}, {a: 'a', b: true}],
    })

    expect(result).to.have.entriesCount('interface', 2)
    expect(result).to.equal(expected)
  })

  it('Should add one inteface each uniq object', () => {
    const expected = `interface User {
  a: Array<A | A1>;
}

interface A {
  a: string;
  b: boolean;
}

interface A1 {
  c: string;
  d: null;
}
`
    const result = createInterfacesFromObject('User', {
      a: [{a: 'a', b: true}, {a: 'a', b: true}, {c: 'c', d: null}],
    })

    expect(result).to.have.entriesCount('interface', 3)
    expect(result).to.equal(expected)
  })
})
