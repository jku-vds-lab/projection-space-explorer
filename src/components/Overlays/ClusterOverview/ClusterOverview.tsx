import "./ClusterOverview.scss";
import * as React from 'react'
import Cluster from "../../Utility/Data/Cluster";
import { Story } from "../../Utility/Data/Story";
import { GenericFingerprint } from "../../Legends/Generic";
import { Card, Grow, Link, CardHeader, CardContent, Button, Typography } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect, ConnectedProps } from 'react-redux'
import { DatasetType } from "../../Utility/Data/DatasetType";
import { Dataset } from "../../Utility/Data/Dataset";
import { GenericChanges } from "../../Legends/GenericChanges/GenericChanges";
import { StoryMode } from "../../Ducks/StoryModeDuck";
import { RootState } from "../../Store/Store";
import { addCluster } from "../../Ducks/CurrentClustersDuck";
import { addClusterToStory, addClusterToTrace, selectSideBranch, setActiveTraceState } from "../../Ducks/StoriesDuck";
import { select } from "d3";
import ReactDOM = require("react-dom");


const mapStateToProps = (state: RootState) => ({
    storyMode: state.storyMode,
    dataset: state.dataset,
    stories: state.stories,
    currentAggregation: state.currentAggregation
})

const mapDispatch = dispatch => ({
    addCluster: cluster => dispatch(addCluster(cluster)),
    addClusterToTrace: cluster => dispatch(addClusterToTrace(cluster)),
    setActiveTraceState: cluster => dispatch(setActiveTraceState(cluster)),
    selectSideBranch: index => dispatch(selectSideBranch(index))
})

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    itemClicked: any
    storyMode?: StoryMode
    dataset: Dataset
}

const Plus = ({ onClick, x, y, r }) => {
    return <g onClick={() => {
        onClick()
    }}>
        <circle cx={x} cy={y} r={r} fill="#F0F0F0" stroke-width="2" stroke="red" ></circle>
        <line x1={x - r + 3} y1={y} x2={x + r - 3} y2={y} stroke-width="2" stroke="red"></line>
        <line x1={x} y1={y - r + 3} x2={x} y2={y + r - 3} stroke-width="2" stroke="red"></line>
    </g>
}

const Circle = ({ x, y, onClick }) => {
    return <circle cx={x} cy={y} r="6" fill="blue" onClick={onClick} />
}


class ProvenanceGraph extends React.PureComponent<any, any> {
    render() {
        const midX = 80
        const rectWidth = 16
        const margin = 12

        const fillColors = [ "#F1DCA5", "#F8C7A0" ]
        const strokeColors = [ "#e9c46a", "#f4a261" ]
        const mainColor = "#2a9d8f"

        if (!this.props.input) return null;

        let { position, stories } = this.props.input

        let currentAggregation = this.props.currentAggregation
        let selectSideBranch = this.props.selectSideBranch
        let addClusterToTrace = this.props.addClusterToTrace
        let addCluster = this.props.addCluster


        return <div>
            <Typography align="center" variant="subtitle2">Provenance</Typography>
            <svg style={{
                width: '100%',
                height: '100%',
                maxWidth: '120px',
                minHeight: position && position.length > 0 ? position[position.length - 1].y + 100 : 200,
                minWidth: '100px'
            }}>

                {


                    function () {


                        let components = []
                        let numSidePaths = Math.min(2, stories.trace.sidePaths.length)

                        for (let si = 0; si < numSidePaths; si++) {
                            let sidePathIndex = stories.trace.sidePaths.indexOf(stories.trace.sidePaths[si])

                            let sidePath = stories.trace.sidePaths[sidePathIndex]

                            components.push(<g>
                                {
                                    // Left markers bottom
                                    sidePath.syncNodes.map((sync, i) => {
                                        let p = position[sync]

                                        if (i != sidePath.syncNodes.length - 1) {
                                            let y = p.y + 16 + si * 4
                                            return <line x1={midX} y1={y} x2={midX - rectWidth * (si + 1) - margin * (si + 1) + rectWidth / 2} y2={y} strokeWidth={2} stroke={strokeColors[si]}></line>
                                        } else {
                                            return <g></g>
                                        }
                                    })
                                }


                                {
                                    // Left markers top
                                    sidePath.syncNodes.map((sync, i) => {
                                        let p = position[sync]
                                        if (i != 0) {
                                            let y = p.y - 16 - si * 4
                                            return <line x1={midX} y1={y} x2={midX - rectWidth * (si + 1) - margin * (si + 1) + rectWidth / 2} y2={y} strokeWidth={2} stroke={strokeColors[si]}></line>
                                        } else {
                                            return <g></g>
                                        }
                                    })
                                }

                                {
                                    // Rectangles
                                    sidePath.syncNodes.map((node, i) => {
                                        if (i != sidePath.syncNodes.length - 1) {

                                            let i1 = sidePath.syncNodes[i]
                                            let i2 = sidePath.syncNodes[i + 1]


                                            let sync1 = position[i1]
                                            let sync2 = position[i2]

                                            if (i2 - i1 == 1 || true) {
                                                let x = midX - rectWidth * (si + 1) - margin * (si + 1)

                                                return <g onClick={() => {
                                                    selectSideBranch(sidePathIndex)
                                                }}>
                                                    <line x1={x + rectWidth / 2} y1={sync1.y + 16 + si * 4} x2={x + rectWidth / 2} y2={sync2.y - 16 - si * 4} strokeWidth={2} stroke={strokeColors[si]}></line>
                                                    <rect x={x} y={sync1.y + 35} rx="5" ry="5" width={rectWidth} height={sync2.y - sync1.y - 70} strokeWidth={2} stroke={strokeColors[si]} fill={fillColors[si]} />
                                                    <text x={x + rectWidth / 2} y={sync1.y + (sync2.y - sync1.y) / 2} textAnchor="middle">{sidePath.nodes.indexOf(stories.trace.mainPath[i2]) - sidePath.nodes.indexOf(stories.trace.mainPath[i1]) - 1}</text>
                                                </g>
                                            } else {
                                                return <g></g>
                                            }
                                        } else {
                                            return <g></g>
                                        }
                                    })
                                }
                            </g>)

                        }


                        return <g>
                            {components}
                        </g>
                    }()
                }

                {
                    position.map((p, index) => {
                        return <g>
                            <text x={midX + 10} y={p.y} fill="black">{index}</text>
                            <circle cx={midX} cy={p.y} r="6" fill={mainColor} />
                        </g>
                    })
                }

                {
                    position.map((p, i) => {
                        if (i != position.length - 1) {
                            let p1 = p
                            let p2 = position[i + 1]

                            return <line x1={midX} y1={p1.y} x2={midX} y2={p2.y} stroke={mainColor} strokeWidth="2"></line>
                        } else {
                            let p1 = p
                            let p2 = { x: p1.x, y: p1.y + 40 }

                            return <g>
                                <line x1={midX} y1={p1.y} x2={midX} y2={p2.y} stroke={mainColor} strokeWidth="2"></line>
                                <Plus x={midX} y={p2.y} r={10} onClick={() => {
                                    let cluster = Cluster.fromSamples(currentAggregation)
                                    addCluster(cluster)
                                    addClusterToTrace(cluster)

                                }} />
                            </g>
                        }
                    })
                }

                {
                    position.length == 0 && <g>
                        <line x1={midX} y1={0} x2={midX} y2={100} stroke={mainColor} strokeWidth="2"></line>
                        <Plus x={midX} y={50} r={10} onClick={() => {

                            if (currentAggregation.length > 0) {
                                let cluster = Cluster.fromSamples(this.props.currentAggregation)
                                addCluster(cluster)
                                addClusterToTrace(cluster)
                            }
                        }} />
                    </g>
                }
            </svg>
        </div>
    }
}


export const ClusterOverview = connector(function ({
    dataset,
    itemClicked,
    storyMode,
    stories,
    currentAggregation,
    addCluster,
    addClusterToTrace,
    setActiveTraceState,
    selectSideBranch }: Props) {

    if (stories.trace == null || stories.active == null) {
        return null
    }

    const itemRef = React.useRef<any>()
    const provenanceRef = React.useRef<any>()
    const [active, setActive] = React.useState(0)


    const [input, setInput] = React.useState(null)



    React.useEffect(() => {
        const current = itemRef.current
        if (current) {
            const state = []
            for (var i = 1; i < current.children.length; i++) {
                const child = current.children[i];

                state.push({ y: child.offsetTop + child.offsetHeight / 2 - current.children[1].offsetTop })
            }

            console.log("reacting to story change")
            console.log(stories)
            setInput({ stories: stories, position: state })
        }
    }, [stories])

    console.log("true stories")
    console.log(stories)

    React.useEffect(() => {
        setActiveTraceState(stories.trace.mainPath[0])
    }, [stories.trace])

    return <Grow in={stories.active != null}>
        <Card className="ClusterOverviewParent">

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>

                    <ProvenanceGraph
                        input={input}
                        currentAggregation={currentAggregation}
                        addCluster={addCluster}
                        addClusterToTrace={addClusterToTrace}
                        selectSideBranch={selectSideBranch}
                    ></ProvenanceGraph>

                    <div ref={itemRef} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '100px'
                    }}>
                        <Typography align="center" variant="subtitle2">Cluster</Typography>
                        {
                            stories.trace?.mainPath.map((cluster, index) => {
                                return <ToggleButton
                                    key={index}
                                    className="ClusterItem"
                                    selected={stories.activeTraceState == cluster}
                                    value={index}
                                    onClick={() => {
                                        itemClicked(cluster)
                                        setActiveTraceState(cluster)
                                    }}><GenericFingerprint
                                        type={dataset.type}
                                        vectors={cluster.vectors}
                                        scale={1}
                                    ></GenericFingerprint>
                                </ToggleButton>
                            })
                        }
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '100px'
                    }}>
                        <Typography align="center" variant="subtitle2">Change</Typography>
                        {
                            stories.trace?.mainEdges.map((edge, index) => {
                                return <ToggleButton
                                    key={index}
                                    className="ClusterItem CORightItem"
                                    value={index}
                                    onClick={() => {
                                        itemClicked(edge.destination)
                                    }}>
                                    <GenericChanges
                                        scale={1}
                                        vectorsA={edge.source.vectors}
                                        vectorsB={edge.destination.vectors}
                                    />
                                </ToggleButton>
                            })
                        }
                    </div>
                </div>
            </div>
        </Card>
    </Grow >
})