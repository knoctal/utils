import { Compare } from './compare';

/**
 * Use for tanstack query params management. It provides a way to add parameters to
 * an array uniquely.
 *
 * Useful for cases like pagination, filtering, and sorting where you want to keep track
 * of the parameters used in a useQuery and be able to parse them back into their original
 * form for use in your application.
 */
export class ParamManager {
  private static _CURRENT_PARAM?: readonly unknown[] | null = null;

  static add(params?: readonly unknown[] | null) {
    this._CURRENT_PARAM = params;
    return this;
  }

  static into(keys: Array<unknown | null>) {
    if (!Array.isArray(keys)) {
      throw new Error('Query Keys object must be an array');
    }

    if (!Compare.does(keys).contain([this._CURRENT_PARAM])) {
      keys.push(structuredClone(this._CURRENT_PARAM));
    }

    this._CURRENT_PARAM = null;
    return this;
  }
}
