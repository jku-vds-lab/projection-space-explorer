import { arraysEqual } from '../WebGLView/UtilityFunctions';

export class AShallowSet {
  static indexOf(set: any[], value) {
    if (value instanceof Array) {
      return set.findIndex((e) => arraysEqual(e, value));
    }

    return set.indexOf(value);
  }

  static has(set: any[], value) {
    if (value instanceof Array) {
      return set.find((e) => arraysEqual(e, value));
    }
    
    return set.includes(value);
  }

  static create(values: any[]) {
    const set = [];

    values.forEach((element) => {
      if (AShallowSet.has(set, element)) {
        return;
      }

      set.push(element);
    });

    return set;
  }
}
