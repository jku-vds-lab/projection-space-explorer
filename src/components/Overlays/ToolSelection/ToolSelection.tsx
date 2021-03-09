import React = require("react")
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import BlurOffIcon from '@material-ui/icons/BlurOff';
import './ToolSelection.scss'
import { connect, ConnectedProps } from 'react-redux'
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import { Tooltip, Typography } from "@material-ui/core";
import { setCurrentTool } from "../../Ducks/CurrentToolDuck";
import { RootState } from "../../Store/Store";

import * as frontend_utils from "../../../utils/frontend-connect";

const ENTER_DELAY = 500

export enum Tool {
    Default,
    Move,
    Crosshair
}

export function getToolCursor(tool: Tool) {
    switch (tool) {
        case Tool.Default:
            return 'default'
        case Tool.Move:
            return 'move'
        case Tool.Crosshair:
            return 'crosshair'
    }
}


const mapStateToProps = (state: RootState) => ({
    currentTool: state.currentTool,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setCurrentTool: id => dispatch(setCurrentTool(id))
})

const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux



function ToolSelection({ currentTool, setCurrentTool, dataset }: Props) {
    return <div className="ToolSelectionParent">
        <ToggleButtonGroup
            style={{ pointerEvents: 'auto' }}
            size='small'
            value={currentTool}
            exclusive
            onChange={(e, newValue) => {
                setCurrentTool(newValue)
            }}
            aria-label="text alignment"
        >

            <ToggleButton value={Tool.Default}>
                <Tooltip enterDelay={ENTER_DELAY} title={
                    <React.Fragment>
                        <Typography variant="subtitle2">Lasso Selection Tool</Typography>
                        <Typography variant="body2">This tool can be used to make a lasso selection around states which selects or deselects them.</Typography>
                    </React.Fragment>
                }>
                    <SelectAllIcon />
                </Tooltip>
            </ToggleButton>


            <ToggleButton value={Tool.Move}>
                <Tooltip enterDelay={ENTER_DELAY} title={
                    <React.Fragment>
                        <Typography variant="subtitle2">Panning Tool</Typography>
                        <Typography variant="body2">With this tool you can move the projection around by dragging it.</Typography>
                    </React.Fragment>
                }>
                    <ControlCameraIcon />
                </Tooltip>
            </ToggleButton>

            {dataset?.isSequential && !frontend_utils.CHEM_PROJECT &&
                <ToggleButton value={Tool.Crosshair}>
                    <Tooltip enterDelay={ENTER_DELAY} title={
                        <React.Fragment>
                            <Typography variant="subtitle2">Line Inspection Tool</Typography>
                            <Typography variant="body2">When clicking on a state of a line while this tool is active, the line will become selected and you can inspect it state by state.</Typography>
                        </React.Fragment>
                    }>
                        <LinearScaleIcon />
                    </Tooltip>
                </ToggleButton>
            }
        </ToggleButtonGroup>
    </div>
}

export const ToolSelectionRedux = connector(ToolSelection)