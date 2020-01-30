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
import ReactCountryFlag from "react-country-flag"


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

export var YearAggComp = ({ }) => {
    var lineStart = 60
    var lineEnd = 232 - 60

    return <svg width="232" height="96" viewBox="0 0 232 96">

        <line x1={lineStart} y1="48" x2={lineEnd} y2="48" stroke="black" />

        <text x="38" y="52" font-size="14" text-anchor="end">1800</text>
        <text x="190" y="52" font-size="14">2015</text>
    </svg>
}

export var YearComp = ({ oldYear, newYear }) => {

    var lineStart = 60
    var lineEnd = 232 - 60
    var oldX = lineStart + (lineEnd - lineStart) * ((oldYear - 1800) / 215)
    var newX = lineStart + (lineEnd - lineStart) * ((newYear - 1800) / 215)

    return <svg width="232" height="96" viewBox="0 0 232 96">

        <line x1={lineStart} y1="48" x2={lineEnd} y2="48" stroke="black" />

        <circle cx={newX} cy="48" r="14" stroke="black" stroke-width="1" fill="#70AD47" />

        <circle cx={oldX} cy="48" r="10" stroke="black" stroke-width="1" fill="#D9D9D9" />

        <text x={newX} y="20" font-size="14" text-anchor="middle">{newYear}</text>
        <text x={oldX} y="32" font-size="14" text-anchor="middle">{oldYear}</text>

        <text x="38" y="52" font-size="14" text-anchor="end">1800</text>
        <text x="190" y="52" font-size="14">2015</text>
    </svg>
}


export var StoryLegend = ({ selection }) => {
    if (selection == null) {
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

                {
                    selection.length == 1 ?
                        vertical.map(row => {
                            var selectionState = selection[0]
                            return <TableRow key={row.name}>
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
                        })
                        :
                        vertical.map(row => {
                            return <TableRow key={row.name}>
                                <TableCell className={classes.rowtextcell} align="right">{row}</TableCell>

                                {horizontal.map(col => {

                                    // col is x, y, size
                                    // row is child_mortality... fertility

                                    var percent =
                                        selection.length > 0 ? selection.filter(value => value[`new_${col}`] == row).length / selection.length : 0


                                    var W = WIDTH - 2
                                    var H = HEIGHT - 2
                                    var A = W * H
                                    var A2 = (W * H) * percent

                                    return <TableCell className={classes.nocell} align="right">
                                        <Grid align="center" justify="center" direction="column" container>
                                            <Grid item>
                                                <div style={{
                                                    background: '#70AD47',
                                                    width: Math.sqrt(((A / (A / A2)) * W) / H),
                                                    height: Math.sqrt(((A / (A / A2)) * H) / W)
                                                }}></div>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                })}
                            </TableRow>
                        })
                }


            </TableBody>
        </Table>

        {
            selection.length == 1 ?
                <YearComp oldYear={selection[0].old_year} newYear={selection[0].new_year}></YearComp>
                :
                <YearAggComp></YearAggComp>
        }

    </Grid>
}