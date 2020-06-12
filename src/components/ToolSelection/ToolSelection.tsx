import React = require("react")
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import BlurOffIcon from '@material-ui/icons/BlurOff';
import './ToolSelection.scss'

export var ToolSelection = function ({ currentTool, onChange }) {
    return <div className="ToolSelectionParent">
        <ToggleButtonGroup
            style={{ pointerEvents: 'auto' }}
            size='small'
            value={currentTool}
            exclusive
            onChange={(e, newValue) => {
                e.preventDefault()
                onChange(newValue)
            }}
            aria-label="text alignment"
        >
            <ToggleButton value="default" aria-label="left aligned">
                <SelectAllIcon />
            </ToggleButton>
            <ToggleButton value="move" aria-label="centered">
                <ControlCameraIcon />
            </ToggleButton>
            <ToggleButton value="grab" aria-label="centered">
                <BlurOffIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    </div>
}