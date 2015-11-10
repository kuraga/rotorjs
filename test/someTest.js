import test from 'tapes';
import sinon from 'sinon';

function hello(name, cb) {
  cb('hello ' + name);
}

test('a set of some tests', function (t) {
  t.test('testing something', function (t) {
    t.ok(true, 'is true');
    t.end();
  });

  t.test('a nested set of tests', function (t) {
    var cb;

    t.beforeEach(function (t) {
      cb = sinon.spy();
      t.end();
    });

    t.test('this inherits from the parent suite', function (t) {
      hello('foo', cb);

      t.true(cb.calledWith('hello foo'));
      t.end();
    });

    t.end();
  });

  t.end();
});
