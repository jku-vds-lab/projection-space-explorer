import { connect } from 'react-redux'
import * as React from 'react'
import { Paper, Typography, Divider, IconButton, Card, CardHeader, CardContent } from "@material-ui/core";
import './StateSequenceDrawer.scss'
import { Tool } from "../ToolSelection/ToolSelection";
import { DataLine } from "../../Utility/Data/DataLine";
import { Dataset } from "../../Utility/Data/Dataset";
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
import { GenericLegend } from '../../legends/Generic';
import { GenericChanges } from '../../legends/GenericChanges/GenericChanges';
import { DatasetType } from '../../Utility/Data/DatasetType';
import { ResizeObserver } from 'resize-observer';

type StateSequenceDrawerProps = {
    activeLine: DataLine,
    currentTool: Tool,
    setHighlightedSequence: any,
    highlightedSequence: any,
    dataset: Dataset,
    setActiveLine: any
    setCurrentAggregation: any
}

const mainColor = '#007dad'

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

    const stateSize = 12;
    const midX = 32
    const grayColor = '#808080'

    const classes = useStyles();
    const [selected, setSelected] = React.useState(0)
    const [playing, setPlaying] = React.useState(null)

    const itemRef = React.useRef()
    const [dirtyFlag, setDirtyFlag] = React.useState(0)
    const [input, setInput] = React.useState<any>(null)

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


    React.useEffect(() => {
        const observer = new ResizeObserver(() => {
            setDirtyFlag(Math.random())
        })
        observer.observe(itemRef.current)

        return () => {
            if (observer && itemRef.current) {
                observer.unobserve(itemRef.current)
            }
        }
    }, [])


    React.useEffect(() => {
        const current = itemRef.current
        //@ts-ignore
        if (current && current.children.length > 0) {
            const state: { y: number, height: number, textY: number }[] = []
            let elementHeight = 0
            let firstDiv = 0

            //@ts-ignore
            for (var i = 1; i < current.children.length; i++) {
                //@ts-ignore
                const child = current.children[i] as HTMLElement;
                elementHeight = child.offsetHeight
                const fingerprint = child.childNodes.item(1)
                if (i == 1) {
                    // @ts-ignore
                    firstDiv = child.childNodes.item(0).offsetHeight + child.childNodes.item(1).offsetHeight / 2 + 16
                }
                state.push({
                    // @ts-ignore
                    y: child.firstChild.offsetTop - itemRef.current.offsetTop + child.firstChild.offsetHeight / 2,
                    height: child.offsetHeight,
                    // @ts-ignore
                    textY: child.firstChild.offsetTop
                })
            }
            setInput({
                position: state,
                elementHeight: elementHeight,
                firstDiv: firstDiv
            })
        }
    }, [dirtyFlag])


    return <Card className="ClusterOverviewParent" variant="outlined">

        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
            <CardHeader
                style={{ paddingBottom: 0 }}
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
            <div

                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
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

            <div
                id={'ssdParent'}
                style={{ overflowY: 'auto' }}>
                <div

                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '8px'
                    }}>

                    <svg style={{
                        height: '100%',
                        maxWidth: '120px',
                        minHeight: input && input.position && input.position.length > 0 ? input.position[input.position.length - 1].y + 100 : 200,
                        width: '64px'
                    }}>

                        { // Generates the lines between the diamon 
                            input && input.position.map((p, i) => {
                                if (i != input.position.length - 1) {
                                    let p1 = p
                                    let p2 = input.position[i + 1]

                                    return <line key={`${p.x}${p.y}`} x1={midX} y1={p1.y} x2={midX} y2={p2.y} stroke={mainColor} strokeWidth="2"></line>
                                }
                            })
                        }

                        {
                            input && input.position.map((p, index) => {
                                return < g key={`${p.x}${p.y}`
                                }>
                                    {selected === index && <circle cx={midX} cy={p.y} r={stateSize} fill={'transparent'} stroke={mainColor} strokeWidth="2" />}
                                    <circle cx={midX} cy={p.y} r={stateSize / 2} fill={selected === index ? mainColor : grayColor} transform={`rotate(45,${midX},${p.y})`} onClick={() => { }} />
                                </g>
                            })
                        }
                    </svg>

                    <div ref={itemRef}>
                        <Typography align="center" variant="subtitle2">State</Typography>

                        {
                            activeLine.vectors.map((vector, index) => {
                                return <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        margin: 8
                                    }}
                                    onClick={() => {
                                        setHighlightedSequence({
                                            previous: activeLine.vectors[index - 1],
                                            current: vector,
                                            next: activeLine.vectors[index + 1]
                                        })
                                        setCurrentAggregation([vector])
                                        setSelected(index)
                                    }}>
                                    <Typography noWrap gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', maxWidth: '250px' }}>{`Point ${index}`}</Typography>

                                    <div className="ClusterItem"
                                        id={`ssdChild${index}`}
                                        style={{
                                            border: selected == index ? `1px solid ${mainColor}` : '1px solid rgba(0, 0, 0, 0.12)',
                                            borderRadius: 4,
                                            padding: '8px',
                                            display: 'flex'
                                        }}
                                    >
                                        <GenericLegend aggregate={false} type={dataset.type} vectors={[vector]} hoverUpdate={null} scale={1}></GenericLegend>
                                    </div>
                                </div>
                            })
                        }
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '100px',
                        position: 'relative'
                    }}>
                        <Typography align="center" variant="subtitle2">Change</Typography>
                        {
                            input && <div style={{ height: input.firstDiv - ((dataset.type === DatasetType.Coral || dataset.type === DatasetType.None) ? 76 : 0) }}></div>
                        }
                        {
                            input && activeLine.vectors.slice(0, activeLine.vectors.length - 1).map((vector, index) => {
                                return <div
                                    key={index}
                                    className=""
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        //top: input.position[index].y + input.position[index].height / 2 - ((dataset.type === DatasetType.Coral || dataset.type === DatasetType.None) ? 76 : 0),
                                        height: (input.position[index + 1].y + input.position[index + 1].height / 2) - (input.position[index].y + input.position[index].height / 2) - 16,
                                        margin: 8,

                                    }}>
                                    <div

                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.12)',
                                            borderRadius: 4,
                                            padding: 8,
                                            maxHeight: '100%',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <GenericChanges
                                            scale={1}
                                            vectorsA={[activeLine.vectors[index]]}
                                            vectorsB={[activeLine.vectors[index + 1]]}
                                        />
                                    </div>
                                </div>
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    </Card >

}



const mapStateToProps = state => ({
    activeLine: state.activeLine,
    currentTool: state.currentTool,
    highlightedSequence: state.highlightedSequence,
    dataset: state.dataset,
    stories: state.stories
})

const mapDispatchToProps = dispatch => ({
    setHighlightedSequence: highlightedSequence => dispatch(setHighlightedSequenceAction(highlightedSequence)),
    setActiveLine: activeLine => dispatch(setActiveLine(activeLine)),
    // setCurrentAggregation: (currentAggregation, clusters) => dispatch(setAggregationAction(currentAggregation, clusters))
    setCurrentAggregation: (currentAggregation) => dispatch(setAggregationAction(currentAggregation))
})


export const StateSequenceDrawerRedux = connect(mapStateToProps, mapDispatchToProps)(StateSequenceDrawer)