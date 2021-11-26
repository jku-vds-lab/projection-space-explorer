
export class CategoryOptionsAPI {
    static hasCategory(categoryOptions: CategoryOptions, catName) {
        if (categoryOptions.json == null) return false
        return categoryOptions.json.filter(a => a.category == catName).length > 0
    }

    static getCategory(categoryOptions: CategoryOptions, catName) {
        if (categoryOptions.json == null) return null
        return categoryOptions.json.filter(a => a.category == catName)[0]
    }

    static getAttribute(categoryOptions: CategoryOptions, category, attribute, type) {
        try {
            return categoryOptions.json.find(c => c.category == category)
                .attributes.find(a => a.key == attribute && a.type == type)
        } catch (e) {
            return null
        }
    }
}





/**
 * Helper class that manages the attribute categories.
 * These options are a top-level representation of all attributes eg
 * color by (att1, att2...)
 * size by (att1, att2...)
 * brightness by ...
 */
export type CategoryOptions = {
    json: any
}