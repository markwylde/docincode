# docincode
Generate API documentation as JSON from comments in your code.

## Installation
```
npm install --save docincode
```

## Usage
In your projects javascript files, add comments anywhere and they will be collected and merged by docincode to create an array of versions.

Only comment blocks that start with `(docs): {RESOURCE_NAME}@{VERSION}` will be included.

If no documentation can be found for a resource in a specific version, it will be taken from the last version that had docs. See the [example codebase](./demo) for a more verbose example.

For example. Given you have the following code somewhere in your `src` folder:
```javascript
export default async function presentPerson () {
  return {
    /*
      (docs): presenters.person@v2
      type: View
      inputs:
        fullName: string | required | the first name and last name of the person
    */
    v2: (person) => {
      return {
        fullName: `${person.firstName} ${person.lastName}`
      };
    },

    /*
      (docs): presenters.person@v1
      type: View
      inputs:
        firstName: string | required | the first name of the person
        lastName: number | required | the last name of the person
    */
    v1: (person) => {
      return {
        firstName: person.firstName,
        lastName: person.lastName
      };
    }
  };
}
```

When you run docincode, like follows:
```javascript
import docincode from 'docincode';

const versions = await docincode(
  path.resolve(__dirname, './src/**/*.js')
);
```

Then you will receive the following `versions`:

```javascript
versions === [
  {
    "name": "v2",
    "notations": [
      {
        "id": "presenters.person",
        "version": "v2",
        "inputs": {
          "fullName": "string | required | the first name and last name of the person"
        }
      }
    ]
  },
  {
    "name": "v1",
    "notations": [
      {
        "id": "presenters.person",
        "version": "v1",
        "inputs": {
          "firstName": "string | required | the first name of the person",
          "lastName": "number | required | the last name of the person"
        }
      }
    ]
  }
]
```