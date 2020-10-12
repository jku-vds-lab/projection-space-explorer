import "./ClusterOverview.scss";
import * as React from 'react'
import { Story } from "../../util/Cluster";
import { GenericFingerprint } from "../../legends/Generic";
import { Card, Grow, Link, CardHeader, CardContent } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect } from 'react-redux'
import { Dataset, DatasetType } from "../../util/datasetselector";
import { GenericChanges } from "../../legends/GenericChanges/GenericChanges";
import { StoryMode } from "../../Ducks/StoryModeDuck";


type ClusterOverviewProps = {
    type: DatasetType
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

    const [active, setActive] = React.useState(0)

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

                <ToggleButtonGroup
                    className="ClusterOverviewItems"
                    orientation="vertical"
                    value={active}
                    exclusive
                    onChange={(e, newActive) => setActive(newActive)}

                >
                    {
                        storyMode == StoryMode.Cluster && story?.clusters.map((cluster, index) => {
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
                    {
                        storyMode == StoryMode.Difference && story?.edges.map((edge, index) => {
                            return <ToggleButton
                                key={index}
                                className="ClusterItem"
                                value={index}
                                onClick={() => {
                                    itemClicked(edge.destination)
                                }}>
                                    <GenericChanges
                                        vectorsA={edge.source.vectors}
                                        vectorsB={edge.destination.vectors}
                                    />
                            </ToggleButton>
                        })
                    }
                </ToggleButtonGroup>
            </CardContent>
        </Card>
    </Grow>
}


export const ClusterOverview = connect(mapStateToProps)(ClusterOverviewFull)