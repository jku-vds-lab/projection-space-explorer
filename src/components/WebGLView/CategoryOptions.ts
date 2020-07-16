/**
 * Helper class that manages the attribute categories.
 * These options are a top-level representation of all attributes eg
 * color by (att1, att2...)
 * size by (att1, att2...)
 * brightness by ...
 */
export class CategoryOptions {
    vectors: any
    json: any

    constructor(vectors, json) {
        this.vectors = vectors
        this.json = json

        if (this.json == null || this.json == "") {
            this.infer()
        } else if (this.vectors != null && this.vectors.length > 0) {
            this.init()
        }
    }

    isCategorical(key) {
        var values = this.vectors.map(vector => vector[key])
        var distinct = [... new Set(values)]

        if (distinct.length < 10) {
            return true
        } else {
            return false
        }
    }

    // Automatically infer categories from this file
    infer() {
        this.json = []

        var header = Object.keys(this.vectors[0]).filter(key => key != 'x' && key != 'y' && key != 'line')
        header.forEach(key => {
            if (this.isCategorical(key)) {

            }
        })
    }

    init() {
        this.json.forEach(category => {
            category.attributes.forEach(attribute => {
                if (attribute.type == 'categorical') {
                    attribute.distinct = [... new Set(this.vectors.map(value => value[attribute.key]))]
                }
            })
        })
    }

    hasCategory(catName) {
        if (this.json == null) return false
        return this.json.filter(a => a.category == catName).length > 0
    }

    getCategory(catName) {
        if (this.json == null) return null
        return this.json.filter(a => a.category == catName)[0]
    }

    asArray() {
        return this.json
    }

    getAttribute(category, attribute, type) {
        try {
            return this.json.find(c => c.category == category)
                .attributes.find(a => a.key == attribute && a.type == type)
        } catch (e) {
            return null
        }
    }
}