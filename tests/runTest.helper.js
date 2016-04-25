import postcss from 'postcss';
import Promise from 'bluebird';
import usedcss from '../src/index.js';
import {readFile} from 'fs';

export function runTest(options, file) {
  if (!file) {
    file = `${__dirname}/test.css`;
  }
  if (options && options.html === undefined) {
    options.html = [`${__dirname}/*.html`];
  }
  if (!options) {
    options = {
      html: [`${__dirname}/*.html`]
    };
  }
  return Promise.promisify(readFile)(file).then((content) => {
    return postcss([usedcss(options)]).process(content.toString());
  });
}
