import { connect } from 'react-redux';
import React = require('react');
import { FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import { DiscreteMapping } from '../../Utility/Colors/Mapping';
import { setAdvancedColoringSelectionAction } from '../../Ducks/AdvancedColoringSelectionDuck';
import { RootState } from '../../Store';

const mapStateToProps = (state: RootState) => ({
  advancedColoringSelection: state.advancedColoringSelection,
});

const mapDispatchToProps = (dispatch) => ({
  setAdvancedColoringSelection: (advancedColoringSelection) => dispatch(setAdvancedColoringSelectionAction(advancedColoringSelection)),
});

type ShowColorLegendProps = {
  pointColorMapping: any;
  advancedColoringSelection: boolean[];
  setAdvancedColoringSelection: Function;
};

function toLabel(value: any): string {
  if (value === '') {
    return '<Empty String>';
  }
  if (value === null) {
    return '<Null>';
  }
  if (value === undefined) {
    return '<Undefined>';
  }

  return value;
}

export function AdvancedColoringLegendFull({ pointColorMapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps) {
  if (pointColorMapping == null) {
    return <div />;
  }

  if (pointColorMapping instanceof DiscreteMapping) {
    return (
      <Grid container direction="column" style={{ padding: '12px 0px', minWidth: 300 }}>
        {pointColorMapping.values.map((value, index) => {
          const color = pointColorMapping.map(value);
          return (
            <FormControlLabel
              key={value}
              style={{ margin: '0 8px' }}
              control={
                <Checkbox
                  style={{ padding: '3px 9px' }}
                  disableRipple
                  color="primary"
                  size="small"
                  checked={advancedColoringSelection[index]}
                  onChange={(event) => {
                    const values = advancedColoringSelection.splice(0);
                    values[event.target.value] = event.target.checked;
                    setAdvancedColoringSelection(values);
                  }}
                  value={index}
                />
              }
              label={<Typography style={{ color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}>{toLabel(value)}</Typography>}
            />
          );
        })}
      </Grid>
    );
  }

  return <div />;
}

export const AdvancedColoringLegend = connect(mapStateToProps, mapDispatchToProps)(AdvancedColoringLegendFull);
