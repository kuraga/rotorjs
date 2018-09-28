// Mostly inherited from https://github.com/zensh/route-trie (by Yan Qing)

import tman from 'tman';
import assert from 'assert';

import { Trie_RouteTrie as Trie } from '../../middlewares';

tman.mocha();

tman.suite('Trie', function () {
  let trie;

  tman.beforeEach(function () {
    trie = new Trie();
  });

  tman.suite('constructor', function () {
    tman.test('should construct Trie instance', function () {
      assert.ok(trie instanceof Trie);
    });
  });

  tman.suite('.define', function () {
    tman.suite('returned value', function () {
      tman.suite('.pattern', function () {
        tman.test('should return pattern', function () {
          const node = trie.define('/path1/:path2/path3');

          assert.ok(trie.is(node.pattern, '/path1/:path2/path3'));
        });

        tman.test('should return first eqivalent pattern', function () {
          const node1 = trie.define('/path1/:path2/path3');
          const node2 = trie.define('/path1/:path2_but_another/path3');
          const node3 = trie.define('/path1/:yet_another_path2/path3');

          assert.ok(trie.is(node1.pattern, '/path1/:path2/path3'));
          assert.ok(trie.is(node2.pattern, '/path1/:path2/path3'));
          assert.ok(trie.is(node3.pattern, '/path1/:path2/path3'));
        });
      });
    });

    tman.test('should return comparable node: nodes with the same patterns should be equal', function () {
      assert.ok(trie.is(trie.define('/path1'), trie.define('/path1')));
      assert.ok(trie.is(trie.define('/path1/:path2/path3'), trie.define('/path1/:path2/path3')));
    });

    tman.test('should return comparable nodes: nodes with different patterns should not be the same', function () {
      assert.notStrictEqual(trie.is(trie.define('/path1/([a-z])'), trie.define('/path1/([A-Z])')));
      assert.notStrictEqual(trie.is(trie.define('/path1/:path2/path3'), trie.define('/path1/:path2(a|b)/path3')));
      assert.notStrictEqual(trie.is(trie.define('/test:name(a|b)'), trie.define('/test:name(c|d)')));
      assert.notStrictEqual(trie.is(trie.define('/test:name'), trie.define('/test::name')));
    });

    tman.test('should return comparable nodes: pattern\'s variable names are discarded', function () {
      assert.ok(trie.is(trie.define('/path1/:path2/path3'), trie.define('/path1/:path4/path3')));
    });

    tman.test('should return comparable nodes: pattern\'s variable names are optional', function () {
      assert.ok(trie.is(trie.define('/path1/:path2([0-9])'), trie.define('/path1/([0-9])')));
    });

    tman.test('should return comparable nodes: wildcard option 1', function () {
      assert.notStrictEqual(trie.is(trie.define('/*'), trie.define('/post')));
    });

    tman.test('should return comparable nodes: wildcard option 2', function () {
      assert.notStrictEqual(trie.is(trie.define('/*'), trie.define('/')));
    });

    tman.test('should return comparable nodes: wildcard option 3', function () {
      assert.notStrictEqual(trie.is(trie.define('/'), trie.define('/:all(*)')));
    });

    tman.test('is case-sensetive', function () {
      assert.notStrictEqual(trie.is(trie.define('/Post'), trie.define('/post')));
    });

    tman.test('discard leading slashes', function () {
      assert.ok(trie.is(trie.define('/'), trie.define('')));

      const node = trie.define('/path1/path2');
      assert.ok(trie.is(node.pattern, '/path1/path2'));
      assert.ok(trie.is(node, trie.define('path1/path2')));
      assert.ok(trie.is(node, trie.define('/path1/path2/')));

      assert.notStrictEqual(trie.is(node, trie.define('/path1/path2/path3')));
      assert.notStrictEqual(trie.is(node, trie.define('/path1/:path2')));
      assert.notStrictEqual(trie.is(node, trie.define('/path2/path2')));
    });

    tman.test('doesn\'t allow multi-slashes 1', function () {
      assert.throws(function () {
        trie.define('///');
      });
    });

    tman.test('doesn\'t allow multi-slashes 2', function () {
      assert.throws(function () {
        trie.define('//path1/path2');
      });
    });

    tman.test('doesn\'t allow multi-slashes 3', function () {
      assert.throws(function () {
        trie.define('/path1///path2');
      });
    });

    tman.test('doesn\'t allow empty regular expressions', function () {
      assert.throws(function () {
        trie.define('/path1/path2()/');
      });
    });

    tman.test('doesn\'t allow partial redefining 1', function () {
      trie.define('/(*)');

      assert.throws(function () {
        trie.define('');
      })

      assert.throws(function () {
        trie.define('/');
      })

      assert.throws(function () {
        trie.define('/a');
      })

      assert.throws(function () {
        trie.define('/(a|b)');
      });

      assert.throws(function () {
        trie.define('/(*)/post');
      });
    });

    tman.test('doesn\'t allow partial redefining 2', function () {
      trie.define('/a/(*)');

      assert.throws(function () {
        trie.define('/a/b');
      });

      assert.throws(function () {
        trie.define('/a/b/c');
      });
    });

    tman.test('doesn\'t allow partial redefining 3', function () {
      trie.define('/a/b(*)');
      trie.define('/a/bc');
      trie.define('/a/b/c');
      trie.define('/a/c(*)');
      trie.define('/a/d(*)');

      assert.throws(function () {
        trie.define('/a/d(*)/e');
      });

      trie.define('/a/(*)');

      assert.throws(function () {
        trie.define('/a/e(*)');
      });
    });
  });

  tman.suite('.match', function () {
    tman.test('matches patterns without params correctly 1', function () {
      const node = trie.define('/');
      const match = trie.match('/');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {});

      assert.strictEqual(trie.match('/path'), null);
      assert.strictEqual(trie.match('path'), null);
    });

    tman.test('matches patterns without params correctly 2', function () {
      const node = trie.define('/post');
      trie.define('/пост');
      const match = trie.match('/post');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {});
    });

    tman.test('matches patterns without params correctly 3', function () {
      trie.define('/post');
      const node = trie.define('/пост');
      const match = trie.match('/пост');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {});
    });

    tman.test('matches patterns without params correctly 4', function () {
      trie.define('/post');
      trie.define('/пост');

      assert.strictEqual(trie.match('/path'), null);
      assert.strictEqual(trie.match('/'), null);
      assert.strictEqual(trie.match('/post/abc'), null);
    });

    tman.test('matches patterns with params correctly 1', function () {
      const node = trie.define('/:type');
      const match = trie.match('/post');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {
        type: 'post'
      });
    });

    tman.test('matches patterns with params correctly 2', function () {
      const node = trie.define('/:type');
      const match = trie.match('/пост');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {
        type: 'пост'
      });
    });

    tman.test('matches patterns with params correctly 3', function () {
      const node = trie.define('/prefix:type');
      const match = trie.match('/prefixpost');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {
        type: 'post'
      });
    });

    tman.test('matches patterns with params correctly 4', function () {
      const node = trie.define('/префикс:type');
      const match = trie.match('/префикспост');

      assert.ok(trie.is(node, match.node));
      assert.deepEqual(match.params, {
        type: 'пост'
      });
    });

    tman.test('matches patterns with params correctly 5', function () {
      assert.strictEqual(trie.match('/prEfixpost'), null);
    });

    tman.test('matches patterns with regexped params correctly 1', function () {
      const node = trie.define('/:type/:id([1-9a-z]{6})');
      const match = trie.match('/post/a12345');

      assert.deepEqual(match.params, {
        type: 'post',
        id: 'a12345'
      });
      assert.ok(trie.is(node, match.node));
      assert.ok(trie.is(node, trie.match('/task/aaabbb').node));
      assert.strictEqual(trie.match('/task/aaabbbc'), null);
      assert.strictEqual(trie.match('/task/aaabbb/ccc'), null);
      assert.strictEqual(trie.match('/task/aaabb'), null);
      assert.strictEqual(trie.match('/task'), null);
    });

    tman.test('matches patterns with regexped params correctly 2', function () {
      const node = trie.define('/(post|task)/([1-9a-z]{6})');

      assert.deepEqual(trie.match('/post/a12345').params, {});
      assert.ok(trie.is(trie.match('/post/a12345').node, node));
      assert.deepEqual(trie.match('/task/a12345').params, {});
      assert.ok(trie.is(trie.match('/task/a12345').node, node));
      assert.strictEqual(trie.match('/event/a12345'), null);
      assert.strictEqual(trie.match('/task/a123456'), null);
      assert.strictEqual(trie.match('/task/a12345/6'), null);
      assert.strictEqual(trie.match('/post'), null);
      assert.strictEqual(trie.match('/'), null);
    });

    tman.test('matches patterns with regexped params correctly 3', function () {
      const node = trie.define('/:type(post|task)/:id([1-9a-z]{6})');

      assert.deepEqual(trie.match('/post/a12345').params, {
        type: 'post',
        id: 'a12345'
      });
      assert.ok(trie.is(trie.match('/post/a12345').node, node));

      assert.deepEqual(trie.match('/task/a12345').params, {
        type: 'task',
        id: 'a12345'
      });
      assert.ok(trie.is(trie.match('/task/a12345').node, node));
    });

    tman.test('matches patterns with regexped params correctly 4', function () {
      const node1 = trie.define('/:type');
      const node2 = trie.define('/:type/:id');

      assert.deepEqual(trie.match('/post').params, {
        type: 'post'
      });
      assert.ok(trie.is(trie.match('/post').node, node1));

      assert.deepEqual(trie.match('/task').params, {
        type: 'task'
      });
      assert.ok(trie.is(trie.match('/task').node, node1));

      assert.deepEqual(trie.match('/post/123456').params, {
        type: 'post',
        id: '123456'
      });
      assert.ok(trie.is(trie.match('/post/123456').node, node2));

      assert.deepEqual(trie.match('/task/123456').params, {
        type: 'task',
        id: '123456'
      });
      assert.ok(trie.is(trie.match('/task/123456').node, node2));
    });

    tman.test('matches patterns with regexped params correctly 5', function () {
      const node1 = trie.define('/:user(user|admin)/:id([1-9]{6})');
      const node2 = trie.define('/:type(post|task)/:id([a-z]{6})');

      assert.deepEqual(trie.match('/post/aaaaaa').params, {
        type: 'post',
        id: 'aaaaaa'
      });
      assert.ok(trie.is(trie.match('/post/aaaaaa').node, node2));

      assert.deepEqual(trie.match('/task/aaaaaa').params, {
        type: 'task',
        id: 'aaaaaa'
      });
      assert.ok(trie.is(trie.match('/task/aaaaaa').node, node2));
      assert.strictEqual(trie.match('/task/111111'), null);

      assert.deepEqual(trie.match('/admin/123456').params, {
        user: 'admin',
        id: '123456'
      });
      assert.ok(trie.is(trie.match('/admin/123456').node, node1));

      assert.deepEqual(trie.match('/user/123456').params, {
        user: 'user',
        id: '123456'
      });
      assert.ok(trie.is(trie.match('/user/123456').node, node1));
      assert.strictEqual(trie.match('/user/aaaaaa'), null);
    });

    tman.test('matches patterns with regexped params correctly 6', function () {
      trie.define('/post/:id([a-z]+)');

      assert.deepEqual(trie.match('/post/abc').params, {
        id: 'abc'
      });
      assert.strictEqual(trie.match('/post/ABC'), null);
      assert.strictEqual(trie.match('/Post/abc'), null);
    });

    tman.test('matches patterns with regexped params correctly 7', function () {
      const node = trie.define('(*)');

      assert.ok(trie.is(trie.match('').node, node));
      assert.ok(trie.is(trie.match('/').node, node));
      assert.ok(trie.is(trie.match('/x').node, node));
      assert.ok(trie.is(trie.match('/x/y/z').node, node));
      assert.deepEqual(trie.match('/post/abc').params, {});
    });

    tman.test('matches patterns with regexped params correctly 8', function () {
      trie.define(':all(*)');

      assert.deepEqual(trie.match('').params, {
        all: ''
      });
      assert.deepEqual(trie.match('/').params, {
        all: ''
      });
      assert.deepEqual(trie.match('/post/abc').params, {
        all: 'post/abc'
      });
    });

    tman.test('matches patterns with regexped params correctly 9', function () {
      const node = trie.define('/:type/:other(*)');

      assert.strictEqual(trie.match('/post'), null);
      assert.ok(trie.is(trie.match('/post/x').node, node));
    });

    tman.test('matches patterns with regexped params correctly 10', function () {
      const node = trie.define('/(post|task)/([1-9a-z]{6})');

      assert.ok(trie.is(trie.match('/post/c1a2t3').node, node));
    });

    tman.test('matches patterns with regexped params correctly 11', function () {
      const node = trie.define('/:type(post|task)/:id([1-9a-z]{6})');
      const match = trie.match('/post/c1a2t3');

      assert.ok(trie.is(match.node, node));
      assert.deepEqual(match.params, {
        type: 'post',
        id: 'c1a2t3'
      });
    });

    tman.test('matches patterns with regexped params correctly 12', function () {
      const node = trie.define('/:type((cat|dog)s?)/:id(\\d+)');
      const match = trie.match('/cat/123');

      assert.ok(trie.is(match.node, node));
      assert.deepEqual(match.params, {
        type: 'cat',
        id: '123'
      });
    });

    tman.test('matches patterns with regexped params correctly 13', function () {
      const node = trie.define('/((post|task)s?)/([\\w\\d]{6})');

      assert.ok(trie.is(trie.match('/post/a12345').node, node));
      assert.deepEqual(trie.match('/post/a12345').params, {});

      assert.ok(trie.is(trie.match('/posts/a12345').node, node));
      assert.deepEqual(trie.match('/posts/a12345').params, {});

      assert.ok(trie.is(trie.match('/task/a12345').node, node));
      assert.deepEqual(trie.match('/task/a12345').params, {});

      assert.ok(trie.is(trie.match('/tasks/a12345').node, node));
      assert.deepEqual(trie.match('/tasks/a12345').params, {});

      assert.strictEqual(trie.match('/event/a12345'), null);
      assert.strictEqual(trie.match('/task/a123456'), null);
      assert.strictEqual(trie.match('/task/a12345/6'), null);
      assert.strictEqual(trie.match('/post'), null);
      assert.strictEqual(trie.match('/'), null);
    });

    tman.test('matches patterns with regexped params correctly 14', function () {
      const node = trie.define('/:type((post|task)s?)/:id([\\w\\d]{6})');

      assert.ok(trie.is(trie.match('/post/a12345').node, node));
      assert.deepEqual(trie.match('/post/a12345').params, {
        type: 'post',
        id: 'a12345'
      });

      assert.ok(trie.is(trie.match('/tasks/a12345').node, node));
      assert.deepEqual(trie.match('/tasks/a12345').params, {
        type: 'tasks',
        id: 'a12345'
      });
    });

    tman.test('matches patterns precisely 1', function () {
      const node = trie.define('/:type/:other(*)');
      trie.define('/:type');
      trie.define('/post');

      assert.notStrictEqual(trie.is(trie.define('/post'), node));
      assert.notStrictEqual(trie.is(trie.define('/:type'), node));
      assert.strictEqual(trie.match('/post/abc'), null);
      assert.deepEqual(trie.match('').params, {
        type: ''
      });
      assert.deepEqual(trie.match('/').params, {
        type: ''
      });
      assert.deepEqual(trie.match('/post').params, {});
      assert.deepEqual(trie.match('/task').params, {
        type: 'task'
      });
      assert.deepEqual(trie.match('/task/abc').params, {
        type: 'task',
        other: 'abc'
      });
      assert.deepEqual(trie.match('/event/x/y/z').params, {
        type: 'event',
        other: 'x/y/z'
      });
    });

    tman.test('matches patterns precisely 2', function () {
      trie.define('/prefix:name/:other(*)');
      trie.define('/test.com::name');
      trie.define('/post');

      assert.strictEqual(trie.match('/prefix'), null);
      assert.deepEqual(trie.match('/prefix/123').params, {
        name: '',
        other: '123'
      });
      assert.deepEqual(trie.match('/prefix123/456').params, {
        name: '123',
        other: '456'
      });
      assert.deepEqual(trie.match('/prefix123/456/789').params, {
        name: '123',
        other: '456/789'
      });

      assert.strictEqual(trie.match('/test.com'), null);
      assert.deepEqual(trie.match('/test.com:').params, {
        name: ''
      });
      assert.deepEqual(trie.match('/test.com:zensh').params, {
        name: 'zensh'
      });
      assert.strictEqual(trie.match('/test.com:zensh/test'), null);
    });
  });
});
