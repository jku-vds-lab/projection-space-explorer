/**
 * The data type of a feature
 */
export enum FeatureType {
  /**
   * Means all values have no other group they belong to
   */
  String = 'String',

  /**
   * Means all values are real numbers e.g. 0.23, 0.13, 1, 2...
   */
  Quantitative = 'Quantitative',

  /**
   * Means the values represent groups
   */
  Categorical = 'Categorical',

  /**
   * Means all values are date timestamps
   */
  Date = 'Date',

  /**
   * Means there exist only 2 groups (stricter than categorical)
   */
  Binary = 'Binary',

  Ordinal = 'Ordinal',

  /**
   * Means all values are arrays of other values.
   */
  Array = 'Array',
}

export function stringToFeatureType(value: string) {
  switch (value.toLowerCase()) {
    case 'array':
      return FeatureType.Array;
    case 'date':
      return FeatureType.Date;
    case 'categorical':
      return FeatureType.Categorical;
    case 'quantitative':
      return FeatureType.Quantitative;
    default:
      return FeatureType.String;
  }
}
