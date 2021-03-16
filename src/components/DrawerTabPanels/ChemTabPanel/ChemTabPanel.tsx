import { Box, FormControl, FormControlLabel, FormHelperText, Input, InputAdornment, InputLabel, Switch, TextField, Tooltip, Typography } from "@material-ui/core";
import React = require("react");
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../Store/Store";
import InfoIcon from '@material-ui/icons/Info';

const mapStateToProps = (state: RootState) => ({
})

const mapDispatchToProps = dispatch => ({
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    
}


export const ChemTabPanel = connector(({  }: Props) => {

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        TODO

    </div>
})