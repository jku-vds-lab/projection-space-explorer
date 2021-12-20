"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
function PseAppBar({ children }) {
    return React.createElement(material_1.AppBar, { variant: "outlined", position: "relative", color: "transparent" },
        React.createElement(material_1.Toolbar, null, children));
}
exports.PseAppBar = PseAppBar;
