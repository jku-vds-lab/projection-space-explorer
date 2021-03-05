import { Box, Button, FormControlLabel, Switch } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setLineUpInput_filter, setLineUpInput_visibility } from "../../Ducks/LineUpInputDuck";
import { RootState } from "../../Store/Store";

const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset,
    currentAggregation: state.currentAggregation
})

const mapDispatchToProps = dispatch => ({
    setLineUpInput_visibility: value => dispatch(setLineUpInput_visibility(value)),
    setLineUpInput_filter: value => dispatch(setLineUpInput_filter(value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}


export const LineUpTabPanel = connector(({ setLineUpInput_visibility, dataset, currentAggregation }: Props) => {
    const handleChange = (_, value) => {
        
    }

    const onLoadAll = () => {
        setLineUpInput_visibility(true);
        setLineUpInput_filter(null);
    }

    const onLoadSelection = () => {
        setLineUpInput_visibility(true);
        setLineUpInput_filter({'selection': true});
    }

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            <FormControlLabel
                control={<Switch checked={true} onChange={handleChange} name="checkedA" />}
                label="External Selection Summary"
            />

            <Button variant="outlined" onClick={onLoadAll}>Load All</Button>
            <Button variant="outlined" onClick={onLoadSelection}>Load Selection</Button>
        </Box>
    </div>
})