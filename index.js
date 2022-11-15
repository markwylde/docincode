import { promises as fs } from 'fs';
import { globby } from 'globby';
import { parse } from 'acorn';
import yaml from 'js-yaml';

const hydrate = (object, origin) => {
  const newObject = {};

  for (const key in object) {
    if (typeof object[key] === 'object') {
      newObject[key] = hydrate(object[key], origin);
    } else {
      newObject[key] = object[key];
    }
  }

  return newObject;
};

async function grabNotations (source) {
  const files = await globby(source);
  const origin = [];

  for (const file of files) {
    const data = await fs.readFile(file, 'utf8');
    parse(data, {
      onComment: (block, comment) => {
        const docSchema = comment.trim().split('\n').slice(1).join('\n');
        const idAndVersion = comment.trim().split('\n')[0].split('(docs):')[1].trim();
        const [id, version] = idAndVersion.split('@');
        if (comment.trim().startsWith('(docs):')) {
          origin.push({
            id,
            version: version || 'v1',
            ...yaml.load(docSchema)
          });
        }
      },
      ecmaVersion: 'latest',
      allowAwaitOutsideFunction: true,
      sourceType: 'module'
    });
  }
  return origin.map(item => hydrate(item, origin));
}

const parseNotationsForVersion = (notations, version) => {
  const parsed = notations.reduce((parsed, notation) => {
    if (notation.version > version) {
      return parsed;
    }

    if (!parsed[notation.id]) {
      parsed[notation.id] = notation;
      return parsed;
    }

    if (parsed[notation.id].version < notation.version) {
      parsed[notation.id] = notation;
      return parsed;
    }

    return parsed;
  }, {});

  return Object.keys(parsed).map(key => parsed[key]);
};

export default async function docincode (source) {
  const notations = await grabNotations(source);
  const versions = Array
    .from(new Set(notations.map(notation => notation.version)))
    .sort((a, b) => (a > b ? -1 : 1))
    .map(version => {
      return {
        name: version,
        notations: parseNotationsForVersion(notations, version)
      };
    });
  return versions;
}
