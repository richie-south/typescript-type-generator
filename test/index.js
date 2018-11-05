/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const chai = require('chai')
chai.use(require('chai-string'))
const expect = chai.expect

const {createInterfacesFromObject} = require('../dist/index')

describe('Structure', () => {

  it('Should add given name', () => {
    const expected = `interface MyInter {
}
`
    const result = createInterfacesFromObject('MyInter', {
    })

    expect(result).to.have.entriesCount('interface', 1)
    expect(result).to.startsWith('interface MyInter')
    expect(result).to.equal(expected)
  })
})

describe('objects', () => {
  it('Should build one interface of all types simple', () => {
    const expected = `interface User {
  a: string;
  b: number;
  c: null;
  d: Array<any>;
  e: E;
  f: boolean;
}

interface E {
}
`
    const result = createInterfacesFromObject('User', {
      a: 'a',
      b: 1,
      c: null,
      d: [],
      e: {},
      f: true,
    })

    expect(result).to.have.entriesCount('interface', 2)
    expect(result).to.equal(expected)
  })

  it('Should only create on extra interface for multible equal objects', () => {
    const expected = `interface User {
  a: A;
  b: A;
  c: A;
}

interface A {
  str: string;
  id: number;
}
`
    const result = createInterfacesFromObject('User', {
      a: {
        str: 'str',
        id: 1,
      },
      b: {
        str: 'str',
        id: 1,
      },
      c: {
        str: 'str',
        id: 1,
      },
    })
    expect(result).to.have.entriesCount('interface', 2)
    expect(result).to.equal(expected)
  })

  it('Should create multible interface for diffrent objects', () => {
    const expected = `interface User {
  a: A;
  b: B;
  c: C;
}

interface A {
  a: string;
  a1: number;
}

interface B {
  b: boolean;
  b1: number;
}

interface C {
  c: null;
  c1: string;
}
`
    const result = createInterfacesFromObject('User', {
      a: {
        a: 'str',
        a1: 1,
      },
      b: {
        b: true,
        b1: 1,
      },
      c: {
        c: null,
        c1: 'c1',
      },
    })

    expect(result).to.have.entriesCount('interface', 4)
    expect(result).to.equal(expected)
  })

  it('Should create multible interface for nested objects', () => {
    const expected = `interface User {
  a: A;
}

interface A {
  a1: number;
  b: AB;
}

interface AB {
  c: BC;
  b1: number;
}

interface BC {
  c: null;
  c1: string;
}
`
    const result = createInterfacesFromObject('User', {
      a: {
        a1: 1,
        b: {
          c: {
            c: null,
            c1: 'c1',
          },
          b1: 1,
        },

      },
    })

    expect(result).to.have.entriesCount('interface', 4)
    expect(result).to.equal(expected)
  })

  it('Should create advanced', () => {
    const expected = `interface User {
  id: number;
  data: Data;
}

interface Data {
  info: DataInfo;
  articles: Array<Articles2 | Articles5>;
}

interface DataInfo {
  name: string;
  id: number;
  props: InfoProps;
}

interface InfoProps {
  prop: number;
  data: string;
}

interface Articles2 {
  title: string;
  id: number;
  content: string;
  props: Props;
}

interface Props {
  views: number;
  structure: PropsStructure;
}

interface PropsStructure {
  foo: string;
}

interface Articles5 {
  title: string;
  id: number;
  content: string;
}
`
    const result = createInterfacesFromObject('User', {
      id: 2,
      data: {
        info: {
          name: 'richard',
          id: 10,
          props: {
            prop: 1,
            data: 'some data',
          },
        },
        articles: [
          {
            title: 'my article',
            id: 1,
            content: 'asd ',
            props: {
              views: 100,
              structure: {
                foo: 'foo',
              },
            },
          },
          {
            title: 'my article',
            id: 1,
            content: 'asd ',
            props: {
              views: 100,
              structure: {
                foo: 'foo',
              },
            },
          },
          {
            title: 'my article',
            id: 1,
            content: 'asd ',
          },
        ],
      },
    })

    expect(result).to.have.entriesCount('interface', 8)
    expect(result).to.equal(expected)
  })
})
