export class LinearColorScale {
  stops: any;
  type: 'continuous' | 'discrete';

  constructor(stops, type) {
    this.stops = stops;
    this.type = type;
  }
}
