'use strict';
import Promise from 'bluebird';
import {readFile} from 'fs';
import {glob as glob} from 'multi-glob';
import postcss from 'postcss';
import {noop} from 'node-noop';
import cheerio from 'cheerio';
import expressions from 'angular-expressions';
import isRegex from 'is-regex';
import angularTemplatecacheExtract from 'angular-templatecache-extract';

module.exports = postcss.plugin('usedcss', (options) => {
  let htmls = [];
  return (css) => {
    return new Promise((resolve, reject) => {
      if (!options.html && !options.js) {
        reject('Neither html nor js files was specified.');
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
      if (options.ngclass && typeof options.ngclass !== 'boolean') {
        reject('ngclass option should be boolean.');
        return;
      }
      if (options.ignoreNesting && typeof options.ignoreNesting !== 'boolean') {
        reject('ignoreNesting option should be boolean.');
        return;
      }
      if (options.templateMode && typeof options.templateMode !== 'boolean') {
        reject('templateMode option should be boolean.');
        return;
      }
      if (options.templateCache && typeof options.templateCache !== 'boolean') {
        reject('templateCache option should be boolean.');
        return;
      }
      if (options.templateCache && !options.js) {
        reject('templateCache option require js files to be specified.');
        return;
      }
      let promise;
      if (options.ignoreNesting && options.ignore) {
        promise = Promise.map(options.ignore, (item, i) => {
          options.ignore[i] = item.replace(/^.*( |>|<)/g, '');
        });
      } else {
        promise = Promise.resolve();
      }
      promise.then(() => {
        let prs = [];
        if (options.html) {
          prs.push(
            Promise.promisify(glob)(options.html)
              .then((files) => {
                return Promise.map(files, (file) => {
                  return Promise.promisify(readFile)(file).then((content) => {
                    htmls.push(cheerio.load(content.toString()));
                    return Promise.resolve();
                  });
                });
              })
          );
        }
        if (options.js && options.templateCache) {
          prs.push(
            Promise.promisify(glob)(options.js)
              .then((files) => {
                return Promise.map(files, (file) => {
                  return Promise.promisify(readFile)(file).then((content) => {
                    return angularTemplatecacheExtract(content.toString())
                      .then(tpls => {
                        return Promise.map(tpls, tpl => {
                          htmls.push(cheerio.load(tpl));
                          return Promise.resolve();
                        });
                      });
                  });
                });
              })
          );
        }
        return Promise.all(prs)
          .then(() => {
            if (options.ngclass) {
              return Promise.map(htmls, (html) => {
                html('[ng-class], [data-ng-class]').each((i, el) => {
                  let cls = [];
                  let ngcl = html(el).attr('ng-class');
                  if (ngcl) {
                    cls = cls.concat(
                      Object.keys(expressions.compile(ngcl)())
                    );
                  }
                  let datang = html(el).attr('data-ng-class');
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
            let promises = [];

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
                  let pr;
                  if (options.ignoreRegexp) {
                    pr = Promise.map(options.ignoreRegexp, (item) => {
                      if (!isRegex(item)) {
                        item = new RegExp(item);
                      }
                      if (item.test(selector)) {
                        return Promise.reject();
                      }
                    });
                  } else {
                    pr = Promise.resolve();
                  }
                  return pr.then(() => {
                    // remove pseudo-classes from selectors
                    selector = selector.replace(/::?[a-zA-Z-]*$/g, '');
                    if (options.ignoreNesting) {
                      selector = selector.replace(/^.*( |>|<)/g, '');
                    }
                    if (options.templateMode) {
                      selector = selector.split(/[ <>]/);
                      if (
                        selector.every(sel => {
                          if (sel === '') {
                            return true;
                          }
                          return htmls.some(html => {
                            return html(sel).length > 0 ||
                              (
                                options.ignore &&
                                options.ignore.indexOf(selector) > -1
                              );
                          });
                        })
                      ) {
                        return Promise.reject();
                      }
                      return Promise.resolve();
                    }
                    return Promise.map(htmls, (html) => {
                      if (
                        html(selector).length > 0 ||
                        (
                          options.ignore &&
                          options.ignore.indexOf(selector) > -1
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
