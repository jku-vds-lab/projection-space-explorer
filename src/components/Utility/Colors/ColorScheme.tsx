export class ColorScheme {
  colors: any;
  mapping: any;

  constructor(colors) {
    this.colors = colors;
  }

  getMapping() {
    return this.mapping;
  }

  map(value) {
    return this.colors[value];
  }
}
