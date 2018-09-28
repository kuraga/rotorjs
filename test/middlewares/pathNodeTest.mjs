import tman from 'tman';
import assert from 'assert';

import { PathNode_TinyPathMatcher as PathNode } from '../../middlewares';

function assertMatch(actualResult, expectedPathNode, expectedParameters) {
  assert.strictEqual(Object.prototype.toString.call(actualResult), '[object Array]');
  assert.strictEqual(actualResult.length, 2);
  assert.strictEqual(actualResult[0], expectedPathNode);
  assert.deepEqual(actualResult[1], expectedParameters);
}

tman.mocha();

tman.suite('PathNode', function () {
  let rootPathNode;
  const stringPattern = 'path', regexpPattern = /^(?<id>\w+)$/,
    data1 = 12345, data2 = { data: 12345 };

  tman.beforeEach(function () {
    rootPathNode = new PathNode();
  });

  tman.suite('constructor', function () {
    tman.test('should construct PathNode instance', function () {
      const pathNode = new PathNode();

      assert.ok(pathNode instanceof PathNode);
    });

    tman.suite('pattern argument', function () {
      tman.test('should accept a string', function () {
        const pathNode = new PathNode(stringPattern);

        assert.ok(pathNode instanceof PathNode);
      });

      tman.test('should accept a regexp', function () {
        const pathNode = new PathNode(regexpPattern);

        assert.ok(pathNode instanceof PathNode);
      });

      tman.test('shouldn\'t accept other types', function () {
        assert.throws(function () {
          new PathNode({});
        });
      }, TypeError);
    });

    tman.test('should accept data argument', function () {
      const pathNode = new PathNode(stringPattern, data1);
      assert.ok(pathNode instanceof PathNode);

      const anotherPathNode = new PathNode(stringPattern, data2);
      assert.ok(anotherPathNode instanceof PathNode);
    });
  });

  tman.suite('.pattern', function () {
    tman.test('should return null if pattern hasn\'t been given at construction', function () {
      const pathNode = new PathNode();

      assert.strictEqual(pathNode.pattern, null);
    });

    tman.test('should return pattern given at construction', function () {
      const pathNode1 = new PathNode(stringPattern);
      assert.strictEqual(pathNode1.pattern, stringPattern);

      const pathNode2 = new PathNode(regexpPattern);
      assert.strictEqual(pathNode2.pattern, regexpPattern);
    });
  });

  tman.suite('.data', function () {
    tman.test('should return undefined if data hasn\'t been given at construction', function () {
      const pathNode = new PathNode();

      assert.strictEqual(pathNode.data, undefined);
    });

    tman.test('should return data given at construction', function () {
      const pathNode1 = new PathNode(stringPattern, data1);
      assert.strictEqual(pathNode1.data, data1);

      const pathNode2 = new PathNode(regexpPattern, data2);
      assert.strictEqual(pathNode2.data, data2);
    });
  });

  tman.suite('.parent', function () {
    tman.test('should return null', function () {
      const pathNode = new PathNode();

      assert.strictEqual(pathNode.parent, null);
    });
  });

  tman.suite('.children', function () {
    tman.test('should be empty', function() {
      const pathNode = new PathNode();

      assert.deepEqual(pathNode.children, {});
    });

    // See also .push tests
  });

  tman.suite('.push', function () {
    tman.suite('node argument', function () {
      tman.test('should accept a PathNode with a pattern', function () {
        const pathNode = new PathNode(regexpPattern);

        assert.doesNotThrow(function () {
          rootPathNode.push(pathNode);
        });
      });

      tman.test('shouldn\'t accept a PathNode without a pattern', function () {
        const pathNode = new PathNode();

        assert.throws(function () {
          rootPathNode.push(pathNode);
        }, /can't push/);
      });

      tman.test('shouldn\'t accept a non-PathNode', function () {
        assert.throws(function () {
          rootPathNode.push({});
        }, TypeError);
      });
    });

    tman.test('should add node argument to .children 1', function () {
      const pathNode = new PathNode(regexpPattern);
      rootPathNode.push(pathNode);

      assert.deepStrictEqual(rootPathNode.children, [ pathNode ]);
    });

    tman.test('should add node argument to .children 2', function () {
      const pathNode = new PathNode(stringPattern),
        anotherPathNode = new PathNode(regexpPattern);
      rootPathNode.push(pathNode);
      rootPathNode.push(anotherPathNode);

      assert.deepStrictEqual(rootPathNode.children, [ pathNode, anotherPathNode ]);
    });

    tman.test('should set node.parent', function () {
      const pathNode = new PathNode(regexpPattern);
      rootPathNode.push(pathNode);

      assert.strictEqual(pathNode.parent, rootPathNode);
    });

    tman.test('should return node argument', function() {
      const pathNode = new PathNode(regexpPattern);
      const result = rootPathNode.push(pathNode);

      assert.strictEqual(result, pathNode);
    });
  });

  tman.suite('.match', function () {
    let aboutPathNode, contactsPathNode, smsPathNode, phonePathNode,
      datePathNode, datetimePathNode, commandPathNode, anotherCommandPathNode,
      privatePathNode, privateHelpPathNode, privateUsersPathNode,
      privateUsersUserPathNode, privateUsersUserFriendshipPathNode;

    tman.beforeEach(function () {
      // Root node (rootPathNode) has been defined already

      aboutPathNode = new PathNode('about');
      contactsPathNode = new PathNode(/contacts/i);
      smsPathNode = new PathNode(/^SMS-\d{4}$/);
      phonePathNode = new PathNode(/^[Pp]hone-(?<phoneNumber>\d{2,4})$/);
      datePathNode = new PathNode(/^date_(?<year>\d{2}|\d{4})-(?<month>\d{2})-(?<day>\d{2})$/);
      datetimePathNode = new PathNode(/^datetime_(?<year>\d{2}|\d{4})-(?<month>\d{2})-(?<day>\d{2})(?:_(?<hour>\d{2})-(?<minute>\d{2})-(?<second>\d{2}))?$/);
      commandPathNode = new PathNode(/^command-.*$/);
      anotherCommandPathNode = new PathNode(/^command-.*$/);

      rootPathNode.push(aboutPathNode);
      rootPathNode.push(contactsPathNode);
      rootPathNode.push(smsPathNode);
      rootPathNode.push(phonePathNode);
      rootPathNode.push(datePathNode);
      rootPathNode.push(datetimePathNode);
      rootPathNode.push(commandPathNode);
      rootPathNode.push(anotherCommandPathNode);

      privatePathNode = new PathNode('private');
      privateHelpPathNode = new PathNode('help');
      privateUsersPathNode = new PathNode('users');
      privateUsersUserPathNode = new PathNode(/^(?<userId>\d+?)$/);
      privateUsersUserFriendshipPathNode = new PathNode(/^friendship-(?<anotherUserId>\d+?)$/);

      rootPathNode.push(privatePathNode);
      privatePathNode.push(privateHelpPathNode);
      privatePathNode.push(privateUsersPathNode);
      privateUsersPathNode.push(privateUsersUserPathNode);
      privateUsersUserPathNode.push(privateUsersUserFriendshipPathNode);
    });

    tman.suite('chunks argument', function () {
      tman.test('should accept an empty array', function () {
        assert.doesNotThrow(function () {
          rootPathNode.match([]);
        });
      });

      tman.test('should accept an array of strings', function () {
        assert.doesNotThrow(function () {
          rootPathNode.match([ 'chunk1', 'chunk2' ]);
        });
      });

      tman.test('shouldn\'t accept an array with non-string element', function () {
        assert.throws(function () {
          rootPathNode.match([ 'a', /b/ ]);
        }, TypeError);
      });

      tman.test('shouldn\'t accept non-array', function () {
        assert.throws(function () {
          rootPathNode.match({});
        }, TypeError);
      });
    });

    tman.test('should match root path node', function () {
      let result = rootPathNode.match([]);

      assertMatch(result, rootPathNode, {});
    });

    tman.suite('first level', function () {
      tman.test('should return null on invalid path 1', function () {
        let result = rootPathNode.match([ 'invalid' ]);

        assert.strictEqual(result, null);
      });

      tman.test('should match a string-pattern path node', function () {
        let result = rootPathNode.match([ 'about' ]);

        assertMatch(result, aboutPathNode, {});
      });

      tman.test('should match a regexp-pattern path node 1', function () {
        let result = rootPathNode.match([ 'contacts' ]);

        assertMatch(result, contactsPathNode, {});
      });

      tman.test('should match first correct path node', function () {
        let result = rootPathNode.match([ 'command-phone' ]);

        assertMatch(result, commandPathNode, {});
      });

      tman.test('should match a regexp-pattern path node 2', function () {
        let result = rootPathNode.match([ 'Contacts' ]);

        assertMatch(result, contactsPathNode, {});
      });

      tman.test('should match a regexp-pattern path node 3', function () {
        let result = rootPathNode.match([ 'prefix__contacts__suffix' ]);

        assertMatch(result, contactsPathNode, {});
      });

      tman.test('should match a regexp-pattern path node 4', function () {
        let result = rootPathNode.match([ 'SMS-4242' ]);

        assertMatch(result, smsPathNode, {});
      });

      tman.test('should return null on invalid path 2', function () {
        let result = rootPathNode.match([ 'SMS-424' ]);

        assert.strictEqual(result, null);
      });

      tman.test('should return current parameters 1 (one parameter in path)', function () {
        let result = rootPathNode.match([ 'Phone-4242' ]);

        assertMatch(result, phonePathNode, { 'phoneNumber': '4242' });
      });

      tman.test('should return current parameters 2 (multiple parameters in path)', function () {
        let result = rootPathNode.match([ 'date_2018-09-28' ]);

        assertMatch(result, datePathNode, { 'year': '2018', 'month': '09', 'day': '28' });
      });

      tman.test('should return current parameters 3 (multiple parameters in path, including optional)', function () {
        let result = rootPathNode.match([ 'datetime_2018-09-29_00-12-43' ]);

        assertMatch(result, datetimePathNode, { 'year': '2018', 'month': '09', 'day': '29',
          'hour': '00', 'minute': '12', 'second': '43' });
      });

      tman.test('should return current parameters 3 (multiple parameters in path, excluding optional)', function () {
        let result = rootPathNode.match([ 'datetime_2018-09-29' ]);

        assertMatch(result, datetimePathNode, { 'year': '2018', 'month': '09', 'day': '29',
          'hour': undefined, 'minute': undefined, 'second': undefined });
      });

      tman.test('should return null on invalid path 3', function () {
        let result = rootPathNode.match([ 'datetime_2018-09-29_00-12' ]);

        assert.strictEqual(result, null);
      });
    });

    tman.suite('nested levels', function () {
      tman.test('should return null on invalid path 4 (last chunk is not a child of first chunk)', function () {
        let result = rootPathNode.match([ 'about', 'invalid' ]);

        assert.strictEqual(result, null);
      });

      tman.test('should return null on invalid path 5 (last chunk is not a child of first chunk)', function () {
        let result = rootPathNode.match([ 'private', 'invalid' ]);

        assert.strictEqual(result, null);
      });

      tman.test('should return null on invalid path 6 (part of path is incorrect)', function () {
        let result = rootPathNode.match([ 'privat', 'users' ]);

        assert.strictEqual(result, null);
      });

      tman.test('should return null on invalid path 7 (part of path is incorrect)', function () {
        let result = rootPathNode.match([ 'private', 'users', 'NaN', 'friendship-34' ]);

        assert.strictEqual(result, null);
      });

      tman.test('should match a string-pattern/string-pattern path node', function () {
        let result = rootPathNode.match([ 'private', 'help' ]);

        assertMatch(result, privateHelpPathNode, {});
      });

      tman.test('should match a string/string-pattern path node', function () {
        let result = rootPathNode.match([ 'private', 'help' ]);

        assertMatch(result, privateHelpPathNode, {});
      });

      tman.test('should match a string/string/regexp/regexp-pattern path node', function () {
        let result = rootPathNode.match([ 'private', 'users', '12', 'friendship-34' ]);

        assertMatch(result, privateUsersUserFriendshipPathNode, { 'userId': '12', 'anotherUserId': '34' });
      });
    });

    tman.test('should also work on a non-root path node', function () {
      let result = privatePathNode.match([ 'users', '12', 'friendship-34' ]);

      assertMatch(result, privateUsersUserFriendshipPathNode, { 'userId': '12', 'anotherUserId': '34' });
    });
  });
});
