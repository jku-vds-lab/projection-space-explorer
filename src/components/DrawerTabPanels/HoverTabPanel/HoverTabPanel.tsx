import { Box, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { selectVectors } from '../../Ducks/AggregationDuck';
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck';
import { SelectionClusters } from '../../Overlays/SelectionClusters';
import type { RootState } from '../../Store/Store';

const mapStateToProps = (state: RootState) => ({
  hoverSettings: state.hoverSettings,
  currentAggregation: state.currentAggregation,
  dataset: state.dataset,
});

const mapDispatchToProps = (dispatch) => ({
  setHoverWindowMode: (value) => dispatch(setHoverWindowMode(value)),
  setAggregation: (value) => dispatch(selectVectors(value)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

export const HoverTabPanel = connector(({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset }: Props) => {
  const handleChange = (_, value) => {
    setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box paddingLeft={2} paddingTop={2}>
        {/* TODO: Cluster count not working */}
        {/* in <b>{currentAggregation.selectedClusters.length}</b> Groups */}
        <Typography color="textSecondary" variant="body2">
          Selected <b>{currentAggregation.aggregation.length}</b> out of <b>{dataset && dataset.vectors.length}</b> items
        </Typography>

        <FormControlLabel
          control={<Switch color="primary" checked={hoverSettings.windowMode === WindowMode.Extern} onChange={handleChange} name="checkedA" />}
          label="External Selection Summary"
        />

        <Button
          variant="outlined"
          onClick={() => {
            setAggregation([]);
          }}
        >
          Clear Selection
        </Button>
      </Box>

      <SelectionClusters />
    </div>
  );
});
