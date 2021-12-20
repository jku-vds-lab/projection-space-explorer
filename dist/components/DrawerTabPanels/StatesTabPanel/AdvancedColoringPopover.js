"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const AdvancedColoringLegend_1 = require("./AdvancedColoringLegend");
exports.AdvancedColoringPopover = ({}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return React.createElement("div", null,
        React.createElement(material_1.Button, { style: { margin: '0px 16px' }, "aria-describedby": id, variant: "outlined", onClick: handleClick }, "Advanced Coloring"),
        React.createElement(material_1.Popover, { id: id, open: open, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            }, transformOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            } },
            React.createElement(AdvancedColoringLegend_1.AdvancedColoringLegend, null)));
};
