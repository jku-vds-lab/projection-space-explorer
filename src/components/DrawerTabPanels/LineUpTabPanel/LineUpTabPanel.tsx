import { Box, Button, FormControlLabel, Switch } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { setLineUpInput_data, setLineUpInput_visibility } from "../../Ducks/LineUpInputDuck";
import { RootState } from "../../Store/Store";

const mapStateToProps = (state: RootState) => ({
    dataset: state.dataset,
    currentAggregation: state.currentAggregation
})

const mapDispatchToProps = dispatch => ({
    setLineUpInput_data: value => dispatch(setLineUpInput_data(value)),
    setLineUpInput_visibility: value => dispatch(setLineUpInput_visibility(value))
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}


export const LineUpTabPanel = connector(({ setLineUpInput_data, setLineUpInput_visibility, dataset, currentAggregation }: Props) => {
    const handleChange = (_, value) => {

    }

    const onLoadAll = () => {
        setLineUpInput_data(dataset.vectors)
        setLineUpInput_visibility(true)
    }

    const onLoadSelection = () => {
        setLineUpInput_data(currentAggregation.aggregation)
        setLineUpInput_visibility(true)
    }

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            <FormControlLabel
                control={<Switch checked={true} onChange={handleChange} name="checkedA" />}
                label="External Selection Summary"
            />
        </Box>

        <Box p={1}><Button variant="outlined" onClick={onLoadAll}>Load All</Button></Box>
        <Box p={1}><Button variant="outlined" onClick={onLoadSelection}>Load Selection</Button></Box>
    </div>
})