// Mostly inherited from https://github.com/arqex/freezer (by Arqex)

import test from 'tapes';

import { Cursor_FreezerJs as Cursor } from '../../middlewares';

let seed = {
  number: 1,
  object: { z: 0, y: 1, x: [ 'A', 'B' ] },
  array: [ 1, 2, { w: 3 } ],
  null: null,
  undefined: undefined,
  string: 'cats'
};

test('Cursor', function (t) {
  let cursor;

  t.beforeEach(function (t) {
    cursor = new Cursor(seed);

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

    t.test('object element', function (t) {
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

    t.test('with unexistent element', function (t) {
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

  t.skip('listeners', function (t) {
    // TODO

    t.end();
  });
  
  t.end();
});
