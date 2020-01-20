import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';


const HEIGHT = 32
const WIDTH = 44

const useStyles = makeStyles({
    table: {
        width: WIDTH * 3 * 2 - 26,
        height: HEIGHT * 5,
        borderCollapse: 'collapse'
    },
    textcell: {
        height: HEIGHT,
        margin: '0',
        padding: '0',
        border: '0px'
    },
    rowtextcell: {
        height: HEIGHT,
        margin: '0',
        padding: '0 15px 0 0',
        border: '0px'
    },
    cell: {
        width: WIDTH,
        height: HEIGHT,
        background: '#70AD47',
        margin: '0',
        padding: '0',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: '#D9D9D9'
    },
    nocell: {
        width: WIDTH,
        height: HEIGHT,
        margin: '0',
        padding: '0',
        border: '1px solid black',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: '#D9D9D9'
    },
    oldcell: {
        width: WIDTH,
        height: HEIGHT,
        margin: '0',
        padding: '0',
        background: '#D9D9D9',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: '#D9D9D9'
    }
});


const marks = [
    {
        value: 0,
        label: '1800',
    },
    {
        value: 100,
        label: '2015',
    },
];


export var YearComp = ({ oldYear, newYear }) => {
    var lineStart = 16
    var lineEnd = 256
    var oldX = lineStart + (lineEnd - lineStart) * ((oldYear - 1800) / 215)
    var newX = lineStart + (lineEnd - lineStart) * ((newYear - 1800) / 215)

    return <svg width="272" height="96" viewBox="0 0 272 96">

        <line x1={lineStart} y1="48" x2={lineEnd} y2="48" stroke="black" />

        <circle cx={newX} cy="48" r="16" stroke="black" stroke-width="1" fill="#70AD47" />

        <circle cx={oldX} cy="48" r="10" stroke="black" stroke-width="1" fill="#D9D9D9" />

        <text x={newX} y="30" text-anchor="middle">{newYear}</text>
        <text x={oldX} y="30" text-anchor="middle">{oldYear}</text>

        <text x="0" y="70">1800</text>
        <text x="234" y="70">2015</text>
    </svg>
}


export var StoryLegend = ({ selectionState }) => {
    if (selectionState == null) {
        return <div>

        </div>
    }


    var vertical = ["gdp", "child_mortality", "fertility", "life_expect", "population"]
    var horizontal = ["x", "y", "size"]

    const classes = useStyles();
    return <Grid
        container
        style={{ background: 'white' }}
        alignItems="center"
        direction="column">
        <Table className={classes.table}>
            <TableBody>
                <TableRow>
                    <TableCell className={classes.textcell}></TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography component="div" fontWeight="fontWeightBold">X</Typography>
                    </TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography component="div" fontWeight="fontWeightBold">Y</Typography>
                    </TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography component="div" fontWeight="fontWeightBold">Size</Typography>
                    </TableCell>
                </TableRow>
                {vertical.map(row => (
                    <TableRow key={row.name}>
                        <TableCell className={classes.rowtextcell} align="right">{row}</TableCell>
                        {horizontal.map(col => {
                            var newVal = selectionState[`new_${col}`]
                            var oldVal = selectionState[`old_${col}`]
                            if (newVal == row) {
                                return <TableCell className={classes.cell} align="right"></TableCell>
                            } else if (newVal != oldVal && oldVal == row) {
                                return <TableCell className={classes.oldcell} align="right"></TableCell>
                            }
                            else {
                                return <TableCell className={classes.nocell} align="right"></TableCell>
                            }
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        <YearComp oldYear={selectionState.old_year} newYear={selectionState.new_year}></YearComp>
    </Grid>
}