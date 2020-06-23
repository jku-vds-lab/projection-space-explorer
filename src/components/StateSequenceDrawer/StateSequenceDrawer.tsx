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
import highlightedSequence from "../Reducers/HighlightedSequenceReducer";
import { setHighlightedSequenceAction } from "../Actions/Actions";

type StateSequenceDrawerProps = {
    activeLine: DataLine,
    currentTool: Tool,
    setHighlightedSequence: any,
    highlightedSequence: any
}

const mapStateToProps = state => ({
    activeLine: state.activeLine,
    currentTool: state.currentTool,
    highlightedSequence: state.highlightedSequence
})

const mapDispatchToProps = dispatch => ({
    setHighlightedSequence: highlightedSequence => dispatch(setHighlightedSequenceAction(highlightedSequence))
})

export const StateSequenceDrawer: FunctionComponent<StateSequenceDrawerProps> = connect(mapStateToProps, mapDispatchToProps)(({
    activeLine,
    currentTool,
    setHighlightedSequence,
    highlightedSequence
}: StateSequenceDrawerProps) => {
    if (currentTool != Tool.Crosshair || activeLine == null) {
        return <div></div>
    }



    return <Paper className="StateSequenceDrawerParent">
        <Timeline>
            {
                activeLine.vectors.map((vector, index) => {
                    return <TimelineItem style={{ minHeight: 30 }} onClick={() => {
                        setHighlightedSequence({
                            previous: activeLine.vectors[index - 1],
                            current: vector,
                            next: activeLine.vectors[index + 1]
                        })
                    }}>
                        <TimelineSeparator>
                            <TimelineDot variant={highlightedSequence != null && highlightedSequence.current == vector ? 'default' : 'outlined'} color="secondary" >

                                <img src={imageFromShape(vector.view.shapeType)} style={{
                                    width: "1rem",
                                    height: "1rem",
                                    verticalAlign: "middle"
                                }} />
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            {index}
                        </TimelineContent>
                    </TimelineItem>
                })
            }
        </Timeline></Paper>
})