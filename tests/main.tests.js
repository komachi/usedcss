import test from 'ava';
import {runTest} from './runTest.helper.js';

test('Should remove unused css classes', t => {
  return runTest().then(result => {
    t.is(result.css,
      '.test1 .test2 { color: red }\n' +
      '.test10,.test2 { color: pink; }\n.' +
      'test1:after { content: \'\'; }\n' +
      '.test2::before { content: \'\'; }\n'
    );
  });
});


test('Should save ng-class classes', t => {
  return runTest({ngclass: true}).then(result => {
    t.is(result.css,
      '.test1 .test2 { color: red }\n' +
      '.test10,.test2 { color: pink; }\n' +
      '.test1:after { content: \'\'; }\n' +
      '.test2::before { content: \'\'; }\n' +
      '.test1 .test3 { color: white; }\n' +
      '.test1 .test4 { color: orange; }\n'
    );
  });
});

test('Should ignore nesting', t => {
  return runTest({ignoreNesting: true}).then(result => {
    t.is(result.css,
      '.test1 .test2 { color: red }\n' +
      '.test10,.test2 { color: pink; }\n' +
      '.test1:after { content: \'\'; }\n' +
      '.test2::before { content: \'\'; }\n' +
      '.nested .test1 { color: blue; }\n' +
      '.nested>.test2 { color: yellow;}\n'
    );
  });
});

test('Should work with ignore option', t => {
  return runTest({ignore: ['.remove']}).then(result => {
    t.is(result.css,
      '.test1 .test2 { color: red }\n' +
      '.test10,.test2 { color: pink; }\n' +
      '.test1:after { content: \'\'; }\n' +
      '.test2::before { content: \'\'; }\n' +
      '.remove { color: black; }\n'
    );
  });
});

test('Ignore should also ignore nesting if ignoreNesting is enabled',
  t => {
    return runTest({
      ignore: ['.nesting .remove'],
      ignoreNesting: true
    }).then(result => {
      t.is(result.css,
       '.test1 .test2 { color: red }\n' +
        '.test10,.test2 { color: pink; }\n' +
        '.test1:after { content: \'\'; }\n' +
        '.test2::before { content: \'\'; }\n' +
        '.nested .test1 { color: blue; }\n' +
        '.nested>.test2 { color: yellow;}\n' +
        '.remove { color: black; }\n'
      );
    });
  }
);

test('Should work with ignoreRegexp option', t => {
  return runTest({ignore: ['.remove']}).then(result => {
    t.is(result.css,
      '.test1 .test2 { color: red }\n' +
      '.test10,.test2 { color: pink; }\n' +
      '.test1:after { content: \'\'; }\n' +
      '.test2::before { content: \'\'; }\n' +
      '.remove { color: black; }\n'
    );
  });
});
