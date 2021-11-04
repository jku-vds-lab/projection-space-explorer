"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const colors_1 = require("../../Utility/Colors/colors");
const PointColorScaleDuck_1 = require("../../Ducks/PointColorScaleDuck");
/**
 * Component that lets user pick from a list of color scales.
 */
exports.ColorScaleSelectFull = ({ channelColor, pointColorScale, setPointColorScale }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [definedScales, setDefinedScales] = React.useState([]);
    React.useEffect(() => {
        if (channelColor) {
            let a = colors_1.defaultScalesForAttribute(channelColor);
            setDefinedScales(a);
            setPointColorScale(a[0]);
        }
        else {
            setDefinedScales([]);
            setPointColorScale(null);
        }
    }, [channelColor]);
    const handleClickListItem = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (event, index) => {
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    if (!channelColor || definedScales.length == 0 || !pointColorScale) {
        return null;
    }
    return (React.createElement("div", null,
        React.createElement(material_1.List, { component: "nav", "aria-label": "Device settings" },
            React.createElement(material_1.ListItem, { button: true, "aria-haspopup": "true", "aria-controls": "lock-menu", "aria-label": "when device is locked", onClick: handleClickListItem },
                React.createElement(exports.ColorScaleMenuItem, { scale: pointColorScale }))),
        React.createElement(material_1.Menu, { id: "lock-menu", anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleClose }, definedScales.map((scale, index) => (React.createElement(material_1.MenuItem, { key: index, selected: pointColorScale == scale, onClick: (event) => {
                setPointColorScale(definedScales[index]);
                handleMenuItemClick(event, index);
            } },
            React.createElement(exports.ColorScaleMenuItem, { scale: scale })))))));
};
exports.ColorScaleMenuItem = ({ scale }) => {
    if (scale.type == "continuous") {
        return React.createElement("div", { style: { width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${scale.stops.map(stop => stop.hex).join(',')})` } });
    }
    else {
        return React.createElement("div", { style: { width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${scale.stops.map((stop, index) => `${stop.hex} ${(index / scale.stops.length) * 100.0}%, ${stop.hex} ${((index + 1) / scale.stops.length) * 100.0}%`).join(',')})` } });
    }
};
const mapStateToProps = state => ({
    channelColor: state.channelColor,
    pointColorScale: state.pointColorScale
});
const mapDispatchToProps = dispatch => ({
    setPointColorScale: value => dispatch(PointColorScaleDuck_1.setPointColorScale(value))
});
exports.ColorScaleSelect = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.ColorScaleSelectFull);
