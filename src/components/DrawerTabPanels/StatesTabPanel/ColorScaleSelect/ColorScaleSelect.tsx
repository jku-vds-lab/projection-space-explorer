import React = require("react");
import { List, ListItem, Menu, MenuItem } from "@material-ui/core";

/**
 * Component that lets user pick from a list of color scales.
 */
export var ColorScaleSelect = ({ selectedScaleIndex, onChange, definedScales }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickListItem = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setAnchorEl(null);

        onChange(definedScales[index], index)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <List component="nav" aria-label="Device settings">
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    onClick={handleClickListItem}
                >
                    <ColorScaleMenuItem scale={definedScales[selectedScaleIndex]}></ColorScaleMenuItem>

                </ListItem>
            </List>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {definedScales.map((scale, index) => (
                    <MenuItem
                        key={index}
                        selected={index === selectedScaleIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                    >
                        <ColorScaleMenuItem scale={scale}></ColorScaleMenuItem>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export var ColorScaleMenuItem = ({ scale }) => {
    if (scale.type == "continuous") {
        return <div style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${scale.stops.map(stop => stop.hex).join(',')})` }}>
        </div>
    } else {
        return <div style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${scale.stops.map((stop, index) => `${stop.hex} ${(index / scale.stops.length) * 100.0}%, ${stop.hex} ${((index + 1) / scale.stops.length) * 100.0}%`).join(',')})` }}>
        </div>
    }
}