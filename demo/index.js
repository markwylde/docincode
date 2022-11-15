const loader = version => async (file) => {
  const mod = await import('./' + file);

  const fn = await mod.default(loader(version));

  for (let key in fn) {
    if (key <= version) {
      return fn[key];
    }
  }
};

const load = loader('v2');

const listPerson = await load('actions/person/list.js');

console.log(listPerson());
