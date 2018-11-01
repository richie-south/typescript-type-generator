# typescript-type(interface)-generator

Generate interfaces form javascript objects

## install

```
npm install typescript-interface-generator
```

## example

```javascript

const { createInterfacesFromObject } = require('../dist/')

const code = createInterfacesFromObject(
  'User',
  {
    id: 1,
    data: {
      name: 'Richard',
      articles: [
        {
          id: 0,
          title: 'article 0',
        },
        {
          id: 0,
          title: 'article 0',
        },
        {
          anotherObject: 10,
        },
      ],
    },
  }
)

console.log(code)
/**
 ** CODE OUTPUT **

 interface User {
    id: number;
    data: Data;
  }

  interface Data {
    name: string;
    articles: Array<Articles | Articles1>;
  }

  interface Articles {
    id: number;
    title: string;
  }

  interface Articles1 {
    anotherObject: number;
  }
 */

```

## gif example

<img src="https://github.com/richie-south/typescript-type-generator/blob/master/media/showcase.gif" width="500">

