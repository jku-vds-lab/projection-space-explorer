/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/function-component-definition */
import * as React from 'react';
import { Checkbox } from '@mui/material';
import DataGrid, { SelectColumn, SelectCellFormatter, GroupFormatterProps, Column, CheckboxFormatterProps } from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import { DefaultFeatureLabel } from '../../../model/Dataset';
import { ProjectionColumn } from '../../Ducks';

function checkboxFormatter({ onChange, checked, ...props }: CheckboxFormatterProps, ref: React.RefObject<HTMLInputElement>) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  return <Checkbox disableRipple size="small" checked={checked} />;
}

export function FeaturePicker({
  selection,
  setSelection,
  selectedRows,
  setSelectedRows,
}: {
  selection: ProjectionColumn[];
  setSelection;
  selectedRows;
  setSelectedRows;
}) {
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(
    () => new Set<unknown>(Object.keys(rowGrouper(selection, 'featureLabel')).includes(DefaultFeatureLabel) ? [DefaultFeatureLabel] : []),
  );

  const ref = React.useRef<any>();
  ref.current = () => setSelection([...selection]);

  const columns = React.useMemo<Column<ProjectionColumn>[]>(
    () => [
      SelectColumn,
      { key: 'featureLabel', name: 'Group', width: 250 },
      { key: 'name', name: 'Name' },
      {
        key: 'normalized',
        name: 'Normalized',
        width: 80,
        formatter({ row, onRowChange, isCellSelected }) {
          return (
            <SelectCellFormatter
              value={row.normalized}
              onChange={() => {
                onRowChange({ ...row, normalized: !row.normalized });
              }}
              isCellSelected={isCellSelected}
            />
          );
        },
        groupFormatter(props: GroupFormatterProps<ProjectionColumn>) {
          return (
            <SelectCellFormatter
              aria-label="Select Group"
              isCellSelected={props.isCellSelected}
              value={props.childRows.filter((row) => row.normalized).length === props.childRows.length}
              onChange={(checked) => {
                props.childRows.forEach((row) => {
                  row.normalized = checked;
                });
                ref.current();
              }}
            />
          );
        },
      },
      {
        key: 'range',
        name: 'Range',
        width: 250,
      },
    ],
    [],
  );

  return (
    <DataGrid
      groupBy={['featureLabel']}
      rowGrouper={rowGrouper}
      expandedGroupIds={expandedGroupIds}
      onExpandedGroupIdsChange={setExpandedGroupIds}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      rowKeyGetter={(row) => row.name}
      onRowsChange={setSelection}
      rows={selection}
      columns={columns}
      renderers={{
        checkboxFormatter,
      }}
    />
  );
}
