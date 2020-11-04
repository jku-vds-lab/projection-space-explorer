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
import { addClusterToStory, addClusterToTrace, setActiveTraceState } from "../../Ducks/StoriesDuck";


const mapStateToProps = (state: RootState) => ({
    storyMode: state.storyMode,
    dataset: state.dataset,
    stories: state.stories,
    currentAggregation: state.currentAggregation
})

const mapDispatch = dispatch => ({
    addCluster: cluster => dispatch(addCluster(cluster)),
    addClusterToTrace: cluster => dispatch(addClusterToTrace(cluster)),
    setActiveTraceState: cluster => dispatch(setActiveTraceState(cluster))
})

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    itemClicked: any
    storyMode?: StoryMode
    dataset: Dataset
}

export const ClusterOverview = connector(function ({
    dataset,
    itemClicked,
    storyMode,
    stories,
    currentAggregation,
    addCluster,
    addClusterToTrace,
    setActiveTraceState }: Props) {

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
            for (var i = 0; i < current.children.length; i++) {
                const child = current.children[i];
                const rect = child.getBoundingClientRect()

                state.push({ y: child.offsetTop + 80 })
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
                            minHeight: '200px'
                        }}>

                            {position.map(p => {
                                return <circle cx="50" cy={p.y} r="6" fill="blue" />
                            })}

                            {position.map((p, i) => {
                                if (i != position.length - 1) {
                                    let p1 = p
                                    let p2 = position[i + 1]

                                    return <line x1={50} y1={p1.y} x2={50} y2={p2.y} stroke="blue" strokeWidth="2"></line>
                                } else {
                                    let p1 = p
                                    let p2 = { x: p1.x, y: p1.y + 50 }

                                    return <g>
                                        <line x1={50} y1={p1.y} x2={50} y2={p2.y} stroke="blue" strokeWidth="2"></line>
                                        <circle cx="50" cy={p2.y} r="6" fill="red" onClick={() => {
                                            let cluster = Cluster.fromSamples(currentAggregation)
                                            addCluster(cluster)
                                            addClusterToTrace(cluster)

                                        }} />
                                    </g>
                                }
                            })}

                            {
                                position.length == 0 ? <g>
                                    <line x1={50} y1={0} x2={50} y2={100} stroke="blue" strokeWidth="2"></line>
                                    <circle cx="50" cy={100} r="6" fill="red" onClick={() => {

                                        if (currentAggregation.length > 0) {
                                            let cluster = Cluster.fromSamples(currentAggregation)
                                            addCluster(cluster)
                                            addClusterToTrace(cluster)
                                        }


                                    }} />
                                </g> : <div></div>
                            }



                        </svg>
                    </div>

                    <div ref={itemRef} style={{
                        display: 'flex',
                        flexDirection: 'column'
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
                        flexDirection: 'column'
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