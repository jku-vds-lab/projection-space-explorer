
/**
 * Calculates the eclidean distance between 2 vectors
 * 
 * @param x1 The x component of the first vector
 * @param y1 The y component of the first vector
 * @param x2 The x component of the second vector
 * @param y2 The y component of the second vector
 */
export function euclideanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}


export function euclideanDistanceVec(v1: VectorType, v2: VectorType) {
    return euclideanDistance(v1.x, v1.y, v2.x, v2.y)
}




export function getSyncNodesAlt(nodes1: [], nodes2: []) {
    const convert = (nodes) => {
        let edges = []
        nodes.forEach((node, index) => {
            if (index != nodes.length - 1) {
                edges.push({ source: node, destination: nodes[index + 1] })
            }
        })

        return {
            nodes: nodes,
            edges: edges
        }
    }

    let main = convert(nodes1)
    let side = convert(nodes2)

    let splits = []

    main.nodes.forEach((cluster, index) => {
        // Sync node needs to be in both
        if (!side.nodes.includes(cluster)) {
            return;
        }

        let outSplit = false
        let inSplit = false

        let mainIndex = index
        let sideIndex = side.nodes.indexOf(cluster)

        let belowMainEdge = main.edges[mainIndex]
        let belowSideEdge = side.edges[sideIndex]

        let aboveMainEdge = main.edges[mainIndex - 1]
        let aboveSideEdge = side.edges[sideIndex - 1]

        // out direction differs
        if (belowMainEdge && belowSideEdge) {
            if (belowMainEdge.source != belowSideEdge.source || belowMainEdge.destination != belowSideEdge.destination) {
                outSplit = true
            }
        }

        // in direction differs
        if (aboveMainEdge && aboveSideEdge) {
            if (aboveMainEdge.source != aboveSideEdge.source || aboveMainEdge.destination != aboveSideEdge.destination) {
                inSplit = true
            }
        }

        if (belowMainEdge && !belowSideEdge || !belowMainEdge && belowSideEdge) {
            outSplit = true
        }

        if (!aboveMainEdge && aboveSideEdge || aboveMainEdge && !aboveSideEdge) {
            inSplit = true
        }

        if (outSplit || inSplit) {
            splits.push({ index: index, in: inSplit, out: outSplit })
        }
    })

    return splits
}


export function getSyncNodes(main, side) {

    const checkEdge = (edge1, edge2) => {
        return edge1.source != edge2.source || edge1.destination != edge2.destination
    }

    let syncs = main.nodes.filter((cluster, index) => {
        // A node that is not in the side story cant be a sync node
        if (!side.nodes.includes(cluster)) {
            return false
        }

        // Find side node that corresponds to this node
        let sideNode = side.nodes.find(e => e.label == cluster.label)

        if (index == 0 && checkEdge(main.edges[0], side.edges[0])) {
            return true
        }

        if (index == main.nodes.length - 1) {
            if (checkEdge(main.edges[main.edges.length - 1], side.edges[side.edges.length - 1])) {
                return true
            }
        } else if (index != main.nodes.length - 1 && index != 0) {
            if (checkEdge(main.edges[index], side.edges[side.nodes.indexOf(sideNode)]) || checkEdge(main.edges[index - 1], side.edges[side.nodes.indexOf(sideNode) - 1])) {
                return true
            }
        }



        return false
    }).map(c => main.nodes.indexOf(c))


    /**main.nodes.forEach((cluster, index) => {
        if (side.nodes.includes(cluster) && side.edges.find(edge => {
            return (edge.source == cluster || edge.destination == cluster) &&
                (!main.nodes.includes(edge.source) || !main.nodes.includes(edge.destination))
                || (!side.nodes)
        })) {
            syncs.push(index)
        }
    })**/

    return syncs
}






export type VectorType = {
    x: number
    y: number
}

/**
 * Math class for vector calculations.
 */
export class VectBase implements VectorType {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    lerp(v: VectorType, alpha: number) {
        this.x += (v.x - this.x) * alpha
        this.y += (v.y - this.y) * alpha

        return this
    }

    angle() {
        return Math.atan2(- this.y, - this.x) + Math.PI;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }

    static subtract(a, b) {
        return new VectBase(a.x - b.x, a.y - b.y)
    }

    static add(a, b) {
        return new VectBase(a.x + b.x, a.y + b.y)
    }
}










