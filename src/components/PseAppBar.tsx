import { AppBar, Toolbar, Typography } from "@mui/material";
import React = require("react");

export function PseAppBar({ children }) {
    return <AppBar variant="outlined" position="relative" color="transparent">
        <Toolbar>
            {children}
        </Toolbar>
    </AppBar>
}