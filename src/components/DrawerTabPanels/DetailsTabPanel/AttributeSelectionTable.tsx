import { Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import DataGrid, { SelectColumn } from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import { usePSESelector } from '../../Store/Store';
import { DefaultFeatureLabel } from '../../../model';

export function AttributeSelectionTable(props: { attributes: any[]; setAttributes: (attributes: any[]) => void }) {
  console.log(props.attributes);
  const [open, setOpen] = React.useState(false);

  const dataset = usePSESelector((state) => state.dataset);
  // const attributes = usePSESelector((state) => state.genericFingerprintAttributes);
  // const dispatch = useDispatch();

  const openAttributes = (event) => {
    setOpen(true);
  };

  const [localAttributes, setLocalAttributes] = React.useState<any>([]);
  const [rows, setRows] = React.useState<any>([]);
  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<number>>(() => new Set());
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(() => new Set<unknown>([]));

  const columnsSelected = [SelectColumn, { key: 'feature', name: 'Selected' }, { key: 'group', name: 'Group' }];

  const handleClose = () => {
    setOpen(false);
    props.setAttributes([...localAttributes]);
    // dispatch(setGenericFingerprintAttributes([...localAttributes]));
  };

  const groupMapping = (r, i) => {
    return {
      id: i,
      feature: r.feature,
      show: r.show,
      group: dataset.columns[r.feature].featureLabel ? dataset.columns[r.feature].featureLabel : DefaultFeatureLabel,
    };
  };

  React.useEffect(() => {
    setLocalAttributes(props.attributes.map(groupMapping));
    setRows(props.attributes.map(groupMapping));
  }, [props.attributes]);

  function rowKeyGetter(row: any) {
    return row.feature;
  }

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
