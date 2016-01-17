// Mostly inherited from https://github.com/arqex/freezer (by Arqex)

import test from 'tapes';
import sinon from 'sinon';
import raf from 'raf';

import { Cursor_FreezerJs as Cursor } from '../../middlewares';

let seed = {
  number: 1,
  object: { z: 0, y: 1, x: [ 'A', 'B' ] },
  array: [ 1, 2, { w: 3 } ],
  null: null,
  undefined: undefined,
  string: 'cats'
};

let sandbox;

test('Cursor', function (t) {
  let cursor;

  t.beforeEach(function (t) {
    sandbox = sinon.sandbox.create();
    cursor = new Cursor(seed);

    t.end();
  });

  t.afterEach(function (t) {
    sandbox.restore();

    t.end();
  });

  t.test('constructor', function (t) {
    t.test('construct an instance of Cursor', function (t) {
      t.assert(cursor instanceof Cursor);

      t.end();
    });

    t.end();
  });

  t.test('.get', function (t) {
    t.test('should return actual data', function (t) {
      let data = cursor.get();

      t.deepEqual(data, seed);

      t.end();
    });

    t.end();
  });

  t.test('.set', function (t) {
    let data;

    t.beforeEach(function (t) {
      data = cursor.get();

      t.end();
    });

    t.test('should return updated object', function (t) {
      let result = data.set('a', 9);
      let updated = cursor.get();

      t.is(result, updated);

      t.end();
    });

    t.test('with object argument', function (t) {
      t.test('should update values', function (t) {
        data.set({
          number: { b: 1 },
          null: 123
        });

        let updated = cursor.get();

        t.deepEqual(updated.number, { b: 1 });
        t.deepEqual(updated.null, 123);

        t.end();
      });

      t.test('shouldn\'t modify argument', function (t) {
        let values = {
          number: { b: 1 },
          null: 123
        },
        valuesCopy = {
          number: { b: 1 },
          null: 123
        };

        data.set(values);

        t.deepEqual(values, valuesCopy);

        t.end();
      });

      t.end();
    });

    t.test('with key and value arguments', function (t) {
      t.test('should update value', function (t) {
        data.set('object', { b: 1 });

        let updated = cursor.get();

        t.deepEqual(updated.object, { b: 1 });

        t.end();
      });

      t.test('shouldn\'t modify argument', function (t) {
        let value = { b: 1 },
          valueCopy = { b: 1 };

        data.set('object', value);

        t.deepEqual(value, valueCopy);

        t.end();
      });

      t.end();
    });

    t.test('called on object element', function (t) {
      t.test('should return object called on', function (t) {
        let result = data.object.set('z', 9);
        let updated = cursor.get().object;

        t.is(result, updated);

        t.end();
      });

      t.test('should update value', function (t) {
        data.object.set('z', 'dogs');

        let updated = cursor.get();

        t.deepEqual(updated.object.z, 'dogs');

        t.end();
      });

      t.end();
    });

    t.test('called on array', function (t) {
      t.test('should update value', function (t) {
        data.array.set(0, 3);

        let updated = cursor.get();

        t.is(updated.array[0], 3);

        t.end();
      });

      t.end();
    });

    for (let newUpdatedValueType of Object.keys(seed)) {
      t.test('set new ' + newUpdatedValueType + ' value', function (t) {
        t.test('should set value', function (t) {
          data.set('newValue', seed[newUpdatedValueType]);

          let updated = cursor.get();

          t.deepEqual(updated.newValue, seed[newUpdatedValueType]);

          t.end();
        });

        t.test('should not modify other values', function (t) {
          data.set('newValue', seed[newUpdatedValueType]);

          let updated = cursor.get();

          for (let key of Object.keys(seed)) {
            if (key !== 'newValue') {
              t.deepEqual(updated[key], seed[key]);
            }
          }

          t.end();
        });

        t.end();
      });

      for (let firstValueType of Object.keys(seed)) {
        t.test('update ' + firstValueType + ' value to ' + newUpdatedValueType + ' value', function (t) {
          t.test('should update value', function (t) {
            data.set(firstValueType, seed[newUpdatedValueType]);

            let updated = cursor.get();

            t.deepEqual(updated[firstValueType], seed[newUpdatedValueType]);

            t.end();
          });

          t.test('should not modify other values', function (t) {
            data.set(firstValueType, seed[newUpdatedValueType]);

            let updated = cursor.get();

            for (let key of Object.keys(seed)) {
              if (key !== firstValueType) {
                t.deepEqual(updated[key], seed[key]);
              }
            }

            t.end();
          });

          t.end();
        });
      }
    }

    t.test('supports chaining calls', function (t) {
      let chained = data.set('a', 9)
        .set('b', 0)
        .set({ c: [2, 3, 4] });
      let updated = cursor.get();

      t.is(chained, updated);

      t.end();
    });

    t.test('with existing node as value', function (t) {
      t.test('should update value', function (t) {
        data.set('a', data.object);

        let updated = cursor.get();

        t.is(data.object, updated.a);

        t.end();
      });

      t.test('should update value but with reference', function (t) {
        data.set('a', data.object);
        data.object.set('z', 2);

        let updated = cursor.get();

        t.is(updated.object, updated.a);
        t.is(updated.a.z, 2);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.remove', function (t) {
    let data;

    t.beforeEach(function (t) {
      data = cursor.get();

      t.end();
    });

    t.test('should return updated object', function (t) {
      let result = data.remove('number');
      let updated = cursor.get();

      t.is(result, updated);

      t.end();
    });

    t.test('should remove element', function(t) {
      data.remove('number');

      let updated = cursor.get();

      t.assert(!updated.hasOwnProperty('number'));
      t.is(updated.number, undefined);

      t.end();
    });

    t.test('should not modify other values', function (t) {
      data.remove('number');

      let updated = cursor.get();

      for (let key of Object.keys(seed)) {
        if (key !== 'number') {
          t.deepEqual(updated[key], seed[key]);
        }
      }

      t.end();
    });

    t.test('with object element', function (t) {
      t.test('should return updated object', function (t) {
        let result = data.object.remove('z');
        let updated = cursor.get().object;

        t.is(result, updated);

        t.end();
      });

      t.test('should remove element', function(t) {
        data.object.remove('z');

        let updated = cursor.get();

        t.assert(!updated.object.hasOwnProperty('z'));
        t.is(updated.object.z, undefined);

        t.end();
      });

      t.test('should not modify other values', function (t) {
        data.object.remove('z');

        let updated = cursor.get();

        for (let key of Object.keys(seed)) {
          if (key !== 'number') {
            t.deepEqual(updated.object[key], seed.object[key]);
          }
        }

        t.end();
      });

      t.end();
    });

    t.test('with non-existent element', function (t) {
      t.test('should return object called on', function (t) {
        let result = data.object.remove('unreal');

        t.is(result, data.object);

        t.end();
      });

      t.test('should not modify any value', function (t) {
        data.object.remove('unreal');

        let updated = cursor.get();

        for (let key of Object.keys(seed)) {
          t.deepEqual(updated.object[key], seed.object[key]);
        }

        t.end();
      });

      t.end();
    });

    t.test('with array of keys', function (t) {
      t.test('should return updated object', function (t) {
        let result = data.remove(['number', 'string']);
        let updated = cursor.get();

        t.is(result, updated);

        t.end();
      });

      t.test('should remove elements', function(t) {
        data.remove(['number', 'string']);

        let updated = cursor.get();

        t.assert(!updated.hasOwnProperty('number'));
        t.is(updated.number, undefined);
        t.assert(!updated.hasOwnProperty('string'));
        t.is(updated.string, undefined);

        t.end();
      });

      t.test('should not modify other values', function (t) {
        data.remove(['number', 'string']);

        let updated = cursor.get();

        for (let key of Object.keys(seed)) {
          if (key !== 'number' && key !== 'string') {
            t.deepEqual(updated[key], seed[key]);
          }
        }

        t.end();
      });

      t.end();
    });

    t.test('references to other values', function (t) {
      t.test('should remove element', function(t) {
        data.set('a', data.object);
        let updated = cursor.get();

        updated.remove('object');
        let newUpdated = cursor.get();

        t.assert(!newUpdated.hasOwnProperty('object'));
        t.is(newUpdated.object, undefined);

        t.end();
      });

      t.test('should preserve duplicates', function (t) {
        data.set('a', data.object);
        let updated = cursor.get();

        updated.remove('object');
        let newUpdated = cursor.get();

        t.is(newUpdated.a, data.object);

        t.end();
      });

      t.test('should not preserve duplicates since all have been deleted', function (t) {
        data.set('a', data.object);
        let updated = cursor.get();

        updated.remove(['object', 'a']);
        let newUpdated = cursor.get();

        t.assert(!newUpdated.hasOwnProperty('object'));
        t.is(newUpdated.object, undefined);
        t.assert(!newUpdated.hasOwnProperty('a'));
        t.is(newUpdated.a, undefined);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('after .remove', function (t) {
    t.test('removed object element can\'t update data', function (t) {
      let data = cursor.get();
      let object = data.object;

      data.remove('object');

      let updated = cursor.get();
      object.set('z', 2);

      let newUpdated = cursor.get();

      t.is(newUpdated, updated);

      t.end();
    });

    t.end();
  });

  t.test('listeners', function (t) {
    let cursor, data,
      callback, callbackSpy, anotherCallback, anotherCallbackSpy;

    t.beforeEach(function (t) {
      cursor = new Cursor(seed);
      data = cursor.get();
      callback = function (data) {};  // eslint-disable-line no-unused-vars
      callbackSpy = sandbox.spy(callback);
      anotherCallback = function (data) {};  // eslint-disable-line no-unused-vars
      anotherCallbackSpy = sandbox.spy(anotherCallback);

      t.end();
    });

    t.test('.subscribe', function (t) {
      t.test('should do something', function (t) {
        t.doesNotThrow(function () {
          cursor.subscribe(callback);
        });

        t.end();
      });

      t.test('should subscribe a callback', function (t) {
        cursor.subscribe(callbackSpy);
        callbackSpy.reset();

        data.object.set('a', 2);

        raf(function () {
          t.assert(callbackSpy.calledOnce);

          t.end();
        });
      });

      t.test('should subscribe several callbacks', function (t) {
        cursor.subscribe(callbackSpy);
        cursor.subscribe(anotherCallbackSpy);
        callbackSpy.reset();
        anotherCallbackSpy.reset();

        data.object.set('a', 2);

        raf(function () {
          t.assert(callbackSpy.calledOnce);
          t.assert(anotherCallbackSpy.calledOnce);

          t.end();
        });
      });

      t.test('should trigger callbacks after...', function (t) {
        t.test('setting property', function (t) {
          t.test('on root', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.is(data.a, 1);
              t.is(cursor.get().a, 1);

              t.end();
            });

            data.set('a', 1);
          });

          t.test('on object element', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.is(data.object.a, 1);
              t.is(cursor.get().object.a, 1);

              t.end();
            });

            data.object.set('a', 1);
          });

          t.test('on array element', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.is(data.array[3], 1);
              t.is(cursor.get().array[3], 1);

              t.end();
            });

            data.array.set(3, 1);
          });

          t.end();
        });

        t.test('updating property', function (t) {
          t.test('on root', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.is(data.number, 2);
              t.is(cursor.get().number, 2);

              t.end();
            });

            data.set('number', 2);
          });

          t.test('on object element', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.is(data.object.z, 2);
              t.is(cursor.get().object.z, 2);

              t.end();
            });

            data.object.set('z', 2);
          });

          t.test('on array element', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.is(data.array[0], 2);
              t.is(cursor.get().array[0], 2);

              t.end();
            });

            data.array.set(0, 2);
          });

          t.end();
        });

        t.test('removing property', function (t) {
          t.test('on root', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.assert(!data.hasOwnProperty('number'));
              t.assert(!data.hasOwnProperty('number'));

              t.end();
            });

            data.remove('number');
          });

          t.test('on object element', function (t) {
            cursor.subscribe(function (data) {
              t.pass();
              t.assert(!data.object.hasOwnProperty('z'));
              t.assert(!data.object.hasOwnProperty('z'));

              t.end();
            });

            data.object.remove('z');
          });

          t.end();
        });

        t.end();
      });

      t.test('should not trigger callback on .remove with non-existant property', function (t) {
        cursor.subscribe(callbackSpy);
        callbackSpy.reset();

        data.remove('wrongProperty');

        raf(function () {
          t.assert(callbackSpy.notCalled);

          t.end();
        });
      });

      t.test('should not trigger callback on non-updating .set', function (t) {
        cursor.subscribe(callbackSpy);
        callbackSpy.reset();

        data.object.set('a', 2);

        raf(function () {
          callbackSpy.reset();
          cursor.get().object.set('a', 2);

          raf(function () {
            t.assert(callbackSpy.notCalled);

            t.end();
          });
        });
      });

      // TODO: Doesn't work (for Freezer) due to https://github.com/arqex/freezer/pull/67
      t.skip('should not trigger callback if it has been subscribed after .set call', function (t) {
        callbackSpy.reset();

        data.object.set('a', 2);

        cursor.subscribe(callbackSpy);

        raf(function () {
          t.assert(callbackSpy.notCalled);

          t.end();
        });
      });

      t.test('should trigger callback after all changes', function (t) {
        t.test('updating by an object', function (t) {
          cursor.subscribe(function (data) {
            t.pass();
            t.is(data.object.a, 2);
            t.is(cursor.get().object.a, 2);
            t.is(data.object.b, 3);
            t.is(cursor.get().object.b, 3);

            t.end();
          });

          data.object.set({
            a: 2,
            b: 3
          });
        });

        t.test('updating by chaining calls', function (t) {
          cursor.subscribe(function (data) {
            t.pass();
            t.is(data.object.a, 2);
            t.is(cursor.get().object.a, 2);
            t.is(data.object.b, 3);
            t.is(cursor.get().object.b, 3);

            t.end();
          });

          data.object.set('a', 2)
            .set('b', 3);
        });

        t.end();
      });

      t.end();
    });

    t.test('.unsubscribe', function (t) {
      t.test('with subscribed callback', function (t) {
        t.beforeEach(function (t) {
          cursor.subscribe(callbackSpy);

          t.end();
        });

        t.test('should do something', function (t) {
          t.doesNotThrow(function () {
            cursor.unsubscribe(callbackSpy);
          });

          t.end();
        });

        t.test('should unsubscribe callback', function (t) {
          cursor.unsubscribe(callbackSpy);
          callbackSpy.reset();

          data.object.set('a', 2);

          raf(function () {
            t.assert(callbackSpy.notCalled);

            t.end();
          });
        });

        t.test('should not unsubscribe other callbacks', function (t) {
          cursor.subscribe(anotherCallbackSpy);

          cursor.unsubscribe(callbackSpy);

          callbackSpy.reset();

          data.object.set('a', 2);

          raf(function () {
            t.assert(callbackSpy.notCalled);
            t.assert(anotherCallbackSpy.calledOnce);

            t.end();
          });
        });

        t.end();
      });

      t.end();
    });

    t.test('.trigger', function (t) {
      t.test('should do something', function (t) {
        t.doesNotThrow(function () {
          cursor.trigger();
        });

        t.end();
      });

      t.test('should trigger callbacks', function (t) {
        cursor.subscribe(callbackSpy);
        cursor.subscribe(anotherCallbackSpy);
        callbackSpy.reset();
        anotherCallbackSpy.reset();

        cursor.trigger();

        raf(function () {
          t.assert(callbackSpy.calledOnce);
          t.assert(anotherCallbackSpy.calledOnce);

          t.end();
        });
      });

      // TODO: t.end() called twice (with Freezer) due to https://github.com/arqex/freezer/pull/67
      t.skip('should trigger callback with current state', function (t) {
        data.object.set('a', 2);

        cursor.subscribe(function (data) {
          t.pass();
          t.is(data.object.a, 2);
          t.is(cursor.get().object.a, 2);

          t.end();
        });

        cursor.trigger();
      });

      t.end();
    });

    t.end();
  });
  
  t.end();
});
