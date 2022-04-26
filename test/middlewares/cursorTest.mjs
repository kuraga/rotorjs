// Mostly inherited from https://github.com/arqex/freezer (by Arqex)

import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';
import rafRaf from '../helpers/rafRaf.mjs';
import { pass } from '../helpers/assertions.mjs';

import { Cursor_FreezerJs as Cursor } from '../../middlewares.mjs';

const seed = {
  number: 1,
  object: { z: 0, y: 1, x: [ 'A', 'B' ] },
  array: [ 1, 2, { w: 3 } ],
  null: null,
  undefined: undefined,
  string: 'cats'
};
const sample = {
  number: -1,
  object: { c: 1, b: -1, a: [ 'Y', 'Z' ] },
  array: [ -1, -2, { e: -3 } ],
  null: null,
  undefined: undefined,
  string: 'dogs'
};

tman.mocha();

tman.suite('Cursor', function () {
  let cursor;

  tman.beforeEach(function () {
    cursor = new Cursor(seed);
  });

  tman.afterEach(function () {
    sinon.restore();
  });

  tman.suite('constructor', function () {
    tman.test('construct an instance of Cursor', function () {
      assert.ok(cursor instanceof Cursor);
    });
  });

  tman.suite('.get', function () {
    tman.test('should return actual state', function () {
      const state = cursor.get();

      assert.deepEqual(state, seed);
    });
  });

  tman.suite('.set', function () {
    let state;

    tman.beforeEach(function () {
      state = cursor.get();
    });

    tman.test('should return updated object', function () {
      const result = state.set('a', 9);
      const updated = cursor.get();

      assert.strictEqual(result, updated);
    });

    tman.suite('with object argument', function () {
      tman.test('should update values', function () {
        state.set({
          number: { b: 1 },
          null: 123
        });

        const updated = cursor.get();

        assert.deepEqual(updated.number, { b: 1 });
        assert.deepEqual(updated.null, 123);
      });

      tman.test('shouldn\'t modify argument', function () {
        const values = {
          number: { b: 1 },
          null: 123
        },
        valuesCopy = {
          number: { b: 1 },
          null: 123
        };

        state.set(values);

        assert.deepEqual(values, valuesCopy);
      });
    });

    tman.suite('with key and value arguments', function () {
      tman.test('should update value', function () {
        state.set('object', { b: 1 });

        const updated = cursor.get();

        assert.deepEqual(updated.object, { b: 1 });
      });

      tman.test('shouldn\'t modify argument', function () {
        const value = { b: 1 },
          valueCopy = { b: 1 };

        state.set('object', value);

        assert.deepEqual(value, valueCopy);
      });
    });

    tman.suite('called on object element', function () {
      tman.test('should return object called on', function () {
        const result = state.object.set('z', 9);
        const updated = cursor.get().object;

        assert.strictEqual(result, updated);
      });

      tman.test('should update value', function () {
        state.object.set('z', 'dogs');

        const updated = cursor.get();

        assert.deepEqual(updated.object.z, 'dogs');
      });
    });

    tman.suite('called on array', function () {
      tman.test('should update value', function () {
        state.array.set(0, 3);

        const updated = cursor.get();

        assert.strictEqual(updated.array[0], 3);
      });
    });

    for (const newUpdatedValueType of Object.keys(sample)) {
      tman.suite(`set new ${newUpdatedValueType} value`, function () {
        tman.test('should set value', function () {
          state.set('newValue', sample[newUpdatedValueType]);

          const updated = cursor.get();

          assert.deepEqual(updated.newValue, sample[newUpdatedValueType]);
        });

        tman.test('should not modify other values', function () {
          state.set('newValue', sample[newUpdatedValueType]);

          const updated = cursor.get();

          for (const key of Object.keys(sample)) {
            if (key !== 'newValue') {
              assert.deepEqual(updated[key], seed[key]);
            }
          }
        });
      });

      for (const firstValueType of Object.keys(sample)) {
        tman.suite(`update ${firstValueType} value to ${newUpdatedValueType} value`, function () {
          tman.test('should update value', function () {
            state.set(firstValueType, sample[newUpdatedValueType]);

            const updated = cursor.get();

            assert.deepEqual(updated[firstValueType], sample[newUpdatedValueType]);
          });

          tman.test('should not modify other values', function () {
            state.set(firstValueType, sample[newUpdatedValueType]);

            const updated = cursor.get();

            for (const key of Object.keys(sample)) {
              if (key !== firstValueType) {
                assert.deepEqual(updated[key], seed[key]);
              }
            }
          });
        });
      }
    }

    tman.test('supports chaining calls', function () {
      const chained = state.set('a', 9)
        .set('b', 0)
        .set({ c: [2, 3, 4] });
      const updated = cursor.get();

      assert.strictEqual(chained, updated);
    });

    tman.suite('with existing node as value', function () {
      tman.test('should update value', function () {
        state.set('a', state.object);

        const updated = cursor.get();

        assert.strictEqual(state.object, updated.a);
      });

      tman.test('should update value but with reference', function () {
        state.set('a', state.object);
        state.object.set('z', 2);

        const updated = cursor.get();

        assert.strictEqual(updated.object, updated.a);
        assert.strictEqual(updated.a.z, 2);
      });
    });
  });

  tman.suite('.remove', function () {
    let state;

    tman.beforeEach(function () {
      state = cursor.get();
    });

    tman.test('should return updated object', function () {
      const result = state.remove('number');
      const updated = cursor.get();

      assert.strictEqual(result, updated);
    });

    tman.test('should remove element', function() {
      state.remove('number');

      const updated = cursor.get();

      assert.ok(!('number' in updated));
      assert.strictEqual(updated.number, undefined);
    });

    tman.test('should not modify other values', function () {
      state.remove('number');

      const updated = cursor.get();

      for (const key of Object.keys(sample)) {
        if (key !== 'number') {
          assert.deepEqual(updated[key], seed[key]);
        }
      }
    });

    tman.suite('with object element', function () {
      tman.test('should return updated object', function () {
        const result = state.object.remove('z');
        const updated = cursor.get().object;

        assert.strictEqual(result, updated);
      });

      tman.test('should remove element', function() {
        state.object.remove('z');

        const updated = cursor.get();

        assert.ok(!('z' in updated.object));
        assert.strictEqual(updated.object.z, undefined);
      });

      tman.test('should not modify other values', function () {
        state.object.remove('z');

        const updated = cursor.get();

        for (const key of Object.keys(sample)) {
          if (key !== 'number') {
            assert.deepEqual(updated.object[key], sample.object[key]);
          }
        }
      });
    });

    tman.suite('with non-existent element', function () {
      tman.test('should return object called on', function () {
        const result = state.object.remove('unreal');

        assert.strictEqual(result, state.object);
      });

      tman.test('should not modify any value', function () {
        state.object.remove('unreal');

        const updated = cursor.get();

        for (const key of Object.keys(sample)) {
          assert.deepEqual(updated.object[key], sample.object[key]);
        }
      });
    });

    tman.suite('with array of keys', function () {
      tman.test('should return updated object', function () {
        const result = state.remove(['number', 'string']);
        const updated = cursor.get();

        assert.strictEqual(result, updated);
      });

      tman.test('should remove elements', function() {
        state.remove(['number', 'string']);

        const updated = cursor.get();

        assert.ok(!('number' in updated));
        assert.strictEqual(updated.number, undefined);
        assert.ok(!('string' in updated));
        assert.strictEqual(updated.string, undefined);
      });

      tman.test('should not modify other values', function () {
        state.remove(['number', 'string']);

        const updated = cursor.get();

        for (const key of Object.keys(sample)) {
          if (key !== 'number' && key !== 'string') {
            assert.deepEqual(updated[key], seed[key]);
          }
        }
      });
    });

    tman.suite('references to other values', function () {
      tman.test('should remove element', function() {
        state.set('a', state.object);
        const updated = cursor.get();

        updated.remove('object');
        const newUpdated = cursor.get();

        assert.ok(!('object' in newUpdated));
        assert.strictEqual(newUpdated.object, undefined);
      });

      tman.test('should preserve duplicates', function () {
        state.set('a', state.object);
        const updated = cursor.get();

        updated.remove('object');
        const newUpdated = cursor.get();

        assert.strictEqual(newUpdated.a, state.object);
      });

      tman.test('should not preserve duplicates since all have been deconsted', function () {
        state.set('a', state.object);
        const updated = cursor.get();

        updated.remove(['object', 'a']);
        const newUpdated = cursor.get();

        assert.ok(!('object' in newUpdated));
        assert.strictEqual(newUpdated.object, undefined);
        assert.ok(!('a' in newUpdated));
        assert.strictEqual(newUpdated.a, undefined);
      });
    });
  });

  tman.suite('after .remove', function () {
    tman.test('removed object element can\'t update state', function () {
      const state = cursor.get();
      const object = state.object;

      state.remove('object');

      const updated = cursor.get();
      object.set('z', 2);

      const newUpdated = cursor.get();

      assert.strictEqual(newUpdated, updated);
    });
  });

  tman.suite('listeners', function () {
    let cursor, state,
      callback, callbackSpy, anotherCallback, anotherCallbackSpy;

    tman.beforeEach(function () {
      cursor = new Cursor(seed);
      state = cursor.get();
      callback = function (state) {};  // eslint-disable-line no-unused-vars
      callbackSpy = sinon.spy(callback);
      anotherCallback = function (state) {};  // eslint-disable-line no-unused-vars
      anotherCallbackSpy = sinon.spy(anotherCallback);
    });

    tman.suite('.subscribe', function () {
      tman.test('should do something', function () {
        assert.doesNotThrow(function () {
          cursor.subscribe(callback);
        });
      });

      tman.test('should subscribe a callback', function (done) {
        cursor.subscribe(callbackSpy);
        callbackSpy.resetHistory();

        state.object.set('a', 2);

        rafRaf(() => {
          assert.ok(callbackSpy.calledOnce);

          done();
        });
      });

      tman.test('should subscribe several callbacks', function (done) {
        cursor.subscribe(callbackSpy);
        cursor.subscribe(anotherCallbackSpy);
        callbackSpy.resetHistory();
        anotherCallbackSpy.resetHistory();

        state.object.set('a', 2);

        rafRaf(() => {
          assert.ok(callbackSpy.calledOnce);
          assert.ok(anotherCallbackSpy.calledOnce);

          done();
        });
      });

      tman.suite('should trigger callbacks after...', function () {
        tman.suite('setting property', function () {
          tman.test('on root', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.strictEqual(state.a, 1);
              assert.strictEqual(cursor.get().a, 1);

              done();
            });

            state.set('a', 1);
          });

          tman.test('on object element', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.strictEqual(state.object.a, 1);
              assert.strictEqual(cursor.get().object.a, 1);

              done();
            });

            state.object.set('a', 1);
          });

          tman.test('on array element', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.strictEqual(state.array[3], 1);
              assert.strictEqual(cursor.get().array[3], 1);

              done();
            });

            state.array.set(3, 1);
          });
        });

        tman.suite('updating property', function () {
          tman.test('on root', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.strictEqual(state.number, 2);
              assert.strictEqual(cursor.get().number, 2);

              done();
            });

            state.set('number', 2);
          });

          tman.test('on object element', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.strictEqual(state.object.z, 2);
              assert.strictEqual(cursor.get().object.z, 2);

              done();
            });

            state.object.set('z', 2);
          });

          tman.test('on array element', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.strictEqual(state.array[0], 2);
              assert.strictEqual(cursor.get().array[0], 2);

              done();
            });

            state.array.set(0, 2);
          });
        });

        tman.suite('removing property', function () {
          tman.test('on root', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.ok(!('number' in state));
              assert.strictEqual(state.number, undefined);

              done();
            });

            state.remove('number');
          });

          tman.test('on object element', function (done) {
            cursor.subscribe(function (state) {
              pass();
              assert.ok(!('z' in state.object));
              assert.strictEqual(state.object.z, undefined);

              done();
            });

            state.object.remove('z');
          });
        });
      });

      tman.test('should not trigger callback on .remove with non-existant property', function (done) {
        cursor.subscribe(callbackSpy);
        callbackSpy.resetHistory();

        state.remove('wrongProperty');

        rafRaf(() => {
          assert.ok(callbackSpy.notCalled);

          done();
        });
      });

      tman.test('should not trigger callback on non-updating .set', function (done) {
        cursor.subscribe(callbackSpy);
        callbackSpy.resetHistory();

        state.set('number', 1);

        rafRaf(() => {
          assert.ok(callbackSpy.notCalled);

          done();
        });
      });

      // TODO: Doesn't work (for Freezer) due to https://github.com/arqex/freezer/issues/85
      tman.it.skip('should not trigger callback if it has been subscribed after .set call', function (done) {
        callbackSpy.resetHistory();

        state.object.set('a', 2);

        cursor.subscribe(callbackSpy);

        rafRaf(() => {
          assert.ok(callbackSpy.notCalled);

          done();
        });
      });

      tman.test('should trigger callback after all changes', function () {
        tman.test('updating by an object', function (done) {
          cursor.subscribe(function (state) {
            pass();
            assert.strictEqual(state.object.a, 2);
            assert.strictEqual(cursor.get().object.a, 2);
            assert.strictEqual(state.object.b, 3);
            assert.strictEqual(cursor.get().object.b, 3);

            done();
          });

          state.object.set({
            a: 2,
            b: 3
          });
        });

        tman.test('updating by chaining calls', function (done) {
          cursor.subscribe(function (state) {
            pass();
            assert.strictEqual(state.object.a, 2);
            assert.strictEqual(cursor.get().object.a, 2);
            assert.strictEqual(state.object.b, 3);
            assert.strictEqual(cursor.get().object.b, 3);

            done();
          });

          state.object.set('a', 2)
            .set('b', 3);
        });
      });
    });

    tman.suite('.unsubscribe', function () {
      tman.suite('with subscribed callback', function () {
        tman.beforeEach(function () {
          cursor.subscribe(callbackSpy);
        });

        tman.test('should do something', function () {
          assert.doesNotThrow(function () {
            cursor.unsubscribe(callbackSpy);
          });
        });

        tman.test('should unsubscribe callback', function (done) {
          cursor.unsubscribe(callbackSpy);
          callbackSpy.resetHistory();

          state.object.set('a', 2);

          rafRaf(() => {
            assert.ok(callbackSpy.notCalled);

            done();
          });
        });

        tman.test('should not unsubscribe other callbacks', function (done) {
          cursor.subscribe(anotherCallbackSpy);

          cursor.unsubscribe(callbackSpy);

          callbackSpy.resetHistory();

          state.object.set('a', 2);

          rafRaf(() => {
            assert.ok(callbackSpy.notCalled);
            assert.ok(anotherCallbackSpy.calledOnce);

            done();
          });
        });
      });
    });

    tman.suite('.triggerUpdate', function () {
      tman.test('should do something', function () {
        assert.doesNotThrow(function () {
          cursor.triggerUpdate();
        });
      });

      tman.test('should trigger callbacks', function (done) {
        cursor.subscribe(callbackSpy);
        cursor.subscribe(anotherCallbackSpy);
        callbackSpy.resetHistory();
        anotherCallbackSpy.resetHistory();

        cursor.triggerUpdate();

        rafRaf(() => {
          assert.ok(callbackSpy.calledOnce);
          assert.ok(anotherCallbackSpy.calledOnce);

          done();
        });
      });

      // TODO: done() called twice (with Freezer) due to https://github.com/arqex/freezer/issues/85
      tman.it.skip('should trigger callback with current state', function (done) {
        state.object.set('a', 2);

        cursor.subscribe(function (state) {
          pass();
          assert.strictEqual(state.object.a, 2);
          assert.strictEqual(cursor.get().object.a, 2);

          done();
        });

        cursor.triggerUpdate();
      });
    });
  });
});
