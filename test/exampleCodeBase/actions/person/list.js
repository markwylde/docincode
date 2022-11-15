export default async function listPerson (load) {
  const presentPerson = await load('presenters/person.js');

  return {
    /*
      (docs): actions.person.list@v1
      type: API Endpoint
      method: GET
      query:
        limit: number | optional | the maximum number of records to return
        offset: number | optional | the number of records to skip
      output:
        (docs): presenters.person
    */
    v1: () => {
      return [
        {
          firstName: 'Mark',
          lastName: 'Wylde'
        },
        {
          firstName: 'Joe',
          lastName: 'Bloggs'
        }
      ].map(presentPerson);
    }
  };
}
