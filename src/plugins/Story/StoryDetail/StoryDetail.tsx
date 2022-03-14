import * as React from 'react';
import { createTheme, Divider, Grid, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { makeStyles, ThemeProvider } from '@mui/styles';
import { getCountryCode } from '../../../components/Utility/CountryCodes';
import { DefaultLegend } from '../../..';

const HEIGHT = 32;
const WIDTH = 44;

const useStyles = makeStyles({
  table: {
    width: WIDTH * 6,
    height: HEIGHT * 6,
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  smalltable: {
    width: WIDTH * 6,
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  textcell: {
    height: HEIGHT,
    margin: '0',
    padding: '0',
    border: '0px',
  },
  rowtextcell: {
    height: HEIGHT,
    margin: '0',
    padding: '0 15px 0 0',
    border: '0px',
  },
  cell: {
    width: WIDTH,
    height: HEIGHT,
    background: '#70AD47',
    margin: '0',
    padding: '0',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
  },
  nocell: {
    width: WIDTH,
    height: HEIGHT,
    margin: '0',
    padding: '0',
    border: '1px solid black',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
  },
  oldcell: {
    width: WIDTH,
    height: HEIGHT,
    margin: '0',
    padding: '0',
    background: '#D9D9D9',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
  },
});

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 11,
    },
  },
});

function Countries({ countries, countryCounts }) {
  if (countries == null || countries === undefined) return <div />;

  let countrySum = 0;
  Object.keys(countryCounts).forEach((key) => {
    if (countryCounts[key] > countrySum) {
      countrySum = countryCounts[key];
    }
  });

  return countries.map((countryName) => {
    return (
      <img
        key={countryName}
        title={`${countryName} : ${countryCounts[countryName]}`}
        src={`img/flags/flags-iso/shiny/24/${getCountryCode(countryName)}.png`}
        style={{ opacity: countryCounts[countryName] / countrySum }}
      />
    );
  });
}

function SubColor({ selection, row }) {
  const classes = useStyles();

  if (selection.length === 1) {
    const selectionState = selection[0];
    const newVal = selectionState.new_color;
    const oldVal = selectionState.old_color;
    if (newVal === row) {
      return <TableCell className={classes.cell} align="right" />;
    }
    if (newVal !== oldVal && oldVal === row) {
      return <TableCell className={classes.oldcell} align="right" />;
    }
    return <TableCell className={classes.nocell} align="right" />;
  }
  const percent = selection.length > 0 ? selection.filter((value) => value.new_color === row).length / selection.length : 0;

  const W = WIDTH - 2;
  const H = HEIGHT - 2;
  const A = W * H;
  const A2 = W * H * percent;

  return (
    <TableCell className={classes.nocell} align="right">
      <Grid container justifyContent="center" direction="column" alignItems="center">
        <Grid item>
          <div
            style={{
              background: '#70AD47',
              width: Math.sqrt(((A / (A / A2)) * W) / H),
              height: Math.sqrt(((A / (A / A2)) * H) / W),
            }}
          />
        </Grid>
      </Grid>
    </TableCell>
  );
}

export function YearAggComp({ selection }) {
  const lineStart = 20;
  const lineEnd = 232 - 20;
  if (selection == null || selection === undefined || selection.length === 0) {
    return (
      <svg width="232" height="76" viewBox="0 0 232 76">
        <line x1={lineStart} y1="38" x2={lineEnd} y2="38" stroke="black" />
      </svg>
    );
  }

  const years = [...new Set(selection.map((value) => value.new_year))] as any[];
  years.sort();
  const count = years.map((year) => selection.filter((s) => s.new_year === year).length);
  const max = Math.max(...count);
  const segmentWidth = 14;

  return (
    <svg width="232" height="76" viewBox="0 0 232 76">
      <line x1={lineStart} y1="38" x2={lineEnd} y2="38" stroke="black" />

      {years.map((year, i) => {
        const startX = (lineEnd - lineStart) / 2 - (segmentWidth * years.length) / 2;
        const newX = startX + i * segmentWidth;
        return (
          <text key={year} fontSize="12" transform={`rotate(45, ${newX}, ${48})`} x={newX} y={46}>
            {year}
          </text>
        );
      })}
      {years.map((year, i) => {
        const startX = (lineEnd - lineStart) / 2 - (segmentWidth * years.length) / 2;
        const newX = startX + i * segmentWidth;
        const h = (count[i] / max) * 30 + 2;
        return <rect key={year} strokeWidth={1} x={newX} y={38 - h} width={10} height={h} />;
      })}
    </svg>
  );
}

export function YearComp({ oldYear, newYear }) {
  const lineStart = 60;
  const lineEnd = 232 - 60;
  const oldX = lineStart + (lineEnd - lineStart) * ((oldYear - 1800) / 215);
  const newX = lineStart + (lineEnd - lineStart) * ((newYear - 1800) / 215);

  return (
    <svg width="232" height="76" viewBox="0 0 232 76">
      <line x1={lineStart} y1="48" x2={lineEnd} y2="48" stroke="black" />

      <circle cx={newX} cy="48" r="14" stroke="black" strokeWidth="1" fill="#70AD47" />

      <circle cx={oldX} cy="48" r="10" stroke="black" strokeWidth="1" fill="#D9D9D9" />

      <text x={newX} y="20" fontSize="14" textAnchor="middle" fill="#70AD47">
        {newYear}
      </text>
      <text x={oldX} y="32" fontSize="14" textAnchor="middle" fill="#D9D9D9">
        {oldYear}
      </text>

      <text x="38" y="52" fontSize="14" textAnchor="end">
        1800
      </text>
      <text x="190" y="52" fontSize="14">
        2015
      </text>
    </svg>
  );
}

function parseCountries(countries) {
  if (countries == null) return [];

  try {
    const replaced = countries.replace(/'/g, '"').replace(/;/g, ',');
    const parsed = JSON.parse(`{ "result": ${replaced} }`);
    if (parsed == null) {
      return [];
    }
    return parsed.result;
  } catch (e) {
    return ['error'];
  }
}

type StoryLegendProps = {
  selection: any[];
};

export function StoryLegend({ selection }: StoryLegendProps) {
  if(selection.length <= 0){
    return <DefaultLegend></DefaultLegend>
  }

  const classes = useStyles();

  if (selection == null) {
    return <div />;
  }

  const vertical = ['gdp', 'child_mortality', 'fertility', 'life_expect', 'population'];
  const horizontal = ['x', 'y', 'size'];

  const countryArray = selection.flatMap((s) => parseCountries(s.new_country));
  const countryCounts = {};
  countryArray.forEach((country) => {
    countryCounts[country] = countryCounts[country] ? countryCounts[country] + 1 : 1;
  });

  const allCountries = [...new Set(countryArray)];
  allCountries.sort((a, b) => {
    return countryCounts[b] - countryCounts[a];
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={{ background: 'white' }} alignItems="center" direction="column">
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.textcell} style={{ width: 2 * WIDTH }} />
              <TableCell className={classes.textcell} align="center">
                <Typography variant="subtitle2">X</Typography>
              </TableCell>
              <TableCell className={classes.textcell} align="center">
                <Typography variant="subtitle2">Y</Typography>
              </TableCell>
              <TableCell className={classes.textcell} align="center">
                <Typography variant="subtitle2">Size</Typography>
              </TableCell>
              <TableCell className={classes.textcell} align="center">
                <Typography variant="subtitle2">Color</Typography>
              </TableCell>
            </TableRow>

            {selection.length === 1
              ? vertical.map((row) => {
                  const selectionState = selection[0];
                  return (
                    <TableRow key={row}>
                      <TableCell key={`text${row}`} className={classes.rowtextcell} align="right">
                        <Typography variant="subtitle1">{row}</Typography>
                      </TableCell>
                      {horizontal.map((col) => {
                        const newVal = selectionState[`new_${col}`];
                        const oldVal = selectionState[`old_${col}`];
                        if (newVal === row) {
                          return <TableCell key={`text${row}${col}`} className={classes.cell} align="right" />;
                        }
                        if (newVal !== oldVal && oldVal === row) {
                          return <TableCell key={`text${row}${col}`} className={classes.oldcell} align="right" />;
                        }
                        return <TableCell key={`text${row}${col}`} className={classes.nocell} align="right" />;
                      })}
                    </TableRow>
                  );
                })
              : vertical.map((row) => {
                  return (
                    <TableRow key={row}>
                      <TableCell className={classes.rowtextcell} align="right">
                        <Typography variant="subtitle1">{row}</Typography>
                      </TableCell>

                      {horizontal.map((col) => {
                        // col is x, y, size
                        // row is child_mortality... fertility

                        const percent = selection.length > 0 ? selection.filter((value) => value[`new_${col}`] === row).length / selection.length : 0;

                        const W = WIDTH - 2;
                        const H = HEIGHT - 2;
                        const A = W * H;
                        const A2 = W * H * percent;

                        return (
                          <TableCell key={`${row}${col}`} className={classes.nocell} align="right">
                            <Grid alignItems="center" justifyContent="center" direction="column" container>
                              <Grid item>
                                <div
                                  style={{
                                    background: '#70AD47',
                                    width: Math.sqrt(((A / (A / A2)) * W) / H),
                                    height: Math.sqrt(((A / (A / A2)) * H) / W),
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>

        <Divider style={{ margin: '4px 0px', width: WIDTH * 4 }} />

        <Table className={classes.smalltable}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.rowtextcell} style={{ width: 2 * WIDTH }} align="right">
                <Typography variant="subtitle1">Continent</Typography>
              </TableCell>
              <TableCell className={classes.nocell} />
              <TableCell className={classes.nocell} />
              <TableCell className={classes.nocell} />

              <SubColor selection={selection} row="continent" />
            </TableRow>
            <TableRow>
              <TableCell className={classes.rowtextcell} style={{ width: 2 * WIDTH }} align="right">
                <Typography variant="subtitle1">Religion</Typography>
              </TableCell>
              <TableCell className={classes.nocell} />
              <TableCell className={classes.nocell} />
              <TableCell className={classes.nocell} />

              <SubColor selection={selection} row="main_religion" />
            </TableRow>
          </TableBody>
        </Table>

        {selection.length === 1 ? <YearComp oldYear={selection[0].old_year} newYear={selection[0].new_year} /> : <YearAggComp selection={selection} />}

        <Grid item style={{ height: 32 }}>
          {selection.length === 1 ? (
            <Countries countries={parseCountries(selection[0].new_country)} countryCounts={countryCounts} />
          ) : (
            <Countries countries={allCountries} countryCounts={countryCounts} />
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
