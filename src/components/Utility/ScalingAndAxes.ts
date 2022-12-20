/**
 * Creates a scaler function
 *
 * @param range the range of the channel
 * @param minValue the minimum value of the mapping
 * @param maxValue the maximum value of the mapping
 */
export function createLinearRangeScaler(range: [number] | [number, number], minValue: number, maxValue: number) {
  if (minValue === maxValue) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (value: number) => {
      return range[0];
    };
  }
  return (value: number) => {
    return range[0] + (range[1] - range[0]) * ((value - minValue) / (maxValue - minValue));
  };
}
