"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
require("./VirtualTable.scss");
class VirtualColumn extends React.Component {
}
exports.VirtualColumn = VirtualColumn;
class VirtualTable extends React.Component {
    constructor(props) {
        // Initial props:
        super(props);
        // Initial state:
        this.state = {
            columns: Object.keys(this.props.rows[0]),
            tableHeight: (this.props.rowHeight * this.props.rows.length),
            scroll: {
                top: 0,
                index: 0,
                end: Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight),
            }
        };
        // Event handlers:
        this.onScroll = this.onScroll.bind(this);
        this.scrollInterval = null;
    }
    onScroll({ target }) {
        let state = this.state;
        let scrollTop = target.scrollTop;
        let rowHeight = this.props.rowHeight;
        let tableHeight = this.props.tableHeight;
        let index = Math.floor(scrollTop / rowHeight);
        let padding = Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight);
        state.scroll.index = (index - padding) < 0 ? index : (index - padding);
        state.scroll.end = index + Math.ceil((tableHeight * 2) / rowHeight);
        state.scroll.top = (scrollTop / rowHeight) * rowHeight;
        this.setState(state);
    }
    generateRows() {
        let columns = this.state.columns;
        let rowHeight = this.props.rowHeight;
        let rows = this.props.rows;
        let index = this.state.scroll.index;
        let items = [];
        do {
            if (index >= rows.length) {
                index = rows.length;
                break;
            }
            const rowAttrs = {
                style: {
                    position: "absolute",
                    top: (index * rowHeight),
                    left: 0,
                    height: rowHeight,
                    lineHeight: `${rowHeight}px`,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    padding: 4,
                    boxSizing: 'border-box'
                },
                className: `tr ${(index % 2) === 0 ? 'tr-odd' : 'tr-even'}`
            };
            items.push(
            //@ts-ignore
            React.createElement("div", Object.assign({}, rowAttrs, { key: index }), this.props.children.map((child, i) => {
                return React.createElement("div", { key: i, style: { display: 'inline-block', flexGrow: 1, flexBasis: 0 } }, child.props.renderer(rows[index]));
            })));
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
                    height: (this.props.tableHeight > this.state.tableHeight)
                        ? this.state.tableHeight + 2
                        : this.props.tableHeight,
                    width: 500
                },
                onScroll: this.onScroll
            },
            tbody: {
                style: {
                    position: "relative",
                    display: 'inline-block',
                    height: this.state.tableHeight,
                    maxHeight: this.state.tableHeight,
                    width: "100%"
                }
            }
        };
        return (React.createElement("div", Object.assign({}, attrs.wrapper),
            React.createElement("div", Object.assign({}, attrs.content),
                React.createElement("div", Object.assign({}, attrs.tbody), this.generateRows()))));
    }
}
exports.VirtualTable = VirtualTable;
