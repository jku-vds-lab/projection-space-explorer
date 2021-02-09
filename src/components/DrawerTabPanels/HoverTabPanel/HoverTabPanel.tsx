import { Box, FormControlLabel, Switch } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setHoverWindowMode, WindowMode } from "../../Ducks/HoverSettingsDuck";
import { SelectionClusters } from "../../Overlays/SelectionClusters/SelectionClusters";
import { RootState } from "../../Store/Store";

const mapStateToProps = (state: RootState) => ({
    hoverSettings: state.hoverSettings
})

const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(setHoverWindowMode(value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    hoverUpdate
}


export const HoverTabPanel = connector(({ hoverSettings, setHoverWindowMode, hoverUpdate }: Props) => {
    const handleChange = (_, value) => {
        setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded)
    }

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            <FormControlLabel
                control={<Switch checked={hoverSettings.windowMode == WindowMode.Extern} onChange={handleChange} name="checkedA" />}
                label="External Selection Summary"
            />
        </Box>

        <SelectionClusters hoverUpdate={hoverUpdate}></SelectionClusters>
    </div>
})