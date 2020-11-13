import "./ClusterOverview.scss";
import * as React from 'react'
import Cluster from "../../util/Cluster";
import { Story } from "../../util/Story";
import { GenericFingerprint } from "../../legends/Generic";
import { Card, Grow, Link, CardHeader, CardContent, Button, Typography } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect, ConnectedProps } from 'react-redux'
import { Dataset, DatasetType } from "../../util/datasetselector";
import { GenericChanges } from "../../legends/GenericChanges/GenericChanges";
import { StoryMode } from "../../Ducks/StoryModeDuck";
import { RootState } from "../../Store/Store";
import { addCluster } from "../../Ducks/CurrentClustersDuck";
import { addClusterToStory, addClusterToTrace, selectSideBranch, setActiveTraceState } from "../../Ducks/StoriesDuck";


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

    const [active, setActive] = React.useState(0)

    const [position, setPositions] = React.useState([])



    React.useEffect(() => {
        const current = itemRef.current
        if (current) {
            const state = []
            for (var i = 1; i < current.children.length; i++) {
                const child = current.children[i];

                state.push({ y: child.offsetTop + child.offsetHeight / 2 - current.children[1].offsetTop })
            }
            setPositions(state)
        }
    }, [stories])

    React.useEffect(() => {
        setActiveTraceState(stories.trace.mainPath[0])
    }, [stories.trace])



    return <Grow in={stories.active != null}>
        <Card className="ClusterOverviewParent">

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>

                    <div>
                        <Typography align="center" variant="subtitle2">Provenance</Typography>
                        <svg style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '120px',
                            minHeight: '200px',
                            minWidth: '100px'
                        }}>

                            {position.map((p, index) => {
                                let cluster = stories.trace.mainPath[index]
                                let sidePathIndex = stories.trace.sidePaths.findIndex(sidePath => {
                                    return sidePath.edges.find(edge => edge.source == cluster)
                                })


                                return <g>
                                    <text x="60" y={p.y} fill="black">{index}</text>
                                    <circle cx="50" cy={p.y} r="6" fill="blue" />

                                    {sidePathIndex >= 0 &&
                                        <g>
                                            <line x1={50} y1={p.y} x2={30} y2={p.y + 40} stroke="gray" strokeWidth={2}></line>
                                            <Circle x={30} y={p.y + 40} onClick={() => {
                                                selectSideBranch(sidePathIndex)
                                            }}></Circle>
                                        </g>}
                                </g>
                            })}

                            {position.map((p, i) => {
                                if (i != position.length - 1) {
                                    let p1 = p
                                    let p2 = position[i + 1]

                                    return <line x1={50} y1={p1.y} x2={50} y2={p2.y} stroke="blue" strokeWidth="2"></line>
                                } else {
                                    let p1 = p
                                    let p2 = { x: p1.x, y: p1.y + 40 }

                                    return <g>
                                        <line x1={50} y1={p1.y} x2={50} y2={p2.y} stroke="blue" strokeWidth="2"></line>
                                        <Plus x={50} y={p2.y} r={10} onClick={() => {
                                            let cluster = Cluster.fromSamples(currentAggregation)
                                            addCluster(cluster)
                                            addClusterToTrace(cluster)

                                        }} />
                                    </g>
                                }
                            })}

                            {
                                position.length == 0 && <g>
                                    <line x1={50} y1={0} x2={50} y2={100} stroke="blue" strokeWidth="2"></line>
                                    <Plus x={50} y={50} r={10} onClick={() => {

                                        if (currentAggregation.length > 0) {
                                            let cluster = Cluster.fromSamples(currentAggregation)
                                            addCluster(cluster)
                                            addClusterToTrace(cluster)
                                        }


                                    }} />
                                </g>
                            }



                        </svg>
                    </div>

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