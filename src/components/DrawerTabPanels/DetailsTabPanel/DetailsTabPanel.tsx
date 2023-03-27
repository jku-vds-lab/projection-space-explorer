/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Divider, FormControl, Grid, IconButton, MenuItem, Popover, Select, Switch, Tooltip, Typography } from '@mui/material';
import { Deselect, OpenInNew, OpenInNewOff, Settings } from '@mui/icons-material';
import * as React from 'react';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck';
import { HoverStateOrientation, setHoverStateOrientation } from '../../Ducks/HoverStateOrientationDuck';
import { SelectionClusters } from '../../Overlays/SelectionClusters';
import { RootState, usePSESelector } from '../../Store/Store';
import { selectVectors } from '../../Ducks/AggregationDuck';
import './DatasetTabPanel.scss';
import { AttributeSelectionTable } from './AttributeSelectionTable';
import { AStorytelling } from '../../Ducks/StoriesDuck';
import { FeatureConfig } from '../../../BaseConfig';
import { setGenericFingerprintAttributes } from '../../Ducks';

const mapStateToProps = (state: RootState) => ({
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
    globalLabels,
    config,
  }: Props) => {
    const attributes = usePSESelector((state) => state.genericFingerprintAttributes);
    const handleChange = (_, value) => {
      setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded);
    };

    const [openSettingsPanel, setOpenSettingsPanel] = React.useState(false);
    const anchorRef = React.useRef();

    const dispatch = useDispatch();

    return (
      <div key={dataset?.info?.path} style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 1 }}>
        <Box paddingX={2} paddingTop={2} paddingBottom={1}>
          <Typography variant="subtitle2" gutterBottom>
            Visualy summarize {globalLabels.itemLabelPlural}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Interactively select {globalLabels.itemLabelPlural} to update the summary visualization.{' '}
            {currentAggregation.selectedClusters && currentAggregation.selectedClusters.length > 0 ? (
              <>
                Selected <b>{currentAggregation.selectedClusters.length}</b> out of <b>{activeStorybook?.clusters.ids.length}</b> groups.
              </>
            ) : (
              <>
                Selected <b>{currentAggregation.aggregation.length}</b> out of <b>{dataset?.vectors.length}</b> {globalLabels.itemLabelPlural}.
              </>
            )}
          </Typography>
        </Box>

        <Box paddingX={1} paddingTop={1}>
          <Grid container>
            <Grid item xs={2}>
              {hoverSettings.windowMode === WindowMode.Embedded && (
                <Tooltip
                  placement="bottom"
                  title={<Typography variant="subtitle2">This opens a new window that offers more space for the selection detail image</Typography>}
                >
                  <IconButton onClick={(e) => handleChange(e, true)} color="primary" aria-label="Open summary visualization in new window">
                    <OpenInNew />
                  </IconButton>
                </Tooltip>
              )}
              {hoverSettings.windowMode === WindowMode.Extern && (
                <Tooltip placement="bottom" title={<Typography variant="subtitle2">Close external window</Typography>}>
                  <IconButton onClick={(e) => handleChange(e, false)} color="primary" aria-label="Open summary visualization in new window">
                    <OpenInNewOff />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={2}>
              {config?.detailsTab?.showClearSelectionButton !== false && (
                <Box>
                  <Tooltip placement="bottom" title={<Typography variant="subtitle2">Clear current selection</Typography>}>
                    <span>
                      <IconButton
                        disabled={currentAggregation.aggregation.length <= 0}
                        onClick={() => {
                          setAggregation([]);
                        }}
                        color="primary"
                        aria-label="Clear current selection"
                      >
                        <Deselect />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              )}
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={2}>
              {config?.detailsTab?.showChooseAttributesButton !== false && config?.detailsTab?.showHoverPositionSelect !== false && (
                <Tooltip placement="bottom" title={<Typography variant="subtitle2">Change settings for selection and hover views</Typography>}>
                  <IconButton ref={anchorRef} onClick={() => setOpenSettingsPanel(true)} color="primary" aria-label="Open summary visualization in new window">
                    <Settings />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          </Grid>
          <Popover
            open={openSettingsPanel}
            anchorEl={anchorRef.current}
            onClose={() => setOpenSettingsPanel(false)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box paddingX={2} paddingY={2} width={300}>
              {config?.detailsTab?.showChooseAttributesButton !== false ? (
                <Box paddingBottom={2}>
                  <Typography variant="body1">Choose the attributes you want to show in the selection view.</Typography>
                  <AttributeSelectionTable
                    attributes={attributes}
                    setAttributes={(attributes) => {
                      dispatch(setGenericFingerprintAttributes(attributes));
                    }}
                  >
                    Choose attributes
                  </AttributeSelectionTable>
                </Box>
              ) : null}
              {config?.detailsTab?.showHoverPositionSelect !== false ? (
                <FormControl style={{ width: '100%' }}>
                  <Typography variant="body1">Change the position of the hover view.</Typography>
                  {/* <FormHelperText>Hover position</FormHelperText> */}
                  <Select
                    color="primary"
                    displayEmpty
                    size="small"
                    value={hoverStateOrientation}
                    onChange={(event) => {
                      setHoverStateOrientation(event.target.value);
                    }}
                  >
                    <MenuItem value={HoverStateOrientation.NorthEast}>Top right</MenuItem>
                    <MenuItem value={HoverStateOrientation.SouthWest}>Bottom left </MenuItem>
                  </Select>
                </FormControl>
              ) : null}
            </Box>
          </Popover>
        </Box>
        {/* <Box paddingX={2} paddingTop={1}>
            <FormControlLabel
              control={<Switch color="primary" checked={hoverSettings.windowMode === WindowMode.Extern} onChange={handleChange} name="checkedA" />}
              label="External selection view"
            />
        </Box> */}
        {/* {config?.detailsTab?.showClearSelectionButton !== false ? (
          <Box paddingX={2} paddingTop={1}>
            <Button
              variant="outlined"
              style={{ width: '100%' }}
              onClick={() => {
                setAggregation([]);
              }}
            >
              Clear selection
            </Button>
          </Box>
        ) : null} */}

        {config?.detailsTab?.showDivider !== false ? (
          <Box paddingBottom={1} paddingX={0}>
            <Divider orientation="horizontal" />
          </Box>
        ) : null}

        <SelectionClusters />
      </div>
    );
  },
);
