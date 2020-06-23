import { FunctionComponent } from "react";
import { connect } from 'react-redux'
import * as React from 'react'
import { List, Typography, Paper } from "@material-ui/core";
import { active } from "d3";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import './StateSequenceDrawer.scss'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import BlurOffIcon from '@material-ui/icons/BlurOff';
import { Tool } from "../ToolSelection/ToolSelection";
import { DataLine } from "../util/datasetselector";
import { imageFromShape } from "../view/meshes";

type StateSequenceDrawerProps = {
    activeLine: DataLine,
    currentTool: Tool
}

const mapStateToProps = state => ({
    activeLine: state.activeLine,
    currentTool: state.currentTool
})



export const StateSequenceDrawer: FunctionComponent<StateSequenceDrawerProps> = connect(mapStateToProps, null)(({
    activeLine,
    currentTool
}: StateSequenceDrawerProps) => {
    if (currentTool != Tool.Crosshair || activeLine == null) {
        return <div></div>
    }

    

    return <Timeline className="StateSequenceDrawerParent" align="alternate">
        {
            activeLine.vectors.map((vector, index) => {
                return <TimelineItem style={{ minHeight: 30 }} onClick={() => {
                    console.log("hi")
                }}>
                    <TimelineSeparator>
                        <TimelineDot variant='outlined' color="secondary" >
                            
                            <img src={imageFromShape(vector.view.shapeType)} style={{
                                width: "1rem",
                                height: "1rem",
                                verticalAlign: "middle"
                            }} />
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography>{index}</Typography>
                    </TimelineContent>
                </TimelineItem>
            })
        }
    </Timeline>
})