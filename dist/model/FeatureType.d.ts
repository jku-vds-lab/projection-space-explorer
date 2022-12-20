/**
 * The data type of a feature
 */
export declare enum FeatureType {
    /**
     * Means all values have no other group they belong to
     */
    String = "String",
    /**
     * Means all values are real numbers e.g. 0.23, 0.13, 1, 2...
     */
    Quantitative = "Quantitative",
    /**
     * Means the values represent groups
     */
    Categorical = "Categorical",
    /**
     * Means all values are date timestamps
     */
    Date = "Date",
    /**
     * Means there exist only 2 groups (stricter than categorical)
     */
    Binary = "Binary",
    Ordinal = "Ordinal",
    /**
     * Means all values are arrays of other values.
     */
    Array = "Array"
}
export declare function stringToFeatureType(value: string): FeatureType.String | FeatureType.Quantitative | FeatureType.Categorical | FeatureType.Date | FeatureType.Array;
