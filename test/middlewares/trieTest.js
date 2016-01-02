// Mostly inherited from https://github.com/zensh/route-trie (by Yan Qing)

import test from 'tapes';

import { Trie_RouteTrie as Trie } from '../../middlewares';

test('Trie', function (t) {
  let trie;

  t.beforeEach(function (t) {
    trie = new Trie();

    t.end();
  });

  t.test('constructor', function (t) {
    t.test('should construct Trie instance', function (t) {
      t.assert(trie instanceof Trie);

      t.end();
    });

    t.end();
  });

  t.test('.define', function (t) {
    t.test('should return comparable nodes 1', function (t) {
      t.is(trie.define('/path1'), trie.define('/path1'));
      t.is(trie.define('/path1/:path2/path3'), trie.define('/path1/:path2/path3'));

      t.end();
    });

    t.test('should return comparable nodes 2', function (t) {
      t.not(trie.define('/path1/[a-z]'), trie.define('/path1/[A-Z]'));

      t.end();
    });

    t.test('should return comparable nodes 3', function (t) {
      t.is(trie.define('/path1/:path2/path3'), trie.define('/path1/:path22/path3'));

      t.end();
    });

    t.test('should return comparable nodes 4', function (t) {
      t.not(trie.define('/path1/:path2/path3'), trie.define('/path1/:path2(a|b)/path3'));

      t.end();
    });

    t.test('should return comparable nodes 5', function (t) {
      t.not(trie.define('/*'), trie.define('/'));

      t.end();
    });

    t.test('should return comparable nodes 5', function (t) {
      t.not(trie.define('/*'), trie.define('/post'));

      t.end();
    });

    t.test('should return comparable nodes 6', function (t) {
      t.not(trie.define('/test:name(a|b)'), trie.define('/test:name(c|d)'));
      t.not(trie.define('/test:name(a|b)'), trie.define('/test::name(a|b)'));

      t.end();
    });

    t.test('is case-sensetive', function (t) {
      t.not(trie.define('/Post'), trie.define('/post'));

      t.end();
    });

    t.test('discard leading slashes', function (t) {
      t.is(trie.define('/'), trie.define(''));

      let node = trie.define('/path1/path2');
      t.is(node._nodeState.pattern, '/path1/path2');
      t.is(node, trie.define('path1/path2'));
      t.is(node, trie.define('/path1/path2/'));

      t.not(node, trie.define('/path1/path2/path3'));
      t.not(node, trie.define('/path1/:path2'));
      t.not(node, trie.define('/path2/path2'));

      t.end();
    });

    t.test('doesn\'t allow multi-slashes 1', function (t) {
      t.throws(function () {
        trie.define('///');
      });

      t.end();
    });

    t.test('doesn\'t allow multi-slashes 2', function (t) {
      t.throws(function () {
        trie.define('//path1/path2');
      });

      t.end();
    });

    t.test('doesn\'t allow multi-slashes 3', function (t) {
      t.throws(function () {
        trie.define('/path1///path2');
      });

      t.end();
    });

    t.test('doesn\'t allow empty regular expressions', function (t) {
      t.throws(function () {
        trie.define('/path1/path2()/');
      });

      t.end();
    });

    t.test('doesn\'t allow partial redefining', function (t) {
      trie.define('/*');

      t.throws(function () {
        trie.define('/(*)');
      });

      t.throws(function () {
        trie.define('/(a|b)');
      });

      t.throws(function () {
        trie.define('/(*)/post');
      });

      t.end();
    });

    t.test('returned value', function (t) {
      t.test('.pattern', function (t) {
        let node = trie.define('/path1/:path2/path3');

        t.is(node._nodeState.pattern, '/path1/:path2/path3'); // FIXME

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.match', function (t) {
    t.test('matches patterns without params correctly', function (t) {
      let node = trie.define('/');
      let match = trie.match('/');

      t.is(node, match.node);
      t.deepEqual(match.params, {});

      t.is(null, trie.match('/path'));
      t.is(null, trie.match('path'));

      t.end();
    });

    t.test('matches patterns with params correctly', function (t) {
      let node = trie.define('/:type');
      let match = trie.match('/post');

      t.deepEqual(match.params, {
        type: 'post'
      });
      t.is(node, match.node);
      t.is(node, trie.match('/task').node);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 1', function (t) {
      let node = trie.define('/:type/:id([1-9a-z]{6})');
      let match = trie.match('/post/a12345');

      t.deepEqual(match.params, {
        type: 'post',
        id: 'a12345'
      });
      t.is(node, match.node);
      t.is(node, trie.match('/task/aaabbb').node);
      t.is(null, trie.match('/task/aaabbbc'));
      t.is(null, trie.match('/task/aaabbb/ccc'));
      t.is(null, trie.match('/task/aaabb'));
      t.is(null, trie.match('/task'));

      t.end();
    });

    t.test('matches patterns with regexped params correctly 2', function (t) {
      let node = trie.define('/post|task/([1-9a-z]{6})');

      t.deepEqual(trie.match('/post/a12345').params, {});
      t.is(trie.match('/post/a12345').node, node);
      t.deepEqual(trie.match('/task/a12345').params, {});
      t.is(trie.match('/task/a12345').node, node);
      t.is(trie.match('/event/a12345'), null);
      t.is(trie.match('/task/a123456'), null);
      t.is(trie.match('/task/a12345/6'), null);
      t.is(trie.match('/post'), null);
      t.is(trie.match('/'), null);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 3', function (t) {
      let node = trie.define('/:type(post|task)/:id([1-9a-z]{6})');

      t.deepEqual(trie.match('/post/a12345').params, {
        type: 'post',
        id: 'a12345'
      });
      t.is(trie.match('/post/a12345').node, node);

      t.deepEqual(trie.match('/task/a12345').params, {
        type: 'task',
        id: 'a12345'
      });
      t.is(trie.match('/task/a12345').node, node);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 4', function (t) {
      let node1 = trie.define('/:type');
      let node2 = trie.define('/:type/:id');

      t.deepEqual(trie.match('/post').params, {
        type: 'post'
      });
      t.is(trie.match('/post').node, node1);

      t.deepEqual(trie.match('/task').params, {
        type: 'task'
      });
      t.is(trie.match('/task').node, node1);

      t.deepEqual(trie.match('/post/123456').params, {
        type: 'post',
        id: '123456'
      });
      t.is(trie.match('/post/123456').node, node2);

      t.deepEqual(trie.match('/task/123456').params, {
        type: 'task',
        id: '123456'
      });
      t.is(trie.match('/task/123456').node, node2);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 5', function (t) {
      let node1 = trie.define('/:user(user|admin)/:id([1-9]{6})');
      let node2 = trie.define('/:type(post|task)/:id([a-z]{6})');

      t.deepEqual(trie.match('/post/aaaaaa').params, {
        type: 'post',
        id: 'aaaaaa'
      });
      t.is(trie.match('/post/aaaaaa').node, node2);

      t.deepEqual(trie.match('/task/aaaaaa').params, {
        type: 'task',
        id: 'aaaaaa'
      });
      t.is(trie.match('/task/aaaaaa').node, node2);
      t.is(trie.match('/task/111111'), null);

      t.deepEqual(trie.match('/admin/123456').params, {
        user: 'admin',
        id: '123456'
      });
      t.is(trie.match('/admin/123456').node, node1);

      t.deepEqual(trie.match('/user/123456').params, {
        user: 'user',
        id: '123456'
      });
      t.is(trie.match('/user/123456').node, node1);
      t.is(trie.match('/user/aaaaaa'), null);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 6', function (t) {
      trie.define('/post/:id([a-z]+)');

      t.deepEqual(trie.match('/post/abc').params, {
        id: 'abc'
      });
      t.is(trie.match('/post/ABC'), null);
      t.is(trie.match('/Post/abc'), null);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 7', function (t) {
      let node = trie.define('*');

      t.is(trie.match('').node, node);
      t.is(trie.match('/').node, node);
      t.is(trie.match('/x').node, node);
      t.is(trie.match('/x/y/z').node, node);
      t.deepEqual(trie.match('/post/abc').params, {});

      t.end();
    });

    t.test('matches patterns with regexped params correctly 8', function (t) {
      trie.define(':all(*)');

      t.deepEqual(trie.match('').params, {
        all: ''
      });
      t.deepEqual(trie.match('/').params, {
        all: ''
      });
      t.deepEqual(trie.match('/post/abc').params, {
        all: 'post/abc'
      });

      t.end();
    });

    t.test('matches patterns with regexped params correctly 9', function (t) {
      let node = trie.define('/:all*');

      t.is(trie.match('').node, node);
      t.is(trie.match('/').node, node);
      t.is(trie.match('/x').node, node);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 10', function (t) {
      let node = trie.define('/:type/:other(*)');

      t.is(trie.match('/post'), null);
      t.is(trie.match('/post/x').node, node);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 11', function (t) {
      let node = trie.define('/post|task/([1-9a-z]{6})');

      t.is(trie.define('/(post|task)/([1-9a-z]{6})'), node);
      t.is(trie.define('/post|task/[1-9a-z]{6}'), node);

      t.end();
    });

    t.test('matches patterns with regexped params correctly 12', function (t) {
      let node = trie.define('/:type(post|task)/:id([1-9a-z]{6})');

      t.is(trie.define('/:type1(post|task)/[1-9a-z]{6}'), node);

      t.end();
    });

    t.test('matches patterns precisely 1', function (t) {
      let node = trie.define('/:all*');
      trie.define('');

      t.not(trie.define(''), node);
      t.not(trie.match('/').node, node);
      t.is(trie.match('/x').node, node);
      t.deepEqual(trie.match('').params, {});
      t.deepEqual(trie.match('/').params, {});
      t.deepEqual(trie.match('/post/abc').params, {
        all: 'post/abc'
      });

      t.end();
    });

    t.test('matches patterns precisely 2', function (t) {
      let node = trie.define('/:type/:other(*)');
      trie.define('/:type');
      trie.define('/post');

      t.not(trie.define('/post'), node);
      t.not(trie.define('/:type'), node);
      t.is(trie.match('/post/abc'), null);
      t.deepEqual(trie.match('').params, {
        type: ''
      });
      t.deepEqual(trie.match('/').params, {
        type: ''
      });
      t.deepEqual(trie.match('/post').params, {});
      t.deepEqual(trie.match('/task').params, {
        type: 'task'
      });
      t.deepEqual(trie.match('/task/abc').params, {
        type: 'task',
        other: 'abc'
      });
      t.deepEqual(trie.match('/event/x/y/z').params, {
        type: 'event',
        other: 'x/y/z'
      });

      t.end();
    });

    t.test('matches patterns precisely 3', function (t) {
      trie.define('/prefix:name/:other(*)');
      trie.define('/test.com::name');
      trie.define('/post');

      t.is(trie.match('/prefix'), null);
      t.deepEqual(trie.match('/prefix/123').params, {
        name: '',
        other: '123'
      });
      t.deepEqual(trie.match('/prefix123/456').params, {
        name: '123',
        other: '456'
      });
      t.deepEqual(trie.match('/prefix123/456/789').params, {
        name: '123',
        other: '456/789'
      });

      t.is(trie.match('/test.com'), null);
      t.deepEqual(trie.match('/test.com:').params, {
        name: ''
      });
      t.deepEqual(trie.match('/test.com:zensh').params, {
        name: 'zensh'
      });
      t.is(trie.match('/test.com:zensh/test'), null);

      t.end();
    });

    t.end();
  });

  t.end();
});
