/**
 * Use for tanstack query params management. It provides a way to add parameters to
 * a set or an array and parse them back into their original form.
 *
 * Useful for cases like pagination, filtering, and sorting where you want to keep track
 * of the parameters used in a query and be able to parse them back into their original
 * form for use in your application.
 */
export class ParamManager {
  private static _CURRENT_PARAM_STRING: unknown | null = null;

  static add(params?: object) {
    if (Array.isArray(params)) {
      this._CURRENT_PARAM_STRING = JSON.stringify(params);
    } else {
      this._CURRENT_PARAM_STRING = params ? JSON.stringify(Object.fromEntries(Object.entries(params).sort())) : null;
    }
    return this;
  }

  static into(set: Set<unknown | null> | Array<unknown | null>) {
    if (!this._CURRENT_PARAM_STRING) {
      this._CURRENT_PARAM_STRING = null;
      return this;
    }

    if (Array.isArray(set)) {
      if (!set.includes(this._CURRENT_PARAM_STRING)) {
        set.push(this._CURRENT_PARAM_STRING);
      }
    } else {
      set.add(this._CURRENT_PARAM_STRING);
    }
    this._CURRENT_PARAM_STRING = null;
    return this;
  }

  /**
   * Parses stringified parameters back into their original form.
   * @param param `Array` | `Set` of stringified parameters
   * @returns parsed Array
   * @throws Error if the parameter type is **not** `Array` or `Set`
   */
  static parse<T>(param: T) {
    if (Array.isArray(param)) {
      return param.map((p) => JSON.parse(p as string)) as T;
    } else if (param instanceof Set) {
      return param
        .values()
        .filter(Boolean)
        .map((param) => JSON.parse(param as string)) as T;
    } else {
      throw new Error('Unsupported parameter type for parsing');
    }
  }
}
