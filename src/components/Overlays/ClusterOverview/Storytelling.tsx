import "./Storytelling.scss";
import * as React from 'react'
import { ACluster } from "../../../model/Cluster";
import { GenericLegend } from "../../legends/Generic";
import { Card, Typography, Tooltip, IconButton, CardHeader } from "@material-ui/core";
import { connect, ConnectedProps } from 'react-redux'
import { DatasetType } from "../../../model/DatasetType";
import { Dataset } from "../../../model/Dataset";
import { GenericChanges } from "../../legends/GenericChanges";
import { RootState } from "../../Store/Store";
import { addClusterToTrace, selectSideBranch, setActiveTrace, setActiveTraceState, StoriesType, StoriesUtil } from "../../Ducks/StoriesDuck";
import { DifferenceThresholdSlider } from '../../../plugins/Coral/CoralChanges/DifferenceThresholdSlider';
import CloseIcon from '@material-ui/icons/Close';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop';
import { ResizeObserver } from 'resize-observer';
import { selectClusters } from "../../Ducks/AggregationDuck";


const mainColor = '#007dad'

const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset,
    stories: state.stories,
    currentAggregation: state.currentAggregation,
    genericFingerprintAttributes: state.genericFingerprintAttributes
})

const mapDispatch = dispatch => ({
    addClusterToTrace: cluster => dispatch(addClusterToTrace(cluster)),
    setActiveTraceState: (cluster: string) => dispatch(setActiveTraceState(cluster)),
    selectSideBranch: (index: number) => dispatch(selectSideBranch(index)),
    setActiveTrace: (trace: number) => dispatch(setActiveTrace(trace)),
    setSelectedCluster: (clusters: string[], shift) => dispatch(selectClusters(clusters, shift))
})

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
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
                    return <GenericLegend
                        type={dataset.type}
                        vectors={node.vectors}
                        scale={1}
                        aggregate={true}
                    ></GenericLegend>
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

        const grayColor = '#808080'

        const fillColors = ['#DCDCDC', '#DCDCDC']
        const strokeColors = [grayColor, grayColor]

       
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

                                            // @ts-ignore
                                            if (i == sidePath.syncNodes.length - 1 && node.out) {
                                                // Case where its the last syncnode and its outgoing
                                                // @ts-ignore
                                                let pos1 = position[node.index]


                                                return <g onClick={() => {
                                                    selectSideBranch(sidePathIndex)
                                                }}>
                                                    <path d={`M ${midX - stateSize / 2} ${pos1.y} Q ${x} ${pos1.y} ${x} ${pos1.y + 35}`} stroke={strokeColors[si]} fill="transparent" strokeWidth="2"></path>

                                                    <line x1={x} y1={pos1.y + 35 + 70 - 6} x2={x} y2={pos1.y + elementHeight} stroke={strokeColors[si]}></line>

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


                                                    <rect x={x - 6} y={pos1.y + elementHeight - 6} width={stateSize} height={stateSize} fill={fillColors[si]} transform={`rotate(45,${x},${pos1.y + elementHeight})`} />
                                                </g>
                                            } else
                                                // @ts-ignore
                                                if (node.out && i != sidePath.syncNodes.length - 1 && sidePath.syncNodes[i + 1].in) {
                                                    // @ts-ignore
                                                    let i1 = sidePath.syncNodes[i].index
                                                    // @ts-ignore
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




                    { // Generates the lines between the diamon 
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
                                        let cluster = ACluster.fromSamples(this.props.dataset, currentAggregation.aggregation)

                                        addClusterToTrace(cluster)

                                    }} />
                                </g>
                            }
                        })
                    }

                    { // Generates the plus icon that is shown when its empty
                        position.length == 0 && <g key={"plusmarker"}>
                            <line x1={midX} y1={0} x2={midX} y2={100} stroke={mainColor} strokeWidth="2"></line>
                            <Plus x={midX} y={100} r={10} onClick={() => {
                                if (currentAggregation.aggregation.length > 0) {
                                    let cluster = ACluster.fromSamples(this.props.dataset, this.props.currentAggregation.aggregation)

                                    addClusterToTrace(cluster)
                                }
                            }} />

                            <text x={60} y={120} textAnchor="middle" fontFamily="sans-serif" fontSize="12">
                                <tspan x="60" dy="1.2em">Select points and</tspan>
                                <tspan x="60" dy="1.2em">start a story</tspan>
                            </text>
                        </g>
                    }


                    { // Generates the diamond shapes
                        position.map((p, index) => {
                            let cluster = stories.trace.mainPath[index]

                            return < g key={`${p.x}${p.y}`
                            }>
                                {stories.activeTraceState === cluster && <circle cx={midX} cy={p.y} r={stateSize} fill={'transparent'} stroke={mainColor} strokeWidth="2" />}
                                <rect x={midX - 6} y={p.y - 6} width={stateSize} height={stateSize} fill={currentAggregation.selectedClusters.includes(cluster) ? mainColor : grayColor} transform={`rotate(45,${midX},${p.y})`} onClick={() => this.props.onClusterClicked(cluster)} />
                            </g>
                        })
                    }
                </svg>
            </div>
        </div >
    }
}

type InputType = {
    stories: StoriesType,
    position: { y: number, height: number, textY: number, mainEdge: string }[],
    elementHeight: number
    firstDiv: number
}

export const Storytelling = connector(function ({
    dataset,
    stories,
    currentAggregation,
    addClusterToTrace,
    setActiveTraceState,
    setActiveTrace,
    selectSideBranch,
    setSelectedCluster
}: Props) {

    if (stories.trace === null || stories.active === null) {
        return null
    }

    const itemRef = React.useRef<any>()

    const [playing, setPlaying] = React.useState(null)
    const [dirtyFlag, setDirtyFlag] = React.useState(0)

    const [input, setInput] = React.useState<InputType>(null)

    React.useEffect(() => {
        const observer = new ResizeObserver(() => {
            setDirtyFlag(Math.random())
        })
        observer.observe(itemRef.current)

        return () => {
            if (playing) {
                clearInterval(playing)
            }
            if (observer && itemRef.current) {
                observer.unobserve(itemRef.current)
            }
        }
    }, [])



    React.useEffect(() => {
        const current = itemRef.current
        if (current) {
            const state: { y: number, height: number, textY: number, mainEdge: any }[] = []
            let elementHeight = 0
            let firstDiv = 0

            for (var i = 1; i < current.children.length; i++) {
                const child = current.children[i] as HTMLElement;
                elementHeight = child.offsetHeight
                const fingerprint = child.childNodes.item(1)
                if (i == 1) {
                    // @ts-ignore
                    firstDiv = child.childNodes.item(0).offsetHeight + child.childNodes.item(1).offsetHeight / 2 + 16
                }
                state.push({
                    // @ts-ignore
                    y: child.firstChild.offsetTop - itemRef.current.offsetTop + child.firstChild.offsetHeight / 2,
                    height: child.offsetHeight,
                    // @ts-ignore
                    textY: child.firstChild.offsetTop,
                    mainEdge: stories.trace.mainEdges[i - 1]
                })
            }

            setInput({
                stories: stories,
                position: state,
                elementHeight: elementHeight,
                firstDiv: firstDiv
            })

        }
    }, [stories, dirtyFlag])


    React.useEffect(() => {
        if (stories.trace && stories.trace.mainPath.length > 0) {
            setActiveTraceState(stories.trace.mainPath[0])
            setSelectedCluster([stories.trace.mainPath[0]], false)
        }
    }, [stories.trace])



    return <Card className="ClusterOverviewParent" variant="outlined">

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <CardHeader
                style={{ paddingBottom: 0 }}
                action={
                    <IconButton onClick={() => {
                        setActiveTrace(null)
                    }}>
                        <CloseIcon />
                    </IconButton>
                }
                title="Storytelling"
            />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            }}>
                <IconButton aria-label="previous" onClick={() => {
                    if (stories.activeTraceState) {
                        let i = stories.trace.mainPath.indexOf(stories.activeTraceState)
                        let c: string = null
                        if (i == 0) {
                            c = stories.trace.mainPath[stories.trace.mainPath.length - 1]
                        } else {
                            c = stories.trace.mainPath[(i - 1) % stories.trace.mainPath.length]
                        }
                        setActiveTraceState(c)
                        setSelectedCluster([c], false)
                    } else {
                        setActiveTraceState(stories.trace.mainPath[0])
                        setSelectedCluster([stories.trace.mainPath[0]], false)
                    }
                }}>
                    <SkipPreviousIcon />
                </IconButton>
                <IconButton aria-label="play/pause" onClick={() => {
                    if (playing) {
                        clearInterval(playing)
                        setPlaying(null)
                    } else {
                        let interval = setInterval(() => {
                            let btn = document.getElementById('nextBtn')
                            if (btn) {
                                btn.click()
                            } else {
                                if (playing) {
                                    clearInterval(playing)
                                }
                            }
                        }, 2000)
                        setPlaying(interval)
                    }
                }}>
                    {playing ? <StopIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton aria-label="next" id="nextBtn" onClick={() => {
                    if (stories.activeTraceState) {
                        let i = stories.trace.mainPath.indexOf(stories.activeTraceState)
                        let c = stories.trace.mainPath[(i + 1) % stories.trace.mainPath.length]
                        setActiveTraceState(c)
                        setSelectedCluster([c], false)
                    } else {
                        setActiveTraceState(stories.trace.mainPath[0])
                        setSelectedCluster([stories.trace.mainPath[0]], false)
                    }
                }}>
                    <SkipNextIcon />
                </IconButton>
            </div>

            <div
                style={{ overflowY: 'auto' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '8px'
                }}>

                    <ProvenanceGraph
                        input={input}
                        currentAggregation={currentAggregation}
                        addClusterToTrace={addClusterToTrace}
                        selectSideBranch={selectSideBranch}
                        dataset={dataset}
                        onClusterClicked={(cluster) => {
                            setActiveTraceState(cluster)
                            setSelectedCluster([cluster], false)
                        }}
                    ></ProvenanceGraph>

                    <div ref={itemRef} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '100px'
                    }}>
                        <Typography align="center" variant="subtitle2">Summary</Typography>

                        {
                            stories.trace?.mainPath.map((cluster, index) => {
                                return <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        margin: 8
                                    }}
                                    onClick={() => {
                                        setActiveTraceState(cluster)
                                        setSelectedCluster([cluster], false)
                                    }}>
                                    <Typography noWrap gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', maxWidth: '250px' }}>{ACluster.getTextRepresentation(StoriesUtil.retrieveCluster(stories, cluster))}</Typography>

                                    <div className="ClusterItem"
                                        style={{
                                            border: currentAggregation.selectedClusters.includes(cluster) ? `1px solid ${mainColor}` : '1px solid rgba(0, 0, 0, 0.12)',
                                            borderRadius: 4,
                                            padding: '8px',
                                            display: 'flex'
                                        }}
                                    >
                                        <GenericLegend
                                            type={dataset.type}
                                            vectors={StoriesUtil.retrieveCluster(stories, cluster).indices.map(i => dataset.vectors[i])}
                                            scale={1}
                                            aggregate={true}
                                        />
                                    </div>
                                </div>
                            })
                        }
                    </div>


                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '100px',
                        position: 'relative'
                    }}>
                        <Typography align="center" variant="subtitle2">Difference</Typography>
                        {(dataset.type === DatasetType.Cohort_Analysis || dataset.type === DatasetType.None) && <DifferenceThresholdSlider />}

                        {
                            input && <div style={{ height: input.firstDiv - ((dataset.type === DatasetType.Cohort_Analysis || dataset.type === DatasetType.None) ? 76 : 0) }}></div>
                        }
                        {
                            input && input.position.slice(0, input.position.length - 1).map((elem, index) => {
                                let edge = StoriesUtil.retreiveEdge(stories, elem.mainEdge)
                                return <div
                                    key={index}
                                    className=""
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        //top: input.position[index].y + input.position[index].height / 2 - ((dataset.type === DatasetType.Coral || dataset.type === DatasetType.None) ? 76 : 0),
                                        height: (input.position[index + 1].y + input.position[index + 1].height / 2) - (input.position[index].y + input.position[index].height / 2) - 16,
                                        margin: 8,

                                    }}>
                                    <div

                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.12)',
                                            borderRadius: 4,
                                            padding: 8,
                                            maxHeight: '100%',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <GenericChanges

                                            scale={1}
                                            vectorsA={StoriesUtil.retrieveCluster(stories, edge.source).indices.map(i => dataset.vectors[i])}
                                            vectorsB={StoriesUtil.retrieveCluster(stories, edge.destination).indices.map(i => dataset.vectors[i])}
                                        />
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </Card>
})