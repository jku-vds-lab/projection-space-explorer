/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, MenuItem, Popover, Select, Switch, Typography } from '@mui/material';
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setGenericFingerprintAttributes } from '../../Ducks/GenericFingerprintAttributesDuck';
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck';
import { HoverStateOrientation, setHoverStateOrientation } from '../../Ducks/HoverStateOrientationDuck';
import { SelectionClusters } from '../../Overlays/SelectionClusters';
import type { RootState } from '../../Store/Store';
import { VirtualColumn, VirtualTable } from '../../UI/VirtualTable';
import { selectVectors } from '../../Ducks/AggregationDuck';
import { AStorytelling } from '../../Ducks/StoriesDuck copy';
import { FeatureConfig } from '../../../BaseConfig';

const mapStateToProps = (state: RootState) => ({
  hoverSettings: state.hoverSettings,
  currentAggregation: state.currentAggregation,
  dataset: state.dataset,
  hoverStateOrientation: state.hoverStateOrientation,
  activeStorybook: AStorytelling.getActive(state.stories),
});

const mapDispatchToProps = (dispatch) => ({
  setHoverWindowMode: (value) => dispatch(setHoverWindowMode(value)),
  setAggregation: (value) => dispatch(selectVectors(value, false)),
  setHoverStateOrientation: (value) => dispatch(setHoverStateOrientation(value)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  config: FeatureConfig;
};

const strrenderer = (name: string, row: any) => {
  return row[name];
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
    config,
  }: Props) => {
    const handleChange = (_, value) => {
      setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 1 }}>
        <Box paddingX={2} paddingTop={1}>
          {currentAggregation.selectedClusters && currentAggregation.selectedClusters.length > 0 ? (
            <Typography color="textSecondary" variant="body2">
              Selected <b>{currentAggregation.selectedClusters.length}</b> out of <b>{activeStorybook?.clusters.ids.length}</b> groups
            </Typography>
          ) : (
            <Typography color="textSecondary" variant="body2">
              Selected <b>{currentAggregation.aggregation.length}</b> out of <b>{dataset?.vectors.length}</b> items
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
          <AttributeTable config={config} />
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

const attributeConnector = connect(
  (state: RootState) => ({
    genericFingerprintAttributes: state.genericFingerprintAttributes,
  }),
  (dispatch) => ({
    setGenericFingerprintAttributes: (genericFingerprintAttributes) => dispatch(setGenericFingerprintAttributes(genericFingerprintAttributes)),
  }),
  null,
  { forwardRef: true },
);

type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>;

type AttributeTableProps = AttributeTablePropsFromRedux & { config: FeatureConfig };

const AttributeTable = attributeConnector(({ config, genericFingerprintAttributes, setGenericFingerprintAttributes }: AttributeTableProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const fingerprintAttributes = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setGenericFingerprintAttributes([...localAttributes]);
  };

  const [localAttributes, setLocalAttributes] = React.useState<any>([]);

  React.useEffect(() => {
    setLocalAttributes(genericFingerprintAttributes);
  }, [genericFingerprintAttributes]);

  const booleanRenderer = (row: any) => {
    return (
      <Checkbox
        color="primary"
        disableRipple
        checked={row.show}
        onChange={(event) => {
          row.show = event.target.checked;
          setLocalAttributes([...localAttributes]);
        }}
      />
    );
  };

  return (
    <div>
      {config?.showSummaryAttributes !== false ? (
        <Button style={{ width: '100%' }} variant="outlined" onClick={fingerprintAttributes}>
          Summary Attributes
        </Button>
      ) : null}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box margin={2}>
          <VirtualTable rows={localAttributes} rowHeight={42} tableHeight={300}>
            <VirtualColumn width={300} name="Feature" renderer={(row) => strrenderer('feature', row)} />
            <VirtualColumn width={50} name="Show" renderer={(row) => booleanRenderer(row)} />
          </VirtualTable>
        </Box>
      </Popover>
    </div>
  );
});
