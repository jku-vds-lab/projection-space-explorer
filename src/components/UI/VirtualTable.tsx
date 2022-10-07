/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-loop-func */
import './VirtualTable.scss';
import * as React from 'react';

type VirtualTableProps = {
  rows: any;
  rowHeight: number;
  tableHeight: number;
};

type VirtualColumnProps = {
  width: number;
  name: string;
  renderer: (row: any) => any;
};

export class VirtualColumn extends React.Component<VirtualColumnProps, any> {}

export class VirtualTable extends React.Component<VirtualTableProps, any> {
  constructor(props) {
    // Initial props:
    super(props);

    // Initial state:
    this.state = {
      tableHeight: this.props.rowHeight * this.props.rows.length,
      scroll: {
        top: 0,
        index: 0,
        end: Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight),
      },
    };

    // Event handlers:
    this.onScroll = this.onScroll.bind(this);
  }

  onScroll({ target }) {
    const { state } = this;

    const { scrollTop } = target;
    const { rowHeight } = this.props;
    const { tableHeight } = this.props;
    const index = Math.floor(scrollTop / rowHeight);
    const padding = Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight);
    state.scroll.index = index - padding < 0 ? index : index - padding;
    state.scroll.end = index + Math.ceil((tableHeight * 2) / rowHeight);
    state.scroll.top = (scrollTop / rowHeight) * rowHeight;

    this.setState(state);
  }

  generateRows() {
    const { rowHeight } = this.props;
    const { rows } = this.props;
    let { index } = this.state.scroll;
    const items = [];

    do {
      if (index >= rows.length) {
        index = rows.length;
        break;
      }

      const rowAttrs = {
        style: {
          position: 'absolute',
          top: index * rowHeight,
          left: 0,
          height: rowHeight,
          lineHeight: `${rowHeight}px`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          padding: 4,
          boxSizing: 'border-box',
        },
        className: `tr ${index % 2 === 0 ? 'tr-odd' : 'tr-even'}`,
      };

      items.push(
        // @ts-ignore
        <div {...rowAttrs} key={index}>
          {/* @ts-ignore */}
          {this.props.children.map((child, i) => {
            return (
              <div key={i} style={{ display: 'inline-block', flexGrow: 1, flexBasis: 0 }}>
                {child.props.renderer(rows[index])}
              </div>
            );
          })}
        </div>,
      );

      index++;
    } while (index < this.state.scroll.end);

    return items;
  }

  render() {
    const attrs = {
      wrapper: { className: 'wrapper' },
      tr: { className: 'tr' },
      content: {
        className: 'table-content dorime',
        style: {
          height: this.props.tableHeight > this.state.tableHeight ? this.state.tableHeight + 2 : this.props.tableHeight,
          width: 500,
        },
        onScroll: this.onScroll,
      },
      tbody: {
        style: {
          position: 'relative',
          display: 'inline-block',
          height: this.state.tableHeight,
          maxHeight: this.state.tableHeight,
          width: '100%',
        },
      },
    };

    return (
      <div {...attrs.wrapper}>
        <div {...attrs.content}>
          {/* @ts-ignore */}
          <div {...attrs.tbody}>{this.generateRows()}</div>
        </div>
      </div>
    );
  }
}
