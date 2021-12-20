"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const clone = require("clone");
// @ts-ignore
const star_png_1 = require("../../../../textures/sprites/star.png");
// @ts-ignore
const circle_png_1 = require("../../../../textures/sprites/circle.png");
// @ts-ignore
const cross_png_1 = require("../../../../textures/sprites/cross.png");
// @ts-ignore
const square_png_1 = require("../../../../textures/sprites/square.png");
const styles_1 = require("@mui/styles");
const useStyles = styles_1.makeStyles(theme => ({
    root: {
        padding: '3px 9px !important'
    },
}));
const ShapeSymbol = ({ symbol, text, checked, onCheck }) => {
    const classes = useStyles();
    var paths = {
        "star": star_png_1.default,
        "circle": circle_png_1.default,
        "square": square_png_1.default,
        "cross": cross_png_1.default
    };
    return React.createElement("div", { key: symbol },
        React.createElement(material_1.Checkbox, { className: classes.root, checked: checked, color: "primary", onChange: (event) => { onCheck(event, symbol); }, disableRipple: true, inputProps: { 'aria-label': 'decorative checkbox' } }),
        React.createElement("img", { src: paths[symbol], style: {
                width: "1rem",
                height: "1rem",
                verticalAlign: "middle"
            } }),
        React.createElement("span", { style: {
                verticalAlign: "middle",
                marginLeft: "0.5rem"
            } }, text));
};
function defaultState() {
    return {
        cross: true, circle: true, star: true, square: true
    };
}
/**
 * Simple shape legend
 * put a category in props
 */
exports.ShapeLegend = ({ dataset, category, onChange }) => {
    const [state, setState] = React.useState(defaultState());
    React.useEffect(() => {
        setState(defaultState());
    }, [category, dataset]);
    var defaults = [{ symbol: 'cross', text: 'First State' }, { symbol: 'circle', text: 'Intermediate State' }, { symbol: 'star', text: 'Last State' }];
    if (category == null) {
        return React.createElement("div", null, defaults.map(def => {
            return React.createElement(ShapeSymbol, { key: def.symbol, symbol: def.symbol, text: def.text, checked: state[def.symbol], onCheck: (event) => {
                    var newState = clone(state);
                    newState[def.symbol] = event.target.checked;
                    setState(newState);
                    onChange(newState);
                } });
        }));
    }
    return React.createElement("div", null, category.values.map(v => {
        return React.createElement(ShapeSymbol, { key: v.from, symbol: v.to, text: "display" in v ? v.display : v.from, checked: state[v.to], onCheck: (event) => {
                var newState = clone(state);
                newState[v.to] = event.target.checked;
                setState(newState);
                onChange(newState);
            } });
    }));
};
