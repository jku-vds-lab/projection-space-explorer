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
import Flag from "react-flags";
import { getCountryCode } from '../util/isocountries';
import { Divider } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const theme = createMuiTheme({
    typography: {
        subtitle1: {
            fontSize: 11,
        }
    },
});


const HEIGHT = 32
const WIDTH = 44

const useStyles = makeStyles({
    table: {
        width: WIDTH * 6,
        height: HEIGHT * 6,
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
    },
    smalltable: {
        width: WIDTH * 6,
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
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

export var YearAggComp = ({ selection }) => {
    var lineStart = 20
    var lineEnd = 232 - 20
    if (selection == null || selection == undefined || selection.length == 0) {


        return <svg width="232" height="76" viewBox="0 0 232 76">

            <line x1={lineStart} y1="38" x2={lineEnd} y2="38" stroke="black" />

        </svg>


    }



    var years = [...new Set(selection.map(value => value.new_year))]
    years.sort()
    var count = years.map(year => selection.filter(s => s.new_year == year).length)
    var max = Math.max(...count)
    var segmentWidth = 14



    return <svg width="232" height="76" viewBox="0 0 232 76">

        <line x1={lineStart} y1="38" x2={lineEnd} y2="38" stroke="black" />

        {


            years.map((year, i) => {
                var startX = ((lineEnd - lineStart) / 2) - ((segmentWidth * years.length) / 2)
                var newX = startX + i * segmentWidth
                return <text font-size="12" transform={`rotate(45, ${newX}, ${48})`} x={newX} y={46}>{year}</text>
            })
        }
        {
            years.map((year, i) => {
                var startX = ((lineEnd - lineStart) / 2) - ((segmentWidth * years.length) / 2)
                var newX = startX + i * segmentWidth
                var h = ((count[i] / max) * 30) + 2
                return <rect stroke-width={1} x={newX} y={38 - h} width={10} height={h}></rect>
            })
        }
    </svg>
}



export var YearComp = ({ oldYear, newYear }) => {
    var lineStart = 60
    var lineEnd = 232 - 60
    var oldX = lineStart + (lineEnd - lineStart) * ((oldYear - 1800) / 215)
    var newX = lineStart + (lineEnd - lineStart) * ((newYear - 1800) / 215)

    return <svg width="232" height="76" viewBox="0 0 232 76">

        <line x1={lineStart} y1="48" x2={lineEnd} y2="48" stroke="black" />

        <circle cx={newX} cy="48" r="14" stroke="black" stroke-width="1" fill="#70AD47" />

        <circle cx={oldX} cy="48" r="10" stroke="black" stroke-width="1" fill="#D9D9D9" />

        <text x={newX} y="20" font-size="14" text-anchor="middle" fill="#70AD47">{newYear}</text>
        <text x={oldX} y="32" font-size="14" text-anchor="middle" fill="#D9D9D9">{oldYear}</text>

        <text x="38" y="52" font-size="14" text-anchor="end">1800</text>
        <text x="190" y="52" font-size="14">2015</text>
    </svg>
}


function parseCountries(countries) {
    if (countries == null) return []

    try {
        var replaced = countries.replace(/'/g, '"').replace(/;/g, ',')
        var parsed = JSON.parse(`{ "result": ${replaced} }`)
        if (parsed == null) {
            return []
        } else {
            return parsed.result
        }
    } catch(e) {
        return ['error']
    }
}

export var StoryLegend = ({ selection }) => {
    if (selection == null) {
        return <div>
        </div>
    }

    var vertical = ["gdp", "child_mortality", "fertility", "life_expect", "population"]
    var horizontal = ["x", "y", "size"]

    var allCountries = [...new Set(selection.flatMap(s => parseCountries(s.new_country)))]

    const classes = useStyles();
    return <ThemeProvider theme={theme}><Grid
        container
        style={{ background: 'white' }}
        alignItems="center"
        direction="column">



        <Table className={classes.table}>
            <TableBody>
                <TableRow>
                    <TableCell className={classes.textcell} style={{ width: 2 * WIDTH }}></TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography variant='subtitle2'>X</Typography>
                    </TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography variant='subtitle2'>Y</Typography>
                    </TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography variant='subtitle2'>Size</Typography>
                    </TableCell>
                    <TableCell className={classes.textcell} align="center">
                        <Typography variant='subtitle2'>Color</Typography>
                    </TableCell>
                </TableRow>

                {
                    selection.length == 1 ?
                        vertical.map(row => {
                            var selectionState = selection[0]
                            return <TableRow key={row.name}>
                                <TableCell className={classes.rowtextcell} align="right">
                                    <Typography variant='subtitle1'>{row}</Typography>
                                </TableCell>
                                {horizontal.map(col => {

                                    var newVal = selectionState[`new_${col}`]
                                    var oldVal = selectionState[`old_${col}`]
                                    if (newVal == row) {
                                        return <TableCell className={classes.cell} align="right"></TableCell>
                                    } else if (newVal != oldVal && oldVal == row) {
                                        return <TableCell className={classes.oldcell} align="right"></TableCell>
                                    } else {
                                        return <TableCell className={classes.nocell} align="right"></TableCell>
                                    }
                                })}
                            </TableRow>
                        })
                        :
                        vertical.map(row => {
                            return <TableRow key={row.name}>
                                <TableCell className={classes.rowtextcell} align="right">
                                    <Typography variant='subtitle1'>{row}</Typography>
                                </TableCell>

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

        <Divider style={{ margin: '4px 0px', width: WIDTH * 4 }}></Divider>

        <Table className={classes.smalltable}>
            <TableBody>
                <TableRow>
                    <TableCell className={classes.rowtextcell} style={{ width: 2 * WIDTH }} align="right">
                        <Typography variant='subtitle1'>Continent</Typography>
                    </TableCell>
                    <TableCell className={classes.nocell}></TableCell>
                    <TableCell className={classes.nocell}></TableCell>
                    <TableCell className={classes.nocell}></TableCell>

                    <SubColor selection={selection} row={'continent'}></SubColor>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.rowtextcell} style={{ width: 2 * WIDTH }} align="right">
                        <Typography variant='subtitle1'>Religion</Typography>
                    </TableCell>
                    <TableCell className={classes.nocell}></TableCell>
                    <TableCell className={classes.nocell}></TableCell>
                    <TableCell className={classes.nocell}></TableCell>

                    <SubColor selection={selection} row={'main_religion'}></SubColor>
                </TableRow>
            </TableBody>
        </Table>


        {
            selection.length == 1 ?
                <YearComp oldYear={selection[0].old_year} newYear={selection[0].new_year}></YearComp>
                :
                <YearAggComp selection={selection}></YearAggComp>
        }

        <Grid item style={{ height: 32 }}>
            {
                selection.length == 1 ?
                    <Countries countries={parseCountries(selection[0].new_country)}></Countries>
                    : <Countries countries={allCountries}></Countries>
            }
        </Grid>

    </Grid>
    </ThemeProvider>
}


var SubColor = ({ selection, row }) => {
    const classes = useStyles();

    if (selection.length == 1) {
        var selectionState = selection[0]
        var newVal = selectionState[`new_color`]
        var oldVal = selectionState[`old_color`]
        if (newVal == row) {
            return <TableCell className={classes.cell} align="right"></TableCell>
        } else if (newVal != oldVal && oldVal == row) {
            return <TableCell className={classes.oldcell} align="right"></TableCell>
        } else {
            return <TableCell className={classes.nocell} align="right"></TableCell>
        }
    } else {
        var percent =
            selection.length > 0 ? selection.filter(value => value[`new_color`] == row).length / selection.length : 0


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
    }

}


var Countries = ({ countries }) => {
    if (countries == null || countries == undefined) return <div></div>

    return countries.map(countryName => {
        return <img
            title={countryName}
            src={"/img/flags/flags-iso/shiny/24/" + getCountryCode(countryName) + ".png"}
        ></img>
    })
}