/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Divider, FormControl, FormControlLabel, FormHelperText, MenuItem, Select, Switch, Typography } from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck';
import { HoverStateOrientation, setHoverStateOrientation } from '../../Ducks/HoverStateOrientationDuck';
import { SelectionClusters } from '../../Overlays/SelectionClusters';
import type { RootState } from '../../Store/Store';
import { selectVectors } from '../../Ducks/AggregationDuck';
import './DatasetTabPanel.scss';
import { AttributeSelectionTable } from './AttributeSelectionTable';
import { setGenericFingerprintAttributes } from '../../Ducks/GenericFingerprintAttributesDuck';
import { AStorytelling } from '../../Ducks/StoriesDuck';
import { FeatureConfig } from '../../../BaseConfig';

const mapStateToProps = (state: RootState) => ({
  genericFingerprintAttributes: state.genericFingerprintAttributes,
  hoverSettings: state.hoverSettings,
  currentAggregation: state.currentAggregation,
  dataset: state.dataset,
  hoverStateOrientation: state.hoverStateOrientation,
  activeStorybook: AStorytelling.getActive(state.stories),
  globalLabels: state.globalLabels,
});

const mapDispatchToProps = (dispatch) => ({
  setHoverWindowMode: (value) => dispatch(setHoverWindowMode(value)),
  setAggregation: (value) => dispatch(selectVectors(value, false)),
  setHoverStateOrientation: (value) => dispatch(setHoverStateOrientation(value)),
  setGenericFingerprintAttributes: (genericFingerprintAttributes) => dispatch(setGenericFingerprintAttributes(genericFingerprintAttributes)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  config: FeatureConfig;
};

export const DetailsTabPanel = connector(
  ({
    hoverSettings,
    setHoverWindowMode,
    setAggregation,
    currentAggregation,
    dataset,
    hoverStateOrientation,
    setHoverStateOrientation,
    activeStorybook,
    genericFingerprintAttributes,
    setGenericFingerprintAttributes,
    globalLabels,
  }: Props) => {
    const handleChange = (_, value) => {
      setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded);
    };

    return (
      <div key={dataset?.info?.path} style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 1 }}>
        <Box paddingX={2} paddingTop={1}>
          {currentAggregation.selectedClusters && currentAggregation.selectedClusters.length > 0 ? (
            <Typography color="textSecondary" variant="body2">
              Selected <b>{currentAggregation.selectedClusters.length}</b> out of <b>{activeStorybook?.clusters.ids.length}</b> groups
            </Typography>
          ) : (
            <Typography color="textSecondary" variant="body2">
              Selected <b>{currentAggregation.aggregation.length}</b> out of <b>{dataset?.vectors.length}</b> {globalLabels.itemLabelPlural}
            </Typography>
          )}
        </Box>

        <Box paddingX={2} paddingTop={1}>
          <FormControlLabel
            control={<Switch color="primary" checked={hoverSettings.windowMode === WindowMode.Extern} onChange={handleChange} name="checkedA" />}
            label="External Summary"
          />
        </Box>
        <Box paddingX={2} paddingTop={1}>
          <Button
            variant="outlined"
            style={{ width: '100%' }}
            onClick={() => {
              setAggregation([]);
            }}
          >
            Clear Selection
          </Button>
        </Box>

        <Box paddingX={2} paddingTop={1}>
          <AttributeSelectionTable attributes={genericFingerprintAttributes} setAttributes={setGenericFingerprintAttributes} btnFullWidth>
            Summary Attributes
          </AttributeSelectionTable>
        </Box>

        <Box paddingX={2} paddingTop={1}>
          <div style={{ width: '100%' }}>
            <FormControl style={{ width: '100%' }}>
              <FormHelperText>Hover Position</FormHelperText>
              <Select
                displayEmpty
                size="small"
                value={hoverStateOrientation}
                onChange={(event) => {
                  setHoverStateOrientation(event.target.value);
                }}
              >
                <MenuItem value={HoverStateOrientation.NorthEast}>North East</MenuItem>
                <MenuItem value={HoverStateOrientation.SouthWest}>South West</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Box>

        <Box paddingY={2}>
          <Divider orientation="horizontal" />
        </Box>

        <SelectionClusters />
      </div>
    );
  },
);
