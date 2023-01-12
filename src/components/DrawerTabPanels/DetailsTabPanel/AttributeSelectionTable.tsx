import { Button, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import DataGrid, { SelectColumn } from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import { usePSESelector } from '../../Store/Store';
import { DefaultFeatureLabel } from '../../../model';

type AttributeType = { feature: string; show: boolean };

export function AttributeSelectionTable({
  attributes,
  setAttributes,
  children,
}: {
  attributes: AttributeType[];
  setAttributes: (attributes: AttributeType[]) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const dataset = usePSESelector((state) => state.dataset);
  const dispatch = useDispatch();

  const openAttributes = (event) => {
    setOpen(true);
  };

  const [rows, setRows] = React.useState<any>([]);
  const [selectedRows, setSelectedRows] = React.useState<ReadonlySet<string>>(() => new Set());
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(() => new Set<unknown>([]));

  const columnsSelected = [SelectColumn, { key: 'feature', name: 'Selected' }, { key: 'group', name: 'Group' }];

  const handleClose = () => {
    setOpen(false);
    const localAttributes = attributes.map((r) => ({ ...r, show: selectedRows.has(r.feature) }));
    dispatch(setAttributes([...localAttributes]));
  };

  const groupMapping = React.useCallback(
    (r, i) => {
      return {
        id: i,
        feature: r.feature,
        show: r.show,
        group: dataset.columns[r.feature].featureLabel ? dataset.columns[r.feature].featureLabel : DefaultFeatureLabel,
      };
    },
    [dataset],
  );

  React.useEffect(() => {
    setSelectedRows(new Set(attributes.filter((r) => r.show).map((r) => r.feature)));
    setRows(attributes.map(groupMapping));
  }, [attributes, groupMapping]);

  const rowKeyGetter = (row: any) => {
    return row.feature;
  };

  return (
    <div>
      <Button fullWidth variant="outlined" onClick={openAttributes}>
        {children}
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
