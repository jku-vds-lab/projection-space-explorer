import { QualitativeScaleMapping } from "./QualitativeScaleMapping";








export class ColorScheme {
  colors: any;
  mapping: any;

  constructor(colors) {
    this.colors = colors;
  }

  getMapping() {
    return this.mapping;
  }

  createMapping(values) {

    var i = 0;
    this.mapping = values.reduce((map, obj) => {
      map[obj] = this.colors[i % this.colors.length];
      i++;
      return map;
    }, {});

    return new QualitativeScaleMapping(this, values);
  }

  map(value) {
    return this.colors[value];
  }
}
