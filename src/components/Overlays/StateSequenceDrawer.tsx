/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { connect } from 'react-redux';
import * as React from 'react';
import { Typography, IconButton, Card, CardHeader } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StopIcon from '@mui/icons-material/Stop';
import { ResizeObserver } from 'resize-observer';
import { setActiveLine } from '../Ducks/ActiveLineDuck';
import { GenericLegend } from '../legends/Generic';
import { GenericChanges } from '../legends/GenericChanges';
import { DatasetType } from '../../model/DatasetType';
import { setHighlightedSequenceAction } from '../Ducks/HighlightedSequenceDuck';
import { Dataset } from '../../model/Dataset';
import { selectVectors } from '../Ducks/AggregationDuck';

type StateSequenceDrawerProps = {
  activeLine: string;
  setHighlightedSequence: any;
  dataset: Dataset;
  setActiveLine: any;
  setCurrentAggregation: (select: number[]) => void;
};

const mainColor = '#007dad';

/**
 * The StateSequenceDrawer is the UI element that is shown when one line is selected by the line selection tool. In this case
 * the user wants to navigate the sequence of one line only.
 */
function StateSequenceDrawer({ activeLine, setHighlightedSequence, dataset, setActiveLine, setCurrentAggregation }: StateSequenceDrawerProps) {
  if (activeLine == null) {
    return <div />;
  }

  const { vectors } = dataset.segments.find((seg) => seg.lineKey === activeLine);

  const stateSize = 12;
  const midX = 32;
  const grayColor = '#808080';

  const [selected, setSelected] = React.useState(0);
  const [playing, setPlaying] = React.useState(null);

  const itemRef = React.useRef();
  const [dirtyFlag, setDirtyFlag] = React.useState(0);
  const [input, setInput] = React.useState<any>(null);

  React.useEffect(() => {
    setSelected(0);

    setHighlightedSequence({
      previous: null,
      current: vectors[0],
      next: vectors[1],
    });
    setCurrentAggregation([vectors[0].__meta__.meshIndex]);
    setPlaying(null);
  }, [activeLine]);

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      setDirtyFlag(Math.random());
    });
    observer.observe(itemRef.current);

    return () => {
      if (observer && itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const { current } = itemRef;
    // @ts-ignore
    if (current && current.children.length > 0) {
      const state: { y: number; height: number; textY: number }[] = [];
      let elementHeight = 0;
      let firstDiv = 0;

      // @ts-ignore
      for (let i = 1; i < current.children.length; i++) {
        // @ts-ignore
        const child = current.children[i] as HTMLElement;
        elementHeight = child.offsetHeight;
        if (i === 1) {
          // @ts-ignore
          firstDiv = child.childNodes.item(0).offsetHeight + child.childNodes.item(1).offsetHeight / 2 + 16;
        }
        state.push({
          // @ts-ignore
          y: child.firstChild.offsetTop - itemRef.current.offsetTop + child.firstChild.offsetHeight / 2,
          height: child.offsetHeight,
          // @ts-ignore
          textY: child.firstChild.offsetTop,
        });
      }
      setInput({
        position: state,
        elementHeight,
        firstDiv,
      });
    }
  }, [dirtyFlag]);

  return (
    <Card className="ClusterOverviewParent" variant="outlined">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <CardHeader
          style={{ paddingBottom: 0 }}
          action={
            <IconButton
              aria-label="close"
              onClick={() => {
                setHighlightedSequence(null);
                setActiveLine(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          }
          title={`Line ${activeLine}`}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <IconButton
            aria-label="previous"
            onClick={() => {
              if (selected > 0) {
                setHighlightedSequence({
                  previous: vectors[selected - 2],
                  current: vectors[selected - 1],
                  next: vectors[selected],
                });

                setCurrentAggregation([vectors[selected - 1].__meta__.meshIndex]);
                let myElement = document.getElementById(`ssdChild${selected - 2}`);
                if (myElement) {
                  const topPos = myElement.offsetTop;
                  document.getElementById('ssdParent').scrollTop = topPos;
                } else {
                  myElement = document.getElementById(`ssdChild${selected - 1}`);
                  const topPos = myElement.offsetTop;
                  document.getElementById('ssdParent').scrollTop = topPos;
                }

                setSelected(selected - 1);
              } else {
                setHighlightedSequence({
                  previous: undefined,
                  current: vectors[vectors.length - 2],
                  next: vectors[vectors.length - 1],
                });
                setCurrentAggregation([vectors[vectors.length - 2].__meta__.meshIndex]);
                const myElement = document.getElementById(`ssdChild${vectors.length - 3}`);
                const topPos = myElement.offsetTop;
                document.getElementById('ssdParent').scrollTop = topPos;

                setSelected(vectors.length - 1);
              }
            }}
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            aria-label="play/pause"
            onClick={() => {
              if (playing) {
                clearInterval(playing);
                setPlaying(null);
              } else {
                const interval = setInterval(() => {
                  document.getElementById('nextBtn').click();
                }, 300);
                setPlaying(interval);
              }
            }}
          >
            {playing ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            aria-label="next"
            id="nextBtn"
            onClick={() => {
              if (selected + 1 < vectors.length) {
                setHighlightedSequence({
                  previous: vectors[selected],
                  current: vectors[selected + 1],
                  next: vectors[selected + 2],
                });
                setCurrentAggregation([vectors[selected + 1].__meta__.meshIndex]);
                const myElement = document.getElementById(`ssdChild${selected}`);
                const topPos = myElement.offsetTop;
                document.getElementById('ssdParent').scrollTop = topPos;

                setSelected(selected + 1);
              } else {
                setHighlightedSequence({
                  previous: vectors[0 - 1],
                  current: vectors[0],
                  next: vectors[0 + 1],
                });
                setCurrentAggregation([vectors[0].__meta__.meshIndex]);
                const myElement = document.getElementById(`ssdChild${0}`);
                const topPos = myElement.offsetTop;
                document.getElementById('ssdParent').scrollTop = topPos;

                setSelected(0);
              }
            }}
          >
            <SkipNextIcon />
          </IconButton>
        </div>

        <div id="ssdParent" style={{ overflowY: 'auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '8px',
            }}
          >
            <svg
              style={{
                height: '100%',
                maxWidth: '120px',
                minHeight: input && input.position && input.position.length > 0 ? input.position[input.position.length - 1].y + 100 : 200,
                width: '64px',
              }}
            >
              {
                // Generates the lines between the diamon
                input &&
                  input.position.map((p, i) => {
                    if (i !== input.position.length - 1) {
                      const p1 = p;
                      const p2 = input.position[i + 1];

                      return <line key={`${p.x}${p.y}`} x1={midX} y1={p1.y} x2={midX} y2={p2.y} stroke={mainColor} strokeWidth="2" />;
                    }

                    return null;
                  })
              }

              {input &&
                input.position.map((p, index) => {
                  return (
                    <g key={`${p.x}${p.y}`}>
                      {selected === index && <circle cx={midX} cy={p.y} r={stateSize} fill="transparent" stroke={mainColor} strokeWidth="2" />}
                      <circle
                        cx={midX}
                        cy={p.y}
                        r={stateSize / 2}
                        fill={selected === index ? mainColor : grayColor}
                        transform={`rotate(45,${midX},${p.y})`}
                        onClick={() => {}}
                      />
                    </g>
                  );
                })}
            </svg>

            <div ref={itemRef}>
              <Typography align="center" variant="subtitle2">
                State
              </Typography>

              {vectors.map((vector, index) => {
                return (
                  <div
                    key={vector.__meta__.meshIndex}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      margin: 8,
                    }}
                    onClick={() => {
                      setHighlightedSequence({
                        previous: vectors[index - 1],
                        current: vector,
                        next: vectors[index + 1],
                      });
                      setCurrentAggregation([vector.__meta__.meshIndex]);
                      setSelected(index);
                    }}
                  >
                    <Typography
                      noWrap
                      gutterBottom
                      style={{ fontWeight: 'bold', textAlign: 'center', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white', maxWidth: '250px' }}
                    >{`Point ${index}`}</Typography>

                    <div
                      className="ClusterItem"
                      id={`ssdChild${index}`}
                      style={{
                        border: selected === index ? `1px solid ${mainColor}` : '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: 4,
                        padding: '8px',
                        display: 'flex',
                      }}
                    >
                      <GenericLegend aggregate={false} type={dataset.type} vectors={[vector]} scale={1} options={{ root: 'sequence' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '100px',
                position: 'relative',
              }}
            >
              <Typography align="center" variant="subtitle2">
                Change
              </Typography>
              {input && (
                <div style={{ height: input.firstDiv - (dataset.type === DatasetType.Cohort_Analysis || dataset.type === DatasetType.None ? 76 : 0) }} />
              )}
              {input &&
                vectors.slice(0, vectors.length - 1).map((vector, index) => {
                  return (
                    <div
                      key={vector.__meta__.meshIndex}
                      className=""
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height:
                          input.position[index + 1].y +
                          input.position[index + 1].height / 2 -
                          (input.position[index].y + input.position[index].height / 2) -
                          16,
                        margin: 8,
                      }}
                    >
                      <div
                        style={{
                          border: '1px solid rgba(0, 0, 0, 0.12)',
                          borderRadius: 4,
                          padding: 8,
                          maxHeight: '100%',
                          overflowY: 'auto',
                        }}
                      >
                        <GenericChanges scale={1} vectorsA={[vectors[index]]} vectorsB={[vectors[index + 1]]} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  activeLine: state.activeLine,
  currentTool: state.currentTool,
  dataset: state.dataset,
  stories: state.stories,
});

const mapDispatchToProps = (dispatch) => ({
  setHighlightedSequence: (highlightedSequence) => dispatch(setHighlightedSequenceAction(highlightedSequence)),
  setActiveLine: (activeLine) => dispatch(setActiveLine(activeLine)),
  // setCurrentAggregation: (currentAggregation, clusters) => dispatch(setAggregationAction(currentAggregation, clusters))
  setCurrentAggregation: (currentAggregation: number[]) => dispatch(selectVectors(currentAggregation)),
});

export const StateSequenceDrawerRedux = connect(mapStateToProps, mapDispatchToProps)(StateSequenceDrawer);
