const { createNewTypesFromObject } = require('./src/')

const code = createNewTypesFromObject(
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
 ** OUTPUT **

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
