/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Checkbox } from '@mui/material';
import * as clone from 'clone';
// @ts-ignore
import { makeStyles } from '@mui/styles';
// @ts-ignore
import StarSymbol from '../../../../textures/sprites/star.png';
// @ts-ignore
import CircleSymbol from '../../../../textures/sprites/circle.png';
// @ts-ignore
import CrossSymbol from '../../../../textures/sprites/cross.png';
// @ts-ignore
import SquareSymbol from '../../../../textures/sprites/square.png';

const useStyles = makeStyles(() => ({
  root: {
    padding: '3px 9px !important',
  },
}));

function ShapeSymbol({ symbol, text, checked, onCheck }) {
  const classes = useStyles();

  const paths = {
    star: StarSymbol,
    circle: CircleSymbol,
    square: SquareSymbol,
    cross: CrossSymbol,
  };

  return (
    <div key={symbol}>
      <Checkbox
        className={classes.root}
        checked={checked}
        color="primary"
        onChange={(event) => {
          onCheck(event, symbol);
        }}
        disableRipple
        inputProps={{ 'aria-label': 'decorative checkbox' }}
      />

      <img
        src={paths[symbol]}
        style={{
          width: '1rem',
          height: '1rem',
          verticalAlign: 'middle',
        }}
      />
      <span
        style={{
          verticalAlign: 'middle',
          marginLeft: '0.5rem',
        }}
      >
        {text}
      </span>
    </div>
  );
}

function defaultState() {
  return {
    cross: true,
    circle: true,
    star: true,
    square: true,
  };
}

/**
 * Simple shape legend
 * put a category in props
 */
export function ShapeLegend({ dataset, category, onChange }) {
  const [state, setState] = React.useState(defaultState());

  React.useEffect(() => {
    setState(defaultState());
  }, [category, dataset]);

  const defaults = [
    { symbol: 'cross', text: 'First State' },
    { symbol: 'circle', text: 'Intermediate State' },
    { symbol: 'star', text: 'Last State' },
  ];

  if (category == null) {
    return (
      <div>
        {defaults.map((def) => {
          return (
            <ShapeSymbol
              key={def.symbol}
              symbol={def.symbol}
              text={def.text}
              checked={state[def.symbol]}
              onCheck={(event) => {
                const newState = clone(state);
                newState[def.symbol] = event.target.checked;
                setState(newState);

                onChange(newState);
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {category.values.map((v) => {
        return (
          <ShapeSymbol
            key={v.from}
            symbol={v.to}
            text={'display' in v ? v.display : v.from}
            checked={state[v.to]}
            onCheck={(event) => {
              const newState = clone(state);
              newState[v.to] = event.target.checked;
              setState(newState);

              onChange(newState);
            }}
          />
        );
      })}
    </div>
  );
}
