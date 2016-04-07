'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('multi-glob').glob);
const postcss = require('postcss');
const noop = require('node-noop').noop;
const cheerio = require('cheerio');
const expressions = require('angular-expressions');
const isRegex = require('is-regex');

module.exports = postcss.plugin('usedcss', (options) => {
  var htmls = [];
  return function(css) {
    return new Promise((resolve, reject) => {
      if (!options.html) {
        reject('No html files specified.');
        return;
      }
      if (options.ignore && !Array.isArray(options.ignore)) {
        reject('ignore option should be an array.');
        return;
      }
      if (options.ignoreRegexp && !Array.isArray(options.ignoreRegexp)) {
        reject('ignoreRegexp option should be an array.');
        return;
      }
      if (options.ignoreRegexp && !options.ignoreRegexp.every(isRegex)) {
        reject('ignoreRegexp option should contain regular expressions.');
        return;
      }
      if (options.ngclass && typeof options.ngclass != 'boolean') {
        reject('ngclass option should be boolean.');
        return;
      }
      if (options.ignoreNesting && typeof options.ignoreNesting != 'boolean') {
        reject('ignoreNesting option should be boolean.');
        return;
      }
      var promise;
      if (options.ignoreNesting && options.ignore) {
        promise = Promise.map(options.ignore, (item, i) => {
          options.ignore[i] = item.replace(/^.*( |>|<)/g, '');
        });
      } else {
        promise = Promise.resolve();
      }
      promise.then(() => {
        return glob(options.html)
          .then((files) => {
            return Promise.map(files, (file) => {
              return fs.readFileAsync(file).then((content) => {
                htmls.push(cheerio.load(content.toString()));
                return Promise.resolve();
              });
            });
          })
          .then(() => {
            if (options.ngclass) {
              return Promise.map(htmls, (html) => {
                html('[ng-class], [data-ng-class]').each((i, el) => {
                  var cls = [];
                  var ngcl = html(el).attr('ng-class');
                  if (ngcl) {
                    cls = cls.concat(
                      Object.keys(expressions.compile(ngcl)())
                    );
                  }
                  var datang = html(el).attr('data-ng-class');
                  if (datang) {
                    cls = cls.concat(
                      Object.keys(expressions.compile(datang)())
                    );
                  }
                  cls.forEach((cl) => {
                    html(el).addClass(cl);
                  });
                });
                return Promise.resolve();
              });
            }
            return Promise.resolve();
          })
          .then(() => {
            var promises = [];
            css.walkRules((rule) => {
              // ignore keyframes
              if (
                rule.parent.type === 'atrule' &&
                /keyframes/.test(rule.parent.name)
              ) {
                return;
              }

              // if we found an element, we reject the promise and do nothing
              // promise is resolved if we found nothing after iteration
              // in this case, we remove a rule
              // sounds hacky, but it works
              promises.push(
                Promise.map(rule.selectors, (selector) => {
                  var promise;
                  if (options.ignoreRegexp) {
                    promise = Promise.map(options.ignoreRegexp, (item) => {
                      if (item.test(selector)) {
                        return Promise.reject();
                      }
                    });
                  } else {
                    promise = Promise.resolve();
                  }
                  return promise.then(() => {
                    // remove pseudo-classes from selectors
                    selector = selector.replace(/::?[a-zA-Z-]*$/g, '');
                    if (options.ignoreNesting) {
                      selector = selector.replace(/^.*( |>|<)/g, '')
                    }
                    return Promise.map(htmls, (html) => {
                      if (
                        (html(selector).length > 0 ||
                        (
                          options.ignore &&
                          options.ignore.indexOf(selector) > -1)
                        )
                      ) {
                        return Promise.reject();
                      }
                      return Promise.resolve();
                    });
                  });
                })
                .then(() => {
                  rule.remove();
                  return Promise.resolve();
                })
                .catch(noop)
              );
            });
            return Promise.all(promises);
          });
      })
        .then(resolve)
        .catch(reject);
    });
  };
});
