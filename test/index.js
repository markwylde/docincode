import path from 'path';
import test from 'basictap';
import docincode from '../index.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

test('parses correctly', async t => {
  const versions = await docincode(
    path.resolve(__dirname, './exampleCodeBase/**/*.js')
  );

  t.deepEqual(versions, [
    {
      name: 'v2',
      notations: [
        {
          id: 'presenters.person',
          type: 'View',
          version: 'v2',
          inputs: {
            fullName: 'string | required | the first name and last name of the person'
          }
        },
        {
          id: 'actions.person.list',
          type: 'API Endpoint',
          version: 'v1',
          method: 'GET',
          query: {
            limit: 'number | optional | the maximum number of records to return',
            offset: 'number | optional | the number of records to skip'
          },
          output: {
            '(docs)': 'presenters.person'
          }
        }
      ]
    },
    {
      name: 'v1',
      notations: [
        {
          id: 'presenters.person',
          type: 'View',
          version: 'v1',
          inputs: {
            firstName: 'string | required | the first name of the person',
            lastName: 'number | required | the last name of the person'
          }
        },
        {
          id: 'actions.person.list',
          type: 'API Endpoint',
          version: 'v1',
          method: 'GET',
          query: {
            limit: 'number | optional | the maximum number of records to return',
            offset: 'number | optional | the number of records to skip'
          },
          output: {
            '(docs)': 'presenters.person'
          }
        }
      ]
    }
  ]);
});
