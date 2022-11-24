export class CategoryOptionsAPI {
  static hasCategory(categoryOptions: CategoryOptions, catName) {
    if (categoryOptions == null) return false;
    return categoryOptions.filter((a) => a.category === catName).length > 0;
  }

  static getCategory(categoryOptions: CategoryOptions, catName) {
    if (categoryOptions == null) return null;
    return categoryOptions.filter((a) => a.category === catName)[0];
  }

  static getAttribute(categoryOptions: CategoryOptions, category, attribute, type) {
    try {
      return categoryOptions.find((c) => c.category === category).attributes.find((a) => a.key === attribute && a.type === type);
    } catch (e) {
      return null;
    }
  }
}

export type CategoryOption = {
  key: string;
  name: string;
  type: 'sequential' | 'categorical';
  range;
  values;
};

/**
 * Helper class that manages the attribute categories.
 * These options are a top-level representation of all attributes eg
 * color by (att1, att2...)
 * size by (att1, att2...)
 * brightness by ...
 */
export type CategoryOptions = { category: string; attributes: CategoryOption[] }[];
