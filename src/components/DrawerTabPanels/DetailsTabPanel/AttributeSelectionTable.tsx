import { Box, Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import DataGrid, { SelectColumn } from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import { RootState, usePSESelector } from '../../Store/Store';
import genericFingerprintAttributes, { setGenericFingerprintAttributes } from '../../Ducks/GenericFingerprintAttributesDuck';
import { DefaultFeatureLabel } from '../../../model';

export function AttributeSelectionTable() {
  const [open, setOpen] = React.useState(false);

  const dataset = usePSESelector((state) => state.dataset);
  const attributes = usePSESelector((state) => state.genericFingerprintAttributes);
  const dispatch = useDispatch();

  const openAttributes = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setGenericFingerprintAttributes([...localAttributes]));
  };

  const [localAttributes, setLocalAttributes] = React.useState<any>([]);
  const [rows, setRows] = React.useState<any>([]);
  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<number>>(() => new Set());
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(() => new Set<unknown>([]));

  const columnsSelected = [SelectColumn, { key: 'feature', name: 'Selected' }, { key: 'group', name: 'Group' }];

  const groupMapping = (r, i) => {
    return {
      id: i,
      feature: r.feature,
      show: r.show,
      group: dataset.columns[r.feature].featureLabel ? dataset.columns[r.feature].featureLabel : DefaultFeatureLabel,
    };
  };

  React.useEffect(() => {
    setLocalAttributes(attributes.map(groupMapping));
    setRows(attributes.map(groupMapping));
  }, [attributes]);

  function rowKeyGetter(row: any) {
    return row.feature;
  }

  console.log(dataset?.columns);
  console.log(genericFingerprintAttributes);
  console.log(rows);

  return (
    <div>
      <Button fullWidth variant="outlined" onClick={openAttributes}>
        Summary Attributes
      </Button>

      <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
        <DialogTitle>Select features you want to be present in the selection view</DialogTitle>
        <DialogContent>
          <DataGrid
            className="rdg-light"
            groupBy={['group']}
            rowGrouper={rowGrouper}
            rowKeyGetter={rowKeyGetter}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            expandedGroupIds={expandedGroupIds}
            onExpandedGroupIdsChange={setExpandedGroupIds}
            columns={columnsSelected}
            rows={rows}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
