import { FunctionComponent } from "react";
import { connect } from 'react-redux'
import * as React from 'react'
import { Paper, Typography, Divider, Link, IconButton, Card, CardHeader, CardContent } from "@material-ui/core";
import './StateSequenceDrawer.scss'
import { Tool } from "../ToolSelection/ToolSelection";
import { DataLine, Dataset } from "../../util/datasetselector";
import { imageFromShape } from "../../WebGLView/meshes";
import { setHighlightedSequenceAction, setActiveLineAction } from "../../Actions/Actions";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

type StateSequenceDrawerProps = {
    activeLine?: DataLine,
    currentTool?: Tool,
    setHighlightedSequence?: any,
    highlightedSequence?: any,
    dataset?: Dataset,
    setActiveLine?: any
}

const mapStateToProps = state => ({
    activeLine: state.activeLine,
    currentTool: state.currentTool,
    highlightedSequence: state.highlightedSequence,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setHighlightedSequence: highlightedSequence => dispatch(setHighlightedSequenceAction(highlightedSequence)),
    setActiveLine: activeLine => dispatch(setActiveLineAction(activeLine))
})

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    primaryTail: {
        backgroundColor: theme.palette.primary.main,
    },
}));

/**
 * The StateSequenceDrawer is the UI element that is shown when one line is selected by the line selection tool. In this case
 * the user wants to navigate the sequence of one line only.
 */
export const StateSequenceDrawer: FunctionComponent<StateSequenceDrawerProps> = connect(mapStateToProps, mapDispatchToProps)(({
    activeLine,
    currentTool,
    setHighlightedSequence,
    highlightedSequence,
    dataset,
    setActiveLine
}: StateSequenceDrawerProps) => {
    if (activeLine == null) {
        return <div></div>
    }

    const classes = useStyles();
    const [selected, setSelected] = React.useState(0)
    React.useEffect(() => {
        setSelected(0)
        setHighlightedSequence({
            previous: null,
            current: activeLine.vectors[0],
            next: activeLine.vectors[1]
        })
    }, [activeLine])


    return <Card className="StateSequenceDrawerParent">
        <CardHeader
            action={
                <IconButton aria-label="close" onClick={() => {
                    setHighlightedSequence(null)
                    setActiveLine(null)
                }}>
                    <CloseIcon />
                </IconButton>
            }
            title="Line Sequence"
        />
        <CardContent className="StateSequenceDrawerPaper">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Link href="#" onClick={() => {
                    setSelected(selected + 1)
                    setHighlightedSequence({
                        previous: activeLine.vectors[selected - 1],
                        current: activeLine.vectors[selected],
                        next: activeLine.vectors[selected + 1]
                    })
                }}>Next</Link>

                <Divider style={{ margin: '8px 0 0 0' }} />

                <div style={{
                    overflowY: 'auto',
                    height: '50vh'
                }}>
                    <Timeline style={{ padding: 0 }}>
                        {
                            activeLine.vectors.map((vector, index) => {
                                return <TimelineItem
                                    key={index}
                                    onClick={() => {
                                        setHighlightedSequence({
                                            previous: activeLine.vectors[index - 1],
                                            current: vector,
                                            next: activeLine.vectors[index + 1]
                                        })
                                        setSelected(index)
                                    }}
                                >
                                    <TimelineOppositeContent style={{
                                        width: 0,
                                        minWidth: 0,
                                        display: 'none'
                                    }}>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot variant={selected == index ? 'default' : 'outlined'} color={selected == index ? 'primary' : 'grey'}>

                                        </TimelineDot>
                                        <TimelineConnector className={selected == index ? classes.primaryTail : ''} />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Paper elevation={3} className={classes.paper}>
                                            <Typography>{dataset.hasColumn('changes') ? vector['changes'] : `Point ${index}`}</Typography>
                                        </Paper>
                                    </TimelineContent>
                                </TimelineItem>
                            })
                        }
                    </Timeline>
                </div>
            </div>
        </CardContent>
    </Card>

})