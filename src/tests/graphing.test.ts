import { timeStamp } from "console";


/**
 * Gets synchronizing nodes of 2 lists
 * @param main
 * @param side 
 */
function getSyncNodesAlt(nodes1: [], nodes2: []) {
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


    let result = []
    return main.nodes.filter((cluster, index) => {
        // Sync node needs to be in both
        if (!side.nodes.includes(cluster)) {
            return false;
        }

        let mainIndex = index
        let sideIndex = side.nodes.indexOf(cluster)

        let belowMainEdge = main.edges[mainIndex]
        let belowSideEdge = side.edges[sideIndex]

        let aboveMainEdge = main.edges[mainIndex - 1]
        let aboveSideEdge = side.edges[sideIndex - 1]

        if (belowMainEdge && belowSideEdge) {
            if (belowMainEdge.source != belowSideEdge.source || belowMainEdge.destination != belowSideEdge.destination) {
                return true
            }
        }

        if (aboveMainEdge && aboveSideEdge) {
            if (aboveMainEdge.source != aboveSideEdge.source || aboveMainEdge.destination != aboveSideEdge.destination) {
                return true
            }
        }

        return false
    })
}



test('adds 1 + 2 to equal 3', () => {
    let a = [ 4, 5, 6 ]
    let b = [ 4, 2, 5, 6, 7 ]

    console.log(getSyncNodesAlt(a, b))

    expect(true)
})