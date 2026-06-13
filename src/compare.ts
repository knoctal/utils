const specialClasses = [URLSearchParams, FormData] as const;

/**
 * @description Provides methods
 * for performing deep comparisons between two values. The method checks for equality by recursively comparing the
 * structure and content of the values.
 *
 * Supported types include:
 * - Primitive types (string, number, boolean, null, undefined)
 * - Arrays
 * - Objects
 * - URLSearchParams
 * - FormData
 * - Map
 * - Set
 * @author najmiter
 */
export class Compare {
  /**
   * @param flana any object to compare
   * @param dheenga any object to compare
   * @returns {boolean} `true` if the objects are deeply equal, `false` otherwise
   * @description This function performs a deep comparison between two values to determine if they are equivalent.
   * It handles various data types, including arrays, objects, and special classes like URLSearchParams, FormData, Map, and Set.
   * The function recursively compares the structure and content of the values to ensure they are deeply equal.
   * @example
   * const obj1 = { a: 1, b: { c: 2 } };
   * const obj2 = { a: 1, b: { c: 2 } };
   * console.log(Compare.deepCompare(obj1, obj2)); // true
   */
  static deepCompare(flana: any, dheenga: any): boolean {
    if (Array.isArray(flana)) {
      if (!Array.isArray(dheenga)) return false;
      if (flana.length !== dheenga.length) return false;

      for (const [i, el] of flana.entries()) {
        if (!Compare.deepCompare(el, dheenga[i])) {
          return false;
        }
      }
    } else if (typeof flana === 'object' && typeof dheenga === 'object') {
      // bcz javascript
      if (flana === null || dheenga === null) {
        return dheenga === null && flana === null;
      }

      for (const Class of specialClasses) {
        if (flana instanceof Class) {
          if (dheenga instanceof Class) {
            return Compare.deepCompare(Object.fromEntries(flana.entries()), Object.fromEntries(dheenga.entries()));
          } else {
            return false;
          }
        }
      }

      const flania = Object.entries(flana);
      const dheengia = Object.entries(dheenga);
      if (flania.length !== dheengia.length) return false;

      for (const [flaniKey, flaniValue] of flania) {
        if (!(flaniKey in dheenga)) return false; // wo bt e ni

        const dheengiValue = dheenga[flaniKey];
        if (!Compare.deepCompare(flaniValue, dheengiValue)) {
          return false;
        }
      }
    } else {
      return flana === dheenga;
    }
    return true; // pass
  }

  /**
   * @param obj any object to check
   * @returns {SubsetManager} an instance of SubsetManager for the provided object
   * @description This method initializes a SubsetManager with the given object, allowing you to check if it is a subset of another object.
   * The SubsetManager provides a method `subsetOf` that can be used to compare the initialized object against another object to determine if it is a subset.
   * @example
   * const obj1 = { a: 1, b: 2 };
   * const obj2 = { a: 1, b: 2, c: 3 };
   * console.log(Compare.is(obj1).subsetOf(obj2)); // true
   * console.log(Compare.is(obj2).subsetOf(obj1)); // false
   *
   * @todo support nested subsets (e.g. { a: { b: 1 } } subset of { a: { b: 1, c: 2 }, d: 3 })
   */
  static is<T>(obj: T): SubsetManager {
    return new SubsetManager(obj);
  }

  /**
   * @param obj any object to check
   * @returns {ContainManager} an instance of ContainManager for the provided object
   * @description This method initializes a ContainManager with the given object, allowing you to check if it contains another object.
   * The ContainManager provides a method `contain` that can be used to compare the initialized object against another object to determine if it contains it.
   * @example
   * const obj1 = { a: 1, b: 2 };
   * const obj2 = { a: 1 };
   * console.log(Compare.does(obj1).contain(obj2)); // true
   */
  static does<T>(obj: T): ContainManager {
    return new ContainManager(obj);
  }
}

class SubsetManager {
  private daIsObject: unknown;

  constructor(daIsObject: unknown | null) {
    this.daIsObject = daIsObject;
  }

  subsetOf<T>(obj: T): boolean {
    if (this.daIsObject === null || obj === null) {
      return obj === null && this.daIsObject === null;
    }

    if (this.daIsObject === undefined || obj === undefined) {
      return obj === undefined && this.daIsObject === undefined;
    }

    if (Array.isArray(this.daIsObject)) {
      if (!Array.isArray(obj)) return false;
      if (this.daIsObject.length > obj.length) return false;

      // O of shitton but queries aren't supposed to be too big anyway
      // so it's fine?
      outer: for (const el of this.daIsObject) {
        for (const el2 of obj) {
          if (Compare.deepCompare(el, el2)) {
            continue outer;
          }
        }
        return false;
      }
      return true;
    }

    if (this.daIsObject instanceof Set) {
      if (!(obj instanceof Set)) return false;
      if (this.daIsObject.size > obj.size) return false;

      this.daIsObject = this.daIsObject.values().toArray();

      return this.subsetOf(obj.values().toArray());
    }

    if (this.daIsObject instanceof Map) {
      if (!(obj instanceof Map)) return false;
      if (this.daIsObject.size > obj.size) return false;

      this.daIsObject = this.daIsObject.entries().toArray();

      return this.subsetOf(obj.entries().toArray());
    }

    if (typeof this.daIsObject === 'object') {
      if (typeof obj !== 'object') return false;

      for (const Class of specialClasses) {
        if (this.daIsObject instanceof Class) {
          if (!(obj instanceof Class)) return false;

          this.daIsObject = Object.fromEntries(this.daIsObject.entries());
          return this.subsetOf(Object.fromEntries(obj.entries()));
        }
      }

      this.daIsObject = Object.entries(this.daIsObject);

      return this.subsetOf(Object.entries(obj));
    }

    return this.daIsObject === obj;
  }
}

class ContainManager {
  private daDoesObject: unknown;

  constructor(daDoesObject: unknown | null) {
    this.daDoesObject = daDoesObject;
  }

  /**
   * @param obj any object to check
   * @returns {boolean} true if the initialized object contains the provided object, false otherwise
   * @description This method checks if the initialized object contains the provided object.
   * @example
   * const obj1 = { a: 1, b: 2 };
   * const obj2 = { a: 1 };
   * console.log(Compare.does(obj1).contain(obj2)); // true
   */
  contain(obj: unknown): boolean {
    return new SubsetManager([obj]).subsetOf(this.daDoesObject);
  }
}
