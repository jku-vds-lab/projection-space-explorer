/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/function-component-definition */
import * as React from 'react';
import DataGrid, { SelectColumn, SelectCellFormatter, GroupFormatterProps, Column, textEditor } from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import { DefaultFeatureLabel } from '../../../model/Dataset';
import type { ProjectionColumn } from '../../Ducks';
import { FeatureConfig } from '../../../BaseConfig';

export function FeaturePicker({
  selection,
  setSelection,
  selectedRows,
  setSelectedRows,
  featureConfig,
}: {
  selection: ProjectionColumn[];
  setSelection;
  selectedRows;
  setSelectedRows;
  featureConfig: FeatureConfig;
}) {
  const [expandedGroupIds, setExpandedGroupIds] = React.useState<ReadonlySet<unknown>>(
    () => new Set<unknown>(Object.keys(rowGrouper(selection, 'featureLabel')).includes(DefaultFeatureLabel) ? [DefaultFeatureLabel] : []),
  );

  const ref = React.useRef<any>();
  ref.current = () => setSelection([...selection]);

  const columns = React.useMemo<Column<ProjectionColumn>[]>(() => {
    const colLst = [
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
    ];
    if (featureConfig?.enableFeatureWeighing) {
      colLst.push({
        key: 'weight',
        name: 'Weight (beta: only for Gower)',
        width: 200,
        editor: textEditor,
        groupFormatter(props: GroupFormatterProps<ProjectionColumn>) {
          const [t, setT] = React.useState(Date.now());
          const inputRef = React.useRef<HTMLInputElement>();

          const value = Math.round(props.childRows.reduce((acc, row) => acc + Number.parseFloat(row.weight), 0) * 1000) / 1000;

          return (
            <input
              ref={inputRef}
              style={{ width: 70 }}
              onFocus={(event) => {
                setT(Date.now());
              }}
              value={value}
              type="number"
              onChange={(event) => {
                const value = Number.parseFloat(event.target.value);
                if (!Number.isNaN(value)) {
                  props.childRows.forEach((row) => {
                    row.weight = value / props.childRows.length;
                  });
                  ref.current();
                }
              }}
              onBlur={(event) => {
                const delta = (Date.now() - t) / 1000;
                if (delta < 0.25) {
                  inputRef.current.focus();
                  inputRef.current.select();
                }
              }}
            />
          );
        },
      });
    }
    return colLst;
  }, [featureConfig?.enableFeatureWeighing]);

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
    />
  );
}
