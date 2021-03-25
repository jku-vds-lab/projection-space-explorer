import "./ClusterOverview.scss";
import * as React from 'react'
import Cluster from "../../Utility/Data/Cluster";
import { GenericFingerprint } from "../../Legends/Generic";
import { Card, Typography, Tooltip, IconButton, CardHeader } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect, ConnectedProps } from 'react-redux'
import { DatasetType } from "../../Utility/Data/DatasetType";
import { Dataset } from "../../Utility/Data/Dataset";
import { GenericChanges } from "../../Legends/GenericChanges/GenericChanges";
import { StoryMode } from "../../Ducks/StoryModeDuck";
import { RootState } from "../../Store/Store";
import { addClusterToTrace, selectSideBranch, setActiveTrace, setActiveTraceState, StoriesType } from "../../Ducks/StoriesDuck";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { DifferenceThresholdSlider } from '../../legends/CoralChanges/DifferenceThresholdSlider';
import CloseIcon from '@material-ui/icons/Close';




const mapStateToProps = (state: RootState) => ({
    storyMode: state.storyMode,
    dataset: state.dataset,
    stories: state.stories,
    currentAggregation: state.currentAggregation
})

const mapDispatch = dispatch => ({
    addClusterToTrace: cluster => dispatch(addClusterToTrace(cluster)),
    setActiveTraceState: cluster => dispatch(setActiveTraceState(cluster)),
    selectSideBranch: index => dispatch(selectSideBranch(index)),
    setActiveTrace: trace => dispatch(setActiveTrace(trace))
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
        <circle cx={x} cy={y} r={r} fill="#F0F0F0" strokeWidth="2" stroke="#DCDCDC" ></circle>
        <line x1={x - r + 3} y1={y} x2={x + r - 3} y2={y} strokeWidth="2" stroke="#007dad"></line>
        <line x1={x} y1={y - r + 3} x2={x} y2={y + r - 3} strokeWidth="2" stroke="#007dad"></line>
    </g>
}

const Circle = ({ x, y, onClick }) => {
    return <circle cx={x} cy={y} r="6" fill="blue" onClick={onClick} />
}


const SidePath = ({ dataset, syncPart, width, stroke, fill, x, y, height }) => {
    return <Tooltip placement="left" title={<React.Fragment>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
                syncPart.map(node => {
                    return <GenericFingerprint
                        type={dataset.type}
                        vectors={node.vectors}
                        scale={1}
                    ></GenericFingerprint>
                })
            }
        </div>
    </React.Fragment>}>
        <rect x={x - width / 2} y={y} rx="5" ry="5" width={width} height={height} strokeWidth={2} stroke={stroke} fill={fill} />
    </Tooltip>
}


class ProvenanceGraph extends React.PureComponent<any, any> {
    constructor(props) {
        super(props)

        this.state = {
            pageOffset: 0
        }
    }

    render() {
        const midX = 80
        const rectWidth = 16
        const margin = 12

        const fillColors = ["#F1DCA5", "#F8C7A0"]
        const strokeColors = ["#e9c46a", "#f4a261"]
        const mainColor = '#007dad'
        const grayColor = '#808080'
        const stateSize = 12

        if (!this.props.input) return null;

        let { position, stories, elementHeight }: { position: any, stories: StoriesType, elementHeight: any } = this.props.input

        let currentAggregation = this.props.currentAggregation
        let selectSideBranch = this.props.selectSideBranch
        let addClusterToTrace = this.props.addClusterToTrace
        let dataset = this.props.dataset
        let pageOffset = this.state.pageOffset


        let numSidePaths = Math.min(2, stories.trace.sidePaths.length)

        return <div>
            <div>
                <Typography align="center" variant="subtitle2" style={{ width: 40 }}></Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => {
                        this.setState({ pageOffset: pageOffset <= 1 ? numSidePaths : pageOffset - 2 })
                    }}>
                        <NavigateBeforeIcon></NavigateBeforeIcon>
                    </IconButton>

                    <IconButton onClick={() => {
                        this.setState({ pageOffset: pageOffset + 2 })
                    }}>
                        <NavigateNextIcon></NavigateNextIcon>
                    </IconButton>
                </div>
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

                            for (let si = 0; si < numSidePaths; si++) {
                                let sidePathIndex = stories.trace.sidePaths.indexOf(stories.trace.sidePaths[(si + pageOffset) % stories.trace.sidePaths.length])

                                let sidePath = stories.trace.sidePaths[sidePathIndex]

                                components.push(<g key={sidePathIndex}>
                                    {
                                        // Rectangles between outgoing and ingoing sync nodes
                                        sidePath.syncNodes.map((node, i) => {
                                            let x = midX - rectWidth * (si + 1) - margin * (si + 1) + rectWidth / 2

                                            if (i == sidePath.syncNodes.length - 1 && node.out) {
                                                // Case where its the last syncnode and its outgoing
                                                let pos1 = position[node.index]


                                                return <g onClick={() => {
                                                    selectSideBranch(sidePathIndex)
                                                }}>
                                                    <path d={`M ${midX - stateSize / 2} ${pos1.y} Q ${x} ${pos1.y} ${x} ${pos1.y + 35}`} stroke={strokeColors[si]} fill="transparent" strokeWidth="2"></path>

                                                    <SidePath
                                                        dataset={dataset}
                                                        syncPart={[]}
                                                        x={x}
                                                        width={rectWidth}
                                                        stroke={strokeColors[si]}
                                                        fill={fillColors[si]}
                                                        y={pos1.y + 35}
                                                        height={elementHeight - 70}
                                                    ></SidePath>

                                                    <line x1={x} y1={pos1.y + 35 + 70 - 6} x2={x} y2={pos1.y + elementHeight} stroke={strokeColors[si]}></line>
                                                    <rect x={x - 6} y={pos1.y + elementHeight - 6} width={stateSize} height={stateSize} fill={fillColors[si]} transform={`rotate(45,${x},${pos1.y + elementHeight})`} />
                                                </g>
                                            } else if (node.out && i != sidePath.syncNodes.length - 1 && sidePath.syncNodes[i + 1].in) {

                                                let i1 = sidePath.syncNodes[i].index
                                                let i2 = sidePath.syncNodes[i + 1].index


                                                let sync1 = position[i1]
                                                let sync2 = position[i2]

                                                let syncLen = sidePath.nodes.indexOf(stories.trace.mainPath[i2]) - sidePath.nodes.indexOf(stories.trace.mainPath[i1]) - 1
                                                let syncPart = sidePath.nodes.slice(sidePath.nodes.indexOf(stories.trace.mainPath[i1]) + 1, sidePath.nodes.indexOf(stories.trace.mainPath[i2]))

                                                let lineY1 = sync1.y
                                                let lineY2 = sync2.y

                                                if (i2 - i1 == 1 || true) {

                                                    return <g onClick={() => {
                                                        selectSideBranch(sidePathIndex)
                                                    }}>
                                                        <path d={`M ${midX} ${lineY1} Q ${x} ${lineY1} ${x} ${lineY1 + 35}`} stroke={strokeColors[si]} fill="transparent" strokeWidth="2"></path>
                                                        <path d={`M ${midX} ${lineY2} Q ${x} ${lineY2} ${x} ${lineY2 - 35}`} stroke={strokeColors[si]} fill="transparent" strokeWidth="2"></path>


                                                        <SidePath
                                                            dataset={dataset}
                                                            syncPart={syncPart}
                                                            x={x}
                                                            width={rectWidth}
                                                            stroke={strokeColors[si]}
                                                            fill={fillColors[si]}
                                                            y={sync1.y + 35}
                                                            height={sync2.y - sync1.y - 70}
                                                        ></SidePath>

                                                        <text x={x} y={sync1.y + (sync2.y - sync1.y) / 2} textAnchor="middle">{syncLen}</text>
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
                        position.map((p, i) => {
                            if (i != position.length - 1) {
                                let p1 = p
                                let p2 = position[i + 1]

                                return <line key={`${p.x}${p.y}`} x1={midX} y1={p1.y} x2={midX} y2={p2.y} stroke={mainColor} strokeWidth="2"></line>
                            } else {
                                let p1 = p
                                let p2 = { x: p1.x, y: p1.y + 40 }

                                return <g key={`${p.x}${p.y}`}>
                                    <line x1={midX} y1={p1.y} x2={midX} y2={p2.y} stroke={mainColor} strokeWidth="2"></line>
                                    <Plus x={midX} y={p2.y} r={10} onClick={() => {
                                        let cluster = Cluster.fromSamples(currentAggregation.aggregation)

                                        addClusterToTrace(cluster)

                                    }} />
                                </g>
                            }
                        })
                    }

                    {
                        position.length == 0 && <g key={"plusmarker"}>
                            <line x1={midX} y1={0} x2={midX} y2={100} stroke={mainColor} strokeWidth="2"></line>
                            <Plus x={midX} y={50} r={10} onClick={() => {

                                if (currentAggregation.aggregation.length > 0) {
                                    let cluster = Cluster.fromSamples(this.props.currentAggregation.aggregation)

                                    addClusterToTrace(cluster)
                                }
                            }} />
                        </g>
                    }

                    {// <!--<circle cx={midX} cy={p.y} r="6" fill={mainColor} />-->
                        position.map((p, index) => {
                            let cluster = stories.trace.mainPath[index]

                            return < g key={`${p.x}${p.y}`
                            }>
                                <rect x={midX - 6} y={p.y - 6} width={stateSize} height={stateSize} fill={currentAggregation.selectedClusters.includes(cluster) ? mainColor : grayColor} transform={`rotate(45,${midX},${p.y})`} />
                                <text style={{textShadow:'-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'}} x={midX} y={p.y} alignment-baseline="middle" text-anchor="middle" fill="black" fontWeight="bold" fontFamily="sans-serif">{cluster.label}</text>
                            </g>
                        })
                    }
                </svg>
            </div>
        </div >
    }
}


export const ClusterOverview = connector(function ({
    dataset,
    itemClicked,
    storyMode,
    stories,
    currentAggregation,
    addClusterToTrace,
    setActiveTraceState,
    setActiveTrace,
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
            let elementHeight = 0

            for (var i = 1; i < current.children.length; i++) {
                const child = current.children[i];
                elementHeight = child.offsetHeight
                state.push({ y: child.offsetTop + child.offsetHeight / 2 - current.children[1].offsetTop - 30 })
            }

            setInput({ stories: stories, position: state, elementHeight: elementHeight })
        }
    }, [stories])

    React.useEffect(() => {
        setActiveTraceState(stories.trace.mainPath[0])
    }, [stories.trace])


    return <Card className="ClusterOverviewParent" variant="outlined">

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <CardHeader

                action={
                    <IconButton onClick={() => {
                        setActiveTrace(null)
                    }}>
                        <CloseIcon />
                    </IconButton>
                }
                title="Storytelling"
            />

            <div style={{ display: 'flex', flexDirection: 'row' }}>

                <ProvenanceGraph
                    input={input}
                    currentAggregation={currentAggregation}
                    addClusterToTrace={addClusterToTrace}
                    selectSideBranch={selectSideBranch}
                    dataset={dataset}
                ></ProvenanceGraph>

                <div ref={itemRef} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '100px'
                    // width: '200px'
                }}>
                    <Typography align="center" variant="subtitle2">Summary</Typography>
                    {
                        stories.trace?.mainPath.map((cluster, index) => {
                            return <div
                                key={index}
                                className="ClusterItem"
                                // selected={stories.activeTraceState == cluster}
                                // value={index}

                                onClick={() => {
                                    itemClicked(cluster)
                                    setActiveTraceState(cluster)
                                }}><GenericFingerprint
                                    type={dataset.type}
                                    vectors={cluster.vectors}
                                    scale={1}
                                ></GenericFingerprint>
                            </div>
                        })
                    }
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '100px'
                    // width: '200px'
                }}>
                    <Typography align="center" variant="subtitle2">Difference</Typography><br />
                    {(dataset.type === DatasetType.Coral || dataset.type === DatasetType.None) && <DifferenceThresholdSlider />}
                    {
                        stories.trace?.mainEdges.map((edge, index) => {
                            return <div
                                key={index}
                                className="ClusterItem CORightItem"
                                // value={index}
                                onClick={() => {
                                    itemClicked(edge.destination)
                                }}>
                                <GenericChanges
                                    scale={1}
                                    vectorsA={edge.source.vectors}
                                    vectorsB={edge.destination.vectors}
                                />
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </Card>
})