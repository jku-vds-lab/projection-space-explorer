
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { Link, Divider } from '@material-ui/core';
import * as React from "react";

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}


const styles = {
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
};

type LineSelectionTreeProps = {
    algorithms: any
    onSelectAll: any
    onChange: any
    checkboxes: any
    colorScale: any
}

type LineSelectionTreeState = {
    expanded: any
}


export function LineSelectionTree_GetChecks(algorithms) {
    var ch = {}
    algorithms.forEach(algo => {
        algo.lines.forEach(line => {
            ch[line.line] = true
        })
    })
    return ch
}

export function LineSelectionTree_GenAlgos(vectors) {
    if (vectors == null) return {}
    var algorithms = []
    var t = [...new Set(vectors.map(vector => vector.algo))]
    t.forEach(algo => {
        var algoVectors = vectors.filter(vector => vector.algo == algo)
        var distinctLines = [...new Set(algoVectors.map(v => v.line))]
        algorithms.push({
            algo: algo,
            lines: distinctLines.map(line => {
                return {
                    line: line,
                    vectors: vectors.filter(v => v.line == line && v.algo == algo)
                }
            })
        })
    })
    return algorithms
}


export var LineSelectionTree = withStyles(styles)(class extends React.Component<LineSelectionTreeProps, LineSelectionTreeState> {
    constructor(props) {
        super(props)

        var state = {
            expanded: []
        }

        this.state = state
    }

    static getDerivedStateFromProps(props, state) {
        // Create a tree structure for our view
        var vectors = props.vectors
        if (vectors == null) return {}

        if (props.vectors != state.vectors) {
            return {
                vectors: props.vectors,
                expanded: []
            }
        } else {
            return {}
        }
    }

    render() {
        if (this.props.algorithms == null) return <div></div>

        return <TreeView
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            expanded={this.state.expanded}
            onNodeToggle={(event, nodes) => {
                this.setState({ expanded: nodes })
            }}
        >



            {
                this.props.algorithms.map(algo => {
                    return <TreeItem
                        key={algo.algo}
                        nodeId={algo.algo}
                        label={algo.algo}>
                        <Grid container direction="row">
                            <Grid item><Link href="#" onClick={() => {
                                this.props.onSelectAll(algo.algo, true)
                            }}>Select all</Link></Grid>

                            <Grid item>
                                <Divider orientation="vertical" style={{ margin: '0px 8px' }} />
                            </Grid>
                            <Grid item>
                                <Link href="#" onClick={() => {
                                    this.props.onSelectAll(algo.algo, false)
                                }}>Unselect all</Link>
                            </Grid>

                        </Grid>

                        {
                            algo.lines.map(line => {


                                return <TreeItem
                                    key={line.line}
                                    nodeId={line.line}
                                    label=
                                    {

                                        <div>
                                            <Checkbox
                                                color="primary"
                                                disableRipple
                                                style={{ padding: '3px 9px', color: `${this.props.colorScale != null ? this.props.colorScale.map(algo.algo).hex : ''}` }}
                                                onClick={(e) => { e.stopPropagation() }}
                                                onChange={(e, checked) => {
                                                    this.props.onChange(line.line, checked)
                                                }}
                                                checked={this.props.checkboxes[line.line]} />
                                            <div style={{ display: 'inline', userSelect: 'none' }}>{line.line}
                                            </div>
                                        </div>
                                    }

                                    onClick={(e) => {
                                        this.props.onChange(line.line, !this.props.checkboxes[line.line])
                                    }}
                                >


                                </TreeItem>
                            })
                        }
                    </TreeItem>
                })
            }

        </TreeView>
    }
})







export var LineTreePopover = ({ onChange, checkboxes, algorithms, colorScale, onSelectAll }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    return <div>
        <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
            Advanced Coloring
        </Button>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Grid style={{ padding: '12px', width: 300, maxHeight: 600 }} container alignItems="stretch" direction="column">
                <LineSelectionTree onChange={onChange} checkboxes={checkboxes} algorithms={algorithms} colorScale={colorScale} onSelectAll={onSelectAll}></LineSelectionTree>
            </Grid>

        </Popover>
    </div>
}