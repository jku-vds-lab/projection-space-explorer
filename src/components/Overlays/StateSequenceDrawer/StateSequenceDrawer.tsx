import { connect } from 'react-redux'
import * as React from 'react'
import { Paper, Typography, Divider, IconButton, Card, CardHeader, CardContent } from "@material-ui/core";
import './StateSequenceDrawer.scss'
import { Tool } from "../ToolSelection/ToolSelection";
import { DataLine, Dataset } from "../../util/datasetselector";
import { imageFromShape } from "../../WebGLView/meshes";
import { setHighlightedSequenceAction } from "../../Ducks/HighlightedSequenceDuck";
import { setAggregationAction } from "../../Ducks/AggregationDuck";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop';
import { setActiveLine } from '../../Ducks/ActiveLineDuck';

type StateSequenceDrawerProps = {
    activeLine: DataLine,
    currentTool: Tool,
    setHighlightedSequence: any,
    highlightedSequence: any,
    dataset: Dataset,
    setActiveLine: any
    setCurrentAggregation: any
}



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
const StateSequenceDrawer = ({
    activeLine,
    setHighlightedSequence,
    dataset,
    setActiveLine,
    setCurrentAggregation
}: StateSequenceDrawerProps) => {
    if (activeLine == null) {
        return <div></div>
    }

    const classes = useStyles();
    const [selected, setSelected] = React.useState(0)
    const [playing, setPlaying] = React.useState(null)
    React.useEffect(() => {
        setSelected(0)

        setHighlightedSequence({
            previous: null,
            current: activeLine.vectors[0],
            next: activeLine.vectors[1]
        })
        setCurrentAggregation([activeLine.vectors[0]])
        setPlaying(null)
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
            title={`Line ${activeLine.lineKey}`}
        />
        <CardContent className="StateSequenceDrawerPaper">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <IconButton aria-label="previous" onClick={() => {
                        if (selected > 0) {
                            setHighlightedSequence({
                                previous: activeLine.vectors[selected - 2],
                                current: activeLine.vectors[selected - 1],
                                next: activeLine.vectors[selected]
                            })

                            setCurrentAggregation([activeLine.vectors[selected - 1]])
                            let myElement = document.getElementById(`ssdChild${selected - 2}`)
                            if (myElement) {
                                let topPos = myElement.offsetTop
                                document.getElementById('ssdParent').scrollTop = topPos
                            } else {
                                myElement = document.getElementById(`ssdChild${selected - 1}`)
                                let topPos = myElement.offsetTop
                                document.getElementById('ssdParent').scrollTop = topPos
                            }

                            setSelected(selected - 1)
                        } else {
                            setHighlightedSequence({
                                previous: undefined,
                                current: activeLine.vectors[activeLine.vectors.length - 2],
                                next: activeLine.vectors[activeLine.vectors.length - 1]
                            })
                            setCurrentAggregation([activeLine.vectors[activeLine.vectors.length - 2]])
                            let myElement = document.getElementById(`ssdChild${activeLine.vectors.length - 3}`)
                            let topPos = myElement.offsetTop
                            document.getElementById('ssdParent').scrollTop = topPos

                            setSelected(activeLine.vectors.length - 1)
                        }
                    }}>
                        <SkipPreviousIcon />
                    </IconButton>
                    <IconButton aria-label="play/pause" onClick={() => {
                        if (playing) {
                            clearInterval(playing)
                            setPlaying(null)
                        } else {
                            let interval = setInterval(() => {
                                document.getElementById('nextBtn').click()
                            }, 300)
                            setPlaying(interval)
                        }
                    }}>
                        {playing ? <StopIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton aria-label="next" id="nextBtn" onClick={() => {
                        if (selected + 1 < activeLine.vectors.length) {
                            setHighlightedSequence({
                                previous: activeLine.vectors[selected],
                                current: activeLine.vectors[selected + 1],
                                next: activeLine.vectors[selected + 2]
                            })
                            setCurrentAggregation([activeLine.vectors[selected + 1]])
                            let myElement = document.getElementById(`ssdChild${selected}`)
                            let topPos = myElement.offsetTop
                            document.getElementById('ssdParent').scrollTop = topPos

                            setSelected(selected + 1)
                        } else {
                            setHighlightedSequence({
                                previous: activeLine.vectors[0 - 1],
                                current: activeLine.vectors[0],
                                next: activeLine.vectors[0 + 1]
                            })
                            setCurrentAggregation([activeLine.vectors[0]])
                            let myElement = document.getElementById(`ssdChild${0}`)
                            let topPos = myElement.offsetTop
                            document.getElementById('ssdParent').scrollTop = topPos

                            setSelected(0)
                        }
                    }}>
                        <SkipNextIcon />
                    </IconButton>
                </div>

                <Divider style={{ margin: '8px 0 0 0' }} />

                <div id='ssdParent' style={{
                    overflowY: 'auto',
                    height: '50vh',
                    position: 'relative'
                }}>
                    <Timeline style={{ padding: 0 }}>
                        {
                            activeLine.vectors.map((vector, index) => {
                                return <div
                                    id={`ssdChild${index}`}
                                    onClick={() => {
                                        setHighlightedSequence({
                                            previous: activeLine.vectors[index - 1],
                                            current: vector,
                                            next: activeLine.vectors[index + 1]
                                        })
                                        setCurrentAggregation([vector])
                                        setSelected(index)
                                    }}>
                                    <TimelineItem key={index}>
                                        <TimelineOppositeContent style={{
                                            width: 0,
                                            minWidth: 0,
                                            display: 'none'
                                        }}>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot variant={selected == index ? 'default' : 'outlined'} color={selected == index ? 'primary' : 'grey'}>

                                            </TimelineDot>
                                            <TimelineConnector className={selected == index || selected == index + 1 ? classes.primaryTail : ''} />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Paper elevation={3} className={classes.paper}>

                                                <Typography><img src={imageFromShape(vector.view.shapeType)} style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                    textAlign: 'center'
                                                }} /> {dataset.hasColumn('changes') ? vector['changes'] : `Point ${index}`}</Typography>
                                            </Paper>
                                        </TimelineContent>
                                    </TimelineItem>
                                </div>
                            })
                        }
                    </Timeline>
                </div>
            </div>
        </CardContent>
    </Card >

}



const mapStateToProps = state => ({
    activeLine: state.activeLine,
    currentTool: state.currentTool,
    highlightedSequence: state.highlightedSequence,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setHighlightedSequence: highlightedSequence => dispatch(setHighlightedSequenceAction(highlightedSequence)),
    setActiveLine: activeLine => dispatch(setActiveLine(activeLine)),
    setCurrentAggregation: currentAggregation => dispatch(setAggregationAction(currentAggregation))
})


export const StateSequenceDrawerRedux = connect(mapStateToProps, mapDispatchToProps)(StateSequenceDrawer)