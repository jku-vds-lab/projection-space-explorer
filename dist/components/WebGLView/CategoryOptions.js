"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CategoryOptionsAPI {
    static hasCategory(categoryOptions, catName) {
        if (categoryOptions.json == null)
            return false;
        return categoryOptions.json.filter(a => a.category == catName).length > 0;
    }
    static getCategory(categoryOptions, catName) {
        if (categoryOptions.json == null)
            return null;
        return categoryOptions.json.filter(a => a.category == catName)[0];
    }
    static getAttribute(categoryOptions, category, attribute, type) {
        try {
            return categoryOptions.json.find(c => c.category == category)
                .attributes.find(a => a.key == attribute && a.type == type);
        }
        catch (e) {
            return null;
        }
    }
    static init(categoryOptions) {
        categoryOptions.json.forEach(category => {
            category.attributes.forEach(attribute => {
                if (attribute.type == 'categorical') {
                    attribute.distinct = [...new Set(categoryOptions.vectors.map(value => value[attribute.key]))];
                }
            });
        });
    }
}
exports.CategoryOptionsAPI = CategoryOptionsAPI;
/**
 * Helper class that manages the attribute categories.
 * These options are a top-level representation of all attributes eg
 * color by (att1, att2...)
 * size by (att1, att2...)
 * brightness by ...
 */
class CategoryOptions {
    constructor(vectors, json) {
        this.vectors = vectors;
        this.json = json;
    }
}
exports.CategoryOptions = CategoryOptions;
