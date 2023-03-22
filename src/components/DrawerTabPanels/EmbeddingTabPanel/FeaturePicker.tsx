/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/function-component-definition */
import * as React from 'react';
import DataGrid, { SelectColumn, SelectCellFormatter, GroupFormatterProps, Column, textEditor } from 'react-data-grid';
import { groupBy as rowGrouper } from 'lodash';
import { Tooltip, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { DefaultFeatureLabel } from '../../../model/Dataset';
import type { ProjectionColumn } from '../../Ducks';
import { FeatureConfig } from '../../../BaseConfig';

function WeightFormatter(props: GroupFormatterProps<ProjectionColumn> & { updateRef: React.RefObject<() => void> }) {
  const [t, setT] = React.useState(Date.now());
  const inputRef = React.useRef<HTMLInputElement>();
  const value = Math.round(props.childRows.reduce((acc, row) => acc + +row.weight, 0) * 1000) / 1000;

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
          props.updateRef.current();
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
}

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
      {
        key: 'featureLabel',
        name: (
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1">Group&nbsp;</Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  Some features belong to a semantic group. You can modify settings for all features in a group at once, or just for individual features.
                  Semantic groups can be collapsed or extended to see all features belonging to a group.
                </Typography>
              }
            >
              <InfoOutlined fontSize="inherit" style={{ color: 'grey' }} />
            </Tooltip>
          </div>
        ),
        width: 250,
      },
      {
        key: 'name',
        name: (
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1">Feature&nbsp;</Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  Features are the columns of your dataset. You can select which features to use for the projection, whether or not to normalize the feature
                  values, and how much weight a feature receives during projection.
                </Typography>
              }
            >
              <InfoOutlined fontSize="inherit" style={{ color: 'grey' }} />
            </Tooltip>
          </div>
        ),
      },
      {
        key: 'normalized',
        name: (
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body1"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Normalize&nbsp;
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  Choose which features to normalize. This option brings the feature to a common scale, which is either standardization or [0; 1] scaling,
                  depending on the feature type and distance metric chosen. Normalization is recommended for most use cases.
                </Typography>
              }
            >
              <InfoOutlined fontSize="inherit" style={{ color: 'grey' }} />
            </Tooltip>
          </div>
        ),
        width: 90,
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
        name: (
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1">Range&nbsp;</Typography>
            <Tooltip title={<Typography variant="subtitle2">This column shows the value ranges for numerical features.</Typography>}>
              <InfoOutlined fontSize="inherit" style={{ color: 'grey' }} />
            </Tooltip>
          </div>
        ),
        width: 150,
      },
    ];
    if (featureConfig?.enableFeatureWeighing) {
      colLst.push({
        key: 'weight',
        name: (
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body1"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Weight (beta)&nbsp;
            </Typography>
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  This option is currently in beta and only works for the &quot;Gower&quot; distance metric. Choose how much weight to give each feature. You
                  can specify the weight individually for each feature, or set a cummulated weight for a group of features, which will evenly distribute the
                  given weights among all features in this group.
                </Typography>
              }
            >
              <InfoOutlined fontSize="inherit" style={{ color: 'grey' }} />
            </Tooltip>
          </div>
        ),
        width: 140,
        editor: textEditor,
        groupFormatter: (props) => <WeightFormatter {...props} updateRef={ref} />,
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
