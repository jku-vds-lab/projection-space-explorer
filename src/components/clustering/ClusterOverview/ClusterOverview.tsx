import "./ClusterOverview.scss";
import * as React from 'react'
import Cluster, { Story } from "../../library/Cluster";
import { GenericFingerprint } from "../../legends/Generic";
import { Card, Slide, Grow, Link } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { connect } from 'react-redux'


type ClusterOverviewProps = {
    type: String
    story?: Story
    itemClicked: any
}

const mapStateToProps = state => ({
    story: state.activeStory
})

export var ClusterOverview = connect(mapStateToProps)(function ({ type, story, itemClicked }: ClusterOverviewProps) {
    if (story == null) {
        return <div></div>
    }

    const [active, setActive] = React.useState(0)

    return <Grow in={story != null}>
        <Card className="ClusterOverviewParent">
            <h6>Story Detail</h6>

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
                    story?.clusters.map((cluster, index) => {
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
            </ToggleButtonGroup>
        </Card>
    </Grow>
})