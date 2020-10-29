import { FormControlLabel, FormGroup, FormLabel, Slider, Switch, Typography } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setTrailLength, setTrailVisibility } from "../../../Ducks/TrailSettingsDuck";
import { RootState } from "../../../Store/Store";

const mapStateToProps = (state: RootState) => ({
    trailSettings: state.trailSettings
})

const mapDispatchToProps = dispatch => ({
    setTrailVisibility: visibility => dispatch(setTrailVisibility(visibility)),
    setTrailLength: length => dispatch(setTrailLength(length))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}


export const ClusterTrailSettings = connector(({ trailSettings, setTrailVisibility, setTrailLength }: Props) => {


    return <div style={{ margin: '24px' }}>
        <FormLabel component="legend">Cluster Trail Settings</FormLabel>
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={trailSettings.show} onChange={(_, newVal) => setTrailVisibility(newVal)} name="jason" />}
                label="Show Cluster Trail"
            />
            <Typography id="discrete-slider" gutterBottom>
                Trail Length
            </Typography>
            <Slider
                value={trailSettings.length}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={10}
                max={100}
                onChange={(_, newVal) => {
                    setTrailLength(newVal)
                }}
            />
        </FormGroup>
    </div>
})