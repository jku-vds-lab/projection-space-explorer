import { Box, Button, Checkbox, Popover } from '@mui/material';
import React = require('react');
import { connect, ConnectedProps } from 'react-redux';

import SearchBar from 'material-ui-search-bar';
import DataGrid from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import type { RootState } from '../../Store/Store';

const attributeConnector = connect(
  (state: RootState) => ({
    dataset: state.dataset,
  }),
  (dispatch) => ({}),
  null,
  { forwardRef: true },
);
type AttributeTablePropsFromRedux = ConnectedProps<typeof attributeConnector>;
type AttributeTableProps = AttributeTablePropsFromRedux & {
  attributes;
  setAttributes;
  children;
  btnFullWidth;
};
export const AttributeSelectionTable = attributeConnector(({ attributes, setAttributes, dataset, btnFullWidth, children }: AttributeTableProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openAttributes = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAttributes([...localAttributes]);
  };

  const [localAttributes, setLocalAttributes] = React.useState<any>([]);
  const [rows, setRows] = React.useState<any>([]);
  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<number>>(() => new Set());
  const [searched, setSearched] = React.useState<string>('');
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(() => new Set<unknown>([]));

  const columns = [
    { key: 'feature', name: 'Feature', resizable: false },
    { key: 'group', name: 'Group', resizable: false },
  ];

  const columnsSelected = [
    { key: 'feature', name: 'Selected', resizable: false },
    { key: 'group', name: 'Group', resizable: false },
  ];

  const groupMapping = (r, i) => {
    return {
      id: i,
      feature: r.feature,
      show: r.show,
      group: dataset.columns[r.feature].featureLabel,
    };
  };

  React.useEffect(() => {
    setLocalAttributes(attributes.map(groupMapping));
    setRows(attributes.map(groupMapping));
  }, [attributes]);

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
    setSearched('');
    requestSearch(searched);
  };

  function rowKeyGetter(row: any) {
    return row.feature;
  }

  function rowClickHandler(row: any, column: any) {
    localAttributes[row.id].show = !row.show;
    setLocalAttributes([...localAttributes]);
    row.show = localAttributes[row.id].show;
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
      style={{ flex: '1', minWidth: 900, overflowX: 'hidden' }}
      groupBy={['group']}
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
      style={{ flex: '1', minWidth: 900, overflowX: 'hidden' }}
      groupBy={['group']}
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

  return (
    <div>
      <Button fullWidth={btnFullWidth} variant="outlined" onClick={openAttributes}>
        {children}
      </Button>

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
          <SearchBar value={searched} onChange={(searchVal) => requestSearch(searchVal)} onCancelSearch={() => cancelSearch()} />
          <div style={{ display: 'flex' }}>
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
  );
});
