import { useReducer, useMemo } from 'react';
import React = require('react');

import DataGrid, { Column, FormatterProps, SelectCellFormatter } from 'react-data-grid';
import { CellExpanderFormatter } from './CellExpanderFormatter';

interface MyRow {
  id: string;
  name: string;
  format: string;
  position: string;
  price: number;
  children?: MyRow[];
  parentId?: string;
  isExpanded?: boolean;
  included: boolean;
}

interface Action {
  type: 'toggleSubRow' | 'deleteSubRow' | 'toggleIncluded';
  id: string;
}

function createRows(): MyRow[] {
  const rows = [];
  for (let i = 0; i < 100; i++) {
    const price = Math.random() * 30;
    const id = `row${i}`;
    const row: MyRow = {
      id,
      name: `supplier ${i}`,
      format: `package ${i}`,
      position: 'Run of site',
      price,
      included: false,
      children: [
        {
          id: `${id}-0`,
          parentId: id,
          name: `supplier ${i}`,
          format: '728x90',
          position: 'run of site',
          price: price / 2,
          included: false,
        },
        {
          id: `${id}-1`,
          parentId: id,
          name: `supplier ${i}`,
          format: '480x600',
          position: 'run of site',
          price: price * 0.25,
          included: false,
        },
        {
          id: `${id}-2`,
          parentId: id,
          name: `supplier ${i}`,
          format: '328x70',
          position: 'run of site',
          price: price * 0.25,
          included: false,
        },
      ],
      isExpanded: false,
    };
    rows.push(row);
  }
  return rows;
}

function toggleSubRow(rows: MyRow[], id: string): MyRow[] {
  const rowIndex = rows.findIndex((r) => r.id === id);
  const row = rows[rowIndex];
  const { children } = row;
  if (!children) return rows;

  const newRows = [...rows];
  newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
  if (!row.isExpanded) {
    newRows.splice(rowIndex + 1, 0, ...children);
  } else {
    newRows.splice(rowIndex + 1, children.length);
  }
  return newRows;
}

function deleteSubRow(rows: MyRow[], id: string): MyRow[] {
  const row = rows.find((r) => r.id === id);
  if (!row || !row.parentId) return rows;

  // Remove sub row from flattened rows.
  const newRows = rows.filter((r) => r.id !== id);

  // Remove sub row from parent row.
  const parentRowIndex = newRows.findIndex((r) => r.id === row.parentId);
  const { children } = newRows[parentRowIndex];
  if (children) {
    const newChildren = children.filter((sr) => sr.id !== id);
    newRows[parentRowIndex] = { ...newRows[parentRowIndex], children: newChildren };
  }

  return newRows;
}

function reducer(rows: MyRow[], { type, id }: Action): MyRow[] {
  switch (type) {
    case 'toggleIncluded': {
      const clone = [...rows];
      const row = { ...clone.find((row) => row.id === id) };
      row.included = !row.included;

      if (row.children) {
        // have children
        row.included = !row.included;

        row.children = row.children.map((child) => {
          return { ...child, included: row.included };
        });
      }

      clone[clone.findIndex((row) => row.id === id)] = row;
      return clone;
    }
    case 'toggleSubRow':
      return toggleSubRow(rows, id);
    case 'deleteSubRow':
      return deleteSubRow(rows, id);
    default:
      return rows;
  }
}

const defaultRows = createRows();

export default function TreeView() {
  const [rows, dispatch] = useReducer(reducer, defaultRows);
  const columns: Column<MyRow>[] = useMemo(() => {
    return [
      {
        key: 'id',
        name: 'id',
        frozen: true,
      },
      {
        key: 'test',
        name: '',
        width: 35,
        maxWidth: 35,
        resizable: false,
        sortable: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        formatter({ row }) {
          return (
            <SelectCellFormatter
              aria-label="Select"
              isCellSelected={false}
              value={row.included}
              onChange={(checked, isShiftClick) => {
                dispatch({ id: row.id, type: 'toggleIncluded' });
              }}
            />
          );
        },
      },
      {
        key: 'name',
        name: 'Name',
      },
      {
        key: 'format',
        name: 'format',
        // eslint-disable-next-line react/no-unstable-nested-components
        formatter({ row, isCellSelected }) {
          const hasChildren = row.children !== undefined;
          const style = !hasChildren ? { marginInlineStart: 30 } : undefined;
          return (
            <>
              {hasChildren && (
                <CellExpanderFormatter
                  isCellSelected={isCellSelected}
                  expanded={row.isExpanded === true}
                  onCellExpand={() => dispatch({ id: row.id, type: 'toggleSubRow' })}
                />
              )}
              <div className="rdg-cell-value">
                <div style={style}>{row.format}</div>
              </div>
            </>
          );
        },
      },
    ];
  }, []);

  return <DataGrid columns={columns} rows={rows} className="big-grid" />;
}
