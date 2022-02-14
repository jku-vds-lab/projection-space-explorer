/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, MenuItem, Popover, Select, Switch, Typography } from '@mui/material';
import React = require('react');
import { connect, ConnectedProps } from 'react-redux';
import { setGenericFingerprintAttributes } from '../../Ducks/GenericFingerprintAttributesDuck';
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck';
import { HoverStateOrientation, setHoverStateOrientation } from '../../Ducks/HoverStateOrientationDuck';
import { SelectionClusters } from '../../Overlays/SelectionClusters';
import type { RootState } from '../../Store/Store';
import { VirtualColumn, VirtualTable } from '../../UI/VirtualTable';
import { selectVectors } from '../../Ducks/AggregationDuck';
import { AStorytelling } from '../../Ducks/StoriesDuck copy';
import SearchBar from 'material-ui-search-bar';
import { display } from '@mui/system';
import DataGrid, {DataGridHandle} from 'react-data-grid';
import { groupBy, groupBy as rowGrouper } from 'lodash';
import { autoMaxBins } from 'vega-lite/build/src/bin';
import './DatasetTabPanel.scss';


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

type Props = PropsFromRedux & {};

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
          <AttributeTable />
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
        dataset: state.dataset
    }),
    dispatch => ({
        setGenericFingerprintAttributes: genericFingerprintAttributes => dispatch(setGenericFingerprintAttributes(genericFingerprintAttributes)),
    })
    , null, { forwardRef: true });

type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>

type AttributeTableProps = AttributeTablePropsFromRedux

const AttributeTable = attributeConnector(({ genericFingerprintAttributes, setGenericFingerprintAttributes, dataset }: AttributeTableProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null)

  const fingerprintAttributes = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setGenericFingerprintAttributes([...localAttributes]);
  };

    const [localAttributes, setLocalAttributes] = React.useState<any>([])
    const [rows, setRows] = React.useState<any>([])
    const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<number>>(() => new Set());
    const [searched, setSearched] = React.useState<string>("");
    const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(
        () => new Set<unknown>([])
      );

    const columns = [
        {key: 'feature', name: 'Feature', resizable: false},
        {key: 'group', name: 'Group', resizable: false},
    ]

    const columnsSelected = [
        {key: 'feature', name: 'Selected', resizable: false},
        {key: 'group', name: 'Group', resizable: false},
    ]

    const groupMapping = (r, i) => {
        return {
            'id': i,
            'feature': r.feature,
            'show': r.show,
            'group': dataset.columns[r.feature].featureLabel
        }
    }

    React.useEffect(() => {
        setLocalAttributes(genericFingerprintAttributes.map(groupMapping))
        setRows(genericFingerprintAttributes.map(groupMapping))
    }, [genericFingerprintAttributes])

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

    const requestSearch = (searchedVal: string) => {
        const filteredRows = localAttributes.filter((row) => {
          return row?.feature?.toLowerCase().includes(searchedVal?.toLowerCase());
        });
        
        setRows(filteredRows);
      };
    
    const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
    };

    function rowKeyGetter(row: any) {
        return row.feature;
    }

    function rowClickHandler(row: any, column: any) {
        localAttributes[row.id].show = !row.show
        setLocalAttributes([...localAttributes])
        row.show = localAttributes[row.id].show
    }

    // const gridRef = React.useRef<DataGridHandle>(null);

    // const NoBoxShadowComponent = styled('div')({
    //     className: 'fixedname',
    //     width: 500,
    //     '& .rdg-cell:': { className: 'anotherfixedname', boxShadow: 'none !important' }
    //   });

    const featureGrid = (
        <DataGrid
            // ref={gridRef}
            className="rdg-light"
            style={{flex: '1', minWidth: 900, overflowX: 'hidden'}}
            groupBy={["group"]}
            rowGrouper={rowGrouper}
            rowKeyGetter={rowKeyGetter}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            onRowClick={rowClickHandler}
            expandedGroupIds={expandedGroupIds}
            onExpandedGroupIdsChange={setExpandedGroupIds}
            columns={columns}
            rows={rows.filter((x) => !x.show)}
        />
    );
    const selectionGrid = (
            <DataGrid
            className="rdg-light"
            style={{flex: '1', minWidth: 900, overflowX: 'hidden'}}
            groupBy={["group"]}
            rowGrouper={rowGrouper}
            rowKeyGetter={rowKeyGetter}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            onRowClick={rowClickHandler}
            expandedGroupIds={expandedGroupIds}
            onExpandedGroupIdsChange={setExpandedGroupIds}
            columns={columnsSelected}
            rows={rows.filter((x) => x.show)}
            />
    );

    return <div>
        <Button style={{ width: '100%' }} variant="outlined" onClick={fingerprintAttributes}>Summary Attributes</Button>

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
                <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
                />
                <div style={{display: 'flex'}}>
                {/* <div style={{flex: '1', minWidth: 400, overflowX: 'hidden'}}> */}
                {featureGrid}
                {/* </div> */}
                {/* <div style={{flex: '1', minWidth: 400, overflowX: 'hidden'}}> */}
                {selectionGrid}
                {/* </div> */}
                </div>
            </Box>
        </Popover>
    </div>
});
