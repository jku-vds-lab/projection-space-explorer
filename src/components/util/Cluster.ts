import { Vect } from "./datasetselector"

export default class Cluster {
    points: Array<any>
    label: any
    bounds: any
    hull: any
    triangulation: any
    vectors: Vect[]

    constructor(points, bounds?, hull?, triangulation?) {
        this.points = points
        this.bounds = bounds
        this.hull = hull
        this.triangulation = triangulation
    }


    static calcBounds(samples: Vect[]) {
        // Get rectangle that fits around data set
        var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
        samples.forEach(sample => {
          minX = Math.min(minX, sample.x)
          maxX = Math.max(maxX, sample.x)
          minY = Math.min(minY, sample.y)
          maxY = Math.max(maxY, sample.y)
        })
      
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY
        }
    }


    static fromSamples(samples: Vect[]) {
        let cluster = new Cluster(samples.map(sample => ({
            x: sample.x,
            y: sample.y,
            meshIndex: sample.view.meshIndex
        })))

        cluster.vectors = samples
        cluster.label = Math.floor(Math.random() * 1000)
        cluster.bounds = Cluster.calcBounds(samples)

        return cluster
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
        return avg / this.points.length
    }

    differentLines() {
        return [...new Set(this.vectors.map(v => v.view.segment.lineKey))].length
    }

    order() {
        return this.points.length / 10 + this.getProbability() - this.getSTD() + this.differentLines()
    }
}