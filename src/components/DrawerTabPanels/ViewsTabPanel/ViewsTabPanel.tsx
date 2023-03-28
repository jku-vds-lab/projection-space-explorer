import * as React from 'react';
import { ConnectedComponent, useDispatch, useSelector } from 'react-redux';
import Split from 'react-split';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import type { RootState } from '../../Store/Store';
import { DetailViewActions } from '../../Ducks/DetailViewDuck';
import { ComponentConfig } from '../../../BaseConfig';
import { GlobalLabelsState } from '../../Ducks';
import { toSentenceCase } from '../../../utils';

type DetailViewChooserProps = {
  overrideComponents: ComponentConfig;
  splitRef: React.LegacyRef<Split>;
  globalLabels: GlobalLabelsState;
};

function instantiateElement(view: JSX.Element | (() => JSX.Element) | ConnectedComponent<any, any>, splitRef: React.LegacyRef<Split>) {
  if (!view) return null;

  return React.isValidElement(view) ? view : React.createElement(view as () => JSX.Element, { splitRef });
}

export function ViewsTabPanel({ overrideComponents, splitRef, globalLabels }: DetailViewChooserProps) {
  const dispatch = useDispatch();

  const detailView = useSelector((state: RootState) => state.detailView);

  if (!overrideComponents || !overrideComponents.detailViews || overrideComponents.detailViews.length === 0) {
    return null;
  }

  const view = overrideComponents.detailViews[detailView.active].settings;

  const onViewChange = (view: string) => {
    dispatch(DetailViewActions.setDetailView(overrideComponents.detailViews.findIndex((e) => e.name === view)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Box paddingX={2} paddingTop={2} paddingBottom={1}>
        <Typography variant="subtitle2" gutterBottom>
          Tabular view of {globalLabels.itemLabelPlural}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Choose a tabular view from the list below to show it.
        </Typography>

        <FormControl>
          <RadioGroup name="radio-buttons-group" value={detailView.active}>
            {overrideComponents.detailViews.map((dv, i) => {
              return <FormControlLabel key={dv.name} value={i} control={<Radio />} label={toSentenceCase(dv.name)} onClick={() => onViewChange(dv.name)} />;
            })}
          </RadioGroup>
        </FormControl>
      </Box>

      {instantiateElement(view, splitRef)}
    </div>
  );
}
