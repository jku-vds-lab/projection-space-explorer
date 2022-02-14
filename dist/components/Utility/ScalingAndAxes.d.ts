/**
 * Creates a scaler function
 *
 * @param range the range of the channel
 * @param minValue the minimum value of the mapping
 * @param maxValue the maximum value of the mapping
 */
export declare function createLinearRangeScaler(range: [number] | [number, number], minValue: number, maxValue: number): (value: number) => number;
