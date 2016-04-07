const postcss = require('postcss');
const Promise = require('bluebird');
const usedcss = require('../index.js');
const readFile = Promise.promisify(require('fs').readFile);

module.exports = (options, file) => {
  if (!file) {
    file = `${__dirname}/test.css`;
  }
  if (options && options.html === undefined) {
    options.html = [`${__dirname}/test.html`];
  }
  if (!options) {
    options = {
      html: [`${__dirname}/test.html`]
    };
  }
  return readFile(file).then((content) => {
    return postcss([usedcss(options)]).process(content.toString());
  });
};
