import test from 'ava';
import {runTest} from './runTest.helper.js';

test('Should retun error if there is no html files specified', t => {
  return runTest({html: null}).catch(err => {
    t.is(err, 'No html files specified.');
  });
});

test('Should retun error if ignore is not an array', t => {
  return runTest({ignore: 'test'}).catch(err => {
    t.is(err, 'ignore option should be an array.');
  });
});

test('Should return error if ignoreRegexp is not an array', t => {
  return runTest({ignoreRegexp: 'test'}).catch(err => {
    t.is(err, 'ignoreRegexp option should be an array.');
  });
});

test('Should retun error if ignoreRegexp contains not a regexp', t => {
  return runTest({ignoreRegexp: ['test']}).catch(err => {
    t.is(err, 'ignoreRegexp option should contain regular expressions.');
  });
});

test('Should retun error if ngclass is not boolean', t => {
  return runTest({ngclass: 'test'}).catch(err => {
    t.is(err, 'ngclass option should be boolean.');
  });
});

test('Should retun error if ignoreNesting is not boolean', t => {
  return runTest({ignoreNesting: 'test'}).catch(err => {
    t.is(err, 'ignoreNesting option should be boolean.');
  });
});
