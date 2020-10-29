import "./ClusterOverview.scss";
import * as React from 'react'
import Cluster, { Story } from "../../util/Cluster";
import { GenericFingerprint } from "../../legends/Generic";
import { Card, Grow, Link, CardHeader, CardContent } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect, ConnectedProps } from 'react-redux'
import { Dataset, DatasetType } from "../../util/datasetselector";
import { GenericChanges } from "../../legends/GenericChanges/GenericChanges";
import { StoryMode } from "../../Ducks/StoryModeDuck";
import { RootState } from "../../Store/Store";


const mapStateToProps = (state: RootState) => ({
    story: state.activeStory,
    storyMode: state.storyMode,
    dataset: state.dataset,
    activeTrace: state.activeTrace
})

const connector = connect(mapStateToProps, null);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    story?: Story
    itemClicked: any
    storyMode?: StoryMode
    dataset: Dataset
}

export const ClusterOverview = connector(function ({ dataset, itemClicked, storyMode, activeTrace, story }: Props) {
    if (activeTrace == null || story == null) {
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

    }, [activeTrace])

    return <Grow in={story != null}>
        <Card className="ClusterOverviewParent">
            <CardContent>
                <Link href="#" onClick={() => {
                    var newActive = (active + 1) % story.clusters.length
                    setActive(newActive)
                    itemClicked(story.clusters[newActive])
                }}>
                    Next
            </Link>

                <hr></hr>

                <div style={{
                    display: 'flex',
                    overflowY: 'auto',
                    height: '100vh',
                    position: 'relative'
                }}>
                    <div >
                        <svg style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '120px'
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
                                    return null
                                }
                            })}



                        </svg>
                    </div>

                    <div ref={itemRef} style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {
                            activeTrace?.mainPath.map((cluster, index) => {
                                return <ToggleButton
                                    key={index}
                                    className="ClusterItem"
                                    value={index}
                                    onClick={() => {
                                        itemClicked(cluster)
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
                        {
                            activeTrace?.mainEdges.map((edge, index) => {
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
            </CardContent>
        </Card>
    </Grow>
})