/**
 * Base type for normalized dictionaries
 */
export type NormalizedDictionary<T> = {
    byId: {
        [id: string]: T;
    };
    allIds: string[];
};
export declare const ANormalized: {
    create<T>(): NormalizedDictionary<T>;
    /**
     * Adds a value to a normalized dictionary
     *
     * @param dict the normalized dictionary
     * @param value the value to add
     */
    add: <T_1>(dict: NormalizedDictionary<T_1>, value: T_1) => string;
    /**
     * Deletes a value by ref from the normalized dictionary
     *
     * @param dict the normalized dictionary
     * @param value the value to remove
     */
    deleteByRef: <T_2>(dict: NormalizedDictionary<T_2>, value: T_2) => string;
    /**
     * Deletes a value by handle from the normalized dictionary
     *
     * @param dict the normalized dictionary
     * @param value the value to remove
     */
    delete: <T_3>(dict: NormalizedDictionary<T_3>, handle: string) => string;
    get: <T_4>(dict: NormalizedDictionary<T_4>, handle: string) => T_4;
    entries: <T_5>(dict: NormalizedDictionary<T_5>) => [string, T_5][];
    forEach: <T_6>(dict: NormalizedDictionary<T_6>, callbackfn: (value: [string, T_6]) => void) => void;
    map: <T_7>(dict: NormalizedDictionary<T_7>, callbackfn: (value: [string, T_7]) => any) => any[];
    filter: <T_8>(dict: NormalizedDictionary<T_8>, callbackfn: (value: [string, T_8]) => any) => (string | T_8)[][];
};
//# sourceMappingURL=NormalizedState.d.ts.map