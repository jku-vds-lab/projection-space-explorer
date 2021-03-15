import { Box, Button, FormControlLabel, Switch, Typography } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setAggregationAction } from "../../Ducks/AggregationDuck";
import { setHoverWindowMode, WindowMode } from "../../Ducks/HoverSettingsDuck";
import { SelectionClusters } from "../../Overlays/SelectionClusters/SelectionClusters";
import { RootState } from "../../Store/Store";

const mapStateToProps = (state: RootState) => ({
    hoverSettings: state.hoverSettings,
    currentAggregation: state.currentAggregation,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(setHoverWindowMode(value)),
    setAggregation: value => dispatch(setAggregationAction(value))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    hoverUpdate
}


export const HoverTabPanel = connector(({ hoverSettings, setHoverWindowMode, hoverUpdate, setAggregation, currentAggregation, dataset }: Props) => {
    const handleChange = (_, value) => {
        setHoverWindowMode(value ? WindowMode.Extern : WindowMode.Embedded)
    }

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            {/* TODO: Cluster count not working */}
            <Typography color={"textSecondary"} variant="body2">Selected <b>{currentAggregation.length}</b> out of <b>{dataset && dataset.vectors.length}</b> items with <b>{dataset && dataset.clusters.length}</b> Clusters</Typography>

            <FormControlLabel
                control={<Switch checked={hoverSettings.windowMode == WindowMode.Extern} onChange={handleChange} name="checkedA" />}
                label="External Selection Summary"
            />

            <Button variant="outlined" onClick={() => { setAggregation([]) }}>Clear Selection</Button>
        </Box>

        <SelectionClusters hoverUpdate={hoverUpdate}></SelectionClusters>
    </div>
})