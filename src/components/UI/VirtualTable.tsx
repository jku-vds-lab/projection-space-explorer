import './VirtualTable.scss'
import React = require("react");

type VirtualTableProps = {
    rows: any
    rowHeight: number
    tableHeight: number
}

type VirtualColumnProps = {
    width: number
    name: string
    renderer: (row:any) => any
}

export class VirtualColumn extends React.Component<VirtualColumnProps, any> {

}

export class VirtualTable extends React.Component<VirtualTableProps, any> {
    scrollInterval: any;

    constructor(props) {
        // Initial props:
        super(props)


        // Initial state:
        this.state = {
            columns: Object.keys(this.props.rows[0]),
            tableHeight: (this.props.rowHeight * this.props.rows.length),
            scroll: {
                top: 0,
                index: 0,
                end: Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight),
            }
        }

        // Event handlers:
        this.onScroll = this.onScroll.bind(this)
        this.scrollInterval = null
    }

    onScroll({ target }) {
        let state = this.state;

        let scrollTop = target.scrollTop
        let rowHeight = this.props.rowHeight
        let tableHeight = this.props.tableHeight
        let index = Math.floor(scrollTop / rowHeight)
        let padding = Math.ceil((this.props.tableHeight * 2) / this.props.rowHeight)
        state.scroll.index = (index - padding) < 0 ? index : (index - padding)
        state.scroll.end = index + Math.ceil((tableHeight * 2) / rowHeight)
        state.scroll.top = (scrollTop / rowHeight) * rowHeight

        this.setState(state);
    }

    generateRows() {
        let columns = this.state.columns
        let rowHeight = this.props.rowHeight
        let rows = this.props.rows
        let index = this.state.scroll.index
        let items = []

        do {
            if (index >= rows.length) {
                index = rows.length
                break
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
            }

            items.push(
                //@ts-ignore
                <div {...rowAttrs} key={index}>
                    {/* @ts-ignore */}
                    {this.props.children.map((child, i) => {
                        return <div key={i} style={{display: 'inline-block', flexGrow: 1, flexBasis: 0}}>
                            {child.props.renderer(rows[index])}
                        </div>
                    })}
                </div>
            )

            index++
        } while (index < this.state.scroll.end)

        return items
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
        }

        return (
            <div {...attrs.wrapper}>
                <div {...attrs.content}>
                    {/* @ts-ignore */}
                    <div {...attrs.tbody}>
                        {this.generateRows()}
                    </div>
                </div>
            </div>
        )
    }
}