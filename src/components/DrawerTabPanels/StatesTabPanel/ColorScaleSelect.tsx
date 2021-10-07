import React = require("react");
import { List, ListItem, Menu, MenuItem } from "@material-ui/core";
import { connect } from 'react-redux'
import { defaultScalesForAttribute } from "../../Utility/Colors/colors";
import { setPointColorScale } from "../../Ducks/PointColorScaleDuck";

/**
 * Component that lets user pick from a list of color scales.
 */
export var ColorScaleSelectFull = ({ channelColor, pointColorScale, setPointColorScale }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [definedScales, setDefinedScales] = React.useState([])
    
    React.useEffect(() => {
        if (channelColor) {
            let a = defaultScalesForAttribute(channelColor)
            setDefinedScales(a)
            setPointColorScale(a[0])
        } else {
            setDefinedScales([])
            setPointColorScale(null)
        }
    }, [channelColor])

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
                    <ColorScaleMenuItem scale={pointColorScale}></ColorScaleMenuItem>

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
                        selected={pointColorScale == scale}
                        onClick={(event) => {
                            setPointColorScale(definedScales[index])
                            handleMenuItemClick(event, index)
                        }}
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

const mapStateToProps = state => ({
    channelColor: state.channelColor,
    pointColorScale: state.pointColorScale
})

const mapDispatchToProps = dispatch => ({
    setPointColorScale: value => dispatch(setPointColorScale(value))
})

export const ColorScaleSelect = connect(mapStateToProps, mapDispatchToProps)(ColorScaleSelectFull)