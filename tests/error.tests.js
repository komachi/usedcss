import test from 'ava';
import {runTest} from './runTest.helper.js';

test('Should return error if there is neither html nor js files was specified',
  t => {
    return runTest({html: null}).catch(err => {
      t.is(err, 'Neither html nor js files was specified.');
    });
  }
);

test('Should return error if ignore is not an array', t => {
  return runTest({ignore: 'test'}).catch(err => {
    t.is(err, 'ignore option should be an array.');
  });
});

test('Should return error if ignoreRegexp is not an array', t => {
  return runTest({ignoreRegexp: 'test'}).catch(err => {
    t.is(err, 'ignoreRegexp option should be an array.');
  });
});

test('Should return error if ngclass is not boolean', t => {
  return runTest({ngclass: 'test'}).catch(err => {
    t.is(err, 'ngclass option should be boolean.');
  });
});

test('Should return error if ignoreNesting is not boolean', t => {
  return runTest({ignoreNesting: 'test'}).catch(err => {
    t.is(err, 'ignoreNesting option should be boolean.');
  });
});

test('Should return error if templateMode is not boolean', t => {
  return runTest({templateMode: 'test'}).catch(err => {
    t.is(err, 'templateMode option should be boolean.');
  });
});

test('Should return error if templateCache is not boolean', t => {
  return runTest({templateCache: 'test', js: ['*.js']}).catch(err => {
    t.is(err, 'templateCache option should be boolean.');
  });
});

test('Should return error if you use templateCache without js', t => {
  return runTest({templateCache: true}).catch(err => {
    t.is(err, 'templateCache option require js files to be specified.');
  });
});
