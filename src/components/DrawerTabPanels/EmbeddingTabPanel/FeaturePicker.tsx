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
        key: 'useWeight',
        name: '(beta) Use weight',
        width: 80,
        formatter({ row, onRowChange, isCellSelected }) {
          return (
            <SelectCellFormatter
              value={row.useWeight}
              onChange={(checked) => {
                onRowChange({ ...row, useWeight: checked });
                if (checked) {
                  alert("Note that weights are currently in beta and are only implemented for Gower's distance at the moment.");
                }
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
              value={props.childRows.filter((row) => row.useWeight).length === props.childRows.length}
              onChange={(checked) => {
                props.childRows.forEach((row) => {
                  row.useWeight = checked;
                });
                ref.current();
              }}
            />
          );
        },
      });

      colLst.push({
        key: 'weight',
        name: 'Weight',
        width: 100,
        editor: textEditor,
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
