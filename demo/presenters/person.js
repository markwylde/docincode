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
