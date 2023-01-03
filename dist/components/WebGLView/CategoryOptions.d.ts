export declare class CategoryOptionsAPI {
    static hasCategory(categoryOptions: CategoryOptions, catName: any): boolean;
    static getCategory(categoryOptions: CategoryOptions, catName: any): {
        category: string;
        attributes: CategoryOption[];
    };
    static getAttribute(categoryOptions: CategoryOptions, category: any, attribute: any, type: any): CategoryOption;
}
export type CategoryOption = {
    key: string;
    name: string;
    type: 'sequential' | 'categorical';
    range: any;
    values: any;
};
/**
 * Helper class that manages the attribute categories.
 * These options are a top-level representation of all attributes eg
 * color by (att1, att2...)
 * size by (att1, att2...)
 * brightness by ...
 */
export type CategoryOptions = {
    category: string;
    attributes: CategoryOption[];
}[];
//# sourceMappingURL=CategoryOptions.d.ts.map