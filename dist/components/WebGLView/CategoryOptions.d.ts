export declare class CategoryOptionsAPI {
    static hasCategory(categoryOptions: CategoryOptions, catName: any): boolean;
    static getCategory(categoryOptions: CategoryOptions, catName: any): any;
    static getAttribute(categoryOptions: CategoryOptions, category: any, attribute: any, type: any): any;
}
/**
 * Helper class that manages the attribute categories.
 * These options are a top-level representation of all attributes eg
 * color by (att1, att2...)
 * size by (att1, att2...)
 * brightness by ...
 */
export declare type CategoryOptions = {
    json: any;
};
