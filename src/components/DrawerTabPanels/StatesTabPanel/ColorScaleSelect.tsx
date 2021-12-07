import React = require("react");
import { List, ListItem, Menu, MenuItem } from "@mui/material";
import { connect, useSelector, useDispatch } from 'react-redux'
import { RootState } from "../../Store";
import { ANormalized, NormalizedDictionary } from "../..";
import { BaseColorScale, ColorScalesActions, APalette } from "../../Ducks/ColorScalesDuck";
import { dispatch } from "d3";

/**
 * Component that lets user pick from a list of color scales.
 */
export var ColorScaleSelectFull = ({ channelColor }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const scales = useSelector<RootState, NormalizedDictionary<BaseColorScale>>((state) => state.colorScales.scales)
    const active = useSelector<RootState, BaseColorScale>((state) => ANormalized.get(state.colorScales.scales, state.colorScales.active))

    const dispatch = useDispatch()

    const handleClickListItem = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = () => {
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!channelColor || !scales) {
        return null
    }


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
                    <ColorScaleMenuItem scale={active}></ColorScaleMenuItem>

                </ListItem>
            </List>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {ANormalized.entries(scales).filter(([key, value]) => value.type === channelColor.type).map(([key, value]) => (
                    <MenuItem
                        key={key}
                        selected={active === value}
                        onClick={(event) => {
                            dispatch(ColorScalesActions.pickScale(key))
                            handleMenuItemClick()
                        }}
                    >
                        <ColorScaleMenuItem scale={value}></ColorScaleMenuItem>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export var ColorScaleMenuItem = ({ scale }: { scale: BaseColorScale }) => {
    const palette = APalette.getByName(scale.palette)

    if (scale.type == 'sequential') {
        return <div style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${palette.map(stop => stop.hex).join(',')})` }}>
        </div>
    } else {
        return <div style={{ width: '100%', minWidth: '15rem', height: '1rem', backgroundImage: `linear-gradient(to right, ${palette.map((stop, index) => `${stop.hex} ${(index / palette.length) * 100.0}%, ${stop.hex} ${((index + 1) / palette.length) * 100.0}%`).join(',')})` }}>
        </div>
    }
}

const mapStateToProps = state => ({
    channelColor: state.channelColor
})

const mapDispatchToProps = dispatch => ({
})

export const ColorScaleSelect = connect(mapStateToProps, mapDispatchToProps)(ColorScaleSelectFull)