import { Button, Popover } from "@mui/material";
import React = require("react");
import { AdvancedColoringLegend } from "./AdvancedColoringLegend";

export var AdvancedColoringPopover = ({ }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return <div>
        <Button style={{ margin: '0px 16px' }} aria-describedby={id} variant="outlined" onClick={handleClick}>
            Advanced Coloring
        </Button>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >



            <AdvancedColoringLegend/>

        </Popover>
    </div>
}