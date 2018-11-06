# typescript-type(interface)-generator

Generate interfaces form javascript objects

## install

```
npm install typescript-interface-generator
```

## example

```javascript

import { createInterfacesFromObject } from 'typescript-interface-generator'

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

## API

### createInterfacesFromObject

Takes a name and a javascript object and returns a string with typescript interfaces

**Syntax**

```javascript
  import { createInterfacesFromObject } from 'typescript-interface-generator'

  createInterfacesFromObject('NAME', {})
```

***Parameters***

* string
  * name of (parent) interface
* object
  * object that should be turned to interfaces

***Return value***

string: contains typescript interfaces

## gif example

<img src="https://github.com/richie-south/typescript-type-generator/blob/master/media/showcase.gif" width="500">

