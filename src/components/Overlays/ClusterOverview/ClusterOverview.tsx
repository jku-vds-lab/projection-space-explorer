import "./ClusterOverview.scss";
import * as React from 'react'
import { Story } from "../../util/Cluster";
import { GenericFingerprint } from "../../legends/Generic";
import { Card, Grow, Link, CardHeader, CardContent } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect } from 'react-redux'
import { DatasetType } from "../../util/datasetselector";
import { StoryMode } from "../../Reducers/StoryModeReducer";
import { GenericChanges } from "../../legends/GenericChanges/GenericChanges";


type ClusterOverviewProps = {
    type: DatasetType
    story?: Story
    itemClicked: any
    storyMode?: StoryMode
}

const mapStateToProps = state => ({
    story: state.activeStory,
    storyMode: state.storyMode
})

export var ClusterOverview = connect(mapStateToProps)(function ({ type, story, itemClicked, storyMode }: ClusterOverviewProps) {
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
                                    type={type}
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
})