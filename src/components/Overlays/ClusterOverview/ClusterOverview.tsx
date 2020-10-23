import "./ClusterOverview.scss";
import * as React from 'react'
import Cluster, { Story } from "../../util/Cluster";
import { GenericFingerprint } from "../../legends/Generic";
import { Card, Grow, Link, CardHeader, CardContent } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect } from 'react-redux'
import { Dataset, DatasetType } from "../../util/datasetselector";
import { GenericChanges } from "../../legends/GenericChanges/GenericChanges";
import { StoryMode } from "../../Ducks/StoryModeDuck";


/**
 * Class that represents a trace through a story.
 */
class Trace {
    story: Story
    clusters: Cluster[]

    constructor(story: Story, clusters: Cluster[]) {
        this.story = story
        this.clusters = clusters
    }

    get traceStates() {
        return this.clusters
    }

    getBranchesForState(cluster: Cluster) {
        
    }
}



type ClusterOverviewProps = {
    story?: Story
    itemClicked: any
    storyMode?: StoryMode
    dataset: Dataset
}

const mapStateToProps = state => ({
    story: state.activeStory,
    storyMode: state.storyMode,
    dataset: state.dataset
})

const ClusterOverviewFull = function ({ dataset, story, itemClicked, storyMode }: ClusterOverviewProps) {
    if (story == null) {
        return <div></div>
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
                console.log(child.offsetTop)
                console.log(rect)
                state.push({ y: child.offsetTop + 80 })
            }
            setPositions(state)
        }

    }, [story])

    return <Grow in={story != null}>
        <Card className="ClusterOverviewParent">
            <CardHeader
                title="Story"
            />

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
                    height: '600px',
                    position: 'relative'
                }}>
                    <div >
                        <svg style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '120px'
                        }}>

                            {position.map(p => {
                                return <circle cx="50" cy={p.y} r="30" stroke="black" stroke-width="3" fill="red" />
                            })}

                            {position.map((p, i) => {
                                if (i != position.length - 1) {
                                    let p1 = p
                                    let p2 = position[i + 1]

                                    return <line x1={50} y1={p1.y} x2={50} y2={p2.y} stroke="black" strokeWidth="2"></line>
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
                            story?.clusters.map((cluster, index) => {
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
                            story?.edges.map((edge, index) => {
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
}


export const ClusterOverview = connect(mapStateToProps)(ClusterOverviewFull)