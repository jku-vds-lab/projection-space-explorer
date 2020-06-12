import * as React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import * as clone from 'clone'
import './ShapeLegend.scss'

const ShapeSymbol = ({ symbol, text, checked, onCheck }) => {
    var paths = {
        "star": "./textures/sprites/star.png",
        "circle": "./textures/sprites/circle.png",
        "square": "./textures/sprites/square.png",
        "cross": "./textures/sprites/cross.png"
    }

    return <div>
        <Checkbox
            className="ShapeLegendCheckbox"
            checked={checked}
            color="primary"
            onChange={(event) => { onCheck(event, symbol) }}
            disableRipple
            inputProps={{ 'aria-label': 'decorative checkbox' }} />

        <img src={paths[symbol]} style={{
            width: "1rem",
            height: "1rem",
            verticalAlign: "middle"
        }} />
        <span style={{
            verticalAlign: "middle",
            marginLeft: "0.5rem"
        }}>{text}</span>

    </div>
}


function defaultState() {
    return {
        cross: true, circle: true, star: true, square: true
    }
}


/**
 * Simple shape legend
 * put a category in props
 */
export var ShapeLegend = ({ dataset, category, onChange }) => {
    const [state, setState] = React.useState(defaultState())

    React.useEffect(() => {
        setState(defaultState())
    }, [category, dataset])



    var defaults = [{ symbol: 'cross', text: 'First State' }, { symbol: 'circle', text: 'Intermediate State' }, { symbol: 'star', text: 'Last State' }]

    if (category == null) {
        return <div>
            {defaults.map(def => {
                return <ShapeSymbol key={def.symbol} symbol={def.symbol} text={def.text} checked={state[def.symbol]} onCheck={(event) => {
                    var newState = clone(state)
                    newState[def.symbol] = event.target.checked
                    setState(newState)

                    onChange(newState)
                }}></ShapeSymbol>
            })}
        </div>
    }

    return <div>
        {
            category.values.map(v => {
                return <ShapeSymbol symbol={v.to} text={"display" in v ? v.display : v.from} checked={state[v.to]} onCheck={(event) => {
                    var newState = clone(state)
                    newState[v.to] = event.target.checked
                    setState(newState)

                    onChange(newState)
                }}></ShapeSymbol>
            })
        }
    </div>
}