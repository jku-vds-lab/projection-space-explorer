export default class Cluster {
    points: Array<any>

    constructor(points, bounds, hull, triangulation) {
        this.points = points
        this.bounds = bounds
        this.hull = hull
        this.triangulation = triangulation
    }

    containsPoint(coords) {
        var x = coords.x
        var y = coords.y
        if (x > this.bounds.minX && x < this.bounds.maxX && y < this.bounds.maxY && y > this.bounds.minY) {
            return true
        }

        return false
    }

    getCenter() {
        var x = 0
        var y = 0

        this.points.forEach(p => {
            x = x + p.x
            y = y + p.y
        })

        return {
            x: x / this.points.length,
            y: y / this.points.length
        }
    }

    getProbability() {
        var avg = 0
        this.points.forEach(p => {
            avg = avg + p.probability
        })
        return avg / this.points.length
    }

    getSTD() {
        var center = this.getCenter()
        var std = 0

        this.points.forEach(p => {
            std = std + Math.sqrt(((p.x - center.x) * (p.x - center.x)) + ((p.y - center.y) * (p.y - center.y)))
        })

        return std / this.points.length
    }


    meanScore() {
        var avg = 0
        this.points.forEach(p => {
            avg = avg + p.score
        })
        console.log(this.points)
        return avg / this.points.length
    }

    differentLines() {
        return [...new Set(this.vectors.map(v => v.view.lineIndex))].length
    }

    order() {
        return this.points.length / 10 + this.getProbability() - this.getSTD() + this.differentLines()
    }
}










/**
 * A story is a list of clusters with a specific order.
 */
export class Story {
    clusters: Cluster[]

    constructor(clusters) {
        this.clusters = clusters
    }
}