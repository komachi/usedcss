const expect = require('expect');
const runTest = require('./runTest.helper.js');

describe('main', () => {
  it('Should remove unused css classes', (done) => {
    runTest().then((result) => {
      expect(result.css).toBe(
        '.test1 .test2 { color: red }\n' +
        '.test10,.test2 { color: pink; }\n.' +
        'test1:after { content: \'\'; }\n' +
        '.test2::before { content: \'\'; }\n'
      );
      done();
    });
  });

  it('Should save ng-class classes', (done) => {
    runTest({ngclass: true}).then((result) => {
      expect(result.css).toBe(
        '.test1 .test2 { color: red }\n' +
        '.test10,.test2 { color: pink; }\n' +
        '.test1:after { content: \'\'; }\n' +
        '.test2::before { content: \'\'; }\n' +
        '.test1 .test3 { color: white; }\n' +
        '.test1 .test4 { color: orange; }\n'
      );
      done();
    });
  });

  it('Should ignore nesting', (done) => {
    runTest({ignoreNesting: true}).then((result) => {
      expect(result.css).toBe(
        '.test1 .test2 { color: red }\n' +
        '.test10,.test2 { color: pink; }\n' +
        '.test1:after { content: \'\'; }\n' +
        '.test2::before { content: \'\'; }\n' +
        '.nested .test1 { color: blue; }\n' +
        '.nested>.test2 { color: yellow;}\n'
      );
      done();
    });
  });

  it('Should work with ignore option', (done) => {
    runTest({ignore: ['.remove']}).then((result) => {
      expect(result.css).toBe(
        '.test1 .test2 { color: red }\n' +
        '.test10,.test2 { color: pink; }\n' +
        '.test1:after { content: \'\'; }\n' +
        '.test2::before { content: \'\'; }\n' +
        '.remove { color: black; }\n'
      );
      done();
    });
  });

  it('Ignore should also ignore nesting if ignoreNesting is enabled',
    (done) => {
      runTest({
        ignore: ['.nesting .remove'],
        ignoreNesting: true
      }).then((result) => {
        expect(result.css).toBe(
          '.test1 .test2 { color: red }\n' +
          '.test10,.test2 { color: pink; }\n' +
          '.test1:after { content: \'\'; }\n' +
          '.test2::before { content: \'\'; }\n' +
          '.nested .test1 { color: blue; }\n' +
          '.nested>.test2 { color: yellow;}\n' +
          '.remove { color: black; }\n'
        );
        done();
      });
    }
  );

  it('Should work with ignoreRegexp option', (done) => {
    runTest({ignoreRegexp: [/.*remo.*/]}).then((result) => {
      expect(result.css).toBe(
        '.test1 .test2 { color: red }\n' +
        '.test10,.test2 { color: pink; }\n' +
        '.test1:after { content: \'\'; }\n' +
        '.test2::before { content: \'\'; }\n' +
        '.remove { color: black; }\n'
      );
      done();
    });
  });
});
