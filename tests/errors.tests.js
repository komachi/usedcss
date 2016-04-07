const expect = require('expect');
const runTest = require('./runTest.helper.js');

describe('errors', () => {
  it('Should retun error if there is no html files specified.', (done) => {
    runTest({html: null}).catch((err) => {
      expect(err).toBe('No html files specified.');
      done();
    });
  });

  it('Should retun error if ignore is not an array', (done) => {
    runTest({ignore: 'test'}).catch((err) => {
      expect(err).toBe('ignore option should be an array.');
      done();
    });
  });

  it('Should retun error if ignoreRegexp is not an array', (done) => {
    runTest({ignoreRegexp: 'test'}).catch((err) => {
      expect(err).toBe('ignoreRegexp option should be an array.');
      done();
    });
  });

  it('Should retun error if ignoreRegexp contains not a regexp', (done) => {
    runTest({ignoreRegexp: ['test']}).catch((err) => {
      expect(err).toBe(
        'ignoreRegexp option should contain regular expressions.'
      );
      done();
    });
  });

  it('Should retun error if ngclass is not boolean', (done) => {
    runTest({ngclass: 'test'}).catch((err) => {
      expect(err).toBe('ngclass option should be boolean.');
      done();
    });
  });

  it('Should retun error if ignoreNesting is not boolean', (done) => {
    runTest({ignoreNesting: 'test'}).catch((err) => {
      expect(err).toBe('ignoreNesting option should be boolean.');
      done();
    });
  });
});
